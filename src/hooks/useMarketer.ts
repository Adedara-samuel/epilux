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