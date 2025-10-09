// src/hooks/useAddresses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/base';

// Hook for getting user's addresses
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/user/addresses');
      return response.data;
    },
  });
};

// Hook for adding address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressData: {
      type?: string;
      street: string;
      city: string;
      state: string;
      zipCode?: string;
      country: string;
    }) => {
      const response = await api.post('/api/user/addresses', addressData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

// Hook for updating address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{
      type?: string;
      street: string;
      city: string;
      state: string;
      zipCode?: string;
      country: string;
    }> }) => {
      const response = await api.put(`/api/user/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

// Hook for deleting address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/user/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};