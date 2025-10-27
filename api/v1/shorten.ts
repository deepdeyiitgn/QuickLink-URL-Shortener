// This is a Vercel serverless function for the Developer API endpoint. 
// It validates the API key and creates a short URL, storing it in MongoDB Atlas.

import { connectToDatabase } from '../lib/mongodb.js';
import type { User, ShortenedUrl } from '../../types';

export default async function handler(req: any, res: any) {
    try {
        // ✅ extra part: agar request /api/v1/shorten/st se aayi ho
        if (req.url.startsWith('/api/v1/shorten/st')) {
            req.method = 'GET';
            const queryStr = req.url.split('?')[1] || '';
            req.query = Object.fromEntries(new URLSearchParams(queryStr));
        }

        const method = req.method;

        // 🔹 Accept both POST (secure) and GET (bot-style)
        if (method !== 'POST' && method !== 'GET') {
            res.setHeader('Allow', ['POST', 'GET']);
            return res.status(405).end('Method Not Allowed');
        }

        // 🔹 Extract API key
        let apiKey: string | undefined;
        let longUrl: string | undefined;
        let alias: string | undefined;

        if (method === 'POST') {
            apiKey = req.headers.authorization?.split(' ')[1];
            ({ longUrl, alias } = req.body);
        } else {
            apiKey = req.query.api;
            longUrl = req.query.url;
            alias = req.query.alias;
        }

        if (!apiKey) {
            return res.status(401).json({ status: 'error', message: "Missing API key." });
        }

        if (!longUrl || typeof longUrl !== 'string' || !longUrl.startsWith('http')) {
            return res.status(400).json({ status: 'error', message: "Invalid or missing URL." });
        }

        // 🔹 Connect to DB
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const urlsCollection = db.collection('urls');

        const user = await usersCollection.findOne({ "apiAccess.apiKey": apiKey });

        if (!user || !user.apiAccess) {
            return res.status(403).json({ status: 'error', message: "Invalid API Key." });
        }

        const subscription = user.apiAccess.subscription;
        if (!subscription || subscription.expiresAt < Date.now()) {
            return res.status(403).json({ status: 'error', message: "API Key expired or invalid." });
        }

        const finalAlias = alias || Math.random().toString(36).substring(2, 8);

        const existingActiveUrl = await urlsCollection.findOne({
            alias: finalAlias,
            $or: [{ expiresAt: null }, { expiresAt: { $gt: Date.now() } }]
        });

        if (existingActiveUrl) {
            return res.status(409).json({ status: 'error', message: "Alias already taken." });
        }

        const host = req.headers?.host;
        const protocol = req.headers?.['x-forwarded-proto'] || 'https';
        const origin = `${protocol}://${host}`;

        const newUrl: ShortenedUrl = {
            id: `api_${Date.now()}`,
            longUrl,
            alias: finalAlias,
            shortUrl: `${origin}/${finalAlias}`,
            createdAt: Date.now(),
            expiresAt: subscription.expiresAt,
            userId: user.id,
        };

        await urlsCollection.updateOne(
            { alias: finalAlias },
            { $set: newUrl },
            { upsert: true }
        );

        // ✅ Standard response format
        return res.status(200).json({
            status: "success",
            shortenedUrl: newUrl.shortUrl,
            longUrl: newUrl.longUrl,
            alias: newUrl.alias,
            expiresAt: newUrl.expiresAt
        });

    } catch (error: any) {
        console.error('API /v1/shorten Error:', error);
        return res.status(500).json({
            status: "error",
            message: error.message || 'Internal server error'
        });
    }
}
