// src/services/orders.ts
import { api } from './base';

// Orders API functions
export const ordersAPI = {
  // Get user's orders
  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get('/api/orders/my-orders', { params });
    return response.data;
  },

  // Get single order by ID
  getOrder: async (id: string) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData: {
    items: {
      productId: string;
      quantity: number;
    }[];
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    notes?: string;
  }) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  // Get all orders (admin only)
  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/api/orders', { params });
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  // Update payment status (admin only)
  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    const response = await api.put(`/api/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  // Get order statistics (admin only)
  getOrderStats: async () => {
    const response = await api.get('/api/orders/stats/summary');
    return response.data;
  },
};