// Vercel Serverless Function: /api/auth
// Handles all authentication logic: signup, login, and password reset.

import { connectToDatabase } from './lib/mongodb.js';
import type { User } from '../types';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// --- Password Hashing Utilities ---
// Use a strong algorithm and salt.
const hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
};

const verifyPassword = (password: string, storedHash: string) => {
    try {
        const [salt, hash] = storedHash.split(':');
        const hashToCompare = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hash === hashToCompare;
    } catch (e) {
        return false;
    }
};


// --- Nodemailer Transport for Brevo ---
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: parseInt(process.env.BREVO_PORT || '587'),
    secure: false, // Brevo uses STARTTLS on port 587
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

// --- Main Handler ---
export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');
        const { action, email, password, name, token, newPassword } = req.body;

        switch (action) {
            case 'login': {
                const user = await usersCollection.findOne({ email });
                if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
                    return res.status(401).json({ error: 'Invalid email or password.' });
                }
                // Don't send back the password hash
                const { passwordHash, ...userToReturn } = user;
                return res.status(200).json(userToReturn);
            }

            case 'signup': {
                if (!name || !email || !password) {
                    return res.status(400).json({ error: 'Name, email, and password are required.' });
                }
                const existingUser = await usersCollection.findOne({ email });
                if (existingUser) {
                    return res.status(409).json({ error: 'An account with this email already exists.' });
                }

                const newUser: User = {
                    id: `user_${Date.now()}`,
                    name,
                    email,
                    passwordHash: hashPassword(password),
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
                // Don't send back the password hash
                const { passwordHash, ...userToReturn } = newUser as any;
                return res.status(201).json(userToReturn);
            }

            case 'forgot-password': {
                const user = await usersCollection.findOne({ email });
                if (!user) {
                    // Still return success to prevent user enumeration attacks
                    return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
                }

                const resetToken = crypto.randomBytes(32).toString('hex');
                const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
                const passwordResetExpires = Date.now() + 3600000; // 1 hour

                await usersCollection.updateOne({ id: user.id }, { $set: { passwordResetToken, passwordResetExpires } });

                const resetUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/reset-password/${resetToken}`;

                // --- HTML Email Template with Logo + Button + Fallback Link ---
                const htmlEmail = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #ddd; padding:20px; text-align:center; background:#f9f9f9;">
                        
                        <!-- Logo -->
                        <img src="https://quick-link-url-shortener.vercel.app/quicklink-logo.svg" 
                             alt="QuickLink Logo" 
                             style="width:150px; margin-bottom:20px;" />

                        <!-- Heading -->
                        <h2 style="color:#333;">Reset Your Password</h2>

                        <!-- Message -->
                        <p style="color:#555; font-size:16px;">
                            We received a request to reset your QuickLink account password. Click the button below to reset it:
                        </p>

                        <!-- Button -->
                        <a href="${resetUrl}" 
                           style="display:inline-block; padding:12px 25px; margin:20px 0; background:#4CAF50; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">
                            Reset Password
                        </a>

                        <!-- Fallback link -->
                        <p style="color:#777; font-size:14px;">
                            If the button doesn’t work, copy and paste this link into your browser: <br />
                            <a href="${resetUrl}" style="color:#4CAF50; word-break:break-all;">${resetUrl}</a>
                        </p>

                        <!-- Footer -->
                        <p style="color:#aaa; font-size:12px; margin-top:30px;">
                            &copy; 2025 QuickLink. All rights reserved.
                        </p>
                    </div>
                `;
                
                const textEmail = `
                    Reset Your Password

                    We received a request to reset your QuickLink account password.
                    
                    Please use the following link to complete the process:
                    ${resetUrl}

                    This link will expire in one hour.
                    
                    If you did not request this, please ignore this email and your password will remain unchanged.

                    © 2025 QuickLink. All rights reserved.
                `;

                const mailOptions = {
                    from: process.env.BREVO_SENDER,
                    to: user.email,
                    subject: 'QuickLink - Password Reset Request',
                    text: textEmail,
                    html: htmlEmail,
                };

                await transporter.sendMail(mailOptions);
                return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
            }

            case 'reset-password': {
                if (!token || !newPassword) {
                    return res.status(400).json({ error: 'Token and new password are required.' });
                }

                const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                
                const user = await usersCollection.findOne({
                    passwordResetToken: hashedToken,
                    passwordResetExpires: { $gt: Date.now() },
                });

                if (!user) {
                    return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
                }

                await usersCollection.updateOne({ id: user.id }, {
                    $set: {
                        passwordHash: hashPassword(newPassword),
                        passwordResetToken: undefined,
                        passwordResetExpires: undefined,
                    }
                });

                return res.status(200).json({ message: 'Password has been successfully reset.' });
            }

            default:
                return res.status(400).json({ error: 'Invalid action specified.' });
        }

    } catch (error: any) {
        console.error('Error with /api/auth:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
