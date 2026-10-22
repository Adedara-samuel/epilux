/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AuthContext } from '../../hooks/useAuth';
import { authAPI } from '../../services/auth';
import { AUTH_EXPIRED_EVENT } from '../../services/base';
import { authSession, isTokenExpired } from '../../lib/auth-session';
import { BACKEND_URL } from '../../lib/config';

// Single source of truth for the signed-in user.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    const clearSession = useCallback(() => {
        authSession.clear();
        setUser(null);
        setToken(null);
        queryClient.clear();
    }, [queryClient]);

    const startSession = useCallback((nextToken: string, nextUser: any) => {
        authSession.save(nextToken, nextUser);
        setToken(nextToken);
        setUser(nextUser);
    }, []);

    // Restore the stored session, then confirm it with the backend in the background
    useEffect(() => {
        const storedToken = authSession.getToken();
        const storedUser = authSession.getUser<any>();

        if (storedToken && !isTokenExpired(storedToken) && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
            authSession.syncCookie();

            fetch(`${BACKEND_URL}/api/users/me`, { headers: { Authorization: `Bearer ${storedToken}` } })
                .then(async (res) => {
                    if (res.status === 401 || res.status === 403) {
                        clearSession();
                        return;
                    }
                    if (res.ok) {
                        const body = await res.json().catch(() => null);
                        const fresh = body?.data;
                        if (fresh?._id || fresh?.id) {
                            // Keep the stored shape (id) and refresh role/profile from the server
                            const merged = { ...storedUser, ...fresh, id: fresh._id || fresh.id };
                            authSession.saveUser(merged);
                            setUser(merged);
                        }
                    }
                })
                .catch(() => {
                    // Offline or backend unreachable: keep the local session
                });
        } else if (storedToken || storedUser) {
            // Expired or incomplete session
            authSession.clear();
        }

        setInitializing(false);
    }, [clearSession]);

    // The API client signals when the backend rejects the session
    useEffect(() => {
        const onExpired = () => {
            setUser(null);
            setToken(null);
            queryClient.clear();
            toast.error('Your session has expired. Please sign in again.');
        };
        window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    }, [queryClient]);

    // Keep tabs in sync: signing out in one tab signs out the others
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key !== authSession.storageKeys.token) return;
            if (!event.newValue) {
                setUser(null);
                setToken(null);
            } else {
                setToken(event.newValue);
                setUser(authSession.getUser());
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleAuthSuccess = useCallback((data: any) => {
        const nextToken = data?.token || data?.data?.token;
        const nextUser = data?.user || data?.data?.user;
        if (!nextToken || !nextUser) {
            throw new Error(data?.message || 'Unexpected response from the server');
        }
        startSession(nextToken, nextUser);
        return { ...data, token: nextToken, user: nextUser };
    }, [startSession]);

    const registerMutation = useMutation({
        mutationFn: async (input: any) => handleAuthSuccess(await authAPI.register(input)),
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) =>
            handleAuthSuccess(await authAPI.login(credentials)),
    });

    const adminLoginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const result = handleAuthSuccess(await authAPI.login(credentials));
            if (result.user?.role !== 'admin') {
                clearSession();
                throw new Error('This account does not have admin access');
            }
            return result;
        },
    });

    const logout = useCallback((options?: { redirectTo?: string }) => {
        const currentToken = authSession.getToken();
        if (currentToken) {
            // Stateless JWT: the server call is best-effort
            authAPI.logout(currentToken).catch(() => {});
        }
        clearSession();
        toast.success('You have been signed out');
        if (typeof window !== 'undefined') {
            window.location.href = options?.redirectTo || '/login';
        }
    }, [clearSession]);

    const updateUser = useCallback((changes: Record<string, any>) => {
        setUser((current: any) => {
            if (!current) return current;
            const next = { ...current, ...changes };
            authSession.saveUser(next);
            return next;
        });
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        initializing,
        isAuthenticated: !!user && !!token,
        loading: initializing || registerMutation.isPending || loginMutation.isPending || adminLoginMutation.isPending,
        register: registerMutation,
        login: loginMutation,
        adminLogin: adminLoginMutation,
        logout,
        updateUser,
        error: registerMutation.error?.message || loginMutation.error?.message || adminLoginMutation.error?.message,
    }), [user, token, initializing, registerMutation, loginMutation, adminLoginMutation, logout, updateUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
