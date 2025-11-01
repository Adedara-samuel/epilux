// src/services/orders.ts
import { api } from './base';

// Public Orders API functions
export const ordersAPI = {
  // Get user's orders
  getOrders: async () => {
    const response = await api.get('/api/orders/my-orders');
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

// User Order Actions API functions
export const orderActionsAPI = {
  // Confirm order receipt
  confirmReceipt: async (id: string) => {
    const response = await api.put(`/api/orders/${id}/confirm-receipt`);
    return response.data;
  },

  // Rate product
  rateProduct: async (id: string, productId: string, rating: number, review?: string) => {
    const response = await api.post(`/api/orders/${id}/rate-product`, {
      productId,
      rating,
      review
    });
    return response.data;
  },

  // Rate marketer
  rateMarketer: async (id: string, rating: number, review?: string) => {
    const response = await api.post(`/api/orders/${id}/rate-marketer`, {
      rating,
      review
    });
    return response.data;
  },

  // Process order payment
  payOrder: async (id: string, paymentData: {
    reference: string;
    amount: number;
    paymentMethod: string;
  }) => {
    const response = await api.post(`/api/orders/${id}/pay`, paymentData);
    return response.data;
  },
};