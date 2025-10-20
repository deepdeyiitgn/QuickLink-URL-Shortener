// Vercel Serverless Function: /api/notifications
// Handles fetching and updating user notifications.

import { connectToDatabase } from './lib/mongodb';
// FIX: Corrected import path for types
import type { Notification } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const notificationsCollection = db.collection('notifications');

        if (req.method === 'GET') {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ error: 'userId is required.' });
            }
            const notifications = await notificationsCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
            return res.status(200).json(notifications);
        }

        if (req.method === 'PUT') {
            const { notificationId } = req.body;
            if (!notificationId) {
                return res.status(400).json({ error: 'notificationId is required.' });
            }
            await notificationsCollection.updateOne(
                { id: notificationId },
                { $set: { isRead: true } }
            );
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/notifications:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}