/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
// NOTE: Assuming your hook is correctly imported as useAdminDashboardStats
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { useAdminDashboardStats } from '@/hooks/useAdmin';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle // Added for potential error status
} from 'lucide-react';
import Link from 'next/link';

// 1. Define the expected API Response structure (Conceptual Interface)
interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
}

interface RecentActivity {
  id: string | number;
  type: 'order' | 'user' | 'product' | 'system';
  message: string;
  time: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

interface TransformedDashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

const DEFAULT_STATS: DashboardStats = {
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  lowStockItems: 0,
};

export default function AdminDashboard() {
   const { user } = useAuth();
   const router = useRouter();
   const [authLoading, setAuthLoading] = useState(true);

   // Add global animations
   useEffect(() => {
       const styleSheet = document.createElement('style');
       styleSheet.textContent = `
         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
         @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
         @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
         @keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

         .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
         .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
         .animate-slideUp { animation: slideUp 0.4s ease-out; }
         .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
         .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

         * { cursor: default; }
         button, a, input, textarea, select { cursor: pointer; }

         .scroll-smooth { scroll-behavior: smooth; }
         .transition-all { transition: all 0.3s ease; }
         .hover-lift { transition: transform 0.2s ease; }
         .hover-lift:hover { transform: translateY(-2px); }
         .hover-glow { transition: box-shadow 0.3s ease; }
         .hover-glow:hover { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
       `;
       document.head.appendChild(styleSheet);

       // Add smooth scrolling to body
       document.body.classList.add('scroll-smooth');

       return () => {
         document.head.removeChild(styleSheet);
         document.body.classList.remove('scroll-smooth');
       };
   }, []);

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    error
  } = useAdminDashboardStats();

  useEffect(() => {
    if (!user) {
      router.push('/admin-login');
    } else if (user.role !== 'admin') {
      router.push('/');
    } else {
      setAuthLoading(false);
    }
  }, [user, router]);

  // Combined loading state
  if (authLoading || statsLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="p-8 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Error Loading Data</h2>
        <p className="text-gray-600 mt-2">Could not fetch dashboard statistics. Please try again.</p>
        <p className="text-sm text-red-400 mt-1">Details: {error ? (error as Error).message : 'Unknown error'}</p>
      </div>
    );
  }

  // 2. Destructure data from the hook response, providing fallbacks
  const stats: DashboardStats = statsData?.stats ?? DEFAULT_STATS;
  // This line is now fixed because RecentActivity[] type is now compatible
  const recentActivities: RecentActivity[] = statsData?.recentActivities ?? [];

  // Safety check for critical data (optional, but good practice)
  if (!stats) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Missing Data</h2>
        <p className="text-gray-600 mt-2">Received unexpected data format from the server.</p>
      </div>
    );
  }


  // Helper function for activity icon
  const getActivityIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'info':
      case 'error':
        return <Clock className="w-4 h-4 text-blue-600" />; // Or adjust for error status if needed
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 md:p-6 text-white animate-bounceIn">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-blue-100 text-sm md:text-base animate-fadeIn animation-delay-300">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards - NOW USING API DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fadeIn animation-delay-700">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-fadeIn animation-delay-900">
        {/* Quick Actions (Unchanged) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/products">
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/orders">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/users">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Alerts - NOW USING API DATA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">{stats.pendingOrders} Pending Orders</p>
                <p className="text-xs text-yellow-600">Require attention</p>
              </div>
              <Link href="/admin/orders" className="ml-auto text-sm text-yellow-600 hover:text-yellow-700">View</Link>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">{stats.lowStockItems} Low Stock Items</p>
                <p className="text-xs text-red-600">Restock needed</p>
              </div>
              <Link href="/admin/products" className="ml-auto text-sm text-red-600 hover:text-red-700">View</Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity - NOW USING API DATA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity to display.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview (Unchanged, still hardcoded) */}
      <Card className="animate-fadeIn animation-delay-1100">
        <CardHeader>
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">98.5%</div>
              <p className="text-sm text-gray-600">Order Fulfillment Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">4.8</div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">2.3 days</div>
              <p className="text-sm text-gray-600">Average Delivery Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}