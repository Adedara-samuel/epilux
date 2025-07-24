/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/register/page.tsx
'use client';

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GoogleSignInButton } from '@/Components/auth/google-signin-btn';

export default function RegisterPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        // --- Input Validation ---
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please ensure both fields are identical.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Your password must be at least 8 characters long for security.');
            return;
        }

        setIsSubmitting(true); // Disable the form to prevent multiple submissions

        try {
            // --- Firebase Authentication Initialization Check ---
            // This is a great defensive check! Ensure 'auth' is ready to go.
            if (!auth) {
                throw new Error('Firebase Authentication service is not available. Please try refreshing the page.');
            }

            // --- 1. Create the User Account ---
            // This automatically signs the user in upon successful creation.
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // --- 2. Send the Email Verification ---
            // This is the core of your question! We'll try to send it and handle potential issues.
            try {
                await sendEmailVerification(userCredential.user);
                console.log('Verification email send initiated for:', userCredential.user.email);
                // Crucial user feedback: let them know what just happened and what to do next.
                alert('Registration successful! Please check your email inbox (and don\'t forget your spam or junk folder!) to verify your account.');
            } catch (emailSendError: any) {
                console.warn('Failed to send verification email immediately after user creation:', emailSendError);
                // Even if the email fails to send, the user account IS created.
                // Inform the user, but don't block their registration flow.
                // They can always request a re-send later after logging in.
                alert('Registration successful, but we encountered an issue sending the verification email. Please check your inbox, and if you don\'t receive it, you can request a new one after logging in.');
                // Note: This error usually indicates a temporary issue or a configuration problem
                // with Firebase email templates, not an auth/error code like email-already-in-use.
            }

            // --- 3. Store Additional User Data in Firestore ---
            // Good practice to store a custom profile.
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: formData.name,
                email: formData.email,
                createdAt: new Date().toISOString(),
                emailVerified: false,
                role: 'customer' // Default role - change this if needed
                // Or determine role based on some logic
            });

            // --- 4. Redirect User ---
            // Direct them to a page that clearly explains the next steps (checking email).
            router.push('/verify-email');

        } catch (err: any) {
            // --- Centralized Error Handling for Registration Issues ---
            console.error('Registration or initial Firestore write error:', err);
            let errorMessage = 'Registration failed. An unexpected error occurred. Please try again.';

            // More user-friendly messages for common Firebase Auth errors
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'This email address is already registered. Please login instead, or use a different email.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'The email address you entered is not valid. Please check and try again.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'The password is too weak. Please choose a stronger one with at least 8 characters, including a mix of letters, numbers, and symbols.';
            } else if (err.code === 'auth/operation-not-allowed') {
                // This is crucial: if Email/Password sign-in isn't enabled in the Firebase Console.
                errorMessage = 'Email/password registration is not enabled for this app. Please contact support or try a different sign-in method.';
            } else if (err.message && err.message.includes('Authentication service not available')) {
                errorMessage = 'An internal setup error occurred. Please refresh the page and try again.';
            }
            // You could add more specific error handling for Firestore errors if needed,
            // but for a `setDoc` operation, a generic retry message is usually sufficient.

            setError(errorMessage); // Display the error message to the user
        } finally {
            setIsSubmitting(false); // Re-enable the form regardless of success or failure
        }
    };

    if (authLoading) {
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
                className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
            >
                {/* Left Column - Form */}
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500">Join us for premium water delivery services</p>
                    </div>

                    <div className="space-y-6">
                        <GoogleSignInButton />

                        <div className="relative flex items-center my-6">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

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
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 text-black py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="John Doe"
                                />
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
                                    I agree to the <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
                                </label>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-950 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
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
                            </motion.button>
                        </form>

                        <div className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-blue-500 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column - Image */}
                <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-epilux-blue to-epilux-dark-blue">
                    <img
                        src="/images/authBg.jpg"
                        alt="Water delivery"
                        className="object-cover w-full h-full opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20 flex items-end p-12">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-3">Pure Water, Delivered to Your Doorstep</h2>
                            <p className="text-white/90 max-w-md">
                                Join thousands of satisfied customers enjoying our premium water delivery service.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}