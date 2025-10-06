'use client';

import { SearchProvider } from '@/app/context/search-context';
import Header from '@/Components/layout/header';
import ClientSidebarWrapper from '@/Components/layout/client-sibar-wraper';

export const dynamic = 'force-dynamic';

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SearchProvider>
            <div className="flex flex-col min-h-screen">
                <div className="flex flex-1">
                    <ClientSidebarWrapper />

                    <main className="flex-1 lg:ml-64">
                        <Header />
                        {children}
                    </main>
                </div>
            </div>
        </SearchProvider>
    );
}