// src/services/support.ts
import { api } from './base';

// Support API functions
export const supportAPI = {
  // Get support tickets
  getTickets: async () => {
    const response = await api.get('/api/support/tickets');
    return response.data;
  },

  // Create support ticket
  createTicket: async (ticketData: {
    subject: string;
    message: string;
    priority?: string;
    category?: string;
  }) => {
    const response = await api.post('/api/support/tickets', ticketData);
    return response.data;
  },

  // Get ticket by ID
  getTicket: async (id: string) => {
    const response = await api.get(`/api/support/tickets/${id}`);
    return response.data;
  },

  // Reply to ticket
  replyToTicket: async (id: string, replyData: {
    message: string;
  }) => {
    const response = await api.post(`/api/support/${id}/reply`, replyData);
    return response.data;
  },

  // Direct Messages
  getMessages: async (params?: { page?: number; limit?: number; isRead?: boolean }) => {
    const response = await api.get('/api/support/messages', { params });
    return response.data;
  },

  sendMessage: async (messageData: {
    recipient: string;
    subject: string;
    message: string;
    priority?: string;
    category?: string;
  }) => {
    const response = await api.post('/api/support/messages', messageData);
    return response.data;
  },

  getMessage: async (id: string) => {
    const response = await api.get(`/api/support/messages/${id}`);
    return response.data;
  },

  markMessageAsRead: async (id: string) => {
    const response = await api.put(`/api/support/messages/${id}/read`);
    return response.data;
  },
};