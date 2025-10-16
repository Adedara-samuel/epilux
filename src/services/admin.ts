/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/admin.ts
import { api } from './base';

// Admin Users API
export const adminUsersAPI = {
  // Get all users
  getUsers: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/api/admin/users/${id}/role`, { role });
    return response.data;
  },
};

// Admin Affiliates API
export const adminAffiliatesAPI = {
  // Get all affiliates
  getAffiliates: async () => {
    const response = await api.get('/api/admin/affiliates');
    return response.data;
  },

  // Get affiliate by ID
  getAffiliate: async (id: string) => {
    const response = await api.get(`/api/admin/affiliates/${id}`);
    return response.data;
  },

  // Update affiliate status
  updateAffiliateStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/admin/affiliates/${id}/status`, { status });
    return response.data;
  },

  // Get affiliate commissions
  getAffiliateCommissions: async (id: string) => {
    const response = await api.get(`/api/admin/affiliates/${id}/commissions`);
    return response.data;
  },

  // Create commission
  createCommission: async (id: string, commissionData: any) => {
    const response = await api.post(`/api/admin/affiliates/${id}/commission`, commissionData);
    return response.data;
  },
};

// Admin Commissions API
export const adminCommissionsAPI = {
  // Update commission status
  updateCommissionStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/admin/commissions/${id}/status`, { status });
    return response.data;
  },
};

// Admin Withdrawals API
export const adminWithdrawalsAPI = {
  // Get all withdrawals
  getWithdrawals: async () => {
    const response = await api.get('/api/admin/withdrawals');
    return response.data;
  },

  // Update withdrawal status
  updateWithdrawalStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/admin/withdrawals/${id}/status`, { status });
    return response.data;
  },
};

// Admin Settings API
export const adminSettingsAPI = {
  // Get system settings
  getSettings: async () => {
    const response = await api.get('/api/admin/settings');
    return response.data;
  },

  // Update system settings
  updateSettings: async (settingsData: any) => {
    const response = await api.put('/api/admin/settings', settingsData);
    return response.data;
  },
};

// Admin Dashboard API
export const adminDashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      // API call executes here
      const response = await api.get('/api/admin/dashboard/stats');
      // This returns the whole response object: { "success": true, "data": { ... } }
      return response.data;
    } catch (error) {
      // Critical: Re-throw the error so React Query catches it.
      console.error("Error fetching admin dashboard stats:", error);
      throw error;
    }
  },
};
