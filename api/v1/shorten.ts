// This is a Vercel serverless function for the Developer API endpoint.
// It validates the API key and creates a short URL, storing it in MongoDB Atlas.

import { connectToDatabase } from '../lib/mongodb.js';
import type { User, ShortenedUrl } from '../../types';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const apiKey = req.headers.authorization?.split(' ')[1];
        if (!apiKey) {
            return res.status(401).json({ error: "Authorization header with Bearer token is required." });
        }

        const { longUrl, alias } = req.body;
        if (!longUrl || typeof longUrl !== 'string' || !longUrl.startsWith('http')) {
            return res.status(400).json({ error: "A valid longUrl is a required field." });
        }

        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const urlsCollection = db.collection('urls');
        
        const user = await usersCollection.findOne({ "apiAccess.apiKey": apiKey });

        if (!user || !user.apiAccess) {
            return res.status(403).json({ error: "Invalid API Key." });
        }

        const subscription = user.apiAccess.subscription;
        if (!subscription || (subscription.expiresAt < Date.now())) {
            return res.status(403).json({ error: "API Key has expired or subscription is invalid." });
        }

        const finalAlias = alias || Math.random().toString(36).substring(2, 8);
        
        const existingActiveUrl = await urlsCollection.findOne({ 
            alias: finalAlias, 
            $or: [ { expiresAt: null }, { expiresAt: { $gt: Date.now() } } ] 
        });

        if (existingActiveUrl) {
            return res.status(409).json({ error: "Alias is already taken." });
        }
        
        const host = req.headers?.host;
        if (!host) {
            console.error("API /v1/shorten Error: Host header is missing.");
            return res.status(500).json({ error: "Could not determine request host." });
        }
        const protocol = req.headers?.['x-forwarded-proto'] || 'https';
        const origin = `${protocol}://${host}`;

        const newUrl: ShortenedUrl = {
            id: `api_${Date.now()}`,
            longUrl,
            alias: finalAlias,
            shortUrl: `${origin}/${finalAlias}`,
            createdAt: Date.now(),
            expiresAt: subscription.expiresAt, // Use the validated subscription's expiration
            userId: user.id,
        };

        await urlsCollection.updateOne(
            { alias: finalAlias },
            { $set: newUrl },
            { upsert: true }
        );

        return res.status(201).json({
            shortUrl: newUrl.shortUrl,
            longUrl: newUrl.longUrl,
            alias: newUrl.alias,
            expiresAt: newUrl.expiresAt
        });

    } catch (error: any) {
        console.error('API /v1/shorten Error:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
