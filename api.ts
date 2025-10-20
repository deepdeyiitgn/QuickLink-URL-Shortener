// api.ts
// A simple API client to interact with the Vercel Serverless Functions.

import type { ShortenedUrl, PaymentRecord, QrCodeRecord, ScanRecord, DbStatus, Donation, Ticket, Notification, User } from './types';

const fetcher = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || res.statusText);
    }
    return res.json();
};

export const api = {
    // URLS
    getUrls: (): Promise<ShortenedUrl[]> => fetcher('/api/urls'),
    addSingleUrl: (url: ShortenedUrl): Promise<{ success: boolean }> => fetcher('/api/urls', { method: 'POST', body: JSON.stringify(url) }),
    extendMultipleUrls: (urlIds: string[], newExpiresAt: number): Promise<{ success: boolean }> => fetcher('/api/urls', { method: 'PUT', body: JSON.stringify({ urlIds, newExpiresAt }) }),
    deleteSingleUrl: (id: string): Promise<{ success: boolean }> => fetcher(`/api/urls?id=${id}`, { method: 'DELETE' }),
    deleteUrlsForUser: (userId: string): Promise<{ success: boolean }> => fetcher(`/api/urls?userId=${userId}`, { method: 'DELETE' }),

    // PAYMENTS
    getPaymentHistory: (): Promise<PaymentRecord[]> => fetcher('/api/payments'),
    addPaymentRecord: (record: PaymentRecord): Promise<PaymentRecord> => fetcher('/api/payments', { method: 'POST', body: JSON.stringify(record) }),
    
    // QR & SCAN HISTORY (Consolidated)
    getQrHistory: (): Promise<QrCodeRecord[]> => fetcher('/api/history?type=qr'),
    addQrRecord: (record: QrCodeRecord): Promise<QrCodeRecord> => fetcher('/api/history?type=qr', { method: 'POST', body: JSON.stringify(record) }),
    getScanHistory: (): Promise<ScanRecord[]> => fetcher('/api/history?type=scan'),
    addScanRecord: (record: ScanRecord): Promise<ScanRecord> => fetcher('/api/history?type=scan', { method: 'POST', body: JSON.stringify(record) }),

    // DB STATUS
    getDbStatus: (): Promise<DbStatus> => fetcher('/api/status'),

    // DONATIONS
    getDonations: (): Promise<Donation[]> => fetcher('/api/donations'),
    addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>): Promise<{ success: boolean }> => fetcher('/api/donations', { method: 'POST', body: JSON.stringify(donation) }),

    // SUPPORT (Consolidated)
    createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>): Promise<Ticket> => fetcher('/api/support?type=ticket', { method: 'POST', body: JSON.stringify(ticket) }),
    getNotifications: (userId: string): Promise<Notification[]> => fetcher(`/api/support?type=notification&userId=${userId}`),
    markNotificationAsRead: (notificationId: string): Promise<{ success: boolean }> => fetcher('/api/support?type=notification', { method: 'PUT', body: JSON.stringify({ notificationId }) }),
    
    // USERS & AUTH (Consolidated)
    getAllUsers: (): Promise<User[]> => fetcher('/api/users'),
    updateUser: (userId: string, data: Partial<User>): Promise<User> => fetcher(`/api/users?userId=${userId}`, { method: 'PUT', body: JSON.stringify(data) }),
    login: (email: string, password: string): Promise<User> => fetcher('/api/auth?action=login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    signup: (name: string, email: string, password: string): Promise<User> => fetcher('/api/auth?action=signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
};
