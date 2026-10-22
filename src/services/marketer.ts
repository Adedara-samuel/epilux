import { api } from './base';

// An order assigned to the logged in marketer (GET /api/marketer/orders)
export interface Order {
  _id: string;
  orderNumber: string;
  status: 'assigned' | 'processing' | 'pending' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  totalAmount: number;
  deliveryFee?: number;
  paymentMethod?: string;
  isPaid?: boolean;
  items: Array<{
    productId?: string;
    name: string;
    quantity: number;
    price: number;
    image?: string | null;
  }>;
  customer: {
    name: string;
    phone?: string;
    email?: string;
  };
  shippingAddress?: {
    address?: string;
    city?: string;
    state?: string;
    landmark?: string;
    deliveryInstructions?: string;
  };
  assignedAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  customerConfirmed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketerStats {
  totalOrders: number;
  pending: number;
  inTransit: number;
  delivered: number;
  completed: number;
  cancelled: number;
}

export type MarketerAction = 'in_transit' | 'delivered' | 'declined';

export const marketerAPI = {
  // Get assigned orders for the marketer
  getOrders: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/api/marketer/orders', { params });
    return (response.data.data || []) as Order[];
  },

  // Get single order details
  getOrder: async (id: string) => {
    const response = await api.get(`/api/marketer/orders/${id}`);
    return response.data.data;
  },

  // Start a delivery, mark it delivered, or decline it (it is passed to another marketer)
  updateOrderStatus: async (id: string, status: MarketerAction, note?: string) => {
    const response = await api.put(`/api/marketer/orders/${id}/status`, { status, note });
    return response.data as { success: boolean; message: string };
  },

  // Get dashboard stats
  getStats: async (): Promise<MarketerStats> => {
    const response = await api.get('/api/marketer/dashboard'); // Updated to standard endpoint
    return response.data.data;
  },

  // Admin: Get all marketers with their assigned products
  getAllMarketers: async () => {
    const response = await api.get('/api/marketer/admin/marketers');
    return response.data.data;
  },

  // Admin: Get single marketer by ID
  getMarketer: async (id: string) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data.data || response.data.user;
  },

  // Admin: Get orders assigned to a marketer
  getMarketerOrders: async (id: string) => {
    const response = await api.get('/api/admin/orders');
    const orders = response.data.orders || response.data.data || [];
    return orders.filter((order: { marketer?: string | { _id: string } }) =>
      (typeof order.marketer === 'string' ? order.marketer : order.marketer?._id) === id
    );
  },

  // Admin: Get a marketer's commission records
  getMarketerCommissions: async (id: string) => {
    const response = await api.get('/api/commission/admin/commissions', { params: { userId: id } });
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
    const response = await api.post('/api/admin/users', { ...marketerData, role: 'marketer' });
    return response.data;
  },

  // Admin: Update marketer details (role changes go through the role endpoint)
  updateMarketer: async (id: string, updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    isActive?: boolean;
  }) => {
    const response = await api.put(`/api/admin/users/${id}`, updateData);
    return response.data;
  },

  // Admin: Delete marketer account
  deleteMarketer: async (id: string) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  // Admin: Assign a product to a marketer
  assignProduct: async (productId: string, marketerId: string) => {
    const response = await api.post('/api/marketer/admin/assign-product', { productId, marketerId });
    return response.data;
  },
};