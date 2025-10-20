// Vercel Serverless Function: /api/support
// Handles tickets and notifications.

import { connectToDatabase } from './lib/mongodb';
import type { Ticket, Notification } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    const { type } = req.query; // 'ticket' or 'notification'

    try {
        const { db } = await connectToDatabase();

        if (type === 'ticket') {
            const ticketsCollection = db.collection('tickets');
            if (req.method === 'POST') {
                const ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'> = req.body;
                if (!ticketData.userEmail || !ticketData.subject || !ticketData.message) {
                    return res.status(400).json({ error: 'Missing required fields for ticket.' });
                }
                const newTicket: Ticket = { ...ticketData, id: `ticket_${Date.now()}`, createdAt: Date.now(), status: 'open' };
                await ticketsCollection.insertOne(newTicket);
                return res.status(201).json(newTicket);
            }
            res.setHeader('Allow', ['POST']);
            return res.status(405).end('Method Not Allowed');

        } else if (type === 'notification') {
            const notificationsCollection = db.collection('notifications');
            if (req.method === 'GET') {
                const { userId } = req.query;
                if (!userId) return res.status(400).json({ error: 'userId is required.' });
                const notifications = await notificationsCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
                return res.status(200).json(notifications);
            }
            if (req.method === 'PUT') {
                const { notificationId } = req.body;
                if (!notificationId) return res.status(400).json({ error: 'notificationId is required.' });
                await notificationsCollection.updateOne({ id: notificationId }, { $set: { isRead: true } });
                return res.status(200).json({ success: true });
            }
            res.setHeader('Allow', ['GET', 'PUT']);
            return res.status(405).end('Method Not Allowed');

        } else {
            return res.status(400).json({ error: 'A valid support type (`ticket` or `notification`) must be specified.' });
        }
    } catch (error: any) {
        console.error(`Error with /api/support (type: ${type}):`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
