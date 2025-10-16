// src/services/messageService.ts
import { api } from './base'; // Assuming base.ts is in the same directory

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
        const response = await api.post('/api/messages', data);
        return response.data;
    },

    /**
     * Get all messages/support tickets for the authenticated user/admin.
     * Maps to: GET /api/messages
     */
    getMessages: async (): Promise<MessagesListResponse> => {
        const response = await api.get('/api/messages');
        return response.data;
    },

    /**
     * Get a single message/support ticket by ID.
     * Maps to: GET /api/messages/:id
     */
    getMessage: async (id: string): Promise<SupportTicket> => {
        const response = await api.get(`/api/messages/${id}`);
        return response.data;
    },

    // --- Admin Action Functions (Required for the AdminNotificationsPage) ---

    /**
     * Update the status of a ticket (Mark as Read/Unread/Resolved).
     * Maps to: PATCH /api/messages/:id
     */
    updateStatus: async (id: string, newStatus: 'read' | 'pending' | 'resolved'): Promise<SupportTicket> => {
        // NOTE: Returning SupportTicket as per typical API response for an update
        const response = await api.patch(`/api/messages/${id}`, { status: newStatus });
        return response.data;
    },

    /**
     * Delete a single message/support ticket by ID.
     * Maps to: DELETE /api/messages/:id
     */
    deleteMessage: async (id: string): Promise<void> => {
        await api.delete(`/api/messages/${id}`);
    },

    /**
     * Resolve a ticket (often combined with sending a reply).
     */
    resolveTicket: async (id: string): Promise<SupportTicket> => {
        return messageAPI.updateStatus(id, 'resolved');
    }
};