/**
 * =============================================================================
 * API ABSTRACTION LAYER (api.ts)
 * =============================================================================
 * This file acts as the single source of truth for all frontend data fetching.
 * It communicates with the Vercel Serverless Functions defined in the `/api` directory,
 * which in turn interact with the MongoDB Atlas database.
 *
 * This architecture cleanly separates the frontend UI from the backend logic,
 * making the application scalable, secure, and easier to maintain.
 * =============================================================================
 */

import type { User, ShortenedUrl, PaymentRecord, QrCodeRecord, ScanRecord } from './types';

// Custom JSON replacer/reviver to handle Infinity, which JSON.stringify turns to null.
const jsonReplacer = (key: string, value: any) => {
    if (value === Infinity) {
        return "__Infinity__"; // Represent Infinity as a special string
    }
    return value;
};

const jsonReviver = (key: string, value: any) => {
    if (value === "__Infinity__") {
        return Infinity; // Convert the special string back to Infinity
    }
    return value;
};

// Generic fetch and save functions for specific endpoints
const fetchData = async <T>(endpoint: string, defaultValue: T): Promise<T> => {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            console.error(`Failed to fetch ${endpoint}:`, response.statusText);
            return defaultValue;
        }
        const text = await response.text();
        return text ? JSON.parse(text, jsonReviver) : defaultValue;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        return defaultValue;
    }
};

const saveData = async <T>(endpoint: string, data: T): Promise<void> => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data, jsonReplacer),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to save to ${endpoint}`);
        }
    } catch (error) {
        console.error(`Error writing to ${endpoint}:`, error);
    }
};


// --- API Functions ---

// Users
const getUsers = (): Promise<User[]> => fetchData('/api/users', []);
const saveUsers = (users: User[]): Promise<void> => saveData('/api/users', users);

// URLs
const getUrls = (): Promise<ShortenedUrl[]> => fetchData('/api/urls', []);
const saveUrls = (urls: ShortenedUrl[]): Promise<void> => saveData('/api/urls', urls);

// Payment History
const getPaymentHistory = (): Promise<PaymentRecord[]> => fetchData('/api/payments', []);
const savePaymentHistory = (records: PaymentRecord[]): Promise<void> => saveData('/api/payments', records);

// QR History
const getQrHistory = (): Promise<QrCodeRecord[]> => fetchData('/api/qrhistory', []);
const saveQrHistory = (records: QrCodeRecord[]): Promise<void> => saveData('/api/qrhistory', records);

// Scan History
const getScanHistory = (): Promise<ScanRecord[]> => fetchData('/api/scanhistory', []);
const saveScanHistory = (records: ScanRecord[]): Promise<void> => saveData('/api/scanhistory', records);

// API Key URL Shortening
const shortenUrlWithApiKey = async (apiKey: string, longUrl: string, alias?: string): Promise<ShortenedUrl> => {
    const response = await fetch('/api/v1/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ longUrl, alias }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL via API.');
    }
    
    // The server response for a URL object may contain '__Infinity__', so we need to revive it.
    return JSON.parse(JSON.stringify(data), jsonReviver);
};

// Atomically add a single URL
const addSingleUrl = async (url: ShortenedUrl): Promise<void> => {
    const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(url, jsonReplacer),
    });
    if (!response.ok) {
        let errorMessage = 'Failed to add URL.';
        try {
            // Try to parse the response as JSON to get a specific error message.
            const data = await response.json();
            errorMessage = data.error || errorMessage;
        } catch (e) {
            // This catch block executes if the server returns a non-JSON response,
            // like an HTML error page from a server crash.
            errorMessage = 'A server error occurred. The response was not in a valid JSON format.';
        }
        throw new Error(errorMessage);
    }
};


export const api = {
    getUsers,
    saveUsers,
    getUrls,
    saveUrls,
    addSingleUrl,
    getPaymentHistory,
    savePaymentHistory,
    getQrHistory,
    saveQrHistory,
    getScanHistory,
    saveScanHistory,
    shortenUrlWithApiKey,
};