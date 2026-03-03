/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useAddresses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/base';

// Hook for getting user's addresses
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/users/me/address');

      // 1. Extract the single address object from the API response: { success: true, data: { address_data } }
      const addressObject = response.data.data;

      // 2. Transform the data into the structure expected by SettingsPage: { addresses: Address[] }
      if (addressObject) {
        // IMPORTANT: Ensure the address has an 'id' for React keys and API actions.
        // If your backend doesn't provide it, you must generate one here or fix the backend.
        const addressWithId = {
          id: addressObject.id,
          type: addressObject.type || 'home',
          ...addressObject
        };

        return {
          addresses: [addressWithId] // Wrap the single object in an array
        };
      }

      return { addresses: [] }; // Return an empty array if no address is found
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
      const response = await api.put('/api/users/me/address', addressData);
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
    mutationFn: async ({ id, data }: {
      id: string; data: Partial<{
        type?: string;
        street: string;
        city: string;
        state: string;
        zipCode?: string;
        country: string;
      }>
    }) => {
      const response = await api.put(`/api/users/me/address`, data);
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
      const response = await api.delete(`/api/users/me/address`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};