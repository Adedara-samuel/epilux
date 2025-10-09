// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI, adminOrdersAPI } from '@/services';

// Public order hooks
// Hook for getting user's orders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getOrders(),
  });
};

// Alias for useOrders
export const useMyOrders = useOrders;

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
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Hook for canceling order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersAPI.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
};

// Admin order hooks
// Hook for getting all orders (admin)
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminOrdersAPI.getOrders(),
  });
};

// Hook for getting single order (admin)
export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => adminOrdersAPI.getOrder(id),
    enabled: !!id,
  });
};

// Hook for updating order status (admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminOrdersAPI.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order'] });
    },
  });
};

// Hook for getting order stats (admin)
export const useOrderStats = () => {
  return useQuery({
    queryKey: ['admin', 'orders', 'stats'],
    queryFn: () => adminOrdersAPI.getOrderStats(),
  });
};