// src/services/affiliate.ts
import { api } from './base';

// Affiliate API functions
export const affiliateAPI = {
  // Get affiliate profile
  getProfile: async () => {
    const response = await api.get('/api/affiliate/profile');
    return response.data;
  },

  // Create/update affiliate profile
  updateProfile: async (profileData: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    phone?: string;
  }) => {
    const response = await api.post('/api/affiliate/profile', profileData);
    return response.data;
  },

  // Get affiliate dashboard
  getDashboard: async () => {
    const response = await api.get('/api/affiliate/dashboard');
    return response.data;
  },

  // Get affiliate commissions
  getCommissions: async () => {
    const response = await api.get('/api/affiliate/commissions');
    return response.data;
  },

  // Get affiliate withdrawals
  getWithdrawals: async () => {
    const response = await api.get('/api/affiliate/withdrawals');
    return response.data;
  },

  // Request withdrawal
  requestWithdrawal: async (withdrawalData: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) => {
    const response = await api.post('/api/affiliate/withdraw', withdrawalData);
    return response.data;
  },
};