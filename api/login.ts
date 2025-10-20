// api/login.ts
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        // In a real app, you would use bcrypt.compare(password, user.passwordHash)
        // For this demo, we compare the "hashed" password directly.
        if (user.passwordHash !== password) {
             return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        // Don't send the password hash back to the client
        const { passwordHash, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);
        
    } catch (error: any) {
        console.error('/api/login error:', error);
        res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}