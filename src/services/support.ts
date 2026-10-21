// src/services/support.ts
import { api } from './base';

// Support API functions
export const supportAPI = {
  // Get the user's support tickets (admins see all)
  getTickets: async (params?: { status?: string; category?: string }) => {
    const response = await api.get('/api/support', { params });
    return response.data;
  },

  // Create support ticket
  createTicket: async (ticketData: {
    subject: string;
    message: string;
    priority?: string;
    category?: string;
  }) => {
    const response = await api.post('/api/support', {
      subject: ticketData.subject,
      description: ticketData.message,
      priority: ticketData.priority,
      category: ticketData.category,
    });
    return response.data;
  },

  // Get ticket by ID
  getTicket: async (id: string) => {
    const response = await api.get(`/api/support/${id}`);
    return response.data;
  },

  // Reply to ticket
  replyToTicket: async (id: string, replyData: {
    message: string;
  }) => {
    const response = await api.post(`/api/support/${id}/messages`, replyData);
    return response.data;
  },

  // Direct messages to the Epilux team
  getMessages: async (params?: { page?: number; limit?: number; isRead?: boolean }) => {
    const response = await api.get('/api/messages', { params });
    return response.data;
  },

  sendMessage: async (messageData: {
    recipient?: string;
    subject: string;
    message: string;
    priority?: string;
    category?: string;
  }) => {
    const response = await api.post('/api/messages', {
      subject: messageData.subject,
      message: messageData.message,
    });
    return response.data;
  },

  // There is no single-message endpoint; find it in the user's messages
  getMessage: async (id: string) => {
    const response = await api.get('/api/messages', { params: { limit: 100 } });
    const list = response.data?.data?.messages || [];
    const message = list.find((m: { _id: string }) => m._id === id);
    return { success: !!message, data: message || null };
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/api/messages/unread');
    return response.data?.data?.count || 0;
  },

  markMessageAsRead: async (id: string) => {
    const response = await api.put(`/api/messages/${id}/read`, {});
    return response.data;
  },
};
