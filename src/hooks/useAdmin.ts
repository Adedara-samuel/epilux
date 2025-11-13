/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/auth';
import {
  adminUsersAPI,
  adminAffiliatesAPI,
  adminCommissionsAPI,
  adminWithdrawalsAPI,
  adminSettingsAPI,
  adminDashboardAPI
} from '@/services';

interface BackendOverview {
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockProducts: number;
  activeAffiliates: number;
  changes: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeAffiliates: number;
  };
}

interface BackendRecent {
  users: any[];
  activity: any[];
}

interface BackendData {
  overview: BackendOverview;
  recent: BackendRecent;
}

interface BackendResponse {
  success: boolean;
  data: BackendData;
}
interface TransformedDashboardStats {
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

type ActivityType = 'order' | 'user' | 'product' | 'system';
type ActivityStatus = 'success' | 'info' | 'warning' | 'error';

interface TransformedRecentActivity {
  id: string | number;
  type: ActivityType;
  message: string;
  time: string;
  status: ActivityStatus;
}

interface TransformedDashboardData {
  stats: TransformedDashboardStats;
  recentActivities: TransformedRecentActivity[];
  recentUsers: any[];
}

// Admin Users Hooks
export const useAdminUsers = (options: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', options],
    queryFn: () => adminUsersAPI.getUsers(options),
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUsersAPI.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminUsersAPI.getUser(id),
    enabled: !!id,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      adminUsersAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user'] });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUsersAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminUsersAPI.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user'] });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended?: boolean }) =>
      adminUsersAPI.suspendUser(id, suspended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user'] });
    },
  });
};

// Admin Affiliates Hooks
export const useAdminAffiliates = () => {
  return useQuery({
    queryKey: ['admin', 'affiliates'],
    queryFn: () => adminAffiliatesAPI.getAffiliates(),
  });
};

export const useAdminAffiliate = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'affiliate', id],
    queryFn: () => adminAffiliatesAPI.getAffiliate(id),
    enabled: !!id,
  });
};

export const useUpdateAffiliateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminAffiliatesAPI.updateAffiliateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliates'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliate'] });
    },
  });
};

// Admin Commissions Hooks
export const useUpdateCommissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminCommissionsAPI.updateCommissionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliates'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliate'] });
    },
  });
};

// Admin Withdrawals Hooks
export const useAdminWithdrawals = () => {
  return useQuery({
    queryKey: ['admin', 'withdrawals'],
    queryFn: () => adminWithdrawalsAPI.getWithdrawals(),
  });
};

export const useUpdateWithdrawalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminWithdrawalsAPI.updateWithdrawalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    },
  });
};

// Admin Settings Hooks
export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminSettingsAPI.getSettings(),
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminSettingsAPI.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
};

// Admin Dashboard Hooks
export const useAdminDashboardStats = () => {
  return useQuery<BackendResponse, Error, TransformedDashboardData>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => adminDashboardAPI.getStats(),
    // 💡 THE FIX: Use 'select' to transform the API data structure
    select: (data) => {
      // Safely access the nested data using optional chaining
      const overview = data?.data?.overview;
      const recentActivities = data?.data?.recent?.activity;
      const recentUsers = data?.data?.recent?.users || [];

      if (!overview) {
        // Return a structure matching the component's expectations but with empty/default data
        const defaultStats: TransformedDashboardStats = {
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

        return {
          stats: defaultStats,
          recentActivities: [],
          recentUsers: [],
        };
      }

      // Map the backend structure (overview) to the component's expected structure (stats)
      const transformedStats: TransformedDashboardStats = {
        totalUsers: overview.totalUsers,
        totalProducts: overview.totalProducts,
        totalOrders: overview.totalOrders,
        totalRevenue: overview.totalRevenue,
        monthlyRevenue: overview.monthlyRevenue,
        pendingOrders: overview.pendingOrders,
        completedOrders: overview.completedOrders,
        // Mapping lowStockProducts to lowStockItems
        lowStockItems: overview.lowStockProducts,
        activeAffiliates: overview.activeAffiliates,
        changes: overview.changes,
      };

      // Map the recent.activity array to the component's expected recentActivities structure
      // NOTE: Using a simple map here. The component expects status to be 'success' | 'info' | 'warning' | 'error'
      const mappedActivities: TransformedRecentActivity[] = recentActivities
        ? recentActivities.map((act: any) => ({
          // Use act._id if it exists, otherwise generate a key
          id: act._id || act.createdAt || Math.random(),
          type: act.type || 'system',
          // Assuming a message field exists
          message: act.message || `Activity of type ${act.type || 'system'} recorded.`,
          time: act.createdAt ? new Date(act.createdAt).toLocaleTimeString() : 'just now',
          status: act.status || 'info', // Assuming status is returned by API
        }))
        : [];

      return {
        stats: transformedStats,
        recentActivities: mappedActivities,
        recentUsers: recentUsers,
      };
    },
  });
};


// Add the new types to src/hooks/useAdmin.ts alongside the existing ones

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

interface AnalyticsBackendResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    topProducts: TopProduct[];
    monthlyData: MonthlyData[];
    // ... potentially other analytics fields like conversionRate (raw data)
  }
}

interface TransformedAnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  conversionRate: string | undefined; // Calculated on client
  topProducts: TopProduct[];
  monthlyData: MonthlyData[];
}

// Admin Analytics Hook
export const useAdminAnalytics = () => {
  return useQuery<AnalyticsBackendResponse, Error, TransformedAnalyticsData>({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminDashboardAPI.getStats(), // Use the new function
    select: (data) => {
      const analyticsData = data?.data;

      // Calculate conversion rate if data is available
      const conversionRate = (analyticsData.totalOrders && analyticsData.totalUsers)
        ? ((analyticsData.totalOrders / analyticsData.totalUsers) * 100).toFixed(1)
        : undefined;

      return {
        totalRevenue: analyticsData.totalRevenue || 0,
        totalOrders: analyticsData.totalOrders || 0,
        totalUsers: analyticsData.totalUsers || 0,
        conversionRate: conversionRate,
        topProducts: analyticsData.topProducts || [],
        monthlyData: analyticsData.monthlyData || [],
      };
    },
  });
};

// NOTE: You must also ensure adminDashboardAPI.getAnalytics is defined and accessible
// in the same file where adminDashboardAPI.getStats is used.