// src/hooks/usePayment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentAPI } from '@/services/payment';
import type { CreateOrderInput } from '@/services/orders';

// Hook for creating an order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: CreateOrderInput) => paymentAPI.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

// Hook for initializing payment
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: ({ orderId, customer }: { orderId: string; customer?: { email?: string; phone?: string; name?: string } }) =>
      paymentAPI.initializePayment(orderId, customer),
  });
};

// Hook for verifying a payment after the gateway redirect
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => paymentAPI.verifyPayment(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
};
