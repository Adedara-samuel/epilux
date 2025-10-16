/* eslint-disable @typescript-eslint/no-explicit-any */
import { affiliateAPI } from '@/services/affiliate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useAffiliateProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['affiliate', 'profile'],
    queryFn: () => affiliateAPI.getProfile(),
    enabled: !!user?.token && user.role === 'affiliate',
  });
};

export const useUpdateAffiliateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: any) =>
      affiliateAPI.updateProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate', 'profile'] });
    },
  });
};

export const useAffiliateSales = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['affiliate', 'sales'],
    queryFn: () => affiliateAPI.getCommissions(),
    enabled: !!user?.token && user.role === 'affiliate',
  });
};

export const useAffiliateReferrals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['affiliate', 'referrals'],
    queryFn: () => affiliateAPI.getWithdrawals(),
    enabled: !!user?.token && user.role === 'affiliate',
  });
};

export const useAffiliateDashboard = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['affiliate', 'dashboard'],
    queryFn: () => affiliateAPI.getDashboard(),
    enabled: !!user?.token && user.role === 'affiliate',
  });
};

export const useRecordAffiliateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleData: any) =>
      affiliateAPI.requestWithdrawal(saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate'] });
    },
  });
};