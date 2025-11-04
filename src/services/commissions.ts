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
}

export interface UpdateCommissionData extends Partial<CreateCommissionData> {
  isActive?: boolean;
  status?: Commission['status'];
}

// Commission API functions
export const commissionsAPI = {
  // Get all commissions
  getCommissions: async (params?: {
    status?: string;
    type?: string;
    limit?: number;
    page?: number;
  }) => {
    const response = await api.get('/api/admin/commissions', { params });
    return response.data;
  },

  // Create commission rate
  createCommission: async (data: CreateCommissionData) => {
    const response = await api.post('/api/admin/commissions', data);
    return response.data;
  },

  // Update commission rate
  updateCommission: async (id: string, data: UpdateCommissionData) => {
    const response = await api.put(`/api/admin/commissions/${id}`, data);
    return response.data;
  },

  // Delete commission rate
  deleteCommission: async (id: string) => {
    const response = await api.delete(`/api/admin/commissions/${id}`);
    return response.data;
  },

  // Get commission by ID
  getCommission: async (id: string) => {
    const response = await api.get(`/api/admin/commissions/${id}`);
    return response.data;
  },
};