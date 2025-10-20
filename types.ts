// types.ts

// Global declarations for external scripts
declare global {
  interface Window {
    Razorpay: any;
    Cashfree: any;
  }
}

// User and Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // This should not be sent to client
  profilePictureUrl?: string;
  createdAt: number;
  lastActive: number;
  // Roles
  isAdmin: boolean;
  canModerate: boolean;
  canSetCustomExpiry: boolean;
  isDonor: boolean;
  status: 'active' | 'banned';
  // Subscriptions
  subscription: Subscription | null;
  apiAccess: ApiAccess | null;
}

export interface Subscription {
  planId: 'monthly' | 'semi-annually' | 'yearly';
  expiresAt: number;
}

export interface ApiAccess {
  apiKey: string;
  subscription: ApiSubscription;
}

export interface ApiSubscription {
  planId: 'trial' | 'basic' | 'pro';
  expiresAt: number;
}

export type AuthModalMode = 'login' | 'signup';

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  isSubscriptionModalOpen: boolean;
  isApiSubscriptionModalOpen: boolean;
  openAuthModal: (mode: AuthModalMode) => void;
  closeAuthModal: () => void;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  openApiSubscriptionModal: () => void;
  closeApiSubscriptionModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserData: (userId: string, data: Partial<User>) => Promise<User>;
  updateUserProfile: (data: { name: string, profilePictureUrl?: string }) => Promise<User>;
  generateApiKey: () => Promise<void>;
  purchaseApiKey: (planId: 'basic' | 'pro', expiresAt: number) => Promise<void>;
  updateUserSubscription: (planId: 'monthly' | 'semi-annually' | 'yearly', expiresAt: number) => Promise<void>;
  updateUserAsDonor: (userId: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
}

// URL Shortener
export interface ShortenedUrl {
  id: string;
  longUrl: string;
  alias: string;
  shortUrl: string;
  createdAt: number;
  expiresAt: number | null;
  userId: string | null;
}

export interface UrlContextType {
    allUrls: ShortenedUrl[];
    activeUrls: ShortenedUrl[];
    expiredUrls: ShortenedUrl[];
    paymentHistory: PaymentRecord[];
    loading: boolean;
    addUrl: (newUrl: ShortenedUrl) => Promise<void>;
    deleteUrl: (urlId: string) => Promise<void>;
    deleteUrlsByUserId: (userId: string) => Promise<void>;
    extendUrls: (urlIds: string[], newExpiresAt: number) => Promise<void>;
    addPaymentRecord: (record: PaymentRecord) => Promise<void>;
    clearAllDynamicUrls: () => Promise<void>;
}


// QR Codes
export type QrCodeType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'geo' | 'event' | 'bitcoin' | 'upi';

export interface QrCodeRecord {
    id: string;
    userId: string | null;
    type: QrCodeType;
    data: any;
    createdAt: number;
}

export interface ScanRecord {
    id: string;
    userId: string | null;
    content: string;
    scannedAt: number;
}

export interface QrContextType {
    qrHistory: QrCodeRecord[];
    scanHistory: ScanRecord[];
    addQrCode: (qr: Omit<QrCodeRecord, 'id' | 'createdAt'>) => Promise<void>;
    addScan: (scan: Omit<ScanRecord, 'id' | 'scannedAt'>) => Promise<void>;
}

// Payments & Donations
export interface PaymentRecord {
    id: string;
    paymentId: string;
    userId: string;
    userEmail: string;
    amount: number;
    currency: string;
    durationLabel: string; // Describes what was purchased
    couponCode?: string;
    createdAt: number;
}

export interface Donation {
    id: string;
    userId: string | null;
    userName: string;
    amount: number;
    createdAt?: number;
}

// Payment Gateway specific types
export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: any[];
  created_at: number;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CashfreeOrder {
    cf_order_id: number;
    order_id: string;
    entity: string;
    order_currency: string;
    order_amount: number;
    order_status: string;
    payment_session_id: string;
    order_expiry_time: string;
}

// Blog
export type UserBadge = 'normal' | 'premium' | 'owner' | 'moderator' | 'blacklist';

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userBadge: UserBadge;
    text: string;
    createdAt: number;
}

export interface BlogPost {
    id: string;
    userId: string;
    userName: string;
    userBadge: UserBadge;
    userProfilePictureUrl?: string;
    title: string;
    content: string;
    postType: 'normal' | 'html';
    imageUrls?: string[];
    audioUrl?: string | null;
    keywords?: string[];
    createdAt: number;
    likes: string[];
    comments: Comment[];
    shares: number;
    isPinned: boolean;
    status: 'pending' | 'approved' | 'rejected';
    views: number;
}

export interface BlogContextType {
    posts: BlogPost[];
    loading: boolean;
    addPost: (postData: Omit<BlogPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isPinned' | 'status' | 'userProfilePictureUrl' | 'views'>) => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
    addComment: (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
    incrementShares: (postId: string) => Promise<void>;
    incrementView: (postId: string) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
    togglePinPost: (postId: string) => Promise<void>;
    approvePost: (postId: string) => Promise<void>;
}

// System Status & Support
export interface DbStatus {
    status: 'ok' | 'error';
    message: string;
    dbName: string;
}

export interface TicketReply {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: number;
}

export interface Ticket {
    id: string;
    userId: string | null;
    userName: string;
    userEmail: string;
    subject: string;
    message: string;
    createdAt: number;
    status: 'open' | 'closed' | 'in-progress';
    replies: TicketReply[];
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    createdAt: number;
    isRead: boolean;
}

// Shop & Coupons
export interface ProductBenefit {
    type: 'SUBSCRIPTION_DAYS' | 'API_DAYS';
    value: number; // e.g., 30 for 30 days
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    benefit: ProductBenefit;
    limitQuantity?: number; // Total available stock
    stock?: number; // Current stock
    availableUntil?: number; // Expiration date for the product listing
    createdAt: number;
    isActive: boolean;
}

export interface CouponDiscount {
    type: 'PERCENT' | 'FLAT';
    value: number;
}

export interface Coupon {
    id: string;
    code: string;
    discount: CouponDiscount;
    expiresAt?: number;
    quantityLimit?: number; // Max number of times the coupon can be used in total
    uses: number; // How many times it has been used
    onePerUser: boolean;
    createdAt: number;
}

// To track which user used which coupon
export interface CouponUsage {
    id: string;
    couponId: string;
    userId: string;
    timestamp: number;
}
