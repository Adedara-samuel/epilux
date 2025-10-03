// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '@/services';

// Hook for getting user's orders
export const useMyOrders = (params?: Parameters<typeof ordersAPI.getMyOrders>[0]) => {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => ordersAPI.getMyOrders(params),
  });
};

// Hook for getting single order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOrder(id),
    enabled: !!id,
  });
};

// Hook for creating order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersAPI.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};

// Hook for getting all orders (admin)
export const useAllOrders = (params?: Parameters<typeof ordersAPI.getAllOrders>[0]) => {
  return useQuery({
    queryKey: ['all-orders', params],
    queryFn: () => ordersAPI.getAllOrders(params),
  });
};

// Hook for updating order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersAPI.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
};

// Hook for updating payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: string }) =>
      ordersAPI.updatePaymentStatus(id, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
};

// Hook for getting order stats
export const useOrderStats = () => {
  return useQuery({
    queryKey: ['order-stats'],
    queryFn: ordersAPI.getOrderStats,
  });
};