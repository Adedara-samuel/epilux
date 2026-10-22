/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/base.ts
import axios from 'axios';
import { BACKEND_URL } from '@/lib/config';
import { authSession, isTokenExpired } from '@/lib/auth-session';

// Backend origin: NEXT_PUBLIC_BACKEND_URL locally, deployed backend otherwise
export const API_BASE_URL = BACKEND_URL;

// Fired when the backend rejects the stored session; AuthProvider listens for it
export const AUTH_EXPIRED_EVENT = 'epilux:auth-expired';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = authSession.getToken();
        if (token) {
            // Always use the stored session token. Some callers pass their own
            // header built before the session was available ("Bearer undefined").
            config.headers.Authorization = `Bearer ${token}`;
        } else if (/^Bearer (undefined|null)?$/.test(String(config.headers.Authorization || ''))) {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Messages the backend uses when a token is no longer usable
const SESSION_ERRORS = /invalid token|token expired|user not found|no token provided|token verification failed/i;

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ensure error.response exists to prevent "Cannot read properties of undefined" errors
        if (!error.response) {
            error.response = {
                status: 0,
                data: { message: 'Unable to reach the server. Please check your connection and try again.' }
            };
        }

        const status = error.response.status;
        const message = error.response.data?.message || '';
        const isLoginRequest = /\/api\/auth\/(login|register|admin\/login)/.test(error.config?.url || '');

        // Only end the session when the backend rejected the token we actually
        // hold now (not a stale or missing one from an earlier request)
        const storedToken = typeof window !== 'undefined' ? authSession.getToken() : null;
        const sentHeader = String(error.config?.headers?.Authorization || '');
        const rejectedCurrentToken = !!storedToken && sentHeader === `Bearer ${storedToken}`;

        if (rejectedCurrentToken && !isLoginRequest && status === 401 && SESSION_ERRORS.test(message)) {
            authSession.clear();
            window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
        }

        return Promise.reject(error);
    }
);

// Pull a user-facing message out of an API error
export const getErrorMessage = (error: any, fallback = 'Something went wrong. Please try again.') =>
    error?.response?.data?.message || error?.message || fallback;

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
                    toast.error(errorMessage || getErrorMessage(error));
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

// Utility functions for token management (kept for existing callers)
export const tokenManager = {
    setToken: (token: string) => {
        authSession.save(token, authSession.getUser());
    },

    getToken: () => {
        const token = authSession.getToken();
        return token && !isTokenExpired(token) ? token : null;
    },

    removeToken: () => {
        authSession.clear();
    },

    setUser: (user: any) => {
        authSession.saveUser(user);
    },

    getUser: () => authSession.getUser<any>(),

    removeUser: () => {
        authSession.clear();
    },

    // Clear all auth data
    clearAuth: () => {
        authSession.clear();
    },
};
