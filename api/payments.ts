// Vercel Serverless Function: /api/payments
// Handles GET/POST for payment records and POST for creating payment orders.

import { connectToDatabase } from './lib/mongodb.js';
import type { PaymentRecord, Coupon, User } from '../types';

// Server-side coupon verification logic
async function verifyAndApplyCoupon(db: any, code: string, baseAmount: number, userId: string): Promise<{ finalPrice: number; discountAmount: number }> {
    if (!code) {
        return { finalPrice: baseAmount, discountAmount: 0 };
    }

    const couponsCollection = db.collection('coupons');
    const coupon: Coupon | null = await couponsCollection.findOne({ code: code.toUpperCase() });

    if (!coupon) throw new Error("Invalid coupon code.");
    if (coupon.expiresAt && coupon.expiresAt < Date.now()) throw new Error("This coupon has expired.");
    if (coupon.quantityLimit && coupon.uses >= coupon.quantityLimit) throw new Error("This coupon has reached its usage limit.");
    
    if (coupon.onePerUser) {
        const usageCollection = db.collection('coupon_usage');
        const existingUsage = await usageCollection.findOne({ couponId: coupon.id, userId });
        if (existingUsage) throw new Error("You have already used this coupon code.");
    }
    
    let discountAmount = 0;
    if (coupon.discount.type === 'FLAT') {
        discountAmount = coupon.discount.value;
    } else if (coupon.discount.type === 'PERCENT') {
        discountAmount = (baseAmount * coupon.discount.value) / 100;
    }

    const finalPrice = Math.max(0, baseAmount - discountAmount);
    return { finalPrice, discountAmount };
}

// Helper function for Razorpay order creation
async function createRazorpayOrder(req: any, res: any) {
    const { amount, currency, couponCode, userId } = req.body;
    if (!amount || !currency || !userId) return res.status(400).json({ error: 'Amount, currency, and userId are required.' });

    const keyId = process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return res.status(500).json({ error: 'Payment gateway (Razorpay) is not configured correctly.' });

    const { db } = await connectToDatabase();
    const { finalPrice } = await verifyAndApplyCoupon(db, couponCode, amount, userId);

    const auth = btoa(`${keyId}:${keySecret}`);
    const options = {
        amount: Math.round(finalPrice * 100), // Razorpay requires amount in paise
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
    const { amount, currency, user, couponCode } = req.body;
    if (!amount || !currency || !user) return res.status(400).json({ error: 'Amount, currency, and user details are required.' });
    
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.status(500).json({ error: 'Payment gateway (Cashfree) is not configured correctly.' });

    const { db } = await connectToDatabase();
    const { finalPrice } = await verifyAndApplyCoupon(db, couponCode, amount, user.id);

    const options = {
        order_id: `order_${Date.now()}`,
        order_amount: finalPrice,
        order_currency: currency,
        customer_details: {
            customer_id: user.id,
            customer_email: user.email,
            customer_phone: '9999999999' // Placeholder as it's required
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
