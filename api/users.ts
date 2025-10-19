// Vercel Serverless Function: /api/users
// Handles GET, POST, and PUT requests for the 'users' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb.js';
import type { User } from '../types';

// Server-side logic to create the owner account if it doesn't exist on first load.
const initializeOwner = async (db: any): Promise<void> => {
    const usersCollection = db.collection('users');
    const ownerEmail = process.env.VITE_OWNER_EMAIL;
    if (!ownerEmail) return;

    const ownerExists = await usersCollection.findOne({ email: ownerEmail });
    if (ownerExists) return;
    
    const ownerPassword = process.env.VITE_OWNER_PASSWORD;
    if (ownerPassword) {
        const ownerUser: User = {
            id: 'owner_001',
            name: 'Site Owner',
            email: ownerEmail,
            passwordHash: `hashed_${ownerPassword}`, // Simple hashing for this app
            createdAt: Date.now(),
            apiAccess: null,
            settings: { warningThreshold: 24 },
            isAdmin: true,
            canSetCustomExpiry: true,
        };
        await usersCollection.insertOne(ownerUser);
        console.log("Owner account created.");
    }
};


export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        if (req.method === 'GET') {
            await initializeOwner(db);
            const users = await usersCollection.find({}).toArray();
            return res.status(200).json(users);
        }

        if (req.method === 'POST') { // Create a single new user
            const newUser: User = req.body;
            if (!newUser || !newUser.email || !newUser.passwordHash) {
                return res.status(400).json({ error: 'Invalid user data provided.' });
            }

            // Capture IP Address from request headers
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
            newUser.ipAddress = Array.isArray(ip) ? ip[0] : ip;

            const existingUser = await usersCollection.findOne({ email: newUser.email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ error: 'An account with this email already exists.' });
            }

            await usersCollection.insertOne({ ...newUser, email: newUser.email.toLowerCase() });
            return res.status(201).json(newUser);
        }

        if (req.method === 'PUT') { // Update a single existing user
            const updatedUser: User & { _id?: any } = req.body;
            if (!updatedUser || !updatedUser.id) {
                return res.status(400).json({ error: 'User ID is required for an update.' });
            }
            
            // Explicitly copy the body and remove immutable fields to prevent the error.
            const userFieldsToUpdate = { ...updatedUser };
            const userId = userFieldsToUpdate.id; // Store the id for the query

            delete userFieldsToUpdate.id;
            delete userFieldsToUpdate._id; // This is the crucial part to fix the error.
            
            // For extra safety, explicitly prevent email updates, as it's a key identifier.
            delete (userFieldsToUpdate as Partial<User>).email;
            
            const result = await usersCollection.updateOne({ id: userId }, { $set: userFieldsToUpdate });
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }
            
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/users:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
