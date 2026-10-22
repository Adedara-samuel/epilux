import SiteHeader from './site-header';
import SiteFooter from './site-footer';

/** Frame for public pages: site header, page content, site footer. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}

/** Standard heading block for public pages. */
export function PageHero({ eyebrow, title, description, children, align = 'left' }: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    align?: 'left' | 'center';
}) {
    const centered = align === 'center';
    return (
        <section className="relative overflow-hidden border-b border-border/60">
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 right-[-8%] size-[30rem] rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10" />
                <div className="absolute -bottom-40 left-[-8%] size-[26rem] rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
            </div>
            <div className={`relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 ${centered ? 'text-center' : ''}`}>
                {eyebrow && <p className="animate-fade-in text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
                <h1 className={`animate-fade-in mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl ${centered ? 'mx-auto' : ''}`} style={{ animationDelay: '60ms' }}>{title}</h1>
                {description && <p className={`animate-fade-in mt-5 max-w-2xl text-lg text-muted-foreground ${centered ? 'mx-auto' : ''}`} style={{ animationDelay: '120ms' }}>{description}</p>}
                {children && <div className={`animate-fade-in mt-8 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`} style={{ animationDelay: '180ms' }}>{children}</div>}
            </div>
        </section>
    );
}
