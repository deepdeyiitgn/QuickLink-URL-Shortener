// Vercel Serverless Function: /api/qrhistory
// Handles GET and POST requests for the 'qrhistory' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb';
// FIX: Corrected import path for types
import type { QrCodeRecord } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const qrHistoryCollection = db.collection('qrhistory');

        if (req.method === 'GET') {
            const history = await qrHistoryCollection.find({}).toArray();
            return res.status(200).json(history);
        }

        if (req.method === 'POST') { // Insert a single new QR record
            if (!req.body) {
                return res.status(400).json({ error: 'Request body is missing.' });
            }
            const newRecord: QrCodeRecord = req.body;
            await qrHistoryCollection.insertOne(newRecord);
            return res.status(201).json(newRecord);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/qrhistory:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}