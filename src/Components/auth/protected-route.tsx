// Components/auth/protected-route.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}