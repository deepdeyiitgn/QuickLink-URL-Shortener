// Vercel Serverless Function: /api/users
// Handles GET and POST requests for the 'users' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb';
import type { User } from '../types';

// Server-side logic to create the owner account if it doesn't exist.
const initializeOwner = async (db: any): Promise<User[]> => {
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();

    if (userCount > 0) {
        const users = await usersCollection.find({}).toArray();
        return users;
    }

    const OWNER_EMAIL = process.env.VITE_OWNER_EMAIL;
    const OWNER_PASSWORD = process.env.VITE_OWNER_PASSWORD;

    if (OWNER_EMAIL && OWNER_PASSWORD) {
        const ownerUser: User = {
            id: 'owner_001',
            name: 'Site Owner',
            email: OWNER_EMAIL,
            passwordHash: `hashed_${OWNER_PASSWORD}`, // Simple hashing for this app
            createdAt: Date.now(),
            apiAccess: null,
            settings: { warningThreshold: 24 },
            isAdmin: true,
            canSetCustomExpiry: true,
        };
        await usersCollection.insertOne(ownerUser);
        return [ownerUser];
    }
    return [];
};


export default async function handler(req: any, res: any) {
    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        if (req.method === 'GET') {
            const users = await initializeOwner(db);
            return res.status(200).json(users);
        }

        if (req.method === 'POST') {
            const users: User[] = req.body;
            // This is a "replace all" operation, mirroring the previous KV store behavior.
            await usersCollection.deleteMany({});
            if (users.length > 0) {
                await usersCollection.insertMany(users);
            }
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/users:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}