import { Metadata } from 'next';
import { SearchProvider } from '@/app/context/search-context';
import Header from '@/Components/layout/header';
import ClientSidebarWrapper from '@/Components/layout/client-sibar-wraper';

export const metadata: Metadata = {
    title: 'All Products | Epilux Water - Order Premium Water',
    description: 'Browse and order from our wide range of premium sachet water, bottled water, dispensers, and accessories.',
};

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
                    
                    <main className="app-content flex-1 lg:ml-64 overflow-y-auto">
                        <Header />
                        {children}
                    </main>
                </div>
            </div>
        </SearchProvider>
    );
}