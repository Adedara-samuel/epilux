import { api } from './base';

export interface Order {
  _id: string;
  orderNumber: string;
  // Backend returns a customer object, updated from string
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  customerPhone?: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  // Added 'assigned' to match your debug log statuses
  status: 'assigned' | 'pending' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  deliveryTime?: string;
  coordinates?: {
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
    // Fix: access response.data.data to unwrap backend nesting
    return response.data.data;
  },

  // Get single order details
  getOrder: async (id: string) => {
    const response = await api.get(`/api/marketer/orders/${id}`);
    return response.data.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/marketer/orders/${id}/status`, { status });
    return response.data; // Usually response status is at root
  },

  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/api/marketer/dashboard'); // Updated to standard endpoint
    return response.data.data;
  },

  // Admin: Get all marketers
  getAllMarketers: async () => {
    const response = await api.get('/api/marketers');
    return response.data.data;
  },

  // Admin: Get single marketer by ID
  getMarketer: async (id: string) => {
    const response = await api.get(`/api/marketers/${id}`);
    return response.data.data;
  },

  // Admin: Get marketer's orders
  getMarketerOrders: async (id: string) => {
    const response = await api.get(`/api/marketers/${id}/orders`);
    return response.data.data;
  },

  // Admin: Get marketer's commissions
  getMarketerCommissions: async (id: string) => {
    const response = await api.get(`/api/marketers/${id}/commissions`);
    return response.data.data;
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