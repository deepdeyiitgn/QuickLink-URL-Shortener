// Vercel Serverless Function: /api/history
// Handles GET and POST requests for QR code generation history and scan history.

import { connectToDatabase } from './lib/mongodb.js';
import type { QrCodeRecord, ScanRecord } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { db } = await connectToDatabase();
        const { type } = req.query; // 'qr' or 'scan'

        let collection;
        let sortKey;
        if (type === 'qr') {
            collection = db.collection('qr_history');
            sortKey = 'createdAt';
        } else if (type === 'scan') {
            collection = db.collection('scan_history');
            sortKey = 'scannedAt';
        } else {
            return res.status(400).json({ error: "Query parameter 'type' must be 'qr' or 'scan'." });
        }

        if (req.method === 'GET') {
            const history = await collection.find({}).sort({ [sortKey]: -1 }).toArray();
            return res.status(200).send(JSON.stringify(history));
        }

        if (req.method === 'POST') {
            const newRecord: QrCodeRecord | ScanRecord = req.body;
            await collection.insertOne(newRecord);
            return res.status(201).json(newRecord);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error(`Error with /api/history?type=${req.query.type}:`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}