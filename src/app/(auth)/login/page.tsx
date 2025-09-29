/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/login/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/Components/auth/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

function LoginPage() {
    const { user, loading: authLoading, login: loginMutation } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // State to hold the redirect path, initialized to a default
    const [redirectTo, setRedirectTo] = useState('/account'); // Default for general users

    // --- IMPORTANT: Parse redirect parameter first ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setRedirectTo(params.get('redirect') || '/');
        }
    }, []);

    // Redirect if already logged in (after redirectTo is set and user data is available)
    useEffect(() => {
        if (!authLoading && user) {
            const role = user.role;
            if (role === 'admin') {
                router.push('/admin/dashboard');
            } else if (role === 'affiliate') {
                router.push('/affiliate/dashboard');
            } else {
                router.push(redirectTo);
            }
        }
    }, [user, authLoading, router, redirectTo]);

    // Form validation
    const isFormValid = email && password && email.includes('@') && password.length >= 6;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        loginMutation.mutate({ email, password }, {
            onSuccess: () => {
                
            },
            onError: (err: any) => {
                setError(err.message || "Login failed. Please check your credentials.");
            },
        });
    };

    if (authLoading || (user && !error)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
            >
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6">
                            <img
                                src="/images/logo.png"
                                alt="Epilux Water Logo"
                                width={120}
                                height={120}
                                className="h-20 w-20"
                            />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Log in to access your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-5">
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 rounded border-gray-300"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </motion.button>
                        </form>

                        <div className="text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-blue-600 hover:underline">
                                Sign up
                            </Link>
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
            </motion.div>
        </div>
    );
}

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        </QueryClientProvider>
    );
}