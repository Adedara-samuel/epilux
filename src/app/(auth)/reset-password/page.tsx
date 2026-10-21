'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { api, getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { AuthShell, Field, IconInputWrapper } from '@/Components/auth/auth-shell';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) return setError('Password must be at least 6 characters long');
        if (password !== confirm) return setError('Passwords do not match');

        setSubmitting(true);
        try {
            await api.post('/api/auth/reset-password', { token, password });
            setDone(true);
            toast.success('Password updated. Please sign in.');
            setTimeout(() => router.push('/login'), 2500);
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to reset password. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    const footer = (
        <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline">
            <ArrowLeft className="size-4" /> Back to sign in
        </Link>
    );

    if (!token) {
        return (
            <AuthShell title="Link not valid" footer={footer}>
                <div className="text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive"><KeyRound className="size-8" /></span>
                    <p className="mt-5 text-muted-foreground">This password reset link is missing or incomplete. Request a new one to continue.</p>
                    <Button asChild variant="brand" size="lg" className="mt-6 w-full rounded-xl">
                        <Link href="/forgot-password">Request a new link</Link>
                    </Button>
                </div>
            </AuthShell>
        );
    }

    if (done) {
        return (
            <AuthShell title="Password updated" footer={footer}>
                <div className="animate-fade-in text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/10 text-success"><Check className="size-8" /></span>
                    <p className="mt-5 text-muted-foreground">Your password has been changed. Taking you to sign in…</p>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell title="Set a new password" subtitle="Choose a strong password you haven't used before." footer={footer}>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {error && (
                    <div className="animate-shake flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-sm text-destructive" role="alert">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                <Field label="New password" htmlFor="password">
                    <IconInputWrapper icon={Lock}>
                        <Input id="password" type={show ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="h-12 rounded-xl pl-11 pr-12" />
                        <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label={show ? 'Hide password' : 'Show password'}>
                            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                        </button>
                    </IconInputWrapper>
                </Field>
                <Field label="Confirm new password" htmlFor="confirm">
                    <IconInputWrapper icon={Lock}>
                        <Input id="confirm" type={show ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className="h-12 rounded-xl pl-11" />
                    </IconInputWrapper>
                </Field>
                <Button type="submit" variant="brand" size="xl" className="w-full rounded-xl" loading={submitting}>
                    {submitting ? 'Updating…' : 'Update password'}
                </Button>
            </form>
        </AuthShell>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}
