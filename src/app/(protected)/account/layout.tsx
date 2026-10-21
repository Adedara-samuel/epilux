import type { Metadata } from 'next';
import AppShell from '@/Components/layout/app-shell';

export const metadata: Metadata = {
    title: 'My account',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
