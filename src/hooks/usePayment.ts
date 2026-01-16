// src/hooks/usePayment.ts
import { useMutation } from '@tanstack/react-query';
import { paymentAPI } from '@/services';

// Hook for initializing payment
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: ({ orderId, paymentData }: {
      orderId: string;
      paymentData: {
        items: Array<{
          product: string;
          quantity: number;
          price: number;
        }>;
        shippingAddress: {
          address: string;
          city: string;
          state: string;
          country: string;
        };
        customerInfo: {
          name: string;
          phone: string;
          email: string;
        };
        paymentMethod: string;
        totalAmount: number;
      };
    }) => paymentAPI.initializePayment(orderId, paymentData),
  });
};