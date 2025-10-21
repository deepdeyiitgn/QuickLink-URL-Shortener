// Vercel Serverless Function: /api/urls
// Handles GET, POST, PUT, and DELETE requests for the 'urls' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb.js';
import type { ShortenedUrl, User } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { db } = await connectToDatabase();
        const urlsCollection = db.collection('urls');

        if (req.method === 'GET') {
            const urls = await urlsCollection.find({}).toArray();
            return res.status(200).send(JSON.stringify(urls));
        }

        if (req.method === 'POST') {
            const { longUrl, alias, userId } = req.body;
            if (!longUrl) {
                return res.status(400).json({ error: 'longUrl is a required field.' });
            }

            const finalAlias = alias || Math.random().toString(36).substring(2, 8);

            const existingActiveUrl = await urlsCollection.findOne({
                alias: finalAlias,
                $or: [{ expiresAt: null }, { expiresAt: { $gt: Date.now() } }]
            });

            if (existingActiveUrl) {
                return res.status(409).json({ error: "This alias is already taken. Please choose another one." });
            }

            // Determine expiry based on user
            let expiresAt: number | null = Date.now() + (24 * 60 * 60 * 1000); // Default: 1 day for anonymous
            if (userId) {
                const user = await db.collection('users').findOne({ id: userId });
                if (user) {
                    if (user.canSetCustomExpiry) {
                        expiresAt = null; // Permanent
                    } else if (user.subscription && user.subscription.expiresAt > Date.now()) {
                        expiresAt = Date.now() + (365 * 24 * 60 * 60 * 1000); // 365 days for premium
                    } else {
                        expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days for registered
                    }
                }
            }

            const host = req.headers?.host;
            if (!host) {
                return res.status(500).json({ error: "Could not determine request host." });
            }
            const protocol = req.headers?.['x-forwarded-proto'] || 'https';
            const origin = `${protocol}://${host}`;

            const newUrl: ShortenedUrl = {
                id: `dyn_${finalAlias}`,
                longUrl,
                alias: finalAlias,
                shortUrl: `${origin}/${finalAlias}`,
                createdAt: Date.now(),
                expiresAt,
                userId: userId || null,
            };

            await urlsCollection.updateOne(
                { alias: newUrl.alias },
                { $set: newUrl },
                { upsert: true }
            );
            return res.status(201).json(newUrl);
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