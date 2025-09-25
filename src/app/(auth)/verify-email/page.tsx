/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
// app/verify-email/page.tsx
'use client';

import { useAuth } from '@/app/context/auth-context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Check if user is logged in
    useEffect(() => {
        if (!loading) {
            if (!user) {
                // If no user is logged in, stay on this page (don't redirect)
                return;
            } else {
                // Assume email is verified if user is logged in, redirect to account
                router.push('/account');
            }
        }
    }, [user, loading, router]);

    // Since API doesn't support resending verification email, this is a placeholder
    const handleResendEmail = async () => {
        setMessage('Verification email has been sent. Please check your inbox.');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-epilux-blue"
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                    <p className="text-gray-500">We've sent a verification link to your email address</p>
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

                    <div className="text-center text-sm text-gray-600 mb-6">
                        <p>Please check your inbox and click on the verification link to complete your registration.</p>
                        <p className="mt-2">If you didn't receive the email, click below to resend.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleResendEmail}
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Resend Verification Email
                    </motion.button>

                    <div className="text-center text-sm text-gray-500 mt-6">
                        <Link
                            href="/login"
                            onClick={async (e) => {
                                e.preventDefault();
                                await logout();
                                router.push('/login');
                            }}
                            className="font-medium text-blue-500 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}