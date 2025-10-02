// src/hooks/useAuthProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/services';
import { useAuth } from './useAuth';

// Hook for getting user profile
export const useProfile = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(token as string),
    enabled: !!token,
  });
};

// Hook for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (profileData: Parameters<typeof authAPI.updateProfile>[1]) =>
      authAPI.updateProfile(token as string, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Hook for logging out
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: () => authAPI.logout(token as string),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
};

// Hook for changing password
export const useChangePassword = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (passwordData: { currentPassword: string; newPassword: string }) =>
      authAPI.changePassword(token as string, passwordData),
  });
};