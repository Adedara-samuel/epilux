/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useMessages.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageAPI, SendMessagePayload, SupportTicket, MessagesListResponse } from '@/services/messageService';
import { toast } from 'sonner';

// --- React Query Keys ---
export const messageKeys = {
    all: ['messages'] as const,
    lists: () => [...messageKeys.all, 'list'] as const,
    details: () => [...messageKeys.all, 'detail'] as const,
    detail: (id: string) => [...messageKeys.details(), id] as const,
};

// --- Fetch Hooks (Queries) ---

/**
 * Custom hook to fetch all support tickets/messages (used on AdminNotificationsPage).
 */
export function useSupportTickets() {
    return useQuery<MessagesListResponse, Error>({
        queryKey: messageKeys.lists(),
        queryFn: messageAPI.getMessages,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

/**
 * Custom hook to fetch a single support ticket/message.
 */
export function useSupportTicket(id: string) {
    return useQuery<SupportTicket, Error>({
        queryKey: messageKeys.detail(id),
        queryFn: () => messageAPI.getMessage(id),
        enabled: !!id,
    });
}

// --- Mutate Hooks (Mutations for all users/admin) ---

/**
 * Custom hook to send a new message (create a support ticket).
 */
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation<SupportTicket, Error, SendMessagePayload>({
        mutationFn: messageAPI.sendMessage, 
        onSuccess: (newTicket) => {
            queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
            toast.success("Your message has been sent successfully!");
        },
        onError: (error) => {
            const errorMessage = (error as any).response?.data?.message || error.message || "Failed to send message.";
            console.error("Error sending message:", error);
            toast.error(errorMessage);
        },
    });
}

// FIX: Define the context type for optimistic updates
type UpdateStatusContext = {
    previousTickets: MessagesListResponse | undefined;
};

/**
 * Custom hook to update a ticket status (e.g., mark as read/unread).
 */
export function useUpdateTicketStatus() {
    const queryClient = useQueryClient();

    return useMutation<
        SupportTicket, // Mutation result type (the updated ticket)
        Error,         // Error type
        { id: string, status: 'read' | 'pending' }, // Variables type
        UpdateStatusContext // Context type (The FIX for previousTickets error)
    >({
        mutationFn: ({ id, status }) => messageAPI.updateStatus(id, status),
        // FIX APPLIED HERE: Explicitly typing the return value in onMutate
        onMutate: async ({ id, status }): Promise<UpdateStatusContext> => { 
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: messageKeys.lists() });

            // Snapshot the previous value, explicitly typing the query data access
            const previousTickets = queryClient.getQueryData<MessagesListResponse>(messageKeys.lists());

            // Optimistically update the list cache
            queryClient.setQueryData(messageKeys.lists(), (old: MessagesListResponse | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    tickets: old.tickets.map(ticket => 
                        ticket.id === id ? { ...ticket, status: status } : ticket
                    ),
                };
            });

            // Return the context object
            return { previousTickets }; 
        },
        onError: (err, newTicket, context) => { 
            // Roll back to the previous data if mutation fails
            if (context?.previousTickets) {
                queryClient.setQueryData(messageKeys.lists(), context.previousTickets);
            }
            toast.error("Failed to update ticket status.");
        },
        onSettled: () => {
            // Invalidate the list query to ensure the server state is eventually reflected
            queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
        },
    });
}


/**
 * Custom hook to delete a message/ticket.
 */
export function useDeleteMessage() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: messageAPI.deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
            toast.success("Ticket deleted successfully.");
        },
        onError: () => {
            toast.error("Failed to delete ticket.");
        },
    });
}

/**
 * Custom hook to resolve a ticket.
 */
export function useResolveTicket() {
    const queryClient = useQueryClient();

    return useMutation<SupportTicket, Error, string>({
        mutationFn: messageAPI.resolveTicket,
        onSuccess: (resolvedTicket) => {
            queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
            queryClient.invalidateQueries({ queryKey: messageKeys.detail(resolvedTicket.id) });
            toast.success(`Ticket ${resolvedTicket.id} resolved successfully.`);
        },
        onError: () => {
            toast.error("Failed to resolve ticket.");
        },
    });
}