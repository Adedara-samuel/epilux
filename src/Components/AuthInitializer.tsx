'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);

  useEffect(() => {
    // Initialize auth on every page load to ensure proper state
    initializeAuth();
  }, [initializeAuth]);

  // Show loading state while authenticating
  if (isAuthenticating) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
}