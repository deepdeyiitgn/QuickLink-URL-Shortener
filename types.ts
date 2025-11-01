// Extend the Window interface to include Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
    grecaptcha: any;
    google: any; // For Google Identity Services
  }
}

export interface ShortenedUrl {
  id: string;
  longUrl: string;
  alias: string;
  shortUrl: string;
  createdAt: number;
  expiresAt: number | null;
  userId: string | null;
}

export type UserBadge = 'normal' | 'premium' | 'moderator' | 'owner' | 'blacklist';
export type UserStatus = 'pending' | 'active' | 'banned';

export interface Subscription {
  planId: 'monthly' | 'semi-annually' | 'yearly';
  expiresAt: number;
}

export interface ApiAccess {
  apiKey: string;
  subscription: {
    planId: 'trial' | 'basic' | 'pro';
    expiresAt: number;
  }
}

export interface User {
  _id?: any; // To accommodate MongoDB documents
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profilePictureUrl?: string;
  createdAt: number;
  lastActive: number;
  isAdmin: boolean;
  canModerate: boolean;
  canSetCustomExpiry: boolean;
  isDonor: boolean;
  status: UserStatus;
  subscription: Subscription | null;
  apiAccess: ApiAccess | null;
  // New fields for security/analytics
  ipAddress?: string;
  browser?: string;
  deviceType?: string;
  // Fields for password reset & email verification
  passwordResetToken?: string;
  passwordResetExpires?: number;
  verificationToken?: string;
  verificationExpires?: number;
}

export type AuthModalMode = 'login' | 'signup';

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  isSubscriptionModalOpen: boolean;
  isApiSubscriptionModalOpen: boolean;
  loading: boolean;
  isFetchingDetails: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<string>;
  logout: () => void;
  openAuthModal: (mode: AuthModalMode) => void;
  closeAuthModal: () => void;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  openApiSubscriptionModal: () => void;
  closeApiSubscriptionModal: () => void;
  updateUserSubscription: (planId: 'monthly' | 'semi-annually' | 'yearly', expiresAt: number) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  generateApiKey: () => Promise<void>;
  purchaseApiKey: (planId: 'basic' | 'pro', expiresAt: number) => Promise<void>;
  updateUserAsDonor: (userId: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  updateUserData: (userId: string, updates: Partial<User>) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  sendPasswordResetLink: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export interface UrlContextType {
  allUrls: ShortenedUrl[];
  activeUrls: ShortenedUrl[];
  expiredUrls: ShortenedUrl[];
  paymentHistory: PaymentRecord[];
  loading: boolean;
  // FIX: Corrected the signature for `addUrl` to accept creation data and return the new URL object.
  // This resolves type errors in both the context provider and the components that use it.
  addUrl: (newUrl: { longUrl: string; alias?: string; userId: string | null }) => Promise<ShortenedUrl>;
  deleteUrl: (urlId: string) => Promise<void>;
  deleteUrlsByUserId: (userId: string) => Promise<void>;
  extendUrls: (urlIds: string[], newExpiresAt: number) => Promise<void>;
  addPaymentRecord: (record: PaymentRecord) => Promise<void>;
  clearAllDynamicUrls: () => Promise<void>;
}

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

export interface PaymentRecord {
  id: string;
  paymentId: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: 'INR';
  durationLabel: string;
  couponCode?: string;
  createdAt: number;
}

export interface Donation {
  id: string;
  name: string;
  amount: number;
  currency: 'INR';
  message?: string;
  isAnonymous: boolean;
  createdAt: number;
  userId: string | null;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: 'INR';
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
  // Define required fields based on Cashfree API response
  payment_session_id: string;
  order_id: string;
}


export interface TicketReply {
    id: string;
    userId: string;
    userName: string;
    userIsAdmin: boolean;
    message: string;
    createdAt: number;
}

export interface Ticket {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    status: 'open' | 'in-progress' | 'closed';
    createdAt: number;
    replies: TicketReply[];
}

export interface NotificationMessage {
    id: string;
    userId: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: number;
    imageUrl?: string;
}

export interface DbStatus {
    status: 'ok' | 'error';
    message: string;
    dbName: string;
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
    likes: string[]; // array of user IDs
    comments: Comment[];
    shares: number;
    views: number;
    isPinned: boolean;
    status: 'pending' | 'approved';
    createdAt: number;
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

export interface ProductBenefit {
    type: 'SUBSCRIPTION_DAYS' | 'API_DAYS';
    value: number; // e.g., 30 for 30 days
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    benefit: ProductBenefit;
    isActive: boolean;
    limitQuantity?: boolean;
    stock?: number;
    availableUntil?: number;
    createdAt: number;
}

export interface Coupon {
    id: string;
    code: string; // e.g., "SAVE10"
    discount: {
        type: 'PERCENT' | 'FLAT';
        value: number;
    };
    expiresAt?: number;
    quantityLimit?: number;
    uses: number;
    onePerUser: boolean;
    createdAt: number;
}

export interface CouponUsage {
    id: string;
    couponId: string;
    userId: string;
    timestamp: number;
}

