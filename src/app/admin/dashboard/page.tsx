// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { products } from '@/types/product';
import AdminStats from '@/Components/admin/admin-stats';
import SalesOverview from '@/Components/admin/SalesOverview';
import InventoryStatus from '@/Components/admin/InventoryStatus';
import RecentOrders from '@/Components/admin/RecentOrders';
import TopAffiliates from '@/Components/admin/TopAffiliates';

// Define the Order type with specific status values
type Order = {
    id: string;
    customer: string;
    amount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: string;
};

type Affiliate = {
    name: string;
    sales: number;
    commission: number;
};

// Mock data with proper typing
const mockOrders: Order[] = [
    { id: 'ORD-1001', customer: 'John Doe', amount: 12500, status: 'Delivered', date: '2023-10-15' },
    { id: 'ORD-1002', customer: 'Jane Smith', amount: 8500, status: 'Processing', date: '2023-10-14' },
    { id: 'ORD-1003', customer: 'Adeola Johnson', amount: 21000, status: 'Shipped', date: '2023-10-14' },
    { id: 'ORD-1004', customer: 'Michael Brown', amount: 17500, status: 'Delivered', date: '2023-10-13' },
    { id: 'ORD-1005', customer: 'Sarah Williams', amount: 9200, status: 'Cancelled', date: '2023-10-12' },
];

const mockAffiliates: Affiliate[] = [
    { name: 'David Wilson', sales: 1250, commission: 62500 },
    { name: 'Grace Adebayo', sales: 980, commission: 49000 },
    { name: 'James Johnson', sales: 750, commission: 37500 },
    { name: 'Patricia Davis', sales: 620, commission: 31000 },
    { name: 'Robert Miller', sales: 580, commission: 29000 },
];

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [user, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-epilux-blue"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-epilux-blue mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminStats
                    totalSales={12500}
                    totalRevenue={4375000}
                    activeAffiliates={85}
                    pendingOrders={12}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <SalesOverview />
                </div>
                <div>
                    <InventoryStatus products={products} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders orders={mockOrders} />
                <TopAffiliates affiliates={mockAffiliates} />
            </div>
        </div>
    );
}