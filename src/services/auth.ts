/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/auth.ts
import { api } from './base';

// Auth API functions
export const authAPI = {
    // Register new user
    register: async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials: {
        email: string;
        password: string;
    }) => {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/api/auth/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData: any) => {
        const response = await api.put('/api/auth/profile', profileData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData: {
        currentPassword: string;
        newPassword: string;
    }) => {
        const response = await api.put('/api/auth/password', passwordData);
        return response.data;
    },

    // Forgot password (reset)
    forgotPassword: async (email: string) => {
        const response = await api.put('/api/auth/password', { email });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/api/auth/logout');
        return response.data;
    },

    // Verify email
    verifyEmail: async (token: string) => {
        const response = await api.post('/api/auth/verify-email', { token });
        return response.data;
    },

    // Update user role (admin only)
    updateUserRole: async (email: string, role: string) => {
        const response = await api.put('/api/auth/role', { email, role });
        return response.data;
    },
};