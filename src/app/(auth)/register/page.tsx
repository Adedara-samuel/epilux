/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useState } from 'react';
import { useMutation, QueryClient, QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import Script from 'next/script';

// Define the type for the AuthContext value
interface AuthContextType {
    user: any;
    loading: boolean;
    register: UseMutationResult<{ user: any; token: any; }, Error, { firstName: string; lastName: string; email: string; password: string; }, unknown>;
    error: string | undefined;
    token: any;
}

// Tailwind CSS is loaded via CDN for single-file deployment.
// This should be removed if you are using a build process.
const TailwindCSS = () => (
    <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
);

// =========================================================================
// 1. API Service (AuthService) - This would typically be in src/services/AuthService.js
// This service handles the actual network requests. It's a clean separation
// of concerns from your React components and hooks.
// =========================================================================
const BASE_URL = 'http://localhost:5000';

const authService = {
    /**
     * Registers a new user with the backend API.
     * @param {object} userData - The user data including firstName, lastName, email, and password.
     * @returns {Promise<object>} - A promise that resolves with the API response.
     */
    register: async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        return response.json();
    },
};

// =========================================================================
// 2. Custom React Hook and Context (useAuth) - This would be in src/hooks/useAuth.js
// This hook provides a user-friendly interface to the auth service and
// manages the authentication state using React Context and Tanstack Query.
// =========================================================================
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (data: { user: any; token: any }) => {
            // Assuming your API returns a user object and a token on success
            setUser(data.user);
            setToken(data.token);
        },
        onError: (error: Error) => {
            console.error('Registration error:', error.message);
        },
    });

    const value = {
        user,
        loading: registerMutation.isPending,
        register: registerMutation,
        error: registerMutation.error?.message,
        token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// =========================================================================
// 3. Simple Modal/Alert Component
// This is a replacement for the alert() function.
// =========================================================================
const Modal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};


// =========================================================================
// 4. Updated Register Page Component - This would be in src/app/register/page.jsx
// This component shows how to use the new useAuth hook with Tanstack Query's
// mutation states.
// =========================================================================
const RegisterPage = () => {
    const { register: registerMutation, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [localError, setLocalError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
    }

    registerMutation.mutate(
        {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
        },
        {
            onSuccess: () => {
                console.log('User registered successfully!');
                setShowModal(true);
            },
            onError: (err: Error) => { // Corrected this line
                setLocalError(err.message);
            },
        }
    );
};

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Column - Form */}
                    <div className="w-full lg:w-1/2 p-8 sm:p-12">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                            <p className="text-gray-500">Join us for premium water delivery services</p>
                        </div>

                        <div className="space-y-6">
                            {(localError || error) && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                    {localError || error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 text-black py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 text-black py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 text-black py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={8}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 text-black rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 rounded border-gray-300"
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                        I agree to the <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-950 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>

                            <div className="text-center text-sm text-gray-500">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium text-blue-500 hover:underline">
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-800">
                    <img
                        src="/images/auth-bg.jpg"
                        alt="Water delivery"
                        className="object-cover w-full h-full opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20 flex items-end p-12">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-3">Customer Dashboard</h2>
                            <p className="text-white/90 max-w-md">
                                Manage your water subscriptions and orders
                            </p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            {showModal && (
                <Modal
                    message="Registration successful! You will be redirected to the login page."
                    onClose={() => {
                        setShowModal(false);
                        // In a real app, you would use a router here.
                        window.location.href = '/login';
                    }}
                />
            )}
        </>
    );
};

// =========================================================================
// 5. Main App Wrapper
// This wraps your application with the necessary providers.
// =========================================================================
const queryClient = new QueryClient();

export default function App() {
    return (
        <>
            <TailwindCSS />
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RegisterPage />
                </AuthProvider>
            </QueryClientProvider>
        </>
    );
}
