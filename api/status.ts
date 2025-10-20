// Vercel Serverless Function: /api/status
// This endpoint provides a health check for the database connection.

import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    const dbName = process.env.MONGODB_DB_NAME || 'Not Set';
    
    try {
        const { db } = await connectToDatabase();
        // Ping the database to confirm a successful connection.
        await db.command({ ping: 1 });
        
        return res.status(200).json({
            status: 'ok',
            message: 'Database connection successful.',
            dbName: dbName,
        });
    } catch (error: any) {
        console.error('Database connection check failed:', error);
        return res.status(500).json({
            status: 'error',
            message: `Database connection failed: ${error.message}`,
            dbName: dbName,
        });
    }
}