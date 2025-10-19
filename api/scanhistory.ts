// Vercel Serverless Function: /api/scanhistory
// Handles GET and POST requests for the 'scanhistory' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb';
import type { ScanRecord } from '../types';

export default async function handler(req: any, res: any) {
    try {
        const { db } = await connectToDatabase();
        const scanHistoryCollection = db.collection('scanhistory');

        if (req.method === 'GET') {
            const history = await scanHistoryCollection.find({}).toArray();
            return res.status(200).json(history);
        }

        if (req.method === 'POST') {
            const history: ScanRecord[] = req.body;
            // "Replace all" operation
            await scanHistoryCollection.deleteMany({});
            if (history.length > 0) {
                await scanHistoryCollection.insertMany(history);
            }
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/scanhistory:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}