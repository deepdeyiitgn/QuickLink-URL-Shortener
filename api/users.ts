// api/users.ts
import { connectToDatabase } from './lib/mongodb.js';
import type { User } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection<User>('users');

        if (req.method === 'GET') {
            const users = await usersCollection.find({}, { projection: { passwordHash: 0 } }).toArray();
            return res.status(200).json(users);
        }

        if (req.method === 'PUT') {
            const { userId } = req.query;
            const updateData = req.body;
            if (!userId || !updateData) {
                return res.status(400).json({ error: 'User ID and update data are required.' });
            }
            
            // Prevent certain fields from being updated directly
            delete updateData.id;
            delete updateData.email;
            delete updateData.passwordHash;

            // Implicitly update last active time on any profile update
            const finalUpdateData = { ...updateData, lastActive: Date.now() };

            const updatedUser = await usersCollection.findOneAndUpdate(
                { id: userId },
                { $set: finalUpdateData },
                { returnDocument: 'after', projection: { passwordHash: 0 } }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found.' });
            }
            
            return res.status(200).json(updatedUser);
        }

        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/users:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}