// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/services';

// Hook for getting user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userAPI.getProfile(),
  });
};

// Hook for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

// Hook for changing password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: userAPI.changePassword,
  });
};

// Hook for getting user's orders
export const useUserOrders = () => {
  return useQuery({
    queryKey: ['user', 'orders'],
    queryFn: () => userAPI.getOrders(),
  });
};

// Hook for getting user's addresses
export const useUserAddresses = () => {
  return useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: () => userAPI.getAddresses(),
  });
};

// Hook for adding address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};

// Hook for updating address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof userAPI.updateAddress>[1] }) =>
      userAPI.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};

// Hook for deleting address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};