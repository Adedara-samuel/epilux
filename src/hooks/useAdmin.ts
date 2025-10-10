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

// Admin Users Hooks
export const useAdminUsers = (options: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', options],
    queryFn: () => adminUsersAPI.getUsers(options),
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
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => adminDashboardAPI.getStats(),
  });
};
