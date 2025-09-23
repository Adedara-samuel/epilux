// app/context/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { authAPI, tokenManager } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
    register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => ({ success: false, message: '' }),
    register: async () => ({ success: false, message: '' }),
    logout: async () => { },
    updateUser: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = tokenManager.getToken();
                const storedUser = tokenManager.getUser();

                if (token && storedUser) {
                    // Verify token is still valid by fetching user profile
                    const response = await authAPI.getProfile();
                    if (response.success && response.user) {
                        setUser(response.user);
                        tokenManager.setUser(response.user);
                    } else {
                        // Token is invalid, clear auth data
                        tokenManager.clearAuth();
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                tokenManager.clearAuth();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        try {
            const response = await authAPI.login(credentials);
            
            if (response.success && response.token && response.user) {
                tokenManager.setToken(response.token);
                tokenManager.setUser(response.user);
                setUser(response.user);
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message || 'Login failed' };
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'An error occurred during login';
            return { success: false, message };
        }
    };

    const register = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
        try {
            const response = await authAPI.register(userData);
            
            if (response.success && response.token && response.user) {
                tokenManager.setToken(response.token);
                tokenManager.setUser(response.user);
                setUser(response.user);
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message || 'Registration failed' };
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || 'An error occurred during registration';
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            tokenManager.clearAuth();
            setUser(null);
            router.push('/login');
        }
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...userData } : null);
        if (user) {
            const updatedUser = { ...user, ...userData };
            tokenManager.setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);