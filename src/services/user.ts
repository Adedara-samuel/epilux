// src/services/user.ts
import { api } from './base';

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/api/auth/change-password', passwordData);
    return response.data;
  },

  // Get user's orders
  getOrders: async () => {
    const response = await api.get('/api/users/orders');
    return response.data;
  },

  // Get user's addresses
  getAddresses: async () => {
    const response = await api.get('/api/user/addresses');
    return response.data;
  },

  // Add address
  addAddress: async (addressData: {
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }) => {
    const response = await api.post('/api/user/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (id: string, addressData: Partial<{
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>) => {
    const response = await api.put(`/api/user/addresses/${id}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id: string) => {
    const response = await api.delete(`/api/user/addresses/${id}`);
    return response.data;
  },
};