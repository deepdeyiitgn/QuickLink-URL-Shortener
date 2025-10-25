// Vercel Serverless Function: /api/admin
// Secure endpoint to provide aggregated data for the admin's live activity dashboard.

import { connectToDatabase } from './lib/mongodb.js';
import type { User } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { db } = await connectToDatabase();
        const { adminId } = req.query;

        if (!adminId) {
            return res.status(401).json({ error: 'Admin ID is required.' });
        }
        
        const adminUser = await db.collection('users').findOne({ id: adminId as string });
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Admin access required.' });
        }
        
        // 1. Get System Status
        const systemStatus = {
            db: { status: 'ok', message: '', dbName: process.env.MONGODB_DB_NAME || 'Not Set' },
            auth: { status: 'ok', message: 'Authentication service is operational.' },
            urls: { status: 'ok', message: 'URL services are operational.' },
            payments: { status: 'ok', message: 'Payment gateway is configured.' },
        };
        try {
            await db.command({ ping: 1 });
            systemStatus.db.message = 'Database connection successful.';
        } catch (e: any) {
            systemStatus.db.status = 'error';
            systemStatus.db.message = `Database connection failed: ${e.message}`;
            systemStatus.auth.status = 'error';
            systemStatus.auth.message = 'Service down due to DB issues.';
            systemStatus.urls.status = 'error';
            systemStatus.urls.message = 'Service down due to DB issues.';
        }
        if (!process.env.VITE_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            systemStatus.payments.status = 'degraded';
            systemStatus.payments.message = 'Razorpay not configured.';
        }

        // 2. Get all users, sorted by last active
        const allUsers = await db.collection('users').find({}).sort({ lastActive: -1 }).toArray();
        
        // 3. Get recent activity logs (last 20)
        const activityLogs = await db.collection('activity_logs').find({}).sort({ timestamp: -1 }).limit(20).toArray();

        return res.status(200).json({
            systemStatus,
            allUsers,
            activityLogs,
        });

    } catch (error: any) {
        console.error('Error with /api/admin:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
