/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/base.ts
import axios from 'axios';

// Use production backend URL
const API_BASE_URL = 'https://epilux-backend.vercel.app';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL, // Use relative URLs for Next.js rewrites
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage first (using 'auth_token' key), then try cookie as fallback
        let token = tokenManager.getToken();

        // If no token in localStorage, try to get from cookie
        if (!token && typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
            if (authCookie) {
                token = authCookie.split('=')[1];
                // Store in localStorage for future requests using 'auth_token' key
                if (token) {
                    tokenManager.setToken(token);
                }
            }
        }

        if (token && typeof window !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
            // Also set token as cookie for backend compatibility (7 days)
            document.cookie = `authToken=${token}; path=/; max-age=604800; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
        }

        // Debug: Log token usage
        if (token) {
            console.log('Using auth token for request:', config.url);
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
        // Ensure error.response exists to prevent "Cannot read properties of undefined" errors
        if (!error.response) {
            error.response = {
                status: 0,
                data: { message: 'Network error or server unreachable' }
            };
        }
        // Don't automatically clear auth on 401, let components handle it
        return Promise.reject(error);
    }
);

// Utility functions for token management
export const tokenManager = {
    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('tokenTimestamp', Date.now().toString());
        }
    },

    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
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
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenTimestamp');
            // Clear the auth cookie
            document.cookie = 'authToken=; path=/; max-age=0; samesite=strict';
        }
    },
};