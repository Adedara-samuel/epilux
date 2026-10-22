import type { Metadata } from 'next';
import AppShell from '@/Components/layout/app-shell';

export const metadata: Metadata = {
    title: 'Checkout',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
