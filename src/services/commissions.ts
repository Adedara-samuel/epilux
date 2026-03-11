// src/services/commissions.ts
import { api } from './base';

// Commission interfaces
export interface Commission {
  _id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'available' | 'withdrawn' | 'rejected';
  type: 'product' | 'service' | 'referral' | 'general';
  description?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CommissionRate {
  _id: string;
  name: string;
  description?: string;
  rate: number;
  type: 'percentage' | 'fixed';
  category: 'product' | 'service' | 'referral' | 'general';
  isActive: boolean;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionData {
  name: string;
  description?: string;
  rate: number;
  type: 'percentage' | 'fixed';
  category: 'product' | 'service' | 'referral' | 'general';
  userId?: string; // Add userId for commission creation
}

export interface UpdateCommissionData extends Partial<CreateCommissionData> {
  isActive?: boolean;
  status?: Commission['status'];
}

// Commission API functions
export const commissionsAPI = {
  // Get commission settings
  getCommissionSettings: async () => {
    const response = await api.get('/api/admin/settings');
    return response.data;
  },

  // Get all commission records with filtering and pagination
  getAllCommissions: async (params?: {
    status?: string;
    type?: string;
    limit?: number;
    page?: number;
    startDate?: string;
    endDate?: string;
    affiliateId?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    const response = await api.get('/api/commission/admin/commissions', { params });
    console.log("Fetched commissions: ", response.data);
    return response.data;
  },

  // Get all commissions (legacy - for backward compatibility)
  getCommissions: async (params?: {
    status?: string;
    type?: string;
    limit?: number;
    page?: number;
  }) => {
    const response = await api.get('/api/commission/admin/settings', { params });
    return response.data;
  },

  // Create commission rate
  createCommission: async (data: CreateCommissionData) => {
    const response = await api.post('/api/admin/commission-rates', {
      ...data,
      updateBy: "Admin"
    });
    console.log("message: ", response.data);
    return response.data;
  },

  // Update commission rate
  updateCommission: async (id: string, data: UpdateCommissionData) => {
    const response = await api.put(`/api/commission/admin/commissions/${id}`, data);
    return response.data;
  },

  // Delete commission rate
  deleteCommission: async (id: string) => {
    const response = await api.delete(`/api/commission/admin/commissions/${id}`);
    return response.data;
  },

  // Get commission by ID
  getCommission: async (id: string) => {
    const response = await api.get(`/api/commission/admin/commissions/${id}`);
    return response.data;
  },
};