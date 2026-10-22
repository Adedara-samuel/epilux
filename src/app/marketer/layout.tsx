import type { Metadata } from 'next';
import AppShell from '@/Components/layout/app-shell';

export const metadata: Metadata = {
    title: 'My deliveries',
};

export default function MarketerLayout({ children }: { children: React.ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
