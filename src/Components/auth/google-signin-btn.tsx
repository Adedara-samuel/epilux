/* eslint-disable @next/next/no-img-element */
// Components/auth/google-signin-btn.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { handleGoogleAuth } from '@/lib/auth-utils';
import { tokenManager } from '@/lib/api';

export function GoogleSignInButton({ redirectTo = '/admin' }: { redirectTo?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        try {
            // Use Google's OAuth popup to get ID token
            const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            if (!googleClientId) {
                throw new Error('Google client ID not configured');
            }

            // Initialize Google OAuth
            const googleAuth = (window as any).gapi.auth2.getAuthInstance();
            if (!googleAuth) {
                // Load Google Auth API if not already loaded
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://apis.google.com/js/platform.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });

                await new Promise((resolve, reject) => {
                    (window as any).gapi.load('auth2', () => {
                        (window as any).gapi.auth2.init({
                            client_id: googleClientId,
                        }).then(resolve, reject);
                    });
                });
            }

            // Sign in with Google
            const googleUser = await (window as any).gapi.auth2.getAuthInstance().signIn();
            const idToken = googleUser.getAuthResponse().id_token;

            // Send token to backend for verification
            const result = await handleGoogleAuth(idToken);
            
            if (result.success && result.token && result.user) {
                // Store JWT token
                tokenManager.setToken(result.token);
                tokenManager.setUser(result.user);

                // Redirect based on user role
                if (result.user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (result.user.role === 'affiliate') {
                    router.push('/affiliate/dashboard');
                } else {
                    router.push(redirectTo);
                }
            } else {
                console.error('Authentication failed:', result.message);
                alert(result.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
            alert('Google sign-in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                </>
            ) : (
                <>
                    <img src="/images/google-logo.png" alt="Google logo" className="h-5 w-5 mr-2" />
                    Continue with Google
                </>
            )}
        </motion.button>
    );
}