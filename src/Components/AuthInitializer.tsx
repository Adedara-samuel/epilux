'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);

  useEffect(() => {
    // Initialize auth on every page load to ensure proper state
    // Add a small delay to ensure cookies are available
    const timer = setTimeout(() => {
      initializeAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeAuth]);

  // Don't show loading state - let components handle their own loading
  return null;
}