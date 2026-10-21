import type { Metadata } from 'next';
import AppShell from '@/Components/layout/app-shell';

export const metadata: Metadata = {
    title: 'Settings',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
