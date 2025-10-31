// src/services/commissions.ts
import { api } from './base';

// Commission API functions
export const commissionAPI = {
  // Get all commissions (generic)
  getAllCommissions: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/api/commissions', { params });
    return response.data;
  },
  // Update commission status (generic)
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/commissions/${id}/status`, { status });
    return response.data;
  },
  // Get user's commissions
  getUserCommissions: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/api/admin/commissions/me', { params });
    return response.data;
  },

  // Get commission details
  getCommissionDetails: async (id: string) => {
    const response = await api.get(`/api/admin/commissions/${id}`);
    return response.data;
  },

  // Calculate commission estimate
  calculateCommission: async (calculationData: {
    orderAmount: number;
    commissionRate?: number;
  }) => {
    const response = await api.post('/api/admin/commissions/calculate', calculationData);
    return response.data;
  },

  // Update commission status (admin only)
  updateCommissionStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/admin/commissions/${id}/status`, { status });
    return response.data;
  },

  // Request withdrawal
  requestWithdrawal: async (withdrawalData: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) => {
    const response = await api.post('/api/affiliate/withdrawals', withdrawalData);
    return response.data;
  },
};