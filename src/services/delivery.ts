// src/services/delivery.ts
import { api } from './base';

// Delivery API functions
export const deliveryAPI = {
  // Track package by tracking number
  trackPackage: async (trackingNumber: string) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get(`/api/delivery/tracking/${trackingNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Get delivery rates
  getDeliveryRates: async () => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/api/delivery/rates', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
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
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.post('/api/delivery/estimate', estimateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};