import { walletAPI, type WithdrawalRequest } from '@/services/wallet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useWalletBalance = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => walletAPI.getBalance(),
    enabled: !!token,
  });
};

export const useWalletTransactions = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => walletAPI.getTransactions(),
    enabled: !!token,
  });
};

export const useWithdrawalWindow = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['wallet', 'withdrawal-window'],
    queryFn: () => walletAPI.getWithdrawalWindow(),
    enabled: !!token,
    staleTime: 5 * 60_000,
  });
};

export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WithdrawalRequest) => walletAPI.requestWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

// Admin hooks
export const usePendingWithdrawals = () => {
  const { user, token } = useAuth();
  return useQuery({
    queryKey: ['admin', 'withdrawals', 'pending'],
    queryFn: () => walletAPI.getPendingWithdrawals(),
    enabled: !!token && user?.role === 'admin',
  });
};

export const useProcessWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, adminNote }: { id: string; action: 'approve' | 'reject'; adminNote?: string }) =>
      walletAPI.processWithdrawal(id, action, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    },
  });
};
