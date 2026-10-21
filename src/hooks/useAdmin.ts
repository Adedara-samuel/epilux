// src/hooks/useAdmin.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI, type AssignableRole, type ContactMessage, type OrdersQuery } from '@/services/admin';

const keys = {
  stats: ['admin', 'stats'] as const,
  orders: (q?: OrdersQuery) => ['admin', 'orders', q] as const,
  order: (id: string) => ['admin', 'order', id] as const,
  users: (q?: object) => ['admin', 'users', q] as const,
  marketers: ['admin', 'marketers'] as const,
  withdrawals: (s?: string) => ['admin', 'withdrawals', s] as const,
  commissionSettings: ['admin', 'commission-settings'] as const,
  commissionRecords: (q?: object) => ['admin', 'commission-records', q] as const,
  inbox: ['admin', 'inbox'] as const,
  contact: ['admin', 'contact'] as const,
};

// Anything that changes orders or money can move the dashboard numbers
const invalidateAdmin = (qc: ReturnType<typeof useQueryClient>, ...prefixes: string[]) => {
  qc.invalidateQueries({ queryKey: keys.stats });
  prefixes.forEach((p) => qc.invalidateQueries({ queryKey: ['admin', p] }));
};

export const useAdminStats = () =>
  useQuery({ queryKey: keys.stats, queryFn: adminAPI.getStats, refetchInterval: 60_000 });

export const useAdminOrders = (q?: OrdersQuery) =>
  useQuery({ queryKey: keys.orders(q), queryFn: () => adminAPI.getOrders(q), placeholderData: keepPreviousData, refetchInterval: 60_000 });

export const useAdminOrder = (id: string | null) =>
  useQuery({ queryKey: keys.order(id || ''), queryFn: () => adminAPI.getOrder(id as string), enabled: !!id });

export const useUpdateAdminOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) => adminAPI.updateOrderStatus(id, status, note),
    onSuccess: () => invalidateAdmin(qc, 'orders', 'order', 'marketers'),
  });
};

export const useAssignOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, marketerId }: { id: string; marketerId?: string }) => adminAPI.assignOrder(id, marketerId),
    onSuccess: () => invalidateAdmin(qc, 'orders', 'order', 'marketers'),
  });
};

export const useAdminUsers = (q?: { page?: number; limit?: number; search?: string; role?: string }) =>
  useQuery({ queryKey: keys.users(q), queryFn: () => adminAPI.getUsers(q), placeholderData: keepPreviousData });

export const useCreateAdminUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: adminAPI.createUser, onSuccess: () => invalidateAdmin(qc, 'users', 'marketers') });
};

export const useUpdateAdminUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof adminAPI.updateUser>[1] }) => adminAPI.updateUser(id, data),
    onSuccess: () => invalidateAdmin(qc, 'users', 'marketers'),
  });
};

export const useSetUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: AssignableRole }) => adminAPI.setRole(id, role),
    onSuccess: () => invalidateAdmin(qc, 'users', 'marketers'),
  });
};

export const useSetUserSuspended = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspended, reason }: { id: string; suspended: boolean; reason?: string }) => adminAPI.setSuspended(id, suspended, reason),
    onSuccess: () => invalidateAdmin(qc, 'users', 'marketers'),
  });
};

export const useDeleteAdminUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: adminAPI.deleteUser, onSuccess: () => invalidateAdmin(qc, 'users', 'marketers') });
};

export const useAdminMarketers = () => useQuery({ queryKey: keys.marketers, queryFn: adminAPI.getMarketers });

export const useAdminWithdrawals = (status?: string) =>
  useQuery({ queryKey: keys.withdrawals(status), queryFn: () => adminAPI.getWithdrawals(status), placeholderData: keepPreviousData, refetchInterval: 60_000 });

export const useUpdateWithdrawal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: 'paid' | 'rejected'; note?: string }) => adminAPI.updateWithdrawal(id, status, note),
    onSuccess: () => invalidateAdmin(qc, 'withdrawals'),
  });
};

export const useCommissionSettings = () => useQuery({ queryKey: keys.commissionSettings, queryFn: adminAPI.getCommissionSettings });

export const useUpdateCommissionSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminAPI.updateCommissionSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.commissionSettings }),
  });
};

export const useCommissionRecords = (q?: { page?: number; limit?: number; status?: string }) =>
  useQuery({ queryKey: keys.commissionRecords(q), queryFn: () => adminAPI.getCommissionRecords(q), placeholderData: keepPreviousData });

export const useAdminInbox = () => useQuery({ queryKey: keys.inbox, queryFn: adminAPI.getInbox, refetchInterval: 60_000 });

export const useReplyToMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => adminAPI.replyToMessage(id, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.inbox }),
  });
};

export const useSetMessageRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) => adminAPI.setMessageRead(id, isRead),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.inbox }),
  });
};

export const useContactMessages = () => useQuery({ queryKey: keys.contact, queryFn: adminAPI.getContactMessages, refetchInterval: 120_000 });

export const useSetContactStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessage['status'] }) => adminAPI.setContactStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.contact }),
  });
};
