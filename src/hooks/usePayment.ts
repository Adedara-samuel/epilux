// src/hooks/usePayment.ts
import { useMutation } from '@tanstack/react-query';
import { paymentAPI } from '@/services';

// Hook for initializing payment
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: ({ orderId, paymentData }: {
      orderId: string;
      paymentData: { amount: number };
    }) => paymentAPI.initializePayment(orderId, paymentData),
  });
};