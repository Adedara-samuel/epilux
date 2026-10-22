'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Ban, ChevronLeft, ChevronRight, MoreHorizontal, Search, ShieldCheck, Trash2, UserCog, UserPlus, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminUsers, useDeleteAdminUser, useSetUserRole, useSetUserSuspended } from '@/hooks/useAdmin';
import type { AdminUser, AssignableRole } from '@/services/admin';
import { getErrorMessage } from '@/services/base';
import { useDebounce } from '@/hooks/useDebounce';
import { AddUserDialog, ROLE_OPTIONS, roleLabel } from '@/Components/admin/add-user-dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, ErrorState, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { formatDate, fullName } from '@/lib/format';

const ROLE_TABS = [
    { value: 'all', label: 'All' },
    { value: 'user', label: 'Customers' },
    { value: 'marketer', label: 'Marketers' },
    { value: 'admin', label: 'Admins' },
];
const ROLE_TONE = { user: 'neutral', affiliate: 'neutral', marketer: 'brand', admin: 'danger' } as const;
const PAGE_SIZE = 25;

type Pending =
    | { kind: 'role'; user: AdminUser; role: AssignableRole }
    | { kind: 'suspend'; user: AdminUser }
    | { kind: 'unsuspend'; user: AdminUser }
    | { kind: 'delete'; user: AdminUser };

export default function AdminUsersPage() {
    return (
        <Suspense fallback={null}>
            <UsersContent />
        </Suspense>
    );
}

function UsersContent() {
    const { user: me } = useAuth();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role');
    const [role, setRole] = useState(initialRole && ROLE_TABS.some((t) => t.value === initialRole) ? initialRole : 'all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debounced = useDebounce(search.trim(), 350);
    useEffect(() => setPage(1), [role, debounced]);

    const { data, isLoading, isError, refetch, isFetching } = useAdminUsers({ role: role === 'all' ? undefined : role, search: debounced || undefined, page, limit: PAGE_SIZE });
    const setUserRole = useSetUserRole();
    const suspend = useSetUserSuspended();
    const remove = useDeleteAdminUser();
    const [adding, setAdding] = useState(false);
    const [pending, setPending] = useState<Pending | null>(null);
    const [reason, setReason] = useState('');

    const users = data?.users || [];
    const busy = setUserRole.isPending || suspend.isPending || remove.isPending;
    const myId = me?._id || me?.id;

    const run = () => {
        if (!pending) return;
        const done = (msg: string) => () => { toast.success(msg); setPending(null); setReason(''); };
        const fail = (fallback: string) => (err: unknown) => toast.error(getErrorMessage(err, fallback));
        const name = fullName(pending.user);
        if (pending.kind === 'role') setUserRole.mutate({ id: pending.user._id, role: pending.role }, { onSuccess: done(`${name} is now a ${roleLabel(pending.role).toLowerCase()}`), onError: fail('Could not change the role') });
        if (pending.kind === 'suspend') {
            if (reason.trim().length < 3) return toast.error('Give a short reason');
            suspend.mutate({ id: pending.user._id, suspended: true, reason: reason.trim() }, { onSuccess: done(`${name} has been suspended`), onError: fail('Could not suspend the account') });
        }
        if (pending.kind === 'unsuspend') suspend.mutate({ id: pending.user._id, suspended: false }, { onSuccess: done(`${name} can sign in again`), onError: fail('Could not reinstate the account') });
        if (pending.kind === 'delete') remove.mutate(pending.user._id, { onSuccess: done(`${name}'s account was deleted`), onError: fail('Could not delete the account') });
    };

    const dialogCopy = pending && {
        role: { title: `Make ${fullName(pending.user)} a ${pending.kind === 'role' ? roleLabel(pending.role).toLowerCase() : ''}?`, body: pending.kind === 'role' && pending.role === 'marketer' ? 'Marketers receive orders to deliver and stop earning shopping rewards.' : 'Their access changes the next time the app refreshes.', confirm: 'Change role', variant: 'default' as const },
        suspend: { title: `Suspend ${fullName(pending.user)}?`, body: "They're signed out and can't sign in until you reinstate them. Marketers stop receiving new orders.", confirm: 'Suspend', variant: 'destructive' as const },
        unsuspend: { title: `Reinstate ${fullName(pending.user)}?`, body: 'They can sign in again straight away.', confirm: 'Reinstate', variant: 'default' as const },
        delete: { title: `Delete ${fullName(pending.user)}'s account?`, body: "This can't be undone. Accounts with money in their wallet or orders in progress can't be deleted; suspend them instead.", confirm: 'Delete account', variant: 'destructive' as const },
    }[pending.kind];

    return (
        <div>
            <PageHeader title="Users" description="Customers and marketers. Any customer can refer friends." actions={<Button onClick={() => setAdding(true)}><UserPlus /> Add user</Button>} />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="-mx-4 overflow-x-auto px-4 no-scrollbar lg:mx-0 lg:px-0">
                    <Tabs value={role} onValueChange={setRole}>
                        <TabsList>{ROLE_TABS.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}</TabsList>
                    </Tabs>
                </div>
                <div className="relative lg:w-72">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or email" className="h-10 rounded-xl pl-10" aria-label="Search users" />
                </div>
            </div>

            <Panel className="mt-4 overflow-hidden">
                {isLoading ? (
                    <div className="space-y-2 p-5">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton-shimmer h-12 rounded-xl" />)}</div>
                ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : users.length === 0 ? (
                    <EmptyState icon={Users} title={debounced ? 'No matching users' : 'No users here yet'} />
                ) : (
                    <Table className={isFetching ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5 sm:pl-6">Name</TableHead>
                                <TableHead className="hidden md:table-cell">Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden sm:table-cell">Joined</TableHead>
                                <TableHead className="pr-5 text-right sm:pr-6"><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => {
                                const protectedUser = u.role === 'admin' || u._id === myId;
                                return (
                                    <TableRow key={u._id} className={u.suspended ? 'opacity-60' : undefined}>
                                        <TableCell className="pl-5 sm:pl-6">
                                            <p className="font-semibold">{fullName(u)}{u._id === myId && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>}</p>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{u.profile?.phone ? <a href={`tel:${u.profile.phone}`} className="hover:text-primary">{u.profile.phone}</a> : '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5">
                                                <Pill tone={ROLE_TONE[u.role] || 'neutral'}>{roleLabel(u.role)}</Pill>
                                                {!!u.referrals?.length && <Pill tone="info">Referred {u.referrals.length}</Pill>}
                                                {u.suspended && <Pill tone="danger" dot>Suspended</Pill>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                                        <TableCell className="pr-5 text-right sm:pr-6">
                                            {protectedUser ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="size-3.5" /> Protected</span>
                                            ) : (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${fullName(u)}`}><MoreHorizontal /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                                        {ROLE_OPTIONS.filter((r) => r.value !== u.role).map((r) => (
                                                            <DropdownMenuItem key={r.value} className="gap-2" onSelect={() => setPending({ kind: 'role', user: u, role: r.value })}>
                                                                <UserCog className="size-4" /> Make {r.label.toLowerCase()}
                                                            </DropdownMenuItem>
                                                        ))}
                                                        <DropdownMenuSeparator />
                                                        {u.suspended ? (
                                                            <DropdownMenuItem className="gap-2" onSelect={() => setPending({ kind: 'unsuspend', user: u })}><ShieldCheck className="size-4" /> Reinstate</DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="gap-2" onSelect={() => { setReason(''); setPending({ kind: 'suspend', user: u }); }}><Ban className="size-4" /> Suspend</DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem variant="destructive" className="gap-2" onSelect={() => setPending({ kind: 'delete', user: u })}><Trash2 className="size-4" /> Delete account</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}

                {data && data.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-sm sm:px-6">
                        <span className="text-muted-foreground">Page {page} of {data.pages} · {data.total} users</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page"><ChevronLeft /></Button>
                            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= data.pages} aria-label="Next page"><ChevronRight /></Button>
                        </div>
                    </div>
                )}
            </Panel>

            <AddUserDialog open={adding} onOpenChange={setAdding} defaultRole="user" />

            <AlertDialog open={!!pending} onOpenChange={(o) => !o && !busy && setPending(null)}>
                <AlertDialogContent>
                    {pending && dialogCopy && (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{dialogCopy.title}</AlertDialogTitle>
                                <AlertDialogDescription>{dialogCopy.body}</AlertDialogDescription>
                            </AlertDialogHeader>
                            {pending.kind === 'suspend' && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="suspend-reason">Reason</Label>
                                    <Textarea id="suspend-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} className="rounded-xl" />
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={busy}>Back</AlertDialogCancel>
                                <Button variant={dialogCopy.variant} onClick={run} loading={busy}>{dialogCopy.confirm}</Button>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
