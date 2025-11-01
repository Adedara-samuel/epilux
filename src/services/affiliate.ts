import { api } from './base';

// Types (Keeping all your existing type definitions)
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
    // FIX: Added 'token: string' as the first argument
    getProfile: async (token: string): Promise<{ profile: AffiliateProfile }> => {
        // NOTE: You may need to add the token to the API request headers in your 'api' wrapper.
        const response = await api.get('/api/affiliate/profile', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Update affiliate profile
    // FIX: Added 'token: string' as the first argument
    updateProfile: async (
        token: string, 
        profileData: Partial<AffiliateProfile>
    ): Promise<{ profile: AffiliateProfile }> => {
        const response = await api.patch('/api/affiliate/profile', profileData, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Get affiliate dashboard
    // FIX: Added 'token: string' as the first argument
    getDashboard: async (token: string): Promise<{ dashboard: DashboardStats }> => {
        const response = await api.get('/api/affiliate/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Get affiliate commissions
    // FIX: Added 'token: string' as the first argument
    getCommissions: async (token: string): Promise<{ commissions: Commission[]; total: number }> => {
        const response = await api.get('/api/admin/commissions/me', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Get affiliate sales
    // FIX: Added 'token: string' as the first argument
    getSales: async (token: string): Promise<{ sales: Sale[]; total: number }> => {
        const response = await api.get('/api/affiliate/sales', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Get affiliate referrals
    // FIX: Added 'token: string' as the first argument
    getReferrals: async (token: string): Promise<{ referrals: Referral[]; total: number }> => {
        const response = await api.get('/api/affiliate/referrals', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Record a sale
    // FIX: Added 'token: string' as the first argument
    recordSale: async (
        token: string, 
        saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'date' | 'type'> // Removed 'date' and 'type' for cleaner Omit
    ): Promise<{ sale: Sale }> => {
        const response = await api.post('/api/affiliate/sales', saleData, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Get affiliate withdrawals
    // FIX: Added 'token: string' as the first argument
    getWithdrawals: async (token: string): Promise<{ withdrawals: Withdrawal[]; total: number }> => {
        const response = await api.get('/api/affiliate/withdrawals', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },

    // Request withdrawal
    // FIX: Added 'token: string' as the first argument
    requestWithdrawal: async (
        token: string,
        withdrawalData: {
            amount: number;
            bankName: string;
            accountNumber: string;
            accountName: string;
        }
    ): Promise<{ withdrawal: Withdrawal }> => {
        const response = await api.post('/api/affiliate/withdrawals', withdrawalData, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    },
};