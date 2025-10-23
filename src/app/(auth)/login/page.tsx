/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/login/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, User } from 'lucide-react';

function LoginPage() {
    const { user, loading: authLoading, login: loginMutation } = useAuth();
    const { isAuthenticating } = useAuthStore();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // State to hold the redirect path
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    // --- IMPORTANT: Parse redirect parameter first ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setRedirectTo(params.get('redirect') || '/products');
        }
    }, []);

    // Redirect if already logged in (after redirectTo is set and user data is available)
    useEffect(() => {
        if (!authLoading && !isAuthenticating && user && redirectTo) {
            if (!user.emailVerified) {
                router.replace('/verify-email');
            } else {
                const role = user.role;
                if (role === 'admin') {
                    router.replace('/admin/dashboard');
                } else if (role === 'affiliate') {
                    router.replace('/affiliate/dashboard');
                } else if (role === 'marketer') {
                    router.replace('/admin/marketers');
                } else {
                    router.replace(redirectTo);
                }
            }
        }
    }, [user, authLoading, isAuthenticating, router, redirectTo]);

    // Form validation
    const isFormValid = email && password && email.includes('@') && password.length >= 6;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        loginMutation.mutate({ email, password }, {
            onSuccess: () => {
                // Redirect will be handled by the useEffect that watches user state
                setIsSubmitting(false);
                toast.success('Login successful! Welcome back!');
            },
            onError: (err: any) => {
                const errorMessage = err?.response?.data?.message || err?.message || "Login failed. Please check your credentials.";
                setError(errorMessage);
                setIsSubmitting(false);
                toast.error(errorMessage);
            },
        });
    };

    if (authLoading || isAuthenticating || (user && !redirectTo)) {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transform hover:shadow-3xl transition-shadow duration-300"
            >
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounceIn">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-fadeIn">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            Log in to access your dashboard
                        </p>
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
                                    <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline cursor-pointer">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full text-black px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5 cursor-pointer" /> : <Eye className="h-5 w-5 cursor-pointer" />}
                                    </button>
                                </div>
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

                        <div className="text-center text-sm text-gray-500 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline transform hover:scale-105 inline-block">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block w-1/2 relative bg-blue-600">
                    <img
                        src="/images/auth-bg.jpg"
                        alt="Water delivery"
                        className="object-cover w-full h-full opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-12">
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

export default function App() {
    return <LoginPage />;
}