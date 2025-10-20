// Vercel Serverless Function: /api/store
// Handles donations and shop products

import { connectToDatabase } from './lib/mongodb.js';
import type { Donation, Product } from '../types';

async function handleDonationRequests(req: any, res: any, db: any) {
    const donationsCollection = db.collection('donations');

    if (req.method === 'GET') {
        const donations = await donationsCollection.find({}).sort({ amount: -1 }).toArray();
        return res.status(200).json(donations);
    }
    
    if (req.method === 'POST') {
        const donationData: Omit<Donation, 'id' | 'createdAt'> = req.body;
        if (!donationData || !donationData.amount || !donationData.userId || !donationData.userName) {
            return res.status(400).json({ error: 'Missing required fields for donation.' });
        }
        const newDonation: Donation = { ...donationData, id: `donation_${Date.now()}`, createdAt: Date.now() };
        await donationsCollection.insertOne(newDonation);
        return res.status(201).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
}

async function handleProductRequests(req: any, res: any, db: any) {
    const productsCollection = db.collection('products');

    if (req.method === 'GET') {
        const products = await productsCollection.find({}).toArray();
        return res.status(200).json(products);
    }

    if (req.method === 'POST') {
        const productData: Omit<Product, 'id'> = req.body;
        const newProduct: Product = { ...productData, id: `prod_${Date.now()}`};
        await productsCollection.insertOne(newProduct);
        return res.status(201).json(newProduct);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method Not Allowed');
}

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    const { type } = req.query; // 'donations' or 'products'

    try {
        const { db } = await connectToDatabase();

        if (type === 'donations') {
            return handleDonationRequests(req, res, db);
        } else if (type === 'products') {
            return handleProductRequests(req, res, db);
        } else {
            return res.status(400).json({ error: 'A valid store type (`donations` or `products`) must be specified.' });
        }
    } catch (error: any) {
        console.error(`Error with /api/store (type: ${type}):`, error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}