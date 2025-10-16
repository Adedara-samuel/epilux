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
		enabled: !!user?.token && user.role === 'affiliate',
	});
};

export const useUpdateAffiliateProfile = () => {
	const queryClient = useQueryClient();
  // FIX: Define 'user' inside the hook's scope
  const { user } = useAuth();

	return useMutation({
		mutationFn: (profileData: any) =>
      // FIX: 'user' is now defined and accessible here
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
		// FIX: Corrected to use || '' for clarity (?? '' is fine too)
		queryFn: () => affiliateAPI.getSales(user?.token || ''), 
		enabled: !!user?.token && user.role === 'affiliate',
	});
};

export const useAffiliateReferrals = () => {
	const { user } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'referrals'],
		queryFn: () => affiliateAPI.getReferrals(user?.token || ''),
		enabled: !!user?.token && user.role === 'affiliate',
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
		enabled: !!user?.token && user.role === 'affiliate',
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