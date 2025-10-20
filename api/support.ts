// Vercel Serverless Function: /api/support
// Handles tickets and notifications.

import { connectToDatabase } from './lib/mongodb.js';
import type { Ticket, Notification, TicketReply, User } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    const { type, userId, scope } = req.query; // 'ticket' or 'notification'

    try {
        const { db } = await connectToDatabase();

        if (type === 'ticket') {
            const ticketsCollection = db.collection<Ticket>('tickets');
            
            if (req.method === 'GET') {
                let tickets;
                if (scope === 'all') {
                    // In a real app, verify admin status here
                    tickets = await ticketsCollection.find({}).sort({ createdAt: -1 }).toArray();
                } else if (userId) {
                    tickets = await ticketsCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
                } else {
                    return res.status(400).json({ error: 'Either userId or scope=all is required.' });
                }
                return res.status(200).json(tickets);
            }
            
            if (req.method === 'POST') {
                const ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status' | 'replies'> = req.body;
                if (!ticketData.userEmail || !ticketData.subject || !ticketData.message) {
                    return res.status(400).json({ error: 'Missing required fields for ticket.' });
                }
                const newTicket: Ticket = { ...ticketData, id: `ticket_${Date.now()}`, createdAt: Date.now(), status: 'open', replies: [] };
                await ticketsCollection.insertOne(newTicket);
                return res.status(201).json(newTicket);
            }

            if (req.method === 'PUT') {
                const { action, ticketId, reply, status } = req.body;
                let updateResult;

                if (action === 'reply') {
                    const newReply: TicketReply = { ...reply, id: `reply_${Date.now()}`, createdAt: Date.now() };
                    updateResult = await ticketsCollection.findOneAndUpdate(
                        { id: ticketId },
                        { $push: { replies: newReply }, $set: { status: 'in-progress' } },
                        { returnDocument: 'after' }
                    );

                    // If an admin/moderator replied, notify the user.
                    const replyingUser = await db.collection<User>('users').findOne({ id: newReply.userId });
                    
                    if (updateResult && replyingUser && (replyingUser.isAdmin || replyingUser.canModerate) && updateResult.userId) {
                        const notificationsCollection = db.collection('notifications');
                        const newNotif: Notification = {
                            id: `notif_${Date.now()}`,
                            userId: updateResult.userId,
                            message: `You have a new reply on your ticket: "${updateResult.subject}"`,
                            createdAt: Date.now(),
                            isRead: false
                        };
                        await notificationsCollection.insertOne(newNotif);
                    }

                } else if (action === 'status') {
                    updateResult = await ticketsCollection.findOneAndUpdate(
                        { id: ticketId },
                        { $set: { status: status } },
                        { returnDocument: 'after' }
                    );
                } else {
                    return res.status(400).json({ error: 'Invalid action for updating ticket.' });
                }

                if (!updateResult) return res.status(404).json({ error: 'Ticket not found.' });
                return res.status(200).json(updateResult);
            }
            
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            return res.status(405).end('Method Not Allowed');

        } else if (type === 'notification') {
            const notificationsCollection = db.collection('notifications');
            if (req.method === 'GET') {
                if (!userId) return res.status(400).json({ error: 'userId is required.' });
                const notifications = await notificationsCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
                return res.status(200).json(notifications);
            }
            if (req.method === 'POST') { // Admin creating notifications
                const { userId: targetUserId, message } = req.body;
                if (!targetUserId || !message) return res.status(400).json({ error: 'Target user ID and message are required.' });
                
                let notificationsToInsert: Notification[] = [];
                if (targetUserId === 'all') {
                    const usersCollection = db.collection('users');
                    const allUsers = await usersCollection.find({}, { projection: { id: 1 } }).toArray();
                    notificationsToInsert = allUsers.map(user => ({
                        id: `notif_${Date.now()}_${user.id}`,
                        userId: user.id,
                        message,
                        createdAt: Date.now(),
                        isRead: false
                    }));
                } else {
                     notificationsToInsert.push({
                        id: `notif_${Date.now()}`,
                        userId: targetUserId,
                        message,
                        createdAt: Date.now(),
                        isRead: false
                    });
                }

                if (notificationsToInsert.length > 0) {
                    await notificationsCollection.insertMany(notificationsToInsert);
                }
                return res.status(201).json({ success: true, count: notificationsToInsert.length });
            }
            if (req.method === 'PUT') {
                const { notificationId } = req.body;
                if (!notificationId) return res.status(400).json({ error: 'notificationId is required.' });
                await notificationsCollection.updateOne({ id: notificationId }, { $set: { isRead: true } });
                return res.status(200).json({ success: true });
            }
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            return res.status(405).end('Method Not Allowed');

        } else {
            return res.status(400).json({ error: 'A valid support type (`ticket` or `notification`) must be specified.' });
        }
    } catch (error: any) {
        console.error(`Error with /api/support (type: ${type}):`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
