/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/base.ts
import axios from 'axios';

// Always use production backend URL
export const API_BASE_URL = 'https://epilux-backend.vercel.app';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL, // Use relative URLs for Next.js rewrites
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
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
            console.log('Authorization token being sent:', `Bearer ${token.substring(0, 20)}...`);
            if (typeof document !== 'undefined') {
                document.cookie = `authToken=${token}; path=/; max-age=604800; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
            }
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

// Enhanced API wrapper with loading states
export class ApiService {
    static async request<T>(
        config: any,
        options: {
            showLoading?: boolean;
            loadingMessage?: string;
            showSuccessToast?: boolean;
            successMessage?: string;
            showErrorToast?: boolean;
            errorMessage?: string;
        } = {}
    ): Promise<T> {
        const {
            showLoading = true,
            loadingMessage = 'Loading...',
            showSuccessToast = false,
            successMessage,
            showErrorToast = true,
            errorMessage
        } = options;

        try {
            // Show loading state if requested
            if (showLoading && typeof window !== 'undefined') {
                // Import toast dynamically to avoid circular dependencies
                const { toast } = await import('sonner');
                toast.loading(loadingMessage, { id: 'api-loading' });
            }

            const response = await api.request(config);

            // Hide loading and show success if requested
            if (showLoading && typeof window !== 'undefined') {
                const { toast } = await import('sonner');
                toast.dismiss('api-loading');

                if (showSuccessToast && successMessage) {
                    toast.success(successMessage);
                }
            }

            return response.data;
        } catch (error: any) {
            // Hide loading and show error
            if (showLoading && typeof window !== 'undefined') {
                const { toast } = await import('sonner');
                toast.dismiss('api-loading');

                if (showErrorToast) {
                    const message = errorMessage || error.response?.data?.message || 'An error occurred';
                    toast.error(message);
                }
            }

            throw error;
        }
    }

    // Convenience methods
    static async get<T>(url: string, options?: any) {
        return this.request<T>({ method: 'GET', url }, options);
    }

    static async post<T>(url: string, data?: any, options?: any) {
        return this.request<T>({ method: 'POST', url, data }, options);
    }

    static async put<T>(url: string, data?: any, options?: any) {
        return this.request<T>({ method: 'PUT', url, data }, options);
    }

    static async delete<T>(url: string, options?: any) {
        return this.request<T>({ method: 'DELETE', url }, options);
    }
}

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
            localStorage.removeItem('auth_token');
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
            if (typeof document !== 'undefined') {
                document.cookie = 'authToken=; path=/; max-age=0; samesite=strict';
            }
        }
    },
};