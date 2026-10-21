// src/hooks/useAddresses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/services/user';

type AddressInput = {
  type?: string;
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
};

// Hook for getting user's addresses, as { addresses: Address[] }
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: userAPI.getAddresses,
  });
};

// Hook for adding address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressData: AddressInput) => userAPI.addAddress(addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};

// Hook for updating address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddressInput> }) =>
      userAPI.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};

// Hook for deleting address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userAPI.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};
