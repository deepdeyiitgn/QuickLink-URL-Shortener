// api/auth.ts
import { connectToDatabase } from './lib/mongodb';
import type { User } from '../types';

export default async function handler(req: any, res: any) {
    const { action } = req.query;
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection<User>('users');

        if (action === 'login') {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            const user = await usersCollection.findOne({ email: email.toLowerCase() });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // In a real app, you would use bcrypt.compare(password, user.passwordHash)
            if (user.passwordHash !== password) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // Don't send the password hash back to the client
            const { passwordHash, ...userWithoutPassword } = user;
            return res.status(200).json(userWithoutPassword);

        } else if (action === 'signup') {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required.' });
            }

            const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ error: 'An account with this email already exists.' });
            }

            const newUser: User = {
                id: `user_${Date.now()}`,
                name,
                email: email.toLowerCase(),
                passwordHash: password, // In a real app, hash this
                createdAt: Date.now(),
                lastActive: Date.now(),
                isAdmin: false,
                canModerate: false,
                canSetCustomExpiry: false,
                isDonor: false,
                status: 'active',
                subscription: null,
                apiAccess: null,
            };

            await usersCollection.insertOne(newUser);
            const { passwordHash, ...userToReturn } = newUser;
            return res.status(201).json(userToReturn);

        } else {
            return res.status(400).json({ error: 'Invalid action specified.' });
        }

    } catch (error: any) {
        console.error(`/api/auth error (action: ${action}):`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
