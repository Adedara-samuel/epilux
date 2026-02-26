// src/services/payment.ts
import { api } from './base';

// Payment API functions
export const paymentAPI = {
  // Initialize payment for an order
  initializePayment: async (orderId: string, paymentData: {
    // top‑level extras required by backend
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
  }) => {
    const response = await api.post(`/api/flutterwave/initialize/${orderId}`, paymentData);
    return response.data;
  },
}; 
