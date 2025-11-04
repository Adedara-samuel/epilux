// src/services/marketer.ts
import { api } from './base';

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'in_transit' | 'delivered';
  deliveryTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const marketerAPI = {
  // Get assigned orders for the marketer
  getOrders: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/marketer/orders', { params });
    return response.data;
  },

  // Get single order details
  getOrder: async (id: string) => {
    const response = await api.get(`/api/marketer/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: Order['status']) => {
    const response = await api.put(`/api/marketer/orders/${id}/status`, { status });
    return response.data;
  },

  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/api/marketer/dashboard');
    return response.data;
  },

  // Admin: Get all marketers
  getAllMarketers: async () => {
    const response = await api.get('/api/marketer');
    return response.data;
  },

  // Admin: Get single marketer by ID
  getMarketer: async (id: string) => {
    const response = await api.get(`/api/marketers/${id}`);
    return response.data;
  },

  // Admin: Get marketer's orders
  getMarketerOrders: async (id: string) => {
    const response = await api.get(`/api/marketers/${id}/orders`);
    return response.data;
  },

  // Admin: Get marketer's commissions
  getMarketerCommissions: async (id: string) => {
    const response = await api.get(`/api/marketers/${id}/commissions`);
    return response.data;
  },

  // Admin: Create new marketer
  createMarketer: async (marketerData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    const response = await api.post('/api/marketers', marketerData);
    return response.data;
  },

  // Admin: Update marketer
  updateMarketer: async (id: string, updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
  }) => {
    const response = await api.put(`/api/marketers/${id}`, updateData);
    return response.data;
  },

  // Admin: Delete marketer
  deleteMarketer: async (id: string) => {
    const response = await api.delete(`/api/marketers/${id}`);
    return response.data;
  },
};