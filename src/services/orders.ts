// src/services/orders.ts
import { api } from './base';

export interface CreateOrderInput {
  items: { product: string; quantity: number }[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country?: string;
    zipCode?: string;
    landmark?: string;
    deliveryInstructions?: string;
  };
  paymentMethod: 'card' | 'bank_transfer' | 'cash_on_delivery' | 'wallet' | 'flutterwave';
  notes?: string;
}

// Public Orders API functions
export const ordersAPI = {
  // Get user's orders
  getOrders: async () => {
    const response = await api.get('/api/orders/my-orders');
    return response.data;
  },

  // Get single order by ID (owner, assigned marketer or admin)
  getOrder: async (id: string) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Create new order. Prices, delivery fee and total are calculated by the server.
  createOrder: async (orderData: CreateOrderInput) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  // Cancel order (only unpaid orders that haven't shipped)
  cancelOrder: async (id: string, reason?: string) => {
    const response = await api.patch(`/api/orders/${id}/cancel`, { reason });
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
  updateOrderStatus: async (id: string, status: string, note?: string) => {
    const response = await api.put(`/api/admin/orders/${id}/status`, { status, note });
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
  // Confirm the order was received (completes it and releases commission)
  confirmReceipt: async (id: string) => {
    const response = await api.post(`/api/orders/${id}/confirm`);
    return response.data;
  },

  // Rate a product from a delivered order
  rateProduct: async (id: string, productId: string, rating: number, review?: string) => {
    const response = await api.post(`/api/orders/${id}/products/${productId}/rate`, {
      rating,
      review
    });
    return response.data;
  },

  // Rate the delivery / marketer for an order
  rateMarketer: async (id: string, rating: number, review?: string) => {
    const response = await api.post(`/api/deliveries/orders/${id}/rate`, {
      rating,
      comment: review
    });
    return response.data;
  },

  // Start an online payment for an order; the amount is the order total
  payOrder: async (id: string, customer?: { email?: string; phone?: string; name?: string }) => {
    const response = await api.post(`/api/flutterwave/initialize/${id}`, customer || {});
    return response.data;
  },
};
