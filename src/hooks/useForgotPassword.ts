// src/hooks/useForgotPassword.ts
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authAPI.forgotPassword,
  });
};