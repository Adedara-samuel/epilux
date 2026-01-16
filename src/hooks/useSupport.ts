// src/hooks/useSupport.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportAPI } from '@/services';

// Hook for getting support tickets
export const useSupportTickets = () => {
  return useQuery({
    queryKey: ['support', 'tickets'],
    queryFn: () => supportAPI.getTickets(),
  });
};

// Hook for getting single ticket
export const useSupportTicket = (id: string) => {
  return useQuery({
    queryKey: ['support', 'ticket', id],
    queryFn: () => supportAPI.getTicket(id),
    enabled: !!id,
  });
};

// Hook for creating support ticket
export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportAPI.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });
};

// Hook for replying to ticket
export const useReplyToTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      supportAPI.replyToTicket(id, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support'] });
    },
  });
};

// Hook for getting direct messages
export const useMessages = (params?: { page?: number; limit?: number; isRead?: boolean }) => {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => supportAPI.getMessages(params),
  });
};

// Hook for getting single message
export const useMessage = (id: string) => {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => supportAPI.getMessage(id),
    enabled: !!id,
  });
};

// Hook for sending message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportAPI.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

// Hook for marking message as read
export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supportAPI.markMessageAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};