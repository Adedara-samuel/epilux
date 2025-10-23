/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { User } from '@/types/user';
import { authAPI, tokenManager } from '@/services';

interface AuthStore {
    user: User | null;
    loading: boolean;
    isAuthenticating: boolean;
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
    adminLogin: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
    register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    loading: true,
    isAuthenticating: true,

    initializeAuth: async () => {
        set({ isAuthenticating: true });
        try {
            const token = tokenManager.getToken();
            const storedUser = tokenManager.getUser();

            if (token && storedUser) {
                // Just set the user from storage - let backend handle token validation
                set({ user: storedUser });
            } else {
                set({ user: null });
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            set({ user: null });
        } finally {
            set({ loading: false, isAuthenticating: false });
        }
    },

    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await authAPI.login(credentials);

            if (response.success && response.token && response.user) {
                tokenManager.setToken(response.token);
                tokenManager.setUser(response.user);
                set({ user: response.user });

                // Handle role-based redirects
                if (response.user.role === 'marketer') {
                    // Redirect to marketer page
                    if (typeof window !== 'undefined') {
                        window.location.href = '/marketer';
                    }
                } else if (response.user.role === 'affiliate') {
                    // Redirect to products page for affiliates
                    if (typeof window !== 'undefined') {
                        window.location.href = '/products';
                    }
                } else {
                    // Regular users go to products page
                    if (typeof window !== 'undefined') {
                        window.location.href = '/products';
                    }
                }

                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message || 'Login failed' };
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'An error occurred during login';
            return { success: false, message };
        }
    },

    adminLogin: async (credentials: { email: string; password: string }) => {
        try {
            const response = await authAPI.adminLogin(credentials);

            if (response.success && response.token && response.user) {
                tokenManager.setToken(response.token);
                tokenManager.setUser(response.user);
                set({ user: response.user });
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message || 'Admin login failed' };
            }
        } catch (error: any) {
            console.error('Admin login error:', error);
            const message = error.response?.data?.message || 'An error occurred during admin login';
            return { success: false, message };
        }
    },

    register: async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
        try {
            const response = await authAPI.register(userData);

            if (response.success && response.token && response.user) {
                tokenManager.setToken(response.token);
                tokenManager.setUser(response.user);
                set({ user: response.user });
                return { success: true, message: response.message };
            } else {
                return { success: false, message: response.message || 'Registration failed' };
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || 'An error occurred during registration';
            return { success: false, message };
        }
    },

    logout: async () => {
        try {
            const token = tokenManager.getToken();
            if (token) {
                await authAPI.logout(token);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            tokenManager.clearAuth();
            set({ user: null, isAuthenticating: false });
            // Note: router.push('/login') should be handled in the component
        }
    },

    updateUser: (userData: Partial<User>) => {
        set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
        }));
        const { user } = get();
        if (user) {
            const updatedUser = { ...user, ...userData };
            tokenManager.setUser(updatedUser);
        }
    },
}));