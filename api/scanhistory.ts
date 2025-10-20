// Vercel Serverless Function: /api/scanhistory
// Handles GET and POST requests for the 'scanhistory' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb';
// FIX: Corrected import path for types
import type { ScanRecord } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const scanHistoryCollection = db.collection('scanhistory');

        if (req.method === 'GET') {
            const history = await scanHistoryCollection.find({}).toArray();
            return res.status(200).json(history);
        }

        if (req.method === 'POST') { // Insert a single new scan record
            if (!req.body) {
                return res.status(400).json({ error: 'Request body is missing.' });
            }
            const newRecord: ScanRecord = req.body;
            await scanHistoryCollection.insertOne(newRecord);
            return res.status(201).json(newRecord);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/scanhistory:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}