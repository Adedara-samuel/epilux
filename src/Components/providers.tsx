'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    // One client per browser session (not shared between server renders)
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                refetchOnWindowFocus: false,
                retry: (failureCount, error: unknown) => {
                    const status = (error as { response?: { status?: number } })?.response?.status;
                    // Don't retry client errors (auth, validation, not found)
                    if (status && status >= 400 && status < 500) return false;
                    return failureCount < 2;
                },
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}
