// Vercel Serverless Function: /api/support
// Handles all logic for support tickets and sending notifications.

import { connectToDatabase } from './lib/mongodb.js';
import type { Ticket, TicketReply, User, NotificationMessage } from '../types';

async function handleGetTickets(req: any, res: any, db: any) {
    const { userId, forAdmin } = req.query;
    const usersCollection = db.collection('users');
    const user = userId ? await usersCollection.findOne({ id: userId }) : null;

    if (forAdmin === 'true') {
        if (!user || !user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
        const allTickets = await db.collection('tickets').find({}).sort({ createdAt: -1 }).toArray();
        return res.status(200).json(allTickets);
    }
    
    if (userId) {
        const userTickets = await db.collection('tickets').find({ userId }).sort({ createdAt: -1 }).toArray();
        return res.status(200).json(userTickets);
    }
    
    return res.status(400).json({ error: "User ID or admin flag is required." });
}

async function handleCreateTicket(req: any, res: any, db: any) {
    const { userId, userName, userEmail, subject, message } = req.body;
    const newTicket: Ticket = {
        id: `ticket_${Date.now()}`,
        userId,
        userName,
        userEmail,
        subject,
        status: 'open',
        createdAt: Date.now(),
        replies: [{
            id: `reply_${Date.now()}`,
            userId,
            userName,
            userIsAdmin: false,
            message,
            createdAt: Date.now(),
        }]
    };
    await db.collection('tickets').insertOne(newTicket);
    return res.status(201).json(newTicket);
}

async function handleUpdateTicket(req: any, res: any, db: any) {
    const { ticketId, action, userId, message, newStatus } = req.body;
    const user = await db.collection('users').findOne({ id: userId });
    if (!user) return res.status(403).json({ error: "User not found." });

    const ticket = await db.collection('tickets').findOne({ id: ticketId });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

    if (action === 'add_reply') {
        const newReply: TicketReply = {
            id: `reply_${Date.now()}`,
            userId,
            userName: user.name,
            userIsAdmin: user.isAdmin,
            message,
            createdAt: Date.now(),
        };
        await db.collection('tickets').updateOne({ id: ticketId }, { $push: { replies: newReply as any } });
        
        // If an admin replies, notify the user.
        if (user.isAdmin && ticket.userId !== userId) {
             const notification: Omit<NotificationMessage, 'id'> = {
                userId: ticket.userId,
                title: `Reply to your ticket: "${ticket.subject}"`,
                message: `A support agent has replied to your ticket.`,
                link: `/dashboard`, // Links to dashboard where they can see tickets
                isRead: false,
                createdAt: Date.now(),
            };
            await db.collection('notifications').insertOne({ ...notification, id: `notif_${Date.now()}` });
        }
    } else if (action === 'change_status') {
        if (!user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
        // FIX: Explicitly type `updateStatus` to satisfy the MongoDB driver's type requirements.
        const updateStatus: Ticket['status'] = newStatus;
        await db.collection('tickets').updateOne({ id: ticketId }, { $set: { status: updateStatus } });
    } else {
        return res.status(400).json({ error: 'Invalid action.' });
    }

    const updatedTicket = await db.collection('tickets').findOne({ id: ticketId });
    return res.status(200).json(updatedTicket);
}

async function handleGetNotifications(req: any, res: any, db: any) {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    const notifications = await db.collection('notifications').find({ userId }).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(notifications);
}

async function handleSendNotification(req: any, res: any, db: any) {
    const { userId, title, message, link, imageUrl } = req.body;
    const newNotification: NotificationMessage = {
        id: `notif_${Date.now()}`,
        userId,
        title,
        message,
        link,
        imageUrl,
        isRead: false,
        createdAt: Date.now(),
    };
    await db.collection('notifications').insertOne(newNotification);
    return res.status(201).json(newNotification);
}

async function handleMarkRead(req: any, res: any, db: any) {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    await db.collection('notifications').updateMany({ userId, isRead: false }, { $set: { isRead: true } });
    return res.status(200).json({ success: true });
}

async function handleDeleteNotification(req: any, res: any, db: any) {
    const { notificationId, userId } = req.body; // userId for admin check
    const user = await db.collection('users').findOne({ id: userId });
    if (!user || !user.isAdmin) return res.status(403).json({ error: "Unauthorized" });

    const result = await db.collection('notifications').deleteOne({ id: notificationId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Notification not found' });
    return res.status(200).json({ success: true });
}


// Main Handler
export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const { type } = req.query; // Differentiate between tickets and notifications

        if (type === 'ticket') {
            if (req.method === 'GET') return handleGetTickets(req, res, db);
            if (req.method === 'POST') return handleCreateTicket(req, res, db);
            if (req.method === 'PUT') return handleUpdateTicket(req, res, db);
        } else if (type === 'notification') {
            if (req.method === 'GET') return handleGetNotifications(req, res, db);
            if (req.method === 'POST') return handleSendNotification(req, res, db);
            if (req.method === 'PUT' && req.body.action === 'mark_read') return handleMarkRead(req, res, db);
            if (req.method === 'DELETE') return handleDeleteNotification(req, res, db);
        }

        return res.status(400).json({ error: "Invalid request type or method." });

    } catch (error: any) {
        console.error('Error with /api/support:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}