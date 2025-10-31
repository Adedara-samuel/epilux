/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, tokenManager } from './base';

export interface WalletBalance {
  availableBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface WithdrawalRequest {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export const walletAPI = {
  // Get wallet balance
  getBalance: async (): Promise<WalletBalance> => {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get('/api/wallet/balance');
    return response.data;
  },

  // Get wallet transactions
  getTransactions: async (): Promise<{ transactions: WalletTransaction[]; total: number }> => {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get('/api/wallet/transactions');
    return response.data;
  },

  // Request withdrawal
  requestWithdrawal: async (data: WithdrawalRequest): Promise<{ withdrawal: Withdrawal; message: string }> => {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.post('/api/wallet/withdraw', data);
    return response.data;
  },

  // Admin: Get all pending withdrawals
  getPendingWithdrawals: async (): Promise<{ withdrawals: Withdrawal[]; total: number }> => {
    const response = await api.get('/admin/wallet/withdrawals/pending');
    return response.data;
  },

  // Admin: Process withdrawal (approve/reject)
  processWithdrawal: async (id: string, action: 'approve' | 'reject', adminNote?: string): Promise<{ withdrawal: Withdrawal; message: string }> => {
    const response = await api.post(`/admin/wallet/withdraw/${id}/process`, { action, adminNote });
    return response.data;
  },
};