// src/services/payment.ts
import { api } from './base';
import type { CreateOrderInput } from './orders';

export interface PaymentInitResult {
  paymentUrl: string;
  link: string;
  paymentReference: string;
  amount: number;
  publicKey?: string;
}

export interface PaymentVerifyResult {
  status: 'success' | 'failed' | 'pending';
  orderId: string;
  orderNumber: string;
  reference: string;
  amount: number;
  currency: string;
  message?: string;
}

// Payment API functions
export const paymentAPI = {
  // Create the order (prices and total are calculated by the server)
  createOrder: async (orderData: CreateOrderInput) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  // Start a Flutterwave checkout for an order; the amount is the order total
  initializePayment: async (orderId: string, customer: { email?: string; phone?: string; name?: string } = {}) => {
    const response = await api.post(`/api/flutterwave/initialize/${orderId}`, customer);
    return response.data as { success: boolean; data: PaymentInitResult };
  },

  // Confirm a payment after Flutterwave redirects back
  verifyPayment: async (transactionId: string) => {
    const response = await api.get(`/api/flutterwave/verify/${encodeURIComponent(transactionId)}`);
    return response.data as { success: boolean; data: PaymentVerifyResult };
  },
};
