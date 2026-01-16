/* eslint-disable @typescript-eslint/no-explicit-any */
import { affiliateAPI } from '@/services/affiliate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useAffiliateProfile = () => {
  // FIX 1: user is correctly retrieved here
	const { user } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'profile'],
		// FIX 2: Check affiliateAPI.getProfile signature. It likely expects the token.
    // If it expects a token, the original commented-out code was correct:
		queryFn: () => affiliateAPI.getProfile(user?.token || ''),
		enabled: true,
	});
};

export const useUpdateAffiliateProfile = () => {
	const queryClient = useQueryClient();
  // FIX: Define 'user' inside the hook's scope
  const { user } = useAuth();

	return useMutation({
		mutationFn: (profileData: any) =>
			affiliateAPI.updateProfile(user?.token || '', profileData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['affiliate', 'profile'] });
		},
	});
};

export const useAffiliateSales = () => {
	const { user } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'sales'],
		queryFn: () => affiliateAPI.getSales(user?.token || ''), 
		enabled: true,
	});
};

export const useAffiliateReferrals = () => {
	const { user } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'referrals'],
		queryFn: () => affiliateAPI.getReferrals(user?.token || ''),
		enabled: !!user?.token,
		retry: 1,
	});
};

export const useAffiliateDashboard = () => {
  // FIX 1: user is correctly retrieved here
	const { user } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'dashboard'],
		// FIX 2: Check affiliateAPI.getDashboard signature. It likely expects the token.
    // If it expects a token, the original commented-out code was correct:
		queryFn: () => affiliateAPI.getDashboard(user?.token || ''), 
		enabled: true,
	});
};

export const useRecordAffiliateSale = () => {
	const queryClient = useQueryClient();
  // FIX: Define 'user' inside the hook's scope
  const { user } = useAuth();

	return useMutation({
		mutationFn: (saleData: any) =>
      // FIX: 'user' is now defined and accessible here
			affiliateAPI.recordSale(user?.token || '', saleData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['affiliate'] });
		},
	});
};