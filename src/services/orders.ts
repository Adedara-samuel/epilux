// src/services/orders.ts
import { api } from './base';

// Public Orders API functions
export const ordersAPI = {
  // Get user's orders
  getOrders: async () => {
    const response = await api.get('/api/orders');
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

  // Cancel order
  cancelOrder: async (id: string) => {
    const response = await api.put(`/api/orders/${id}/cancel`);
    return response.data;
  },
};

// Admin Orders API functions
export const adminOrdersAPI = {
  // Get all orders (admin only)
  getOrders: async () => {
    const response = await api.get('/api/admin/orders');
    return response.data;
  },

  // Get single order by ID (admin)
  getOrder: async (id: string) => {
    const response = await api.get(`/api/admin/orders/${id}`);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Get order statistics (admin only)
  getOrderStats: async () => {
    const response = await api.get('/api/admin/orders/stats');
    return response.data;
  },
};