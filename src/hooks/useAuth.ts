"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

type AuthResponse = { user: any; token: any; success?: boolean; message?: string };

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
}

// Define the type for the AuthContext value
export interface AuthContextType {
    user: any;
    token: string | null;
    // True while the stored session is being restored or an auth request is in flight
    loading: boolean;
    // True only while the stored session is being restored on first load
    initializing: boolean;
    isAuthenticated: boolean;
    register: UseMutationResult<AuthResponse, Error, RegisterInput, unknown>;
    login: UseMutationResult<AuthResponse, Error, { email: string; password: string }, unknown>;
    adminLogin: UseMutationResult<AuthResponse, Error, { email: string; password: string }, unknown>;
    logout: (options?: { redirectTo?: string }) => void;
    updateUser: (changes: Record<string, any>) => void;
    error: string | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };
