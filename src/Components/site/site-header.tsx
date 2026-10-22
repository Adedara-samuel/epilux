/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { homePathForRole } from '@/lib/auth-session';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/Components/ui/sheet';
import { cn } from '@/lib/utils';

const LINKS = [
    { href: '/products', label: 'Shop' },
    { href: '/affiliate-reg', label: 'Refer & earn' },
    { href: '/bulk-sales', label: 'Bulk orders' },
    { href: '/about', label: 'About' },
    { href: '/contact-us', label: 'Contact' },
];

/** Header for the public pages (home, about, contact, programmes). */
export default function SiteHeader() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    useEffect(() => setOpen(false), [pathname]);

    const home = user ? homePathForRole(user.role) : '/register';

    return (
        <header className={cn('sticky top-0 z-40 transition-[background-color,box-shadow] duration-300', scrolled ? 'glass shadow-soft' : 'bg-background/70 backdrop-blur')}>
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="grid size-10 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-border/70">
                        <img src="/images/logo.png" alt="" className="size-8 object-contain" />
                    </span>
                    <span className="font-display text-lg font-bold tracking-tight">Epilux <span className="text-primary">Water</span></span>
                </Link>

                <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
                    {LINKS.map((l) => (
                        <Link key={l.href} href={l.href}
                            className={cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground', pathname === l.href ? 'text-primary' : 'text-muted-foreground')}>
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    {user ? (
                        <Button asChild><Link href={home}>{user.role === 'admin' ? 'Admin' : user.role === 'marketer' ? 'My deliveries' : 'My account'} <ArrowRight /></Link></Button>
                    ) : (
                        <>
                            <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/login">Sign in</Link></Button>
                            <Button asChild><Link href="/register">Get started</Link></Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button>
                </div>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="right" className="w-72 p-0">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <nav className="flex flex-col gap-1 p-4 pt-14" aria-label="Main">
                        {LINKS.map((l) => (
                            <Link key={l.href} href={l.href} className={cn('rounded-xl px-3 py-3 text-base font-medium hover:bg-muted', pathname === l.href && 'bg-accent text-primary')}>{l.label}</Link>
                        ))}
                        {!user && <Link href="/login" className="mt-2 rounded-xl px-3 py-3 text-base font-medium hover:bg-muted">Sign in</Link>}
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    );
}
