'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { contactAPI, CONTACT_LIMITS, type InquiryType } from '@/services/contact';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

export type ExtraField =
    | { key: string; label: string; type: 'text'; placeholder?: string; required?: boolean }
    | { key: string; label: string; type: 'select'; options: string[]; required?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Enquiry form posting to /api/contact. Extra fields are written into the
 * message so admins see everything in one place (Admin → Messages → Contact form).
 */
export function InquiryForm({
    inquiryType,
    subject,
    extraFields = [],
    messageLabel = 'Message',
    messagePlaceholder = 'How can we help?',
    submitLabel = 'Send message',
    successTitle = 'Thanks, we have your message',
    successText = 'Our team usually replies within one working day.',
    subjectField = false,
}: {
    inquiryType: InquiryType;
    subject?: string;
    extraFields?: ExtraField[];
    messageLabel?: string;
    messagePlaceholder?: string;
    submitLabel?: string;
    successTitle?: string;
    successText?: string;
    /** Show a free-text subject field instead of a fixed subject */
    subjectField?: boolean;
}) {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [extras, setExtras] = useState<Record<string, string>>({});
    const [sent, setSent] = useState(false);

    // Signed-in visitors don't need to retype their details
    useEffect(() => {
        if (!user) return;
        setForm((f) => ({
            ...f,
            name: f.name || [user.firstName, user.lastName].filter(Boolean).join(' '),
            email: f.email || user.email || '',
            phone: f.phone || user.profile?.phone || '',
        }));
    }, [user]);

    const send = useMutation({
        mutationFn: contactAPI.send,
        onSuccess: () => { setSent(true); setForm((f) => ({ ...f, subject: '', message: '' })); setExtras({}); },
        onError: (err) => toast.error(getErrorMessage(err, 'Could not send your message. Please try again.')),
    });

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.name.trim().length < 2) return toast.error('Please tell us your name');
        if (!EMAIL.test(form.email.trim())) return toast.error('Please enter a valid email address');
        const missing = extraFields.find((f) => f.required && !extras[f.key]?.trim());
        if (missing) return toast.error(`Please fill in “${missing.label}”`);
        if (form.message.trim().length < 5) return toast.error('Please write a short message');

        const details = extraFields
            .filter((f) => extras[f.key]?.trim())
            .map((f) => `${f.label}: ${extras[f.key].trim()}`);
        const message = [...details, details.length ? '' : null, form.message.trim()].filter((l) => l !== null).join('\n');
        if (message.length > CONTACT_LIMITS.message) return toast.error('Your message is too long. Please shorten it.');

        send.mutate({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            subject: (subjectField ? form.subject.trim() : subject) || undefined,
            message,
            inquiryType,
        });
    };

    if (sent) {
        return (
            <div className="animate-fade-in-scale flex flex-col items-center px-6 py-12 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"><CheckCircle2 className="size-8" /></span>
                <h3 className="mt-5 text-xl font-bold">{successTitle}</h3>
                <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{successText}</p>
                <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
            <div className="space-y-1.5"><Label htmlFor="iq-name">Full name</Label><Input id="iq-name" value={form.name} onChange={set('name')} maxLength={CONTACT_LIMITS.name} autoComplete="name" className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label htmlFor="iq-phone">Phone (optional)</Label><Input id="iq-phone" type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} maxLength={CONTACT_LIMITS.phone} autoComplete="tel" placeholder="0803 123 4567" className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="iq-email">Email</Label><Input id="iq-email" type="email" value={form.email} onChange={set('email')} maxLength={CONTACT_LIMITS.email} autoComplete="email" className="h-11 rounded-xl" /></div>

            {subjectField && (
                <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="iq-subject">Subject</Label><Input id="iq-subject" value={form.subject} onChange={set('subject')} maxLength={CONTACT_LIMITS.subject} className="h-11 rounded-xl" /></div>
            )}

            {extraFields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                    <Label htmlFor={`iq-${f.key}`}>{f.label}{f.required ? '' : ' (optional)'}</Label>
                    {f.type === 'select' ? (
                        <Select value={extras[f.key] || ''} onValueChange={(v) => setExtras((x) => ({ ...x, [f.key]: v }))}>
                            <SelectTrigger id={`iq-${f.key}`} className="h-11"><SelectValue placeholder="Choose one" /></SelectTrigger>
                            <SelectContent>{f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                    ) : (
                        <Input id={`iq-${f.key}`} value={extras[f.key] || ''} onChange={(e) => setExtras((x) => ({ ...x, [f.key]: e.target.value }))} maxLength={200} placeholder={f.placeholder} className="h-11 rounded-xl" />
                    )}
                </div>
            ))}

            <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="iq-message">{messageLabel}</Label>
                <Textarea id="iq-message" rows={5} value={form.message} onChange={set('message')} maxLength={4000} placeholder={messagePlaceholder} className="rounded-xl" />
            </div>
            <div className="sm:col-span-2">
                <Button type="submit" size="lg" loading={send.isPending}><Send /> {submitLabel}</Button>
            </div>
        </form>
    );
}
