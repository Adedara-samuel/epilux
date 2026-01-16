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
import { Badge } from '@/Components/ui/badge';
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
  XCircle, // Added for potential error status
  Calendar,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

// 1. Define the expected API Response structure (Conceptual Interface)
interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockItems: number;
  activeAffiliates: number;
  changes: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeAffiliates: number;
  };
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
  recentUsers: any[];
}

const DEFAULT_STATS: DashboardStats = {
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  pendingOrders: 0,
  completedOrders: 0,
  lowStockItems: 0,
  activeAffiliates: 0,
  changes: {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeAffiliates: 0,
  },
};

export default function AdminDashboard() {
   const { user } = useAuth();
   const router = useRouter();
   const [authLoading, setAuthLoading] = useState(true);


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
      <div className="space-y-6">
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
  const recentUsers: any[] = statsData?.recentUsers ?? [];

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white animate-bounceIn">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-blue-100 text-base animate-fadeIn animation-delay-300">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards - NOW USING API DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn animation-delay-700">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Active users
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
              In inventory
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
              {stats.changes.totalOrders !== 0 ? `${stats.changes.totalOrders > 0 ? '+' : ''}${stats.changes.totalOrders}` : 'No change'} from last month
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
              {stats.changes.totalRevenue !== 0 ? `${stats.changes.totalRevenue > 0 ? '+' : ''}₦${(stats.changes.totalRevenue / 1000000).toFixed(1)}M` : 'No change'} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(stats.monthlyRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Successfully fulfilled
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn animation-delay-900">
        {/* Quick Actions (Unchanged) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/products">
              <Button className="w-full justify-start" variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
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

        {/* Recent Users - NOW USING API DATA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.slice(0, 5).map((user, index) => (
                  <div key={user._id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'marketer' ? 'secondary' : 'outline'}>
                        {(user.role === 'affiliate' || user.role === 'user') ? 'customer' : user.role}
                      </Badge>
                      <p className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent users to display.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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