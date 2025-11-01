/* eslint-disable @typescript-eslint/no-explicit-any */
import { walletAPI, WalletBalance, WalletTransaction, WithdrawalRequest, Withdrawal } from '@/services/wallet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useWalletBalance = () => {
  const { user, token } = useAuth();
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => walletAPI.getBalance(),
    enabled: !!token,
    retry: 1,
  });
};

export const useWalletTransactions = () => {
  const { user, token } = useAuth();
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => walletAPI.getTransactions(),
    enabled: !!token,
    retry: 1,
  });
};

export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  return useMutation({
    mutationFn: (data: WithdrawalRequest) => walletAPI.requestWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
};

// Admin hooks remain unchanged

// Admin hooks
export const usePendingWithdrawals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin', 'withdrawals', 'pending'],
    queryFn: () => walletAPI.getPendingWithdrawals(),
    enabled: !!user?.token && user.role === 'admin',
  });
};

export const useProcessWithdrawal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, action, adminNote }: { id: string; action: 'approve' | 'reject'; adminNote?: string }) =>
      walletAPI.processWithdrawal(id, action, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
    },
  });
};