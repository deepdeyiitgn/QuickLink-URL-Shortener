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

import type { User, ShortenedUrl, PaymentRecord, QrCodeRecord, ScanRecord, DbStatus } from './types';

// Generic fetch function for GET requests
const fetchData = async <T>(endpoint: string, defaultValue: T): Promise<T> => {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            console.error(`Failed to fetch ${endpoint}:`, response.statusText);
            return defaultValue;
        }
        const text = await response.text();
        // Use standard JSON.parse without a custom reviver
        return text ? JSON.parse(text) : defaultValue;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        return defaultValue;
    }
};

// --- API Functions ---

// Users
const getUsers = (): Promise<User[]> => fetchData('/api/users', []);

const addUser = async (user: User): Promise<User> => {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user.');
    }
    return response.json();
};

const updateUser = async (user: User): Promise<void> => {
    const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user.');
    }
};

// URLs
const getUrls = (): Promise<ShortenedUrl[]> => fetchData('/api/urls', []);

const addSingleUrl = async (url: ShortenedUrl): Promise<void> => {
    const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(url),
    });
    if (!response.ok) {
        let errorMessage = 'Failed to add URL.';
        try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
        } catch (e) {
            errorMessage = 'A server error occurred. The response was not in a valid JSON format.';
        }
        throw new Error(errorMessage);
    }
};

const extendMultipleUrls = async (urlIds: string[], newExpiresAt: number): Promise<void> => {
    const response = await fetch('/api/urls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlIds, newExpiresAt }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extend URLs.');
    }
};

const deleteSingleUrl = async (urlId: string): Promise<void> => {
    const response = await fetch(`/api/urls?id=${urlId}`, { method: 'DELETE' });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete URL.');
    }
};

const deleteUrlsForUser = async (userId: string): Promise<void> => {
    const response = await fetch(`/api/urls?userId=${userId}`, { method: 'DELETE' });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user URLs.');
    }
};


// Payment History
const getPaymentHistory = (): Promise<PaymentRecord[]> => fetchData('/api/payments', []);
const addPaymentRecord = async (record: PaymentRecord): Promise<void> => {
    const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Failed to save payment record.');
};

// QR History
const getQrHistory = (): Promise<QrCodeRecord[]> => fetchData('/api/qrhistory', []);
const addQrRecord = async (record: QrCodeRecord): Promise<void> => {
    const response = await fetch('/api/qrhistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Failed to save QR code record.');
};

// Scan History
const getScanHistory = (): Promise<ScanRecord[]> => fetchData('/api/scanhistory', []);
const addScanRecord = async (record: ScanRecord): Promise<void> => {
    const response = await fetch('/api/scanhistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Failed to save scan record.');
};


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

    if (!response.ok) {
        let errorText;
        try {
            const errorData = await response.json();
            errorText = errorData.error || `API request failed: ${response.statusText}`;
        } catch (e) {
            errorText = 'An unexpected server error occurred while calling the API.';
        }
        throw new Error(errorText);
    }

    try {
        const data = await response.json();
        return data;
    } catch(e) {
        throw new Error('API returned an invalid response.');
    }
};

// System Status
const getDbStatus = async (): Promise<DbStatus> => {
    try {
        const response = await fetch('/api/status');
        // No need to check response.ok, as error states are handled in the JSON body.
        return await response.json();
    } catch (error) {
        return {
            status: 'error',
            message: 'Failed to fetch status from the server API endpoint.',
            dbName: 'Unknown'
        };
    }
};


export const api = {
    getUsers,
    addUser,
    updateUser,
    getUrls,
    addSingleUrl,
    extendMultipleUrls,
    deleteSingleUrl,
    deleteUrlsForUser,
    getPaymentHistory,
    addPaymentRecord,
    getQrHistory,
    addQrRecord,
    getScanHistory,
    addScanRecord,
    shortenUrlWithApiKey,
    getDbStatus,
};
