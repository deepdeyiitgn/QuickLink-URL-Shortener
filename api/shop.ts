
// Vercel Serverless Function: /api/shop
// Handles all logic for products, coupons, and purchase fulfillment.

import { connectToDatabase } from './lib/mongodb.js';
import type { Product, Coupon, User, CouponUsage } from '../types';

// Admin check helper function
const isAdmin = async (db: any, userId: string): Promise<boolean> => {
    if (!userId) return false;
    const user = await db.collection('users').findOne({ id: userId });
    return user?.isAdmin === true;
};

// --- Product Handlers ---
async function handleGetProducts(req: any, res: any, db: any) {
    // FIX: Used the $and operator to correctly combine multiple query conditions.
    // The original code had duplicate `$or` keys which is invalid.
    const products = await db.collection('products').find({
        $and: [
            { isActive: true },
            { $or: [{ availableUntil: null }, { availableUntil: { $gt: Date.now() } }] },
            { $or: [{ limitQuantity: null }, { limitQuantity: false }, { stock: { $gt: 0 } }] }
        ]
    }).toArray();
    return res.status(200).json(products);
}

async function handleAddProduct(req: any, res: any, db: any) {
    const { product, adminId } = req.body;
    if (!await isAdmin(db, adminId)) return res.status(403).json({ error: 'Unauthorized' });
    
    const newProduct: Product = {
        ...product,
        id: `prod_${Date.now()}`,
        createdAt: Date.now(),
        stock: product.limitQuantity ? product.stock : undefined,
    };
    await db.collection('products').insertOne(newProduct);
    return res.status(201).json(newProduct);
}

async function handleDeleteProduct(req: any, res: any, db: any) {
    const { productId, adminId } = req.body;
    if (!await isAdmin(db, adminId)) return res.status(403).json({ error: 'Unauthorized' });

    await db.collection('products').deleteOne({ id: productId });
    return res.status(200).json({ success: true });
}


// --- Coupon Handlers ---
async function handleGetCoupons(req: any, res: any, db: any) {
    const { adminId } = req.query;
    if (!await isAdmin(db, adminId)) return res.status(403).json({ error: 'Unauthorized' });
    const coupons = await db.collection('coupons').find({}).toArray();
    return res.status(200).json(coupons);
}

async function handleAddCoupon(req: any, res: any, db: any) {
    const { coupon, adminId } = req.body;
    if (!await isAdmin(db, adminId)) return res.status(403).json({ error: 'Unauthorized' });

    const newCoupon: Coupon = { ...coupon, id: `coupon_${Date.now()}`, createdAt: Date.now(), uses: 0 };
    await db.collection('coupons').insertOne(newCoupon);
    return res.status(201).json(newCoupon);
}

async function handleDeleteCoupon(req: any, res: any, db: any) {
    const { couponId, adminId } = req.body;
    if (!await isAdmin(db, adminId)) return res.status(403).json({ error: 'Unauthorized' });

    await db.collection('coupons').deleteOne({ id: couponId });
    await db.collection('coupon_usage').deleteMany({ couponId });
    return res.status(200).json({ success: true });
}

async function handleVerifyCoupon(req: any, res: any, db: any) {
    const { code, userId, basePrice } = req.query;
    const baseAmount = Number(basePrice);
    const coupon: Coupon | null = await db.collection('coupons').findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ isValid: false, message: 'Invalid coupon code.' });
    if (coupon.expiresAt && coupon.expiresAt < Date.now()) return res.status(200).json({ isValid: false, message: 'This coupon has expired.' });
    if (coupon.quantityLimit && coupon.uses >= coupon.quantityLimit) return res.status(200).json({ isValid: false, message: 'This coupon has reached its usage limit.' });
    
    if (coupon.onePerUser) {
        const existingUsage = await db.collection('coupon_usage').findOne({ couponId: coupon.id, userId });
        if (existingUsage) return res.status(200).json({ isValid: false, message: 'You have already used this coupon.' });
    }

    let discountAmount = 0;
    if (coupon.discount.type === 'FLAT') discountAmount = coupon.discount.value;
    else if (coupon.discount.type === 'PERCENT') discountAmount = (baseAmount * coupon.discount.value) / 100;
    
    const finalPrice = Math.max(0, baseAmount - discountAmount);
    return res.status(200).json({ isValid: true, message: `Success! You saved ₹${discountAmount.toFixed(2)}.`, finalPrice, discountAmount });
}

// --- Purchase Fulfillment ---
async function handleFulfillPurchase(req: any, res: any, db: any) {
    const { userId, productId, paymentId, couponCode } = req.body;
    const user = await db.collection('users').findOne({ id: userId });
    const product = await db.collection('products').findOne({ id: productId });
    if (!user || !product) return res.status(404).json({ error: 'User or product not found.' });

    // In a real app, you MUST verify the paymentId with the payment gateway's server-to-server API here to prevent fraud.

    // Apply benefit
    let updateData: Partial<User> = { isDonor: true };
    const now = Date.now();
    if (product.benefit.type === 'SUBSCRIPTION_DAYS') {
        const currentExpiry = user.subscription?.expiresAt && user.subscription.expiresAt > now ? user.subscription.expiresAt : now;
        const newExpiry = currentExpiry + (product.benefit.value * 24 * 60 * 60 * 1000);
        updateData.subscription = { planId: 'monthly', expiresAt: newExpiry };
    } else if (product.benefit.type === 'API_DAYS') {
        const currentExpiry = user.apiAccess?.subscription.expiresAt && user.apiAccess.subscription.expiresAt > now ? user.apiAccess.subscription.expiresAt : now;
        const newExpiry = currentExpiry + (product.benefit.value * 24 * 60 * 60 * 1000);
        if (user.apiAccess) {
            updateData.apiAccess = { ...user.apiAccess, subscription: { ...user.apiAccess.subscription, expiresAt: newExpiry } };
        }
    }
    await db.collection('users').updateOne({ id: userId }, { $set: updateData });

    // Handle coupon usage and product stock
    if (couponCode) {
        const coupon = await db.collection('coupons').findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
            await db.collection('coupons').updateOne({ id: coupon.id }, { $inc: { uses: 1 } });
            await db.collection('coupon_usage').insertOne({ id: `usage_${Date.now()}`, couponId: coupon.id, userId, timestamp: now });
        }
    }
    if (product.limitQuantity) {
        await db.collection('products').updateOne({ id: productId }, { $inc: { stock: -1 } });
    }

    return res.status(200).json({ success: true });
}

// --- Main Handler ---
export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const { type, action } = req.query;

        if (req.method === 'GET') {
            if (type === 'product') return handleGetProducts(req, res, db);
            if (type === 'coupon' && action === 'verify') return handleVerifyCoupon(req, res, db);
            if (type === 'coupon') return handleGetCoupons(req, res, db);
        }
        if (req.method === 'POST') {
            if (action === 'fulfill') return handleFulfillPurchase(req, res, db);
            if (type === 'product') return handleAddProduct(req, res, db);
            if (type === 'coupon') return handleAddCoupon(req, res, db);
        }
        if (req.method === 'DELETE') {
            if (type === 'product') return handleDeleteProduct(req, res, db);
            if (type === 'coupon') return handleDeleteCoupon(req, res, db);
        }

        return res.status(400).json({ error: 'Invalid request' });

    } catch (error: any) {
        console.error('Error with /api/shop:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}