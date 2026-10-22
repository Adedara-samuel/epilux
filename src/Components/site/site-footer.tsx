/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Facebook, Instagram, Mail, MessageCircle, Send, Twitter, Youtube } from 'lucide-react';

const COLUMNS = [
    { title: 'Shop', links: [{ href: '/products', label: 'All water' }, { href: '/offers', label: 'Offers' }, { href: '/bulk-sales', label: 'Bulk orders' }, { href: '/subscriptions', label: 'Regular delivery' }] },
    { title: 'Earn', links: [{ href: '/affiliate-reg', label: 'Refer & earn' }, { href: '/products/wallet', label: 'Your wallet' }, { href: '/reseller', label: 'Resell Epilux' }] },
    { title: 'Company', links: [{ href: '/about', label: 'About us' }, { href: '/contact-us', label: 'Contact' }, { href: '/account/help', label: 'Help centre' }] },
];

const SOCIAL = [
    { href: 'https://wa.me/2349136274739?text=Hello%20I%20am%20interested%20in%20Epilux%20Premium%20Products', label: 'WhatsApp', icon: MessageCircle },
    { href: 'https://www.instagram.com/epilux_industries.NG', label: 'Instagram', icon: Instagram },
    { href: 'https://www.facebook.com/share/17UnVMTq9d/', label: 'Facebook', icon: Facebook },
    { href: 'https://x.com/Epilux_NG', label: 'X (Twitter)', icon: Twitter },
    { href: 'https://www.youtube.com/EpiluxNg', label: 'YouTube', icon: Youtube },
    { href: 'https://t.me/EpiluxindustriesNG', label: 'Telegram', icon: Send },
];

export default function SiteFooter() {
    return (
        <footer className="border-t border-border/70 bg-card">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-8">
                <div>
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <span className="grid size-10 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-border/70"><img src="/images/logo.png" alt="" className="size-8 object-contain" /></span>
                        <span className="font-display text-lg font-bold">Epilux <span className="text-primary">Water</span></span>
                    </Link>
                    <p className="mt-4 max-w-sm text-sm text-muted-foreground">Premium sachet and bottled water, delivered to your door by local marketers, with a reward on every order.</p>
                    <a href="mailto:epiluxcompany@gmail.com" className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:text-primary"><Mail className="size-4" /> epiluxcompany@gmail.com</a>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {SOCIAL.map(({ href, label, icon: Icon }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                                className="grid size-10 place-items-center rounded-xl border border-border/70 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
                                <Icon className="size-4" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <p className="text-sm font-semibold">{col.title}</p>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link></li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-border/60">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>© {new Date().getFullYear()} Epilux Water. All rights reserved.</p>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Payments secured by Flutterwave</span>
                        <span aria-hidden className="hidden sm:inline">·</span>
                        <a href="https://sapoktech.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline">
                            Developed by Sapok
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
