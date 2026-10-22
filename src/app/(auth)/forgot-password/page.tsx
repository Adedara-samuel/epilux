'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ArrowRight, Mail, MailCheck } from 'lucide-react';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { AuthShell, Field, IconInputWrapper } from '@/Components/auth/auth-shell';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sentTo, setSentTo] = useState('');
    const forgotPassword = useForgotPassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }
        forgotPassword.mutate({ email: email.trim() }, {
            onSuccess: () => setSentTo(email.trim()),
            onError: (err: Error) => setError(err.message || 'We could not send the reset link. Please try again.'),
        });
    };

    return (
        <AuthShell
            title={sentTo ? 'Check your inbox' : 'Forgot your password?'}
            subtitle={sentTo ? undefined : "Enter your email and we'll send you a link to reset it."}
            footer={
                <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline">
                    <ArrowLeft className="size-4" /> Back to sign in
                </Link>
            }
        >
            {sentTo ? (
                <div className="animate-fade-in text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/10 text-success">
                        <MailCheck className="size-8" />
                    </span>
                    <p className="mt-5 text-muted-foreground">
                        If an account exists for <span className="font-semibold text-foreground">{sentTo}</span>, a password reset link is on its way. It expires in 1 hour.
                    </p>
                    <Button variant="outline" size="lg" className="mt-6 w-full rounded-xl" onClick={() => setSentTo('')}>
                        Use a different email
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {error && (
                        <div className="animate-shake flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-sm text-destructive" role="alert">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    <Field label="Email address" htmlFor="email">
                        <IconInputWrapper icon={Mail}>
                            <Input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 rounded-xl pl-11" />
                        </IconInputWrapper>
                    </Field>
                    <Button type="submit" variant="brand" size="xl" className="group w-full rounded-xl" loading={forgotPassword.isPending} disabled={!email}>
                        {forgotPassword.isPending ? 'Sending…' : (
                            <>
                                Send reset link
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </>
                        )}
                    </Button>
                </form>
            )}
        </AuthShell>
    );
}
