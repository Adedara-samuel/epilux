// src/hooks/useCommissions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commissionAPI } from '@/services/commissions';
import { toast } from 'sonner';

// Hook for getting user's commissions
export const useUserCommissions = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['commissions', 'user', params],
    queryFn: () => commissionAPI.getUserCommissions(params),
  });
};

// Hook for getting commission details
export const useCommissionDetails = (id: string) => {
  return useQuery({
    queryKey: ['commission', id],
    queryFn: () => commissionAPI.getCommissionDetails(id),
    enabled: !!id,
  });
};

// Hook for calculating commission
export const useCalculateCommission = () => {
  return useMutation({
    mutationFn: commissionAPI.calculateCommission,
  });
};

// Hook for all commissions (generic)
export const useAllCommissions = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['commissions', 'all', params],
    queryFn: () => commissionAPI.getAllCommissions(params),
  });
};

// Hook to update commission status (generic)
export const useUpdateCommissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => commissionAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};

// Hook for requesting withdrawal
export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commissionAPI.requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate', 'profile'] });
      toast.success('Withdrawal request submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to request withdrawal');
    },
  });
};