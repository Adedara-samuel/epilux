/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/base.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://epilux-backend.vercel.app';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Override baseURL for Next.js API routes
api.interceptors.request.use((config) => {
    if (config.url?.startsWith('/api/')) {
        config.baseURL = '';
    }
    return config;
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = tokenManager.getToken();
        if (token && typeof window !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
            // Also set token as cookie for backend compatibility
            document.cookie = `authToken=${token}; path=/; max-age=86400; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't automatically clear auth on 401, let components handle it
        return Promise.reject(error);
    }
);

// Utility functions for token management
export const tokenManager = {
    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    },

    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    },

    removeToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    },

    setUser: (user: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    getUser: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    },

    removeUser: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    },

    // Clear all auth data
    clearAuth: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Clear the auth cookie
            document.cookie = 'authToken=; path=/; max-age=0; samesite=strict';
        }
    },
};