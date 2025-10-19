// Vercel Serverless Function: /api/payments
// Handles GET and POST requests for the 'payments' collection in MongoDB.

import { connectToDatabase } from './lib/mongodb';
import type { PaymentRecord } from '../types';

export default async function handler(req: any, res: any) {
    try {
        const { db } = await connectToDatabase();
        const paymentsCollection = db.collection('payments');

        if (req.method === 'GET') {
            const payments = await paymentsCollection.find({}).toArray();
            return res.status(200).json(payments);
        }

        if (req.method === 'POST') {
            const payments: PaymentRecord[] = req.body;
            // "Replace all" operation
            await paymentsCollection.deleteMany({});
            if (payments.length > 0) {
                await paymentsCollection.insertMany(payments);
            }
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/payments:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}