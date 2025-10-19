// Vercel Serverless Function: /api/urls
// Handles GET, POST, PUT, and DELETE requests for the 'urls' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb.js';
import type { ShortenedUrl } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { db } = await connectToDatabase();
        const urlsCollection = db.collection('urls');

        if (req.method === 'GET') {
            const urls = await urlsCollection.find({}).toArray();
            return res.status(200).json(urls);
        }

        if (req.method === 'POST') { // For adding/upserting a single URL
            const newUrl: ShortenedUrl = req.body;
            if (!newUrl || typeof newUrl.alias !== 'string') {
                return res.status(400).json({ error: 'Invalid URL object provided.' });
            }

            const existingActiveUrl = await urlsCollection.findOne({
                alias: newUrl.alias,
                $or: [{ expiresAt: null }, { expiresAt: { $gt: Date.now() } }]
            });

            if (existingActiveUrl) {
                return res.status(409).json({ error: "This alias is already taken. Please choose another one." });
            }

            await urlsCollection.updateOne(
                { alias: newUrl.alias },
                { $set: newUrl },
                { upsert: true }
            );
            return res.status(200).json({ success: true });
        }

        if (req.method === 'PUT') { // For extending multiple URLs
            const { urlIds, newExpiresAt } = req.body;
            if (!Array.isArray(urlIds) || typeof newExpiresAt !== 'number') {
                return res.status(400).json({ error: 'Invalid body for extending URLs.' });
            }
            await urlsCollection.updateMany(
                { id: { $in: urlIds } },
                { $set: { expiresAt: newExpiresAt } }
            );
            return res.status(200).json({ success: true });
        }
        
        if (req.method === 'DELETE') { // For deleting one or more URLs
            const { id, userId } = req.query;
            let result;
            if (id) {
                result = await urlsCollection.deleteOne({ id: id as string });
            } else if (userId) {
                result = await urlsCollection.deleteMany({ userId: userId as string });
            } else {
                return res.status(400).json({ error: 'An `id` or `userId` query parameter is required for deletion.' });
            }

            if (result.deletedCount === 0) {
                // This is not a critical error, but good for debugging.
                console.log(`Delete operation for query ${JSON.stringify(req.query)} matched 0 documents.`);
            }
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('CRITICAL ERROR in /api/urls:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}