import type { Metadata } from 'next';
import AppShell from '@/Components/layout/app-shell';

export const metadata: Metadata = {
    title: 'Shop',
    description: 'Browse and order premium sachet water, bottled water and more, delivered to your door.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
