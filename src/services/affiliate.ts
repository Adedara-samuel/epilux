import { api } from './base';

// Types
export interface AffiliateProfile extends Record<string, unknown> {
  id: string;
  userId: string;
  referralCode: string;
  totalEarned: number;
  availableBalance: number;
  totalWithdrawn: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  amount: number;
  status: 'pending' | 'available' | 'withdrawn';
  source: 'sale' | 'referral' | 'bonus';
  sourceId: string;
  createdAt: string;
  availableAt: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  bankName: string;
  accountNumber: string;
  accountName: string;
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  orderId: string;
  productName: string;
  amount: number;
  commission: number;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  createdAt: string;
  updatedAt: string;
  date: string;
  type: string;
}

// export interface Referral {
//   id: string;
//   name: string;        
//   joinDate: string;
//   email: string;
//   status: 'active' | 'inactive' | 'pending';
//   totalEarned: number;
//   totalCommissions: number;
//   referralCode: string;
//   joinedAt: string;
//   lastActiveAt?: string;
// }

export interface Referral {
  id: string;
  name: string;
  email: string;
  joinDate: string;  
  status: 'active' | 'inactive' | 'pending';
  sales: number;    
  commission: number; 
  lastActivity?: string; 
  totalEarned?: number;
  totalCommissions?: number;
  referralCode?: string;
  joinedAt?: string;
  lastActiveAt?: string;
}
export interface DashboardStats {
  totalEarned: number;
  availableBalance: number;
  pendingCommissions: number;
  totalWithdrawn: number;
  totalSales: number;
  totalReferrals: number;
  recentSales: Sale[];
  recentReferrals: Referral[];
  pendingWithdrawals: Withdrawal[];
  totalEarnings?: number;
}

// Affiliate API functions
export const affiliateAPI = {
  // Get affiliate profile
  getProfile: async (): Promise<{ profile: AffiliateProfile }> => {
    const response = await api.get('/api/affiliate/profile');
    return response.data;
  },

  // Update affiliate profile
  updateProfile: async (profileData: Partial<AffiliateProfile>): Promise<{ profile: AffiliateProfile }> => {
    const response = await api.patch('/api/affiliate/profile', profileData);
    return response.data;
  },

  // Get affiliate dashboard
  getDashboard: async (): Promise<{ dashboard: DashboardStats }> => {
    const response = await api.get('/api/affiliate/dashboard');
    return response.data;
  },

  // Get affiliate commissions
  getCommissions: async (): Promise<{ commissions: Commission[]; total: number }> => {
    const response = await api.get('/api/affiliate/commissions');
    return response.data;
  },

  // Get affiliate sales
  getSales: async (): Promise<{ sales: Sale[]; total: number }> => {
    const response = await api.get('/api/affiliate/sales');
    return response.data;
  },

  // Get affiliate referrals
  getReferrals: async (): Promise<{ referrals: Referral[]; total: number }> => {
    const response = await api.get('/api/affiliate/referrals');
    return response.data;
  },

  // Record a sale
  recordSale: async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ sale: Sale }> => {
    const response = await api.post('/api/affiliate/sales', saleData);
    return response.data;
  },

  // Get affiliate withdrawals
  getWithdrawals: async (): Promise<{ withdrawals: Withdrawal[]; total: number }> => {
    const response = await api.get('/api/affiliate/withdrawals');
    return response.data;
  },

  // Request withdrawal
  requestWithdrawal: async (withdrawalData: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }): Promise<{ withdrawal: Withdrawal }> => {
    const response = await api.post('/api/affiliate/withdrawals', withdrawalData);
    return response.data;
  },
};