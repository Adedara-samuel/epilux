'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { AuthShell, Field, IconInputWrapper } from '@/Components/auth/auth-shell';
import { homePathForRole, safeRedirectPath } from '@/lib/auth-session';

function LoginForm() {
    const { user, initializing, login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Already signed in (or just signed in): go to the right place
    useEffect(() => {
        if (initializing || !user) return;
        const home = homePathForRole(user.role);
        router.replace(redirect ? safeRedirectPath(redirect, home) : home);
    }, [user, initializing, redirect, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        login.mutate({ email: email.trim(), password }, {
            onSuccess: (data) => {
                toast.success(`Welcome back${data.user?.firstName ? `, ${data.user.firstName}` : ''}!`);
            },
            onError: (err) => setError(err.message || 'Sign in failed. Please check your details.'),
        });
    };

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to order water, track deliveries and see your earnings."
            footer={
                <>
                    New to Epilux?{' '}
                    <Link href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'} className="font-semibold text-white underline-offset-4 hover:underline">
                        Create a free account
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {error && (
                    <div className="animate-shake flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-sm text-destructive" role="alert">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Field label="Email address" htmlFor="email">
                    <IconInputWrapper icon={Mail}>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="h-12 rounded-xl pl-11"
                        />
                    </IconInputWrapper>
                </Field>

                <Field
                    label="Password"
                    htmlFor="password"
                    action={<Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>}
                >
                    <IconInputWrapper icon={Lock}>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 rounded-xl pl-11 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                        </button>
                    </IconInputWrapper>
                </Field>

                <Button
                    type="submit"
                    variant="brand"
                    size="xl"
                    className="group w-full rounded-xl"
                    loading={login.isPending}
                    disabled={!email || password.length < 6}
                >
                    {login.isPending ? 'Signing in…' : (
                        <>
                            Sign in
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                    )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    By continuing you agree to Epilux&apos;s terms of service and privacy policy.
                </p>
            </form>
        </AuthShell>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
