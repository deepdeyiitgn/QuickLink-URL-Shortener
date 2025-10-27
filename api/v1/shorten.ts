// This is a Vercel serverless function for the Developer API endpoint. 
// It validates the API key and creates a short URL, storing it in MongoDB Atlas.

import { connectToDatabase } from '../lib/mongodb.js';
import type { User, ShortenedUrl } from '../../types';

export default async function handler(req: any, res: any) {
    try {
        const method = req.method;

        if (method !== 'POST' && method !== 'GET') {
            res.setHeader('Allow', ['POST', 'GET']);
            return res.status(405).end('Method Not Allowed');
        }

        // --- Handle bot-style or browser-style GET requests ---
        if (method === 'GET') {
            const { api, url, alias } = req.query;

            if (!api || !url) {
                return res.status(400).json({ status: 'error', message: 'Missing parameters.' });
            }

            req.headers.authorization = `Bearer ${api}`;
            req.body = { longUrl: decodeURIComponent(url), alias: alias || undefined };
            req.method = 'POST';
        }

        // --- Extract Data ---
        const apiKey = req.headers.authorization?.split(' ')[1];
        const { longUrl, alias } = req.body;

        if (!apiKey) {
            return res.status(401).json({ status: 'error', message: 'Missing API key.' });
        }

        if (!longUrl || typeof longUrl !== 'string' || !longUrl.startsWith('http')) {
            return res.status(400).json({ status: 'error', message: 'Invalid or missing URL.' });
        }

        // --- Connect to DB ---
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const urlsCollection = db.collection('urls');

        const user = await usersCollection.findOne({ "apiAccess.apiKey": apiKey });
        if (!user || !user.apiAccess) {
            return res.status(403).json({ status: 'error', message: 'Invalid API Key.' });
        }

        const subscription = user.apiAccess.subscription;
        if (!subscription || subscription.expiresAt < Date.now()) {
            return res.status(403).json({ status: 'error', message: 'API Key expired or invalid.' });
        }

        // --- Alias handling ---
        const finalAlias = alias || Math.random().toString(36).substring(2, 8);

        const existingActiveUrl = await urlsCollection.findOne({
            alias: finalAlias,
            $or: [{ expiresAt: null }, { expiresAt: { $gt: Date.now() } }]
        });

        if (existingActiveUrl) {
            return res.status(409).json({ status: 'error', message: 'Alias already taken.' });
        }

        // --- Build final short URL ---
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

        // --- Check if it's from browser, redirect instead of JSON ---
        if (req.query?.api && req.query?.url && req.headers.accept?.includes('text/html')) {
            return res.redirect(302, `/${finalAlias}`);
        }

        // ✅ JSON success (for bot or API)
        return res.status(200).json({
            status: 'success',
            shortenedUrl: newUrl.shortUrl,
            longUrl: newUrl.longUrl,
            alias: newUrl.alias,
            expiresAt: newUrl.expiresAt
        });

    } catch (error: any) {
        console.error('API /v1/shorten Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
}
