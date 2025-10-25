// Vercel Serverless Function: /api/users
// Handles GET and PUT requests for the 'users' collection.

import { connectToDatabase } from './lib/mongodb.js';
import type { User } from '../types';
import crypto from 'crypto';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        if (req.method === 'GET') {
            const { id } = req.query;
            if (id) {
                const user = await usersCollection.findOne({ id: id as string });
                if (!user) return res.status(404).json({ error: 'User not found.' });
                return res.status(200).json(user);
            } else {
                // Return all users (should be admin protected in a real app)
                const allUsers = await usersCollection.find({}).toArray();
                return res.status(200).json(allUsers);
            }
        }

        if (req.method === 'PUT') {
            const { id } = req.query;
            const { action, newApiKey, ...updateData } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'User ID is required in the query.' });
            }

            if (action === 'update_details') {
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                updateData.ipAddress = ip;
            }
            
            // Handle API key generation if requested
            if (newApiKey) {
                const apiKey = `qk_${crypto.randomBytes(16).toString('hex')}`;
                
                const apiSubscription = updateData.subscription;
                if (!apiSubscription || !apiSubscription.planId || !apiSubscription.expiresAt) {
                    return res.status(400).json({ error: 'API subscription details are missing for key generation.' });
                }

                updateData.apiAccess = {
                    apiKey: apiKey,
                    subscription: {
                        planId: apiSubscription.planId,
                        expiresAt: apiSubscription.expiresAt
                    }
                };

                // Prevent overwriting main user subscription
                delete updateData.subscription;
            }

            // Always update lastActive on any PUT request
            updateData.lastActive = Date.now();

            const result = await usersCollection.findOneAndUpdate(
                { id: id as string },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!result) {
                return res.status(404).json({ error: 'User not found to update.' });
            }
            
            return res.status(200).json(result);
        }

        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/users:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
