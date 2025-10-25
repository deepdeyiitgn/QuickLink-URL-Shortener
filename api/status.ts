// Vercel Serverless Function: /api/status
// This endpoint provides a comprehensive health check for all critical services.

import { connectToDatabase } from './lib/mongodb.js';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    
    const status = {
        db: { status: 'ok', message: '', dbName: process.env.MONGODB_DB_NAME || 'Not Set' },
        auth: { status: 'ok', message: 'Authentication service is operational.' },
        urls: { status: 'ok', message: 'URL services are operational.' },
        payments: { status: 'ok', message: 'Payment gateway is configured.' },
    };

    // 1. Check Database Connection
    try {
        const { db } = await connectToDatabase();
        await db.command({ ping: 1 });
        status.db.message = 'Database connection successful.';
    } catch (error: any) {
        status.db.status = 'error';
        status.db.message = `Database connection failed: ${error.message}`;
        // If DB is down, other services are implicitly down
        status.auth.status = 'error';
        status.auth.message = 'Authentication service is down due to database connectivity issues.';
        status.urls.status = 'error';
        status.urls.message = 'URL services are down due to database connectivity issues.';
    }

    // 2. Check Payment Gateway Configuration
    if (!process.env.VITE_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        status.payments.status = 'degraded';
        status.payments.message = 'Razorpay payment provider is not configured. Payments will fail.';
    }
    
    // Overall status code
    const isOverallError = status.db.status === 'error' || status.auth.status === 'error' || status.urls.status === 'error';
    const statusCode = isOverallError ? 503 : 200;

    return res.status(statusCode).json(status);
}