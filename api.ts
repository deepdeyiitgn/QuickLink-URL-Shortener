
import type { User, ShortenedUrl, PaymentRecord, QrCodeRecord, ScanRecord, DbStatus, Ticket, Notification, Product, Coupon, BlogPost } from './types';

async function apiFetch(url: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
}

export const api = {
    // Auth
    login: (email: string, password: string): Promise<User> => apiFetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'login', email, password }) }),
    signup: (name: string, email: string, password: string): Promise<User> => apiFetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'signup', name, email, password }) }),
    
    // Users
    getUsers: (): Promise<User[]> => apiFetch('/api/users'),
    getUserById: (id: string): Promise<User> => apiFetch(`/api/users?id=${id}`),
    updateUser: (id: string, updates: Partial<User> & { newApiKey?: boolean }): Promise<User> => apiFetch(`/api/users?id=${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
    updateUserDetails: (id: string, details: { browser: string; deviceType: string }): Promise<User> => apiFetch(`/api/users?id=${id}`, { method: 'PUT', body: JSON.stringify({ action: 'update_details', ...details }) }),
    
    // URLs
    getUrls: (): Promise<ShortenedUrl[]> => apiFetch('/api/urls'),
    addSingleUrl: (url: ShortenedUrl): Promise<{ success: boolean }> => apiFetch('/api/urls', { method: 'POST', body: JSON.stringify(url) }),
    extendMultipleUrls: (urlIds: string[], newExpiresAt: number): Promise<{ success: boolean }> => apiFetch('/api/urls', { method: 'PUT', body: JSON.stringify({ urlIds, newExpiresAt }) }),
    deleteSingleUrl: (id: string): Promise<{ success: boolean }> => apiFetch(`/api/urls?id=${id}`, { method: 'DELETE' }),
    deleteUrlsForUser: (userId: string): Promise<{ success: boolean }> => apiFetch(`/api/urls?userId=${userId}`, { method: 'DELETE' }),

    // History (QR & Scan)
    getQrHistory: (): Promise<QrCodeRecord[]> => apiFetch('/api/history?type=qr'),
    addQrRecord: (record: QrCodeRecord): Promise<QrCodeRecord> => apiFetch('/api/history?type=qr', { method: 'POST', body: JSON.stringify(record) }),
    getScanHistory: (): Promise<ScanRecord[]> => apiFetch('/api/history?type=scan'),
    addScanRecord: (record: ScanRecord): Promise<ScanRecord> => apiFetch('/api/history?type=scan', { method: 'POST', body: JSON.stringify(record) }),
    
    // Payments & Donations
    getPaymentHistory: (): Promise<PaymentRecord[]> => apiFetch('/api/payments'),
    addPaymentRecord: (record: PaymentRecord): Promise<PaymentRecord> => apiFetch('/api/payments', { method: 'POST', body: JSON.stringify(record) }),
    getDonations: (): Promise<any[]> => apiFetch('/api/payments?type=donation'),
    addDonation: (donation: Omit<any, 'id' | 'createdAt'>): Promise<{ success: boolean }> => apiFetch('/api/payments?type=donation', { method: 'POST', body: JSON.stringify(donation) }),

    // Status
    getDbStatus: (): Promise<DbStatus> => apiFetch('/api/status'),
    
    // Tickets
    getUserTickets: (userId: string): Promise<Ticket[]> => apiFetch(`/api/support?type=ticket&userId=${userId}`),
    getAllTickets: (): Promise<Ticket[]> => apiFetch(`/api/support?type=ticket&forAdmin=true&userId=temp`), // userId is placeholder, backend checks admin status
    createTicket: (data: any): Promise<Ticket> => apiFetch('/api/support?type=ticket', { method: 'POST', body: JSON.stringify(data) }),
    updateTicket: (ticketId: string, update: any): Promise<Ticket> => apiFetch('/api/support?type=ticket', { method: 'PUT', body: JSON.stringify({ ticketId, ...update }) }),

    // Notifications
    getNotifications: (userId: string): Promise<Notification[]> => apiFetch(`/api/support?type=notification&userId=${userId}`),
    sendNotification: (data: any): Promise<Notification> => apiFetch('/api/support?type=notification', { method: 'POST', body: JSON.stringify(data) }),
    markNotificationsRead: (userId: string): Promise<{ success: boolean }> => apiFetch('/api/support?type=notification', { method: 'PUT', body: JSON.stringify({ userId, action: 'mark_read' }) }),

    // Blog
    getBlogPosts: (userId?: string): Promise<BlogPost[]> => apiFetch(userId ? `/api/blog?userId=${userId}` : '/api/blog'),

    // Shop & Coupons
    getProducts: (): Promise<Product[]> => apiFetch('/api/shop?type=product'),
    addProduct: (product: Omit<Product, 'id' | 'createdAt'>, adminId: string): Promise<Product> => apiFetch('/api/shop?type=product', { method: 'POST', body: JSON.stringify({ product, adminId }) }),
    deleteProduct: (productId: string, adminId: string): Promise<{ success: true }> => apiFetch('/api/shop?type=product', { method: 'DELETE', body: JSON.stringify({ productId, adminId }) }),
    getCoupons: (adminId: string): Promise<Coupon[]> => apiFetch(`/api/shop?type=coupon&adminId=${adminId}`),
    addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'uses'>, adminId: string): Promise<Coupon> => apiFetch('/api/shop?type=coupon', { method: 'POST', body: JSON.stringify({ coupon, adminId }) }),
    deleteCoupon: (couponId: string, adminId: string): Promise<{ success: true }> => apiFetch('/api/shop?type=coupon', { method: 'DELETE', body: JSON.stringify({ couponId, adminId }) }),
    fulfillPurchase: (data: { userId: string, productId: string, paymentId: string, couponCode?: string }): Promise<{ success: true }> => apiFetch('/api/shop?action=fulfill', { method: 'POST', body: JSON.stringify(data) }),
};