// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminStats from '@/Components/admin/admin-stats';
import SalesOverview from '@/Components/admin/SalesOverview';
import InventoryStatus from '@/Components/admin/InventoryStatus';
import RecentOrders from '@/Components/admin/RecentOrders';
import TopAffiliates from '@/Components/admin/TopAffiliates';
import { useAdminDashboardStats } from '@/hooks/useAdmin';
import { useProducts } from '@/hooks/useProducts';

// TODO: Implement orders and affiliates APIs

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const { data: statsData } = useAdminDashboardStats();
    const { data: productsData } = useProducts({ limit: 20 });

    const stats = statsData?.stats;
    const products = productsData?.products || [];

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'admin') {
            router.push('/');
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
                    totalSales={stats?.totalOrders || 0}
                    totalRevenue={stats?.totalRevenue || 0}
                    activeAffiliates={stats?.activeUsers || 0}
                    pendingOrders={stats?.recentOrders || 0}
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
                <RecentOrders orders={[]} /> {/* Need to implement orders API */}
                <TopAffiliates affiliates={[]} /> {/* Need to implement affiliates API */}
            </div>
        </div>
    );
}