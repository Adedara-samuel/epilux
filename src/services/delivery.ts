// src/services/delivery.ts
import { api } from './base';

// Delivery API functions
export const deliveryAPI = {
  // Track package by tracking number
  trackPackage: async (trackingNumber: string) => {
    const response = await api.get(`/api/delivery/tracking/${trackingNumber}`);
    return response.data;
  },

  // Get delivery rates
  getDeliveryRates: async () => {
    const response = await api.get('/api/delivery/rates');
    return response.data;
  },

  // Estimate delivery cost
  estimateDeliveryCost: async (estimateData: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    destination?: string;
    carrier?: string;
  }) => {
    const response = await api.post('/api/delivery/estimate', estimateData);
    return response.data;
  },
};