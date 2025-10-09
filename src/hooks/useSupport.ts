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