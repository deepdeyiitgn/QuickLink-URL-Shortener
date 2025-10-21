// Vercel Serverless Function: /api/auth
// Handles user login and signup.

import { connectToDatabase } from './lib/mongodb.js';
import type { User } from '../types';

// A simple (and insecure) hashing function for demonstration purposes.
// In a real application, ALWAYS use a strong, salted hashing library like bcrypt.
const simpleHash = (password: string) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return String(hash);
};


export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const { action, name, email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        if (action === 'signup') {
            if (!name) {
                return res.status(400).json({ error: "Name is required for signup." });
            }

            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: "An account with this email already exists." });
            }

            const newUser: User = {
                id: `user_${Date.now()}`,
                name,
                email,
                passwordHash: simpleHash(password),
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
            return res.status(201).json(newUser);

        } else if (action === 'login') {
            const user = await usersCollection.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: "No account found with this email." });
            }

            if (user.passwordHash !== simpleHash(password)) {
                return res.status(401).json({ error: "Incorrect password." });
            }
            
            // Log the login activity
            const activityLogsCollection = db.collection('activity_logs');
            await activityLogsCollection.insertOne({
                userId: user.id,
                userName: user.name,
                action: 'login',
                timestamp: Date.now(),
            });

            // Update lastActive time on successful login
            const updateResult = await usersCollection.findOneAndUpdate(
                { email },
                { $set: { lastActive: Date.now() } },
                { returnDocument: 'after' }
            );

            return res.status(200).json(updateResult);

        } else {
            return res.status(400).json({ error: "Invalid action. Must be 'login' or 'signup'." });
        }

    } catch (error: any) {
        console.error('API /api/auth Error:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
