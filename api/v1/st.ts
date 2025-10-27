// This is a Vercel serverless function for the Developer API endpoint: st.ts
// It validates the API key and creates or redirects short URLs via MongoDB Atlas.

import { connectToDatabase } from '../lib/mongodb.js';
import type { User, ShortenedUrl } from '../../types';

export default async function handler(req: any, res: any) {
    try {
        // ✅ Allow both /api/v1/shorten and /api/v1/st
        if (req.url.startsWith('/api/v1/st')) {
            req.method = 'GET';
            const queryStr = req.url.split('?')[1] || '';
            req.query = Object.fromEntries(new URLSearchParams(queryStr));
        }

        const method = req.method;
        if (method !== 'POST' && method !== 'GET') {
            res.setHeader('Allow', ['POST', 'GET']);
            return res.status(405).end('Method Not Allowed');
        }

        // 🔹 Extract API key & URL
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

        const userAgent = req.headers['user-agent'] || '';
        const isBot = /(curl|wget|axios|python|node|postman)/i.test(userAgent);

        // ✅ Different responses based on client type
        if (isBot) {
            return res.status(200).json({
                status: "success",
                shortenedUrl: newUrl.shortUrl,
                longUrl: newUrl.longUrl,
                alias: newUrl.alias,
                expiresAt: newUrl.expiresAt
            });
        } else {
            // normal browser → redirect directly
            return res.redirect(302, newUrl.shortUrl);
        }

    } catch (error: any) {
        console.error('API /v1/st Error:', error);
        return res.status(500).json({
            status: "error",
            message: error.message || 'Internal server error'
        });
    }
}
