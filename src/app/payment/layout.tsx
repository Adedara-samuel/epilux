import type { Metadata } from 'next';
import AppShell from '@/Components/layout/app-shell';

export const metadata: Metadata = {
    title: 'Payment',
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
