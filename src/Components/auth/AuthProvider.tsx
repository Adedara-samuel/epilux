/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AuthContext } from '../../hooks/useAuth';
import { authAPI } from '../../services/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // No session check, rely on AuthInitializer

    const registerMutation = useMutation({
        mutationFn: authAPI.register,
        onSuccess: (data: { user: any; token: any }) => {
            // Assuming your API returns a user object and a token on success
            setUser(data.user);
            setToken(data.token);
            toast.success('Registration successful!');
        },
        onError: (error: Error) => {
            toast.error(`Registration failed: ${error.message}`);
        },
    });

    const loginMutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data: { user: any; token: any }) => {
            // Set token in localStorage and cookie
            if (typeof window !== 'undefined' && data.token) {
                localStorage.setItem('authToken', data.token);
                document.cookie = `authToken=${data.token}; path=/; max-age=86400; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
            }
            setUser(data.user);
            setToken(data.token);
            toast.success('Login successful!');
        },
        onError: (error: Error) => {
            toast.error(`Login failed: ${error.message}`);
        },
    });

    const adminLoginMutation = useMutation({
        mutationFn: authAPI.adminLogin,
        onSuccess: (data: { user: any; token: any }) => {
            // Set token in localStorage and cookie
            if (typeof window !== 'undefined' && data.token) {
                localStorage.setItem('authToken', data.token);
                document.cookie = `authToken=${data.token}; path=/; max-age=86400; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
            }
            setUser(data.user);
            setToken(data.token);
            toast.success('Admin login successful!');
        },
        onError: (error: Error) => {
            toast.error(`Admin login failed: ${error.message}`);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => token ? authAPI.logout(token) : Promise.resolve(),
        onSuccess: () => {
            setUser(null);
            setToken(null);
            toast.success('Logout successful!');
        },
        onError: (error: Error) => {
            toast.error(`Logout failed: ${error.message}`);
        },
    });

    const value = {
        user,
        loading: registerMutation.isPending || loginMutation.isPending || adminLoginMutation.isPending || logoutMutation.isPending,
        register: registerMutation,
        login: loginMutation,
        adminLogin: adminLoginMutation,
        logout: logoutMutation.mutate,
        error: registerMutation.error?.message || loginMutation.error?.message || adminLoginMutation.error?.message || logoutMutation.error?.message,
        token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};