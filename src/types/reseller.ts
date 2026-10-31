export type ResellerStatus = 'active' | 'suspended' | 'pending';
export type PayoutMethod = 'upi' | 'bank';
export type ListingStatus = 'active' | 'paused' | 'suspended' | 'archived' | 'rejected';
export type ListingThemePreset = 'dark' | 'midnight' | 'neon' | 'sunset' | 'emerald' | 'minimal';

export interface PayoutDetails {
  upiId?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  label?: string;
}

export interface ResellerPayoutMethod {
  id: string;
  userId: string;
  resellerUid: string;
  type: 'upi' | 'bank';
  upiId?: string;
  accountHolderName: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  label?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResellerProfile {
  userId: string;
  resellerUid: string; // Permanent unique public ID, e.g. RSL-8K4M2P9X
  displayName: string;
  email: string;
  phone?: string;
  passwordHash?: string; // SHA-256 password hash for secure authentication
  status: ResellerStatus;
  payoutMethod?: PayoutMethod;
  payoutDetails?: PayoutDetails;
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResellerListing {
  id: string;
  slug: string;
  resellerId: string;
  resellerUid?: string;
  resellerName: string;
  originalProductId: string;
  originalProductSlug: string;
  basePrice: number;
  resalePrice: number;
  grossMargin: number;
  customTitle: string;
  customHeadline?: string;
  customSubtitle?: string;
  customShortDescription?: string;
  customDescription?: string;
  benefits?: string[];
  features?: string[];
  coverImage?: string;
  galleryImages?: string[];
  ctaText?: string;
  themePreset?: ListingThemePreset;
  promoBadge?: string;
  whatsappButtonEnabled?: boolean; // Toggle floating WhatsApp chat button on landing page (default: true)
  whatsappNumber?: string; // Optional custom WhatsApp number (defaults to +91 8807281600)
  status: ListingStatus;
  viewsCount: number;
  uniqueVisitorsCount?: number;
  ctaClicksCount?: number;
  checkoutsInitiatedCount?: number;
  salesCount: number;
  refundsCount?: number;
  totalRevenue: number;
  totalEarned: number;
  createdAt: string;
  updatedAt: string;
}

export type WalletTransactionType =
  | 'sale_available'
  | 'sale_pending'
  | 'withdrawal_requested'
  | 'withdrawal_paid'
  | 'withdrawal_rejected'
  | 'refund_reversal'
  | 'chargeback_reversal'
  | 'admin_adjustment';

export type WalletTransactionStatus = 'completed' | 'pending' | 'reversed' | 'failed';

export interface WalletTransaction {
  id: string;
  resellerId: string;
  resellerUid?: string;
  orderId?: string;
  listingId?: string;
  type: WalletTransactionType;
  amount: number;
  currency: 'INR';
  status: WalletTransactionStatus;
  description: string;
  createdAt: string;
}

export interface WalletAccount {
  resellerId: string;
  resellerUid?: string;
  currency?: 'INR' | string;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  updatedAt: string;
}

export type WithdrawalStatus = 'pending' | 'pending_review' | 'processing' | 'approved' | 'paid' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  resellerId: string;
  resellerUid: string;
  resellerName: string;
  resellerEmail: string;
  amount: number;
  payoutMethod: PayoutMethod;
  payoutDetails: PayoutDetails;
  status: WithdrawalStatus;
  adminNotes?: string;
  rejectionReason?: string;
  payoutReference?: string;
  processedBy?: string;
  walletBalanceAfterReservation?: number;
  pendingEarningsSnapshot?: number;
  totalLifetimeEarningsSnapshot?: number;
  totalWithdrawalsSnapshot?: number;
  verifiedSalesCountSnapshot?: number;
  unitsSoldSnapshot?: number;
  productSummarySnapshot?: Record<string, number>;
  createdAt: string;
  processedAt?: string;
  paidAt?: string;
}

export interface AttributedOrder {
  orderId: string;
  orderNumber: string;
  resellerId: string;
  resellerUid?: string;
  listingId: string;
  listingSlug: string;
  originalProductId: string;
  productTitle: string;
  basePrice: number;
  resalePrice: number;
  earningAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderStatus: 'pending' | 'processing' | 'completed' | 'refunded' | 'failed';
  earningStatus: 'pending' | 'available' | 'reversed';
  createdAt: string;
  paidAt?: string;
}

export interface ResellerProductAnalytics {
  productId: string;
  productTitle: string;
  verifiedOrders: number;
  unitsSold: number;
  grossSales: number;
  netSales: number;
  resellerEarnings: number;
  earningStatus?: 'available' | 'pending' | 'reversed';
}

export interface ResellerFullAnalytics {
  profile: ResellerProfile;
  wallet: WalletAccount;
  listingsCount: number;
  totalOrders: number;
  unitsSold: number;
  grossSales: number;
  netSales: number;
  resellerEarnings: number;
  products: ResellerProductAnalytics[];
  recentOrders: AttributedOrder[];
  withdrawals: WithdrawalRequest[];
  ledger: WalletTransaction[];
}

export interface NotificationOutbox {
  id: string;
  eventType: 'new_reseller' | 'withdrawal_request' | 'withdrawal_status_update';
  resellerUid: string;
  withdrawalId?: string;
  payload: Record<string, any>;
  status: 'pending' | 'sent' | 'failed';
  attemptCount: number;
  lastError?: string;
  createdAt: string;
  sentAt?: string;
}
