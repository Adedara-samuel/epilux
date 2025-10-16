// src/services/user.ts
import { api } from './base';

// User API functions
export const userAPI = {
    // Get user profile - FIXED: Changed /api/users/profile to /api/user/profile
    getProfile: async () => {
        const response = await api.get('/api/user/profile');
        return response.data;
    },

    // Update user profile - FIXED: Changed /api/users/profile to /api/user/profile
    updateProfile: async (profileData: {
        firstName?: string;
        lastName?: string;
        email?: string;
    }) => {
        const response = await api.put('/api/user/profile', profileData);
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
        const response = await api.get('/api/user/orders');
        return response.data;
    },

    // Get user's addresses
    getAddresses: async () => {
        const response = await api.get('/api/user/address');
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