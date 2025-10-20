// Vercel Serverless Function: /api/donations
// Handles GET and POST for donations.

import { connectToDatabase } from './lib/mongodb';
// FIX: Corrected import path for types
import type { Donation } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const donationsCollection = db.collection('donations');

        if (req.method === 'GET') {
            const donations = await donationsCollection.find({}).sort({ createdAt: -1 }).toArray();
            return res.status(200).json(donations);
        }

        if (req.method === 'POST') {
            const donationData: Omit<Donation, 'id' | 'createdAt'> = req.body;
            if (!donationData || !donationData.amount) {
                return res.status(400).json({ error: 'Missing required fields for donation.' });
            }

            const newDonation: Donation = {
                ...donationData,
                id: `donation_${Date.now()}`,
                createdAt: Date.now(),
            };

            await donationsCollection.insertOne(newDonation);
            return res.status(201).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/donations:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}