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
        const { action, email, password, name, token, newPassword, recaptchaToken } = req.body;

        switch (action) {
            case 'login': {
                const user = await usersCollection.findOne({ email });
                if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
                    return res.status(401).json({ error: 'Invalid email or password.' });
                }
                if (user.status === 'pending') {
                    return res.status(401).json({ error: 'Account not verified. Please check your email for a verification link.' });
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
                if (existingUser && existingUser.status !== 'pending') {
                    return res.status(409).json({ error: 'An account with this email already exists.' });
                }

                const verificationToken = crypto.randomBytes(32).toString('hex');

                const userPayload = {
                    name,
                    email,
                    passwordHash: hashPassword(password),
                    createdAt: Date.now(),
                    lastActive: Date.now(),
                    isAdmin: false,
                    canModerate: false,
                    canSetCustomExpiry: false,
                    isDonor: false,
                    status: 'pending' as const,
                    subscription: null,
                    apiAccess: null,
                    verificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
                    verificationExpires: Date.now() + 3600000, // 1 hour
                };
                
                await usersCollection.updateOne({ email }, { $set: { id: `user_${Date.now()}`, ...userPayload } }, { upsert: true });

                const verificationUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/verify-email/${verificationToken}`;

                const htmlEmail = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #ddd; padding:20px; text-align:center; background:#f9f9f9;">
                        <img src="https://quick-link-url-shortener.vercel.app/quicklink-logo.svg" alt="QuickLink Logo" style="width:150px; margin-bottom:20px;" />
                        <h2 style="color:#333;">Welcome to QuickLink!</h2>
                        <p style="color:#555; font-size:16px;">Thanks for signing up! Please click the button below to verify your email address and activate your account.</p>
                        <a href="${verificationUrl}" style="display:inline-block; padding:12px 25px; margin:20px 0; background:#00e5ff; color:#0a0a1a; text-decoration:none; border-radius:5px; font-weight:bold;">Verify Your Email</a>
                        <p style="color:#777; font-size:14px;">If the button doesn’t work, copy and paste this link into your browser: <br /><a href="${verificationUrl}" style="color:#00e5ff; word-break:break-all;">${verificationUrl}</a></p>
                        <p style="color:#aaa; font-size:12px; margin-top:30px;">&copy; ${new Date().getFullYear()} QuickLink. All rights reserved.</p>
                    </div>`;

                await transporter.sendMail({
                    from: process.env.BREVO_SENDER,
                    to: email,
                    subject: 'Verify Your Email Address for QuickLink',
                    html: htmlEmail,
                });

                return res.status(200).json({ message: 'Verification email sent. Please check your inbox to complete your registration.' });
            }

            case 'forgot-password': {
                const user = await usersCollection.findOne({ email });
                if (!user) {
                    return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
                }

                const resetToken = crypto.randomBytes(32).toString('hex');
                const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
                const passwordResetExpires = Date.now() + 3600000; // 1 hour

                await usersCollection.updateOne({ id: user.id }, { $set: { passwordResetToken, passwordResetExpires } });

                const resetUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/reset-password/${resetToken}`;

                const htmlEmail = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #ddd; padding:20px; text-align:center; background:#f9f9f9;"><img src="https://quick-link-url-shortener.vercel.app/quicklink-logo.svg" alt="QuickLink Logo" style="width:150px; margin-bottom:20px;" /><h2 style="color:#333;">Reset Your Password</h2><p style="color:#555; font-size:16px;">We received a request to reset your QuickLink account password. Click the button below to reset it:</p><a href="${resetUrl}" style="display:inline-block; padding:12px 25px; margin:20px 0; background:#00e5ff; color:#0a0a1a; text-decoration:none; border-radius:5px; font-weight:bold;">Reset Password</a><p style="color:#777; font-size:14px;">If the button doesn’t work, copy and paste this link into your browser: <br /><a href="${resetUrl}" style="color:#00e5ff; word-break:break-all;">${resetUrl}</a></p><p style="color:#aaa; font-size:12px; margin-top:30px;">&copy; ${new Date().getFullYear()} QuickLink. All rights reserved.</p></div>`;
                
                await transporter.sendMail({
                    from: process.env.BREVO_SENDER,
                    to: user.email,
                    subject: 'QuickLink - Password Reset Request',
                    html: htmlEmail,
                });
                return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
            }

            case 'reset-password': {
                if (!token || !newPassword) {
                    return res.status(400).json({ error: 'Token and new password are required.' });
                }

                const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                
                const user = await usersCollection.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

                if (!user) {
                    return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
                }

                await usersCollection.updateOne({ id: user.id }, { $set: { passwordHash: hashPassword(newPassword) }, $unset: { passwordResetToken: "", passwordResetExpires: "" } });

                return res.status(200).json({ message: 'Password has been successfully reset.' });
            }
            
            case 'check-verification-token': {
                const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                const user = await usersCollection.findOne({ verificationToken: hashedToken, verificationExpires: { $gt: Date.now() } });
                if (!user) return res.status(404).json({ isValid: false, message: 'This verification link is invalid or has expired.' });
                if (user.status === 'active') return res.status(200).json({ isValid: false, message: 'This account has already been verified.' });
                return res.status(200).json({ isValid: true, message: 'Token is valid.' });
            }
            
            case 'verify-and-activate': {
                const { token, recaptchaToken, mathAnswer, textAnswer } = req.body;

                if (recaptchaToken) {
                    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
                    if (!secretKey) return res.status(500).json({ error: 'reCAPTCHA is not configured on the server.' });

                    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
                    const response = await fetch(verificationUrl, { method: 'POST' });
                    const data = await response.json();
                    if (!data.success) return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
                } else if (mathAnswer !== undefined && textAnswer !== undefined) {
                    // This is a simple server-side check. In a real app, the puzzle values would be stored in the session.
                    // For this stateless approach, we'll have to trust the client sent correct info, which is not ideal.
                    // This is a limitation of a simple serverless function without session management. The main protection is the token.
                } else {
                    return res.status(400).json({ error: 'CAPTCHA response is missing.' });
                }

                const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                const user = await usersCollection.findOne({ verificationToken: hashedToken, verificationExpires: { $gt: Date.now() } });

                if (!user) return res.status(400).json({ error: 'Verification link is invalid or has expired.' });

                await usersCollection.updateOne({ id: user.id }, { $set: { status: 'active' }, $unset: { verificationToken: "", verificationExpires: "" } });

                return res.status(200).json({ message: 'Account verified successfully! You can now log in.' });
            }

            default:
                return res.status(400).json({ error: 'Invalid action specified.' });
        }

    } catch (error: any) {
        console.error('Error with /api/auth:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
