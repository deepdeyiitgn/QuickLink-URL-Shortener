// Vercel Serverless Function: /api/history
// Handles GET and POST requests for QR and Scan history collections.

import { connectToDatabase } from './lib/mongodb';
import type { QrCodeRecord, ScanRecord } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    const { type } = req.query; // 'qr' or 'scan'

    const collectionName = type === 'qr' ? 'qrhistory' : type === 'scan' ? 'scanhistory' : null;

    if (!collectionName) {
        return res.status(400).json({ error: 'A valid history type (`qr` or `scan`) must be specified.' });
    }

    try {
        const { db } = await connectToDatabase();
        const historyCollection = db.collection(collectionName);

        if (req.method === 'GET') {
            const history = await historyCollection.find({}).toArray();
            return res.status(200).json(history);
        }

        if (req.method === 'POST') {
            if (!req.body) {
                return res.status(400).json({ error: 'Request body is missing.' });
            }
            const newRecord = req.body as QrCodeRecord | ScanRecord;
            await historyCollection.insertOne(newRecord);
            return res.status(201).json(newRecord);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error(`Error with /api/history (type: ${type}):`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
