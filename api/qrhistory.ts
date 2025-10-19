// Vercel Serverless Function: /api/qrhistory
// Handles GET and POST requests for the 'qrhistory' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb';
import type { QrCodeRecord } from '../types';

export default async function handler(req: any, res: any) {
    try {
        const { db } = await connectToDatabase();
        const qrHistoryCollection = db.collection('qrhistory');

        if (req.method === 'GET') {
            const history = await qrHistoryCollection.find({}).toArray();
            return res.status(200).json(history);
        }

        if (req.method === 'POST') {
            const history: QrCodeRecord[] = req.body;
            // "Replace all" operation
            await qrHistoryCollection.deleteMany({});
            if (history.length > 0) {
                await qrHistoryCollection.insertMany(history);
            }
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/qrhistory:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}