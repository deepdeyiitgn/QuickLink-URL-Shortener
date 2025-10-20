// api/users.ts
import { connectToDatabase } from './lib/mongodb';
import type { User } from '../types';

// Super simple mock hash for demo purposes. DO NOT USE IN PRODUCTION.
const mockHash = (str: string) => `hashed_${str}`;

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        if (req.method === 'GET') {
            const users = await usersCollection.find({}, { projection: { passwordHash: 0 } }).toArray();
            return res.status(200).json(users);
        }

        if (req.method === 'POST') { // Sign up
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required.' });
            }

            const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ error: 'An account with this email already exists.' });
            }

            const newUser: User = {
                id: `user_${Date.now()}`,
                name,
                email: email.toLowerCase(),
                passwordHash: password, // In a real app, you would hash this: await bcrypt.hash(password, 10),
                createdAt: Date.now(),
                lastActive: Date.now(),
                isAdmin: false,
                canModerate: false,
                canSetCustomExpiry: false,
                isDonor: false,
                status: 'active',
                subscription: null,
                apiAccess: null,
            };

            await usersCollection.insertOne(newUser);
            const { passwordHash, ...userToReturn } = newUser;
            return res.status(201).json(userToReturn);
        }

        if (req.method === 'PUT') {
            const { userId } = req.query;
            const updateData = req.body;
            if (!userId || !updateData) {
                return res.status(400).json({ error: 'User ID and update data are required.' });
            }
            
            // Prevent certain fields from being updated directly via this generic endpoint
            delete updateData.id;
            delete updateData.email;
            delete updateData.passwordHash;

            const result = await usersCollection.findOneAndUpdate(
                { id: userId },
                { $set: updateData },
                { returnDocument: 'after', projection: { passwordHash: 0 } }
            );

            if (!result.value) {
                return res.status(404).json({ error: 'User not found.' });
            }
            
            return res.status(200).json(result.value);
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/users:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}