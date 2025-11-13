// src/hooks/useCommissions.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commissionsAPI, Commission, CommissionRate, CreateCommissionData, UpdateCommissionData } from '@/services/commissions';

// Hook for getting all commissions
export const useCommissions = (params?: {
  status?: string;
  type?: string;
  limit?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['commissions', params],
    queryFn: () => commissionsAPI.getCommissions(params),
  });
};

// Hook for getting all commission rates (admin)
export const useCommissionRates = (params?: {
  category?: string;
  isActive?: boolean;
  limit?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['commission-rates', params],
    queryFn: () => commissionsAPI.getCommissions(params),
  });
};

// Hook for getting single commission
export const useCommission = (id: string) => {
  return useQuery({
    queryKey: ['commission', id],
    queryFn: () => commissionsAPI.getCommission(id),
    enabled: !!id,
  });
};

// Hook for creating commission rate (admin)
export const useCreateCommissionRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommissionData) => commissionsAPI.createCommission(data),
    onSuccess: (data) => {
      // Invalidate and refetch commission rates
      queryClient.invalidateQueries({ queryKey: ['commission-rates'] });
      queryClient.invalidateQueries({ queryKey: ['commissions'] });

      // Also update the cache directly with the new commission rate
      queryClient.setQueryData(['commission-rates'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          commissionRates: [data.commissionRate, ...oldData.commissionRates]
        };
      });
    },
  });
};

// Hook for updating commission rate (admin)
export const useUpdateCommissionRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommissionData }) =>
      commissionsAPI.updateCommission(id, data),
    onSuccess: (data, variables) => {
      // Update the cache directly for the specific commission rate
      queryClient.setQueryData(['commission-rates'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          commissionRates: oldData.commissionRates.map((rate: any) =>
            rate._id === variables.id ? data.commissionRate : rate
          )
        };
      });

      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['commission-rates'] });
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['commission'] });
    },
  });
};

// Hook for deleting commission rate (admin)
export const useDeleteCommissionRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commissionsAPI.deleteCommission(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted item from cache immediately
      queryClient.setQueryData(['commission-rates'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          commissionRates: oldData.commissionRates.filter((rate: any) => rate._id !== deletedId)
        };
      });

      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['commission-rates'] });
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};

// Hook for updating commission status (admin)
export const useUpdateCommissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Commission['status'] }) =>
      commissionsAPI.updateCommission(id, { status }),
    onSuccess: (data, variables) => {
      // Update the cache directly for the specific commission
      queryClient.setQueryData(['commissions'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          commissions: oldData.commissions.map((commission: any) =>
            commission._id === variables.id ? { ...commission, status: variables.status } : commission
          )
        };
      });

      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['commission'] });
    },
  });
};