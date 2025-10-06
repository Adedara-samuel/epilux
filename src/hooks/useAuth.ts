/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { createContext, useContext } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

// Define the type for the AuthContext value
export interface AuthContextType {
    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    user: any;
    loading: boolean;
    register: UseMutationResult<{ user: any; token: any; }, Error, { firstName: string; lastName: string; email: string; password: string; role?: string; }, unknown>;
    login: UseMutationResult<{ user: any; token: any; }, Error, { email: string; password: string; }, unknown>;
    adminLogin: UseMutationResult<{ user: any; token: any; }, Error, { email: string; password: string; }, unknown>;
    logout: () => void;
    error: string | undefined;
    token: string | null;
}

// Create the context with a default value that matches AuthContextType
export const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Helper function to get initial token from localStorage (for client-side only)
export const getInitialToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || null;
    }
    return null;
};