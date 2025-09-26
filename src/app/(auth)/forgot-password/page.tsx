/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForgotPassword } from '@/hooks';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const forgotPasswordMutation = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setError('');
        setMessage('');

        forgotPasswordMutation.mutate({ email }, {
            onSuccess: (data) => {
                setMessage(data.message || 'Password reset email sent. Please check your inbox.');
            },
            onError: (err: any) => {
                console.error('Error sending password reset email:', err);
                setError(err.message || 'Failed to send password reset email. Please try again.');
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <img
                            src="/images/logo.png"
                            alt="Epilux Water Logo"
                            width={120}
                            height={120}
                            className="h-16 w-16 mx-auto"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                    <p className="text-gray-500">Enter your email to reset your password</p>
                </div>

                <div className="space-y-4">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-green-50 text-green-600 rounded-lg text-sm"
                        >
                            {message}
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-50 text-red-600 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="your@email.com"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={forgotPasswordMutation.isPending || !email}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                        >
                            {forgotPasswordMutation.isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </motion.button>
                    </form>

                    <div className="text-center text-sm text-gray-500 mt-6">
                        <Link href="/login" className="font-medium text-blue-500 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}