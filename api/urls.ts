// Vercel Serverless Function: /api/urls
// Handles GET and POST requests for the 'urls' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb';
import type { ShortenedUrl } from '../types';

export default async function handler(req: any, res: any) {
    try {
        const { db } = await connectToDatabase();
        const urlsCollection = db.collection('urls');

        if (req.method === 'GET') {
            const urls = await urlsCollection.find({}).toArray();
            return res.status(200).json(urls);
        }

        if (req.method === 'POST') {
            const body = req.body;

            // Handle atomic add/update for single URL objects
            if (typeof body === 'object' && !Array.isArray(body) && body !== null) {
                const newUrl: ShortenedUrl = body;

                if (!newUrl.longUrl || !newUrl.alias) {
                    return res.status(400).json({ error: 'Invalid URL data provided.' });
                }
                
                // The client's jsonReplacer has already converted Infinity to '__Infinity__'.
                // We can use the body directly.
                const urlToUpsert = newUrl;

                // Server-side check for an existing ACTIVE alias to prevent race conditions.
                const existingActiveUrl = await urlsCollection.findOne({ 
                    alias: urlToUpsert.alias, 
                    $or: [ 
                        { expiresAt: '__Infinity__' }, 
                        { expiresAt: { $gt: Date.now() } } 
                    ] 
                });

                if (existingActiveUrl) {
                    return res.status(409).json({ error: "This alias is already taken. Please choose another one." });
                }

                // Use `updateOne` with `upsert` to create a new URL or overwrite an expired one.
                await urlsCollection.updateOne(
                    { alias: urlToUpsert.alias },
                    { $set: urlToUpsert },
                    { upsert: true }
                );

                return res.status(200).json({ success: true });
            }
            
            // Fallback to old "replace all" logic for arrays (to support other functions)
            if (Array.isArray(body)) {
                await urlsCollection.deleteMany({});
                if (body.length > 0) {
                     // The body is an array of URL objects, already processed by the client's jsonReplacer.
                    await urlsCollection.insertMany(body);
                }
                return res.status(200).json({ success: true });
            }

            return res.status(400).json({ error: 'Invalid request body.' });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any)
    {
        console.error('Error with /api/urls:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}