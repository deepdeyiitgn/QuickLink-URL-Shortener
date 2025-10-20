// Vercel Serverless Function: /api/payments
// Handles GET/POST for payment records and POST for creating payment orders.

import { connectToDatabase } from './lib/mongodb.js';
import type { PaymentRecord } from '../types';

// Helper function for Razorpay order creation
async function createRazorpayOrder(req: any, res: any) {
    const { amount, currency } = req.body;
    if (!amount || !currency) return res.status(400).json({ error: 'Amount and currency are required.' });

    const keyId = process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return res.status(500).json({ error: 'Payment gateway (Razorpay) is not configured correctly.' });

    const auth = btoa(`${keyId}:${keySecret}`);
    const options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
        body: JSON.stringify(options),
    });

    const orderData = await razorpayResponse.json();
    if (!razorpayResponse.ok) throw new Error(orderData.error?.description || 'Failed to create Razorpay order.');
    
    return res.status(200).json(orderData);
}

// Helper function for Cashfree order creation
async function createCashfreeOrder(req: any, res: any) {
    const { amount, currency, user } = req.body;
    if (!amount || !currency || !user) return res.status(400).json({ error: 'Amount, currency, and user details are required.' });
    
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.status(500).json({ error: 'Payment gateway (Cashfree) is not configured correctly.' });

    const options = {
        order_id: `order_${Date.now()}`,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
            customer_id: user.id,
            customer_email: user.email,
            customer_phone: '9999999999'
        },
        order_meta: {
            return_url: `https://quick-link-url-shortener.vercel.app/dashboard?order_id={order_id}`
        }
    };

    const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-client-id': clientId,
            'x-client-secret': clientSecret,
            'x-api-version': '2022-09-01'
        },
        body: JSON.stringify(options),
    });

    const orderData = await cashfreeResponse.json();
    if (!cashfreeResponse.ok) throw new Error(orderData.message || 'Failed to create Cashfree order.');

    return res.status(200).json(orderData);
}


export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const paymentsCollection = db.collection('payments');

        if (req.method === 'GET') {
            const payments = await paymentsCollection.find({}).toArray();
            return res.status(200).json(payments);
        }

        if (req.method === 'POST') {
            const { action, provider } = req.query;

            if (action === 'create_order') {
                if (provider === 'razorpay') return createRazorpayOrder(req, res);
                if (provider === 'cashfree') return createCashfreeOrder(req, res);
                return res.status(400).json({ error: 'Invalid payment provider specified.' });
            }

            // Default POST action: record a payment
            if (!req.body) return res.status(400).json({ error: 'Request body is missing.' });
            const newRecord: PaymentRecord = req.body;
            await paymentsCollection.insertOne(newRecord);
            return res.status(201).json(newRecord);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/payments:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}