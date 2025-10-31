// src/services/messageService.ts
import { api } from './base'; // Assuming base.ts is in the same directory

// Use the backend API URL directly
const getBaseUrl = () => {
  return 'https://epilux-backend.vercel.app';
};

// --- TypeScript Definitions ---

export interface SupportTicket {
    id: string;
    subject: string;
    message: string;
    createdAt: string;
    status: 'pending' | 'read' | 'resolved'; // Dynamically used status
    userId: string;
    // Sender details
    name: string;
    email: string;
}

export interface SendMessagePayload {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface MessagesListResponse {
    tickets: SupportTicket[];
    count: number;
}


// --- Message API Functions ---

export const messageAPI = {
    /**
     * Send a new message (create a Support Ticket).
     * Maps to: POST /api/messages
     */
    sendMessage: async (data: SendMessagePayload): Promise<SupportTicket> => {
        const baseUrl = getBaseUrl();
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const response = await fetch(`${baseUrl}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        return response.json();
    },

    /**
     * Get all messages/support tickets for the authenticated user/admin.
     * Maps to: GET /api/messages
     */
    getMessages: async (): Promise<MessagesListResponse> => {
        const baseUrl = getBaseUrl();
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const response = await fetch(`${baseUrl}/api/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get messages');
        }
        return response.json();
    },

    /**
     * Get a single message/support ticket by ID.
     * Maps to: GET /api/messages/:id
     */
    getMessage: async (id: string): Promise<SupportTicket> => {
        const baseUrl = getBaseUrl();
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const response = await fetch(`${baseUrl}/api/messages/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get message');
        }
        return response.json();
    },

    // --- Admin Action Functions (Required for the AdminNotificationsPage) ---

    /**
     * Update the status of a ticket (Mark as Read/Unread/Resolved).
     * Maps to: PATCH /api/messages/:id
     */
    updateStatus: async (id: string, newStatus: 'read' | 'pending' | 'resolved'): Promise<SupportTicket> => {
        const baseUrl = getBaseUrl();
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const response = await fetch(`${baseUrl}/api/messages/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        return response.json();
    },

    /**
     * Delete a single message/support ticket by ID.
     * Maps to: DELETE /api/messages/:id
     */
    deleteMessage: async (id: string): Promise<void> => {
        const baseUrl = getBaseUrl();
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const response = await fetch(`${baseUrl}/api/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete message');
        }
    },

    /**
     * Resolve a ticket (often combined with sending a reply).
     */
    resolveTicket: async (id: string): Promise<SupportTicket> => {
        return messageAPI.updateStatus(id, 'resolved');
    }
};