// Vercel Serverless Function: /api/support
// Handles tickets and notifications.

import { connectToDatabase } from './lib/mongodb.js';
import type { Ticket, Notification } from '../types';
import { Collection, ObjectId } from 'mongodb';

async function handleTicketRequests(req: any, res: any, db: any) {
    const ticketsCollection: Collection<Ticket> = db.collection('tickets');
    
    if (req.method === 'POST') {
        const ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status' | 'replies' | 'lastReplyAt'> = req.body;
        if (!ticketData.userEmail || !ticketData.subject || !ticketData.message) {
            return res.status(400).json({ error: 'Missing required fields for ticket.' });
        }
        const now = Date.now();
        const newTicket: Ticket = { 
            ...ticketData, 
            id: `ticket_${now}`, 
            createdAt: now,
            lastReplyAt: now,
            status: 'open',
            replies: []
        };
        await ticketsCollection.insertOne(newTicket);
        return res.status(201).json(newTicket);
    }
    
    if (req.method === 'GET') {
        const { userId } = req.query;
        const query = userId ? { userId } : {};
        const tickets = await ticketsCollection.find(query).sort({ lastReplyAt: -1 }).toArray();
        return res.status(200).json(tickets);
    }

    if (req.method === 'PUT') {
        const { ticketId, action } = req.query;
        if (!ticketId || !action) {
            return res.status(400).json({ error: 'ticketId and action are required query parameters.' });
        }

        let updateResult;

        if (action === 'status') {
            const { status } = req.body;
            if (!['open', 'closed', 'in-progress'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status value.' });
            }
            updateResult = await ticketsCollection.findOneAndUpdate(
                { id: ticketId },
                { $set: { status, lastReplyAt: Date.now() } },
                { returnDocument: 'after' }
            );
        } else if (action === 'reply') {
            const replyData = req.body;
            const newReply = { ...replyData, id: `reply_${Date.now()}`, createdAt: Date.now() };
            updateResult = await ticketsCollection.findOneAndUpdate(
                { id: ticketId },
                { 
                    $push: { replies: newReply },
                    $set: { lastReplyAt: Date.now(), status: replyData.isAdminReply ? 'in-progress' : 'open' }
                },
                { returnDocument: 'after' }
            );
        }

        if (!updateResult) {
            return res.status(404).json({ error: 'Ticket not found.' });
        }
        return res.status(200).json(updateResult);
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end('Method Not Allowed');
}


async function handleNotificationRequests(req: any, res: any, db: any) {
    const notificationsCollection: Collection<Notification> = db.collection('notifications');

    if (req.method === 'GET') {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'userId is required.' });
        // Find notifications for the specific user OR broadcast notifications
        const query = { $or: [{ userId }, { userId: 'all' }] };
        const notifications = await notificationsCollection.find(query).sort({ createdAt: -1 }).toArray();
        return res.status(200).json(notifications);
    }
    
    if (req.method === 'POST') { // Admin creates a broadcast
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message content is required.' });
        const newNotification: Notification = {
            id: `notif_${Date.now()}`,
            userId: 'all',
            message,
            createdAt: Date.now(),
            isRead: false,
        };
        await notificationsCollection.insertOne(newNotification);
        return res.status(201).json(newNotification);
    }

    if (req.method === 'PUT') {
        const { notificationId } = req.body;
        if (!notificationId) return res.status(400).json({ error: 'notificationId is required.' });
        await notificationsCollection.updateOne({ id: notificationId }, { $set: { isRead: true } });
        return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end('Method Not Allowed');
}


export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    const { type } = req.query; // 'ticket' or 'notification'

    try {
        const { db } = await connectToDatabase();

        if (type === 'ticket') {
            return handleTicketRequests(req, res, db);
        } else if (type === 'notification') {
            return handleNotificationRequests(req, res, db);
        } else {
            return res.status(400).json({ error: 'A valid support type (`ticket` or `notification`) must be specified.' });
        }
    } catch (error: any) {
        console.error(`Error with /api/support (type: ${type}):`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}