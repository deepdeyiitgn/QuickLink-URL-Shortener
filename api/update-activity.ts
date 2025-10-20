// api/update-activity.ts
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required.' });
        }
        const { db } = await connectToDatabase();
        await db.collection('users').updateOne(
            { id: userId },
            { $set: { lastActive: Date.now() } }
        );
        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Error with /api/update-activity:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}