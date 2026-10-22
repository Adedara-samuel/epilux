// src/services/delivery.ts
import { api } from './base';

// Same rule the server applies when an order is created (utils/orderPricing.js)
export const DELIVERY_FEE = 1500;
export const FREE_DELIVERY_THRESHOLD = 10000;

export const calculateDeliveryFee = (subtotal: number) =>
  subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

// Delivery API functions
export const deliveryAPI = {
  // Track an order by its order ID (public)
  trackPackage: async (orderId: string) => {
    const response = await api.get(`/api/orders/${orderId}/track`);
    return response.data;
  },

  // Delivery pricing used at checkout
  getDeliveryRates: async () => ({
    success: true,
    data: {
      standardFee: DELIVERY_FEE,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      currency: 'NGN',
    },
  }),

  // Estimate the delivery fee for a given order subtotal
  estimateDeliveryCost: async (estimateData: { subtotal?: number }) => ({
    success: true,
    data: {
      fee: calculateDeliveryFee(estimateData.subtotal || 0),
      currency: 'NGN',
    },
  }),
};
