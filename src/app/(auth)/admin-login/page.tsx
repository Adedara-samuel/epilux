/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const AdminLoginPage = () => {
    const { user, loading: authLoading, adminLogin: adminLoginMutation } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'admin') {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/products');
            }
        }
    }, [user, authLoading, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        adminLoginMutation.mutate({ email, password }, {
            onSuccess: () => {
            },
            onError: (err: any) => {
                setError(err.message || "Admin login failed. Please check your credentials.");
            },
        });
    };

    if (authLoading || (user && !error)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10"
            >
                <div className="text-center mb-8">
                    <img
                        src="/images/logo.png"
                        alt="Epilux Water Logo"
                        width={80}
                        height={80}
                        className="h-16 w-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
                    <p className="text-gray-500">Access the admin dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Admin Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-black rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="admin@epilux.com"
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
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-black rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={adminLoginMutation.isPending || !email || !password}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    >
                        {adminLoginMutation.isPending ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Sign in as Admin'
                        )}
                    </motion.button>
                </form>

                <div className="text-center text-sm text-gray-500 mt-6">
                    <Link href="/login" className="font-medium text-blue-500 hover:underline">
                        Regular User Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;