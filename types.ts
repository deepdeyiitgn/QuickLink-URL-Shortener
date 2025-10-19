import React from 'react';

// Fix: Removed 'vite/client' reference which was causing a "Cannot find type definition file" error.
// The types for import.meta.env are now defined globally below to ensure they are available
// throughout the application and fix related 'Property 'env' does not exist' errors.
declare global {
  interface Window {
    Razorpay: any;
    Cashfree: any;
  }
    
  interface ImportMetaEnv {
    readonly VITE_RAZORPAY_KEY_ID: string;
    readonly VITE_OWNER_EMAIL: string;
    readonly VITE_OWNER_PASSWORD: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export type UserBadge = 'normal' | 'premium' | 'owner';

export interface Subscription {
  planId: 'monthly' | 'semi-annually' | 'yearly';
  expiresAt: number;
}

export interface ApiSubscription {
  planId: 'free' | 'basic' | 'pro';
  expiresAt: number;
}

export interface UserSettings {
  warningThreshold: number; // in hours
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  profilePictureUrl?: string;
  subscription?: Subscription;
  apiAccess: {
    apiKey: string;
    subscription: ApiSubscription;
  } | null;
  settings?: UserSettings;
  isAdmin?: boolean;
  canSetCustomExpiry?: boolean;
  canModerate?: boolean;
  ipAddress?: string;
}

export interface ShortenedUrl {
  id: string;
  longUrl: string;
  alias: string;
  shortUrl: string;
  createdAt: number;
  expiresAt: number | null; // timestamp, or null for permanent
  userId: string | null;
}

export interface PaymentRecord {
  id: string;
  paymentId: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: 'INR';
  linkIds?: string[]; // For URL extension payments
  durationLabel: string; // e.g., '1 Month', 'Yearly Subscription'
  createdAt: number;
}

export interface QrCodeRecord {
    id: string;
    userId: string | null;
    type: string;
    payload: string;
    customizations: {
        color: string;
        bgColor: string;
        logo: string | null;
    };
    createdAt: number;
}

export interface ScanRecord {
    id: string;
    userId: string | null;
    content: string;
    scannedAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userBadge: UserBadge;
  text: string;
  createdAt: number;
}

export interface BlogPost {
  _id?: any; // MongoDB ID
  id: string;
  userId: string;
  userName: string;
  userBadge: UserBadge;
  userProfilePictureUrl?: string;
  title: string;
  content: string; // HTML content
  postType: 'normal' | 'html';
  imageUrls: string[];
  audioUrl: string | null;
  isPinned?: boolean;
  status: 'approved' | 'pending';
  createdAt: number;
  likes: string[]; // Array of user IDs
  comments: Comment[];
  shares: number;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  isSubscriptionModalOpen: boolean;
  isApiSubscriptionModalOpen: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  openApiSubscriptionModal: () => void;
  closeApiSubscriptionModal: () => void;
  updateUserSubscription: (planId: 'monthly' | 'semi-annually' | 'yearly', expiresAt: number) => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateUserProfile: (profileData: { name?: string; profilePictureUrl?: string }) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  generateApiKey: () => Promise<void>;
  purchaseApiKey: (planId: 'basic' | 'pro', expiresAt: number) => Promise<void>;
  updateUserPermissions: (userId: string, permissions: { isAdmin?: boolean; canSetCustomExpiry?: boolean; canModerate?: boolean; }) => Promise<void>;
}

export interface UrlContextType {
  allUrls: ShortenedUrl[];
  activeUrls: ShortenedUrl[];
  expiredUrls: ShortenedUrl[];
  paymentHistory: PaymentRecord[];
  addUrl: (url: ShortenedUrl) => Promise<void>;
  deleteUrl: (urlId: string) => Promise<void>;
  deleteUrlsByUserId: (userId: string) => Promise<void>;
  extendUrls: (urlIds: string[], newExpiresAt: number) => Promise<void>;
  addPaymentRecord: (record: PaymentRecord) => Promise<void>;
  clearAllDynamicUrls: () => Promise<void>;
  loading: boolean;
}

export interface QrContextType {
    qrHistory: QrCodeRecord[];
    scanHistory: ScanRecord[];
    addQrCode: (qr: Omit<QrCodeRecord, 'id' | 'createdAt'>) => Promise<void>;
    addScan: (scan: Omit<ScanRecord, 'id' | 'scannedAt'>) => Promise<void>;
}

export interface BlogContextType {
  posts: BlogPost[];
  loading: boolean;
  addPost: (postData: Omit<BlogPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isPinned' | 'status' | 'userProfilePictureUrl'>) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  incrementShares: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  togglePinPost: (postId: string) => Promise<void>;
  approvePost: (postId: string) => Promise<void>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
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
    payment_session_id: string;
}

export interface DbStatus {
    status: 'ok' | 'error';
    message: string;
    dbName: string;
}