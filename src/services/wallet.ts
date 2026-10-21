// src/services/wallet.ts
import { api } from './base';

export interface WalletBalance {
  availableBalance: number;
  lockedAmount: number;
  totalBalance?: number;
  totalEarned: number;
  totalWithdrawn: number;
  currency?: string;
}

export interface WalletTransaction {
  _id: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'refund' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  description: string;
  metadata?: {
    orderId?: string;
    orderNumber?: string;
    bankDetails?: { bankName?: string; accountNumber?: string; accountName?: string };
    adminNote?: string;
  };
  createdAt: string;
}

export interface WithdrawalWindow {
  isOpen: boolean;
  startDay: number;
  endDay: number;
  nextOpensAt: string | null;
  closesAt: string | null;
}

export interface WithdrawalRequest {
  amount: number;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountName: string;
}

export const walletAPI = {
  // Get wallet balance (the backend nests it under `data`)
  getBalance: async (): Promise<WalletBalance> => {
    const response = await api.get('/api/wallet/balance');
    return response.data?.data ?? response.data;
  },

  // Wallet history, newest first
  getTransactions: async (params?: { page?: number; limit?: number; type?: string }): Promise<{ data: WalletTransaction[]; pagination?: { total: number; page: number; pages: number } }> => {
    const response = await api.get('/api/wallet/transactions', { params: { limit: 50, ...params } });
    return response.data;
  },

  // When withdrawals are open (admin-configured monthly window)
  getWithdrawalWindow: async (): Promise<WithdrawalWindow> => {
    const response = await api.get('/api/wallet/withdrawal-window');
    return response.data?.data;
  },

  // Request withdrawal to a bank account; funds are held until an admin pays it
  requestWithdrawal: async (data: WithdrawalRequest) => {
    const response = await api.post('/api/wallet/withdraw', data);
    return response.data;
  },

  // Admin: Get all pending withdrawals
  getPendingWithdrawals: async () => {
    const response = await api.get('/api/wallet/withdrawals/pending');
    return response.data;
  },

  // Admin: Process withdrawal (approve/reject)
  processWithdrawal: async (id: string, action: 'approve' | 'reject', adminNote?: string) => {
    const response = await api.post(`/api/wallet/withdraw/${id}/process`, { action, adminNote });
    return response.data;
  },
};
