'use client';

import { Suspense } from 'react';
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
            <div className="app-content flex flex-col min-h-screen">
                <div className="flex flex-1">
                    <Suspense fallback={<div>Loading sidebar...</div>}>
                        <ClientSidebarWrapper />
                    </Suspense>

                    <main className="app-content flex-1 lg:ml-64 overflow-y-auto">
                        <Suspense fallback={<div>Loading header...</div>}>
                            <Header />
                        </Suspense>
                        {children}
                    </main>
                </div>
            </div>
        </SearchProvider>
    );
}