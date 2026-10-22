// src/services/admin.ts
// Admin API, typed against the backend responses (epilux-backend/controllers/adminController.js,
// orderController.js, commissionAdminController.js, messageController.js, routes/contact.js).
import { api } from './base';

// 'user' is a customer. 'affiliate' only appears on old records; customers who
// refer friends earn from them without a separate role.
export type Role = 'user' | 'affiliate' | 'marketer' | 'admin';
export type AssignableRole = 'user' | 'marketer';

export interface AdminPerson {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profile?: { phone?: string };
}

export interface AdminUser extends AdminPerson {
  role: Role;
  isActive?: boolean;
  suspended?: boolean;
  suspensionReason?: string;
  emailVerified?: boolean;
  referralCode?: string;
  assignedOrdersCount?: number;
  completedOrdersCount?: number;
  referrals?: { user?: string; date?: string }[];
  createdAt: string;
  lastLogin?: string;
}

export interface DashboardStats {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    totalUsers: number;
    totalProducts: number;
    lowStockProducts: number;
    activeAffiliates: number;
    paidRevenue: number;
    paidOrders: number;
    unassignedPaidOrders: number;
    inDelivery: number;
    awaitingConfirmation: number;
    pendingWithdrawals: { count: number; amount: number };
    usersByRole: Record<string, number>;
    changes: { totalOrders: number; totalRevenue: number; pendingOrders: number; activeAffiliates: number };
  };
  recent: {
    users: AdminUser[];
    activity: AdminOrder[];
  };
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  status: string;
  isPaid?: boolean;
  paidAt?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  commissionRate?: number;
  commissionAmount?: number;
  commissionReleased?: boolean;
  customerConfirmed?: boolean;
  userId?: AdminPerson | string | null;
  buyer?: AdminPerson | string | null;
  marketer?: AdminPerson | string | null;
  items: { product?: { _id: string; name?: string; price?: number; images?: { url: string; isPrimary?: boolean }[] } | string | null; quantity: number; price: number }[];
  shippingAddress?: { address?: string; city?: string; state?: string; landmark?: string; deliveryInstructions?: string };
  statusHistory?: { status: string; note?: string; changedAt?: string; timestamp?: string }[];
  assignedAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

