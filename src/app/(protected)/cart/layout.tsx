import type { Metadata } from 'next';
import AppShell from '@/Components/layout/app-shell';

export const metadata: Metadata = {
    title: 'Your cart',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
