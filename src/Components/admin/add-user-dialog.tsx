'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { useCreateAdminUser } from '@/hooks/useAdmin';
import type { AssignableRole } from '@/services/admin';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';

// Everyone who shops is a customer; customers who refer friends earn from them
// without a separate role
export const ROLE_OPTIONS: { value: AssignableRole; label: string; hint: string }[] = [
    { value: 'user', label: 'Customer', hint: 'Shops, refers friends and earns rewards' },
    { value: 'marketer', label: 'Marketer', hint: 'Delivers orders; earns no rewards' },
];

export const roleLabel = (r: string) => ({ user: 'Customer', affiliate: 'Customer', marketer: 'Marketer', admin: 'Admin' }[r] || r);

/** Create a customer, affiliate or marketer account (admins are never created here). */
export function AddUserDialog({ open, onOpenChange, defaultRole = 'marketer' }: { open: boolean; onOpenChange: (o: boolean) => void; defaultRole?: AssignableRole }) {
    const create = useCreateAdminUser();
    const blank = { firstName: '', lastName: '', email: '', phone: '', password: '', role: defaultRole };
    const [form, setForm] = useState(blank);
    useEffect(() => { if (open) setForm(blank); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) return toast.error('Enter a first and last name');
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return toast.error('Enter a valid email');
        if (form.role === 'marketer' && form.phone.replace(/\D/g, '').length < 10) return toast.error('Marketers need a phone number customers can call');
        if (form.password.length < 6) return toast.error('The password must be at least 6 characters');
        create.mutate({ ...form, email: form.email.trim(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), phone: form.phone.trim() || undefined }, {
            onSuccess: () => { toast.success(`${form.firstName} can now sign in as a ${roleLabel(form.role).toLowerCase()}`); onOpenChange(false); },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not create the account')),
        });
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !create.isPending && onOpenChange(o)}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{defaultRole === 'marketer' ? 'Add a marketer' : 'Add a user'}</DialogTitle>
                        <DialogDescription>Share the temporary password with them so they can sign in and change it in Settings.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5"><Label htmlFor="nu-first">First name</Label><Input id="nu-first" value={form.firstName} onChange={set('firstName')} className="h-11 rounded-xl" /></div>
                        <div className="space-y-1.5"><Label htmlFor="nu-last">Last name</Label><Input id="nu-last" value={form.lastName} onChange={set('lastName')} className="h-11 rounded-xl" /></div>
                        <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="nu-email">Email</Label><Input id="nu-email" type="email" value={form.email} onChange={set('email')} className="h-11 rounded-xl" /></div>
                        <div className="space-y-1.5"><Label htmlFor="nu-phone">Phone</Label><Input id="nu-phone" type="tel" value={form.phone} onChange={set('phone')} className="h-11 rounded-xl" placeholder="0803 123 4567" /></div>
                        <div className="space-y-1.5"><Label htmlFor="nu-pass">Temporary password</Label><Input id="nu-pass" value={form.password} onChange={set('password')} className="h-11 rounded-xl" autoComplete="new-password" /></div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="nu-role">Role</Label>
                            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as AssignableRole }))}>
                                <SelectTrigger id="nu-role" className="h-11"><SelectValue /></SelectTrigger>
                                <SelectContent>{ROLE_OPTIONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label} · {r.hint}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={create.isPending}>Cancel</Button>
                        <Button type="submit" loading={create.isPending}><UserPlus /> Create account</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
