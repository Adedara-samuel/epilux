// src/services/payment.ts
import { api } from './base';

// Payment API functions
export const paymentAPI = {
  // Initialize payment for an order
  initializePayment: async (orderId: string, paymentData: {
    amount: number;
  }) => {
    const response = await api.post(`/api/payment/initialize/${orderId}`, paymentData);
    return response.data;
  },
};