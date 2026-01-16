/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AuthContext } from '../../hooks/useAuth';
import { authAPI } from '../../services/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<any>(null);

    // Initialize auth state from localStorage and cookies on mount
    React.useEffect(() => {
        const initializeAuth = () => {
            if (typeof window !== 'undefined') {
                // Check for JWT token in localStorage (using 'auth_token' as specified)
                const storedToken = localStorage.getItem('auth_token');
                const storedUser = localStorage.getItem('user');

                if (storedToken) {
                    // If we have a token, set authenticated state
                    setToken(storedToken);

                    // Try to restore user data if available
                    if (storedUser) {
                        try {
                            const parsedUser = JSON.parse(storedUser);
                            setUser(parsedUser);
                            console.log('Auth initialized from JWT token and user data in localStorage');
                        } catch (error) {
                            // If user data is corrupted, just set basic authenticated state
                            setUser({ authenticated: true });
                            console.log('Auth initialized from JWT token (user data corrupted)');
                        }
                    } else {
                        // Set basic authenticated state if no user data
                        setUser({ authenticated: true });
                        console.log('Auth initialized from JWT token (no user data)');
                    }
                } else {
                    // Also check cookies as fallback
                    const cookies = document.cookie.split(';');
                    const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
                    if (authCookie) {
                        const cookieToken = authCookie.split('=')[1];
                        if (cookieToken) {
                            setToken(cookieToken);
                            setUser({ authenticated: true });
                            // Store in localStorage for future requests
                            localStorage.setItem('auth_token', cookieToken);
                            console.log('Auth initialized from JWT token in cookies');
                        }
                    } else {
                        console.log('No JWT token found in localStorage or cookies');
                    }
                }
            }
        };

        // Run immediately on mount to prevent redirect
        initializeAuth();
    }, []);

    const registerMutation = useMutation({
        mutationFn: authAPI.register,
        onSuccess: (data: { user: any; token: any }) => {
            // Assuming your API returns a user object and a token on success
            setUser(data.user);
            setToken(data.token);
            // Success toast will be handled by individual components
        },
        onError: (error: any) => {
            // Error toast will be handled by individual components
            throw error; // Re-throw to let individual components handle the error
        },
    });

    const loginMutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data: { user: any; token: any }) => {
            // Set token in localStorage using 'auth_token' key as specified
            if (typeof window !== 'undefined' && data.token) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                document.cookie = `authToken=${data.token}; path=/; max-age=86400; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
            }
            setUser(data.user);
            setToken(data.token);
            // Success toast will be handled by individual components
        },
        onError: (error: any) => {
            // Error toast will be handled by individual components
            throw error; // Re-throw to let individual components handle the error
        },
    });

    const adminLoginMutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data: { user: any; token: any }) => {
            // Set token in localStorage using 'auth_token' key as specified
            if (typeof window !== 'undefined' && data.token) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                document.cookie = `authToken=${data.token}; path=/; max-age=86400; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
            }
            setUser(data.user);
            setToken(data.token);
            // Success toast will be handled by individual components
        },
        onError: (error: any) => {
            // Error toast will be handled by individual components
            throw error; // Re-throw to let individual components handle the error
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => token ? authAPI.logout(token) : Promise.resolve(),
        onSuccess: () => {
            setUser(null);
            setToken(null);
            // Clear all auth data on logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                localStorage.removeItem('tokenTimestamp');
                // Clear the auth cookie
                document.cookie = 'authToken=; path=/; max-age=0; samesite=strict';
            }
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

    // Debug: Log user state changes
    React.useEffect(() => {
        console.log('AuthProvider user state:', user);
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};