import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/services/admin';
import { useAuth } from './useAuth';

export const useAdminUsers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminAPI.getUsers(user?.token || ''),
    enabled: !!user?.token && user.role === 'admin',
  });
};

export const useAdminUser = (id: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminAPI.getUser(user?.token || '', id),
    enabled: !!user?.token && user.role === 'admin' && !!id,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminAPI.updateUserRole(user?.token || '', id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteUser(user?.token || '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminDashboardStats = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => adminAPI.getDashboardStats(user?.token || ''),
    enabled: !!user?.token && user.role === 'admin',
  });
};

export const useAdminRecentUsers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin', 'users', 'recent'],
    queryFn: () => adminAPI.getRecentUsers(user?.token || ''),
    enabled: !!user?.token && user.role === 'admin',
  });
};