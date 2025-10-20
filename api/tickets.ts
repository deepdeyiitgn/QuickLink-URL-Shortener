// Vercel Serverless Function: /api/tickets
// Handles creation of support tickets.

import { connectToDatabase } from './lib/mongodb';
// FIX: Correct import path for types
import type { Ticket } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const ticketsCollection = db.collection('tickets');

        if (req.method === 'POST') {
            const ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'> = req.body;
            if (!ticketData.userEmail || !ticketData.subject || !ticketData.message) {
                return res.status(400).json({ error: 'Missing required fields for ticket.' });
            }

            const newTicket: Ticket = {
                ...ticketData,
                id: `ticket_${Date.now()}`,
                createdAt: Date.now(),
                status: 'open',
            };

            await ticketsCollection.insertOne(newTicket);
            return res.status(201).json(newTicket);
        }
        
        // Add GET for admins in a real app
        // if (req.method === 'GET') { ... }

        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/tickets:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}