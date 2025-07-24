/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
// app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { auth } from '@/lib/firebase'; // Ensure 'auth' is imported
import { sendEmailVerification, User } from 'firebase/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, loading } = useAuth(); // 'user' from useAuth is the current Firebase User
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Check if user is logged in and email is verified
    useEffect(() => {
        if (!loading) {
            if (!user) {
                // If no user is logged in, stay on this page (don't redirect)
                return;
            } else if (user.emailVerified) {
                // If email is verified, check role and redirect accordingly
                user.getIdTokenResult().then((token) => {
                    if (token.claims.role === 'admin') {
                        router.push('/admin/dashboard');
                    } else if (token.claims.role === 'affiliate') {
                        router.push('/affiliate/dashboard');
                    } else {
                        router.push('/account');
                    }
                });
            }
        }
    }, [user, loading, router]);

    // This function now correctly uses the 'user' from the useAuth hook
    const handleResendEmail = async () => {
        // We already have 'user' from the useAuth hook in scope
        if (!user) {
            setError('No user is currently signed in to resend email to.');
            console.warn('Attempted to resend verification email but no user was found.');
            return;
        }

        setIsSending(true); // Indicate that an operation is in progress (e.g., disable button)
        setError('');       // Clear any previous errors
        setMessage('');     // Clear any previous messages

        try {
            await sendEmailVerification(user); // Use the 'user' object from useAuth

            // Success message with crucial advice!
            setMessage('Verification email sent successfully! Please check your inbox, and don\'t forget to look in your spam or junk folder.');
            console.log('Resend verification email initiated for:', user.email);

        } catch (err: any) {
            console.error('Error sending verification email:', err);
            let errorMessage = 'Failed to send verification email. Please try again.';

            if (err.code === 'auth/too-many-requests') {
                errorMessage = 'You have requested too many verification emails recently. Please wait a moment before trying again.';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            }
            setError(errorMessage);
        } finally {
            setIsSending(false); // Re-enable the button or stop loading indicator
        }
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
                        onClick={handleResendEmail} // Call the function directly
                        disabled={isSending}
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSending ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            'Resend Verification Email'
                        )}
                    </motion.button>

                    <div className="text-center text-sm text-gray-500 mt-6">
                        <Link
                            href="/login"
                            onClick={async (e) => {
                                e.preventDefault();
                                await auth.signOut();
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