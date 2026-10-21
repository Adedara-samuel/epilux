'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/Components/ui/button';
import { AuthShell } from '@/Components/auth/auth-shell';
import { homePathForRole } from '@/lib/auth-session';

// Accounts are active as soon as they are created, so there is nothing to
// verify. Signed-in users continue to their home page.
export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, initializing } = useAuth();

    useEffect(() => {
        if (!initializing && user) router.replace(homePathForRole(user.role));
    }, [user, initializing, router]);

    return (
        <AuthShell title="Your account is ready">
            <div className="text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/10 text-success">
                    <BadgeCheck className="size-8" />
                </span>
                <p className="mt-5 text-muted-foreground">
                    Epilux accounts are active as soon as you sign up. Sign in to start ordering.
                </p>
                <Button asChild variant="brand" size="lg" className="mt-6 w-full rounded-xl">
                    <Link href="/login">Sign in</Link>
                </Button>
            </div>
        </AuthShell>
    );
}
