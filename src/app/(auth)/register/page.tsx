'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, Gift, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { AuthShell, Field, IconInputWrapper } from '@/Components/auth/auth-shell';
import { homePathForRole, safeRedirectPath } from '@/lib/auth-session';
import { cn } from '@/lib/utils';

// Accept 0803..., 803..., +234803... and 234803...; send the local 0-prefixed form
const normalizePhone = (value: string) => {
    const digits = value.replace(/[^\d+]/g, '');
    if (digits.startsWith('+234')) return `0${digits.slice(4)}`;
    if (digits.startsWith('234') && digits.length === 13) return `0${digits.slice(3)}`;
    if (/^[789]\d{9}$/.test(digits)) return `0${digits}`;
    return digits;
};

const isValidPhone = (value: string) => /^0[789][01]\d{8}$/.test(normalizePhone(value));

const passwordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
};

const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-destructive', 'bg-destructive', 'bg-warning', 'bg-brand-500', 'bg-success'];

function RegisterForm() {
    const { user, initializing, register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const refFromLink = (searchParams.get('ref') || '').trim();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        referralCode: refFromLink,
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (refFromLink) setForm((f) => ({ ...f, referralCode: refFromLink }));
    }, [refFromLink]);

    // Signed in (including right after sign-up): continue
    useEffect(() => {
        if (initializing || !user) return;
        const home = homePathForRole(user.role);
        router.replace(redirect ? safeRedirectPath(redirect, home) : home);
    }, [user, initializing, redirect, router]);

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        if (form.firstName.trim().length < 2) e.firstName = 'Enter your first name';
        if (form.lastName.trim().length < 2) e.lastName = 'Enter your last name';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
        if (!isValidPhone(form.phone)) e.phone = 'Enter a valid Nigerian phone number, e.g. 0803 123 4567';
        if (form.password.length < 6) e.password = 'Use at least 6 characters';
        if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
        return e;
    }, [form]);

    const strength = passwordStrength(form.password);
    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const blur = (key: string) => () => setTouched((t) => ({ ...t, [key]: true }));
    const show = (key: string) => (touched[key] ? errors[key] : undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setTouched({ firstName: true, lastName: true, email: true, phone: true, password: true, confirmPassword: true });
        if (Object.keys(errors).length > 0) return;

        register.mutate({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: normalizePhone(form.phone),
            password: form.password,
            ...(form.referralCode.trim() ? { referralCode: form.referralCode.trim() } : {}),
        }, {
            onSuccess: (data) => toast.success(`Welcome to Epilux${data.user?.firstName ? `, ${data.user.firstName}` : ''}!`),
            onError: (err) => setError(err.message || 'Registration failed. Please try again.'),
        });
    };

    return (
        <AuthShell
            wide
            title="Create your account"
            subtitle="Join Epilux to order water and earn on every purchase."
            footer={
                <>
                    Already have an account?{' '}
                    <Link href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'} className="font-semibold text-white underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                    <div className="animate-shake flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-sm text-destructive" role="alert">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {refFromLink && (
                    <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 p-3 text-sm">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-success/15 text-success"><Gift className="size-4" /></span>
                        <p className="text-foreground/80">You were invited by a friend. Your referral is applied automatically.</p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" htmlFor="firstName" error={show('firstName')}>
                        <IconInputWrapper icon={User}>
                            <Input id="firstName" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} onBlur={blur('firstName')} placeholder="Ada" className="h-12 rounded-xl pl-11" aria-invalid={!!show('firstName')} />
                        </IconInputWrapper>
                    </Field>
                    <Field label="Last name" htmlFor="lastName" error={show('lastName')}>
                        <IconInputWrapper icon={User}>
                            <Input id="lastName" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} onBlur={blur('lastName')} placeholder="Okafor" className="h-12 rounded-xl pl-11" aria-invalid={!!show('lastName')} />
                        </IconInputWrapper>
                    </Field>
                </div>

                <Field label="Email address" htmlFor="email" error={show('email')}>
                    <IconInputWrapper icon={Mail}>
                        <Input id="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} onBlur={blur('email')} placeholder="you@example.com" className="h-12 rounded-xl pl-11" aria-invalid={!!show('email')} />
                    </IconInputWrapper>
                </Field>

                <Field label="Phone number" htmlFor="phone" error={show('phone')} hint="We'll use this to coordinate your deliveries.">
                    <IconInputWrapper icon={Phone}>
                        <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} onBlur={blur('phone')} placeholder="0803 123 4567" className="h-12 rounded-xl pl-11" aria-invalid={!!show('phone')} />
                    </IconInputWrapper>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Password" htmlFor="password" error={show('password')}>
                        <IconInputWrapper icon={Lock}>
                            <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={set('password')} onBlur={blur('password')} placeholder="At least 6 characters" className="h-12 rounded-xl pl-11 pr-12" aria-invalid={!!show('password')} />
                            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                            </button>
                        </IconInputWrapper>
                    </Field>
                    <Field label="Confirm password" htmlFor="confirmPassword" error={show('confirmPassword')}>
                        <IconInputWrapper icon={Lock}>
                            <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} onBlur={blur('confirmPassword')} placeholder="Repeat password" className="h-12 rounded-xl pl-11" aria-invalid={!!show('confirmPassword')} />
                            {form.confirmPassword && form.confirmPassword === form.password && (
                                <Check className="absolute right-3.5 top-1/2 size-[18px] -translate-y-1/2 text-success" />
                            )}
                        </IconInputWrapper>
                    </Field>
                </div>

                {form.password && (
                    <div className="animate-fade-in space-y-1.5" aria-live="polite">
                        <div className="flex gap-1.5">
                            {[0, 1, 2, 3].map((i) => (
                                <span key={i} className={cn('h-1.5 flex-1 rounded-full bg-muted transition-colors duration-300', i < strength && strengthColors[strength])} />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Password strength: <span className="font-semibold text-foreground">{strengthLabels[strength]}</span></p>
                    </div>
                )}

                <Field label="Referral code (optional)" htmlFor="referralCode" hint={refFromLink ? undefined : 'Have a code from a friend? Enter it here.'}>
                    <IconInputWrapper icon={Gift}>
                        <Input id="referralCode" value={form.referralCode} onChange={set('referralCode')} readOnly={!!refFromLink} placeholder="e.g. 115251E20BF2" className={cn('h-12 rounded-xl pl-11 uppercase tracking-wider', refFromLink && 'bg-muted')} />
                    </IconInputWrapper>
                </Field>

                <Button type="submit" variant="brand" size="xl" className="group mt-2 w-full rounded-xl" loading={register.isPending}>
                    {register.isPending ? 'Creating your account…' : (
                        <>
                            Create account
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                    )}
                </Button>
            </form>
        </AuthShell>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterForm />
        </Suspense>
    );
}
