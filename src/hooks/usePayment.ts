// src/hooks/usePayment.ts
import { useMutation } from '@tanstack/react-query';
import { paymentAPI } from '@/services';

// Hook for creating an order
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (orderData: {
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
      paymentMethod: string;
      customerInfo: {
        name: string;
        phone: string;
        email: string;
      };
      totalAmount: number;
    }) => paymentAPI.createOrder(orderData),
  });
};

// Hook for initializing payment
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: ({ orderId, paymentData }: {
      orderId: string;
      paymentData: {
        // duplicate of service shape including required extras
        amount: number;
        email: string;
        phone: string;
        name: string;

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