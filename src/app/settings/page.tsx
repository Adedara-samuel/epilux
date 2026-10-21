'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, KeyRound, MapPin, ShieldAlert, Trash2, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChangePassword, useUpdateProfile } from '@/hooks/useUser';
import { useAddAddress, useAddresses, useDeleteAddress } from '@/hooks/useAddresses';
import { userAPI } from '@/services/user';
import { getErrorMessage } from '@/services/base';
import { authSession } from '@/lib/auth-session';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { PageHeader, Panel, PanelHeader } from '@/Components/ui/kit';

const STATES = [
    'Abia', 'Abuja (FCT)', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi',
    'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

function Field({ id, label, children, hint }: { id: string; label: string; children: React.ReactNode; hint?: string }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

function ProfileTab() {
    const { user, updateUser } = useAuth();
    const update = useUpdateProfile();
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });

    useEffect(() => {
        if (user) setForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.profile?.phone || '' });
    }, [user]);

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) return toast.error('Please enter your first and last name');
        update.mutate({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), phone: form.phone.trim() }, {
            onSuccess: () => {
                updateUser({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), profile: { ...(user?.profile || {}), phone: form.phone.trim() } });
                toast.success('Profile updated');
            },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not update your profile')),
        });
    };

    return (
        <Panel>
            <PanelHeader title="Personal details" description="Your name and phone are shared with your marketer for deliveries." />
            <form onSubmit={save} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <Field id="firstName" label="First name"><Input id="firstName" className="h-12 rounded-xl" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
                <Field id="lastName" label="Last name"><Input id="lastName" className="h-12 rounded-xl" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
                <Field id="email" label="Email" hint="Contact support to change your email."><Input id="email" className="h-12 rounded-xl" value={user?.email || ''} disabled /></Field>
                <Field id="phone" label="Phone number"><Input id="phone" type="tel" inputMode="tel" className="h-12 rounded-xl" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0803 123 4567" /></Field>
                <div className="sm:col-span-2"><Button type="submit" loading={update.isPending}>Save changes</Button></div>
            </form>
        </Panel>
    );
}

function AddressTab() {
    const { data, isLoading } = useAddresses();
    const save = useAddAddress();
    const remove = useDeleteAddress();
    const current = data?.addresses?.[0];
    const [form, setForm] = useState({ street: '', city: '', state: 'Lagos' });

    useEffect(() => {
        if (current) setForm({ street: current.street || '', city: current.city || '', state: current.state || 'Lagos' });
    }, [current]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.street.trim().length < 5 || form.city.trim().length < 2) return toast.error('Please enter your street and city');
        save.mutate({ street: form.street.trim(), city: form.city.trim(), state: form.state, country: 'Nigeria' }, {
            onSuccess: () => toast.success('Delivery address saved'),
            onError: (err) => toast.error(getErrorMessage(err, 'Could not save address')),
        });
    };

    return (
        <Panel>
            <PanelHeader title="Delivery address" description="Used to pre-fill checkout. You can change it for any order." />
            {isLoading ? (
                <div className="p-6"><div className="skeleton-shimmer h-40 rounded-2xl" /></div>
            ) : (
                <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <div className="sm:col-span-2"><Field id="street" label="Street address"><Input id="street" className="h-12 rounded-xl" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="House number and street" /></Field></div>
                    <Field id="city" label="City / area"><Input id="city" className="h-12 rounded-xl" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Ikeja" /></Field>
                    <Field id="state" label="State">
                        <Select value={form.state} onValueChange={(state) => setForm({ ...form, state })}>
                            <SelectTrigger id="state" className="h-12"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <div className="flex flex-wrap gap-2 sm:col-span-2">
                        <Button type="submit" loading={save.isPending}><MapPin /> Save address</Button>
                        {current && (
                            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-destructive" loading={remove.isPending}
                                onClick={() => remove.mutate('default', { onSuccess: () => { toast.success('Address removed'); setForm({ street: '', city: '', state: 'Lagos' }); } })}>
                                Remove
                            </Button>
                        )}
                    </div>
                </form>
            )}
        </Panel>
    );
}

function PasswordTab() {
    const change = useChangePassword();
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
    const [show, setShow] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
        if (form.newPassword !== form.confirm) return toast.error('New passwords do not match');
        if (form.newPassword === form.currentPassword) return toast.error('Choose a password different from your current one');
        change.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword }, {
            onSuccess: () => { toast.success('Password changed'); setForm({ currentPassword: '', newPassword: '', confirm: '' }); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not change password')),
        });
    };

    const type = show ? 'text' : 'password';
    return (
        <Panel>
            <PanelHeader title="Change password" action={
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide passwords' : 'Show passwords'}>{show ? <EyeOff /> : <Eye />}</Button>
            } />
            <form onSubmit={submit} className="grid max-w-xl gap-4 p-5 sm:p-6">
                <Field id="current" label="Current password"><Input id="current" type={type} autoComplete="current-password" className="h-12 rounded-xl" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} /></Field>
                <Field id="new" label="New password"><Input id="new" type={type} autoComplete="new-password" className="h-12 rounded-xl" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} /></Field>
                <Field id="confirm" label="Confirm new password"><Input id="confirm" type={type} autoComplete="new-password" className="h-12 rounded-xl" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></Field>
                <div><Button type="submit" loading={change.isPending}><KeyRound /> Update password</Button></div>
            </form>
        </Panel>
    );
}

function AccountTab() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const del = useMutation({
        mutationFn: userAPI.deleteAccount,
        onSuccess: () => {
            authSession.clear();
            toast.success('Your account has been deleted');
            router.replace('/');
            window.location.reload();
        },
        onError: (err) => { toast.error(getErrorMessage(err, 'Could not delete your account')); setOpen(false); },
    });

    return (
        <Panel className="border-destructive/30">
            <PanelHeader title="Delete account" description="Permanently remove your account and personal data." />
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <p className="flex items-start gap-3 text-sm text-muted-foreground">
                    <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                    You can delete your account once your wallet is empty and you have no deliveries in progress. This can&apos;t be undone.
                </p>
                <Button variant="destructive" onClick={() => setOpen(true)}><Trash2 /> Delete account</Button>
            </div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                        <AlertDialogDescription>Your profile, saved address and order history will be removed permanently.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep my account</AlertDialogCancel>
                        <Button variant="destructive" onClick={() => del.mutate()} loading={del.isPending}>Delete permanently</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Panel>
    );
}

function SettingsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get('tab') || 'profile';

    return (
        <div className="max-w-4xl">
            <PageHeader title="Settings" description="Manage your profile, address and security." />
            <Tabs value={tab} onValueChange={(t) => router.replace(`/settings?tab=${t}`, { scroll: false })}>
                <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
                    <TabsList>
                        <TabsTrigger value="profile"><User /> Profile</TabsTrigger>
                        <TabsTrigger value="address"><MapPin /> Address</TabsTrigger>
                        <TabsTrigger value="password"><KeyRound /> Password</TabsTrigger>
                        <TabsTrigger value="account"><ShieldAlert /> Account</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="profile"><ProfileTab /></TabsContent>
                <TabsContent value="address"><AddressTab /></TabsContent>
                <TabsContent value="password"><PasswordTab /></TabsContent>
                <TabsContent value="account"><AccountTab /></TabsContent>
            </Tabs>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={null}>
            <SettingsContent />
        </Suspense>
    );
}
