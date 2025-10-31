// src/hooks/useMarketer.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketerAPI, Order } from '@/services/marketer';

export const useMarketerOrders = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['marketer', 'orders', params],
    queryFn: () => marketerAPI.getOrders(params),
  });
};

export const useMarketerOrder = (id: string) => {
  return useQuery({
    queryKey: ['marketer', 'order', id],
    queryFn: () => marketerAPI.getOrder(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      marketerAPI.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketer', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['marketer', 'order'] });
      queryClient.invalidateQueries({ queryKey: ['marketer', 'stats'] });
    },
  });
};

export const useMarketerStats = () => {
  return useQuery({
    queryKey: ['marketer', 'stats'],
    queryFn: () => marketerAPI.getStats(),
  });
};

// Admin hooks for marketers
export const useAllMarketers = () => {
  return useQuery({
    queryKey: ['admin', 'marketers'],
    queryFn: () => marketerAPI.getAllMarketers(),
  });
};

export const useMarketer = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'marketer', id],
    queryFn: () => marketerAPI.getMarketer(id),
    enabled: !!id,
  });
};

export const useAdminMarketerOrders = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'marketer', 'orders', id],
    queryFn: () => marketerAPI.getMarketerOrders(id),
    enabled: !!id,
  });
};

export const useAdminMarketerCommissions = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'marketer', 'commissions', id],
    queryFn: () => marketerAPI.getMarketerCommissions(id),
    enabled: !!id,
  });
};

export const useCreateMarketer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: marketerAPI.createMarketer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketers'] });
    },
  });
};

export const useUpdateMarketer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      marketerAPI.updateMarketer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketer'] });
    },
  });
};

export const useDeleteMarketer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: marketerAPI.deleteMarketer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'marketers'] });
    },
  });
};