export interface OrdersQuery {
  status?: string;
  paid?: 'true' | 'false';
  unassigned?: 'true';
  marketer?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminWithdrawal {
  _id: string;
  reference: string;
  amount: number;
  status: 'pending' | 'paid' | 'rejected';
  user: (AdminPerson & { phone?: string }) | null;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  adminNote?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface CommissionSettings {
  commissionRate: number;
  excludedRoles: string[];
  withdrawalWindow?: { startDay: number; endDay: number };
  updatedAt?: string;
}

export interface CommissionRecord {
  _id: string;
  amount: number;
  commissionRate?: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  affiliate?: AdminPerson | null;
  referredUser?: AdminPerson | null;
  order?: { _id: string; orderNumber: string; totalAmount: number; status: string } | null;
  paidAt?: string;
  createdAt: string;
}

export interface AdminMessage {
  _id: string;
  subject?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: (AdminPerson & { role?: Role }) | null;
  replies: { _id: string; content: string; createdAt: string; sender?: AdminPerson | null }[];
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiryType?: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

export interface AdminMarketer extends AdminUser {
  assignedProducts?: { _id: string; name: string }[];
  productCount?: number;
  rating?: number;
}

export const adminAPI = {
  // Dashboard
  getStats: async (): Promise<DashboardStats> => (await api.get('/api/admin/dashboard/stats')).data.data,

  // Orders
  getOrders: async (params?: OrdersQuery): Promise<{ orders: AdminOrder[]; total: number; page: number; pages: number }> => {
    const { data } = await api.get('/api/admin/orders', { params });
    return { orders: data.orders || [], total: data.total ?? (data.orders || []).length, page: data.page || 1, pages: data.pages || 1 };
  },
  getOrder: async (id: string): Promise<AdminOrder> => (await api.get(`/api/admin/orders/${id}`)).data.order,
  updateOrderStatus: async (id: string, status: string, note?: string) =>
    (await api.put(`/api/admin/orders/${id}/status`, { status, note })).data as { success: boolean; message?: string; order: AdminOrder },
  // Omit marketerId to let the system pick the least busy marketer
  assignOrder: async (id: string, marketerId?: string) =>
    (await api.put(`/api/admin/orders/${id}/assign`, marketerId ? { marketerId } : {})).data as { success: boolean; message: string; data: AdminOrder },

  // Users
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const { data } = await api.get('/api/admin/users', { params });
    return { users: (data.data || []) as AdminUser[], total: data.pagination?.total ?? 0, pages: data.pagination?.pages ?? 1 };
  },
  createUser: async (input: { firstName: string; lastName: string; email: string; phone?: string; password: string; role: AssignableRole }) =>
    (await api.post('/api/admin/users', input)).data,
  updateUser: async (id: string, input: Partial<{ firstName: string; lastName: string; email: string; isActive: boolean }>) =>
    (await api.put(`/api/admin/users/${id}`, input)).data,
  setRole: async (id: string, role: AssignableRole) => (await api.put(`/api/admin/users/${id}/role`, { role })).data,
  setSuspended: async (id: string, suspended: boolean, reason?: string) =>
    (await api.put(`/api/admin/users/${id}/suspend`, { suspended, reason })).data,
  deleteUser: async (id: string) => (await api.delete(`/api/admin/users/${id}`)).data,

  // Marketers (with assigned products and delivery counters)
  getMarketers: async (): Promise<AdminMarketer[]> => (await api.get('/api/marketer/admin/marketers')).data.data || [],

  // Withdrawals (wallet ledger)
  getWithdrawals: async (status?: string) => {
    const { data } = await api.get('/api/admin/withdrawals', { params: { status, limit: 100 } });
    return {
      withdrawals: (data.data || []) as AdminWithdrawal[],
      summary: (data.summary || {}) as Record<'pending' | 'paid' | 'rejected', { count: number; amount: number }>,
    };
  },
  // 'paid' = money sent to the bank; 'rejected' = returned to the customer's wallet
  updateWithdrawal: async (id: string, status: 'paid' | 'rejected', note?: string) =>
    (await api.put(`/api/admin/withdrawals/${id}/status`, { status, note })).data as { success: boolean; message: string },

  // Commission settings and records
  getCommissionSettings: async (): Promise<CommissionSettings> => (await api.get('/api/commission/admin/settings')).data.data,
  updateCommissionSettings: async (input: { rate: number; excludedRoles: string[]; startDay: number; endDay: number }) =>
    (await api.post('/api/admin/commission-rates', input)).data,
  getCommissionRecords: async (params?: { page?: number; limit?: number; status?: string }) => {
    const { data } = await api.get('/api/commission/admin/commissions', { params });
    return { records: (data.data || []) as CommissionRecord[], summary: data.summary || {}, total: data.pagination?.total ?? 0 };
  },

  // Messages from signed-in customers (in-app), with replies
  getInbox: async (): Promise<{ messages: AdminMessage[]; unread: number }> => {
    const { data } = await api.get('/api/messages/admin/inbox');
    return { messages: data.data || [], unread: data.unread || 0 };
  },
  replyToMessage: async (id: string, message: string) => (await api.post(`/api/messages/${id}/reply`, { message })).data,
  setMessageRead: async (id: string, isRead = true) => (await api.put(`/api/messages/admin/${id}/read`, { isRead })).data,

  // Public contact form submissions
  getContactMessages: async (): Promise<ContactMessage[]> => (await api.get('/api/contact')).data.data || [],
  setContactStatus: async (id: string, status: ContactMessage['status']) => (await api.put(`/api/contact/${id}/status`, { status })).data,
};
