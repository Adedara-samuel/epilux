/* eslint-disable @typescript-eslint/no-explicit-any */
import { affiliateAPI } from '@/services/affiliate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

// The session token comes from useAuth().token (it is not stored on the user).
// Queries only run once signed in.

export const useAffiliateProfile = () => {
	const { token } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'profile'],
		queryFn: () => affiliateAPI.getProfile(token || ''),
		enabled: !!token,
	});
};

export const useUpdateAffiliateProfile = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();

	return useMutation({
		mutationFn: (profileData: any) =>
			affiliateAPI.updateProfile(token || '', profileData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['affiliate', 'profile'] });
		},
	});
};

export const useAffiliateSales = () => {
	const { token } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'sales'],
		queryFn: () => affiliateAPI.getSales(token || ''),
		enabled: !!token,
	});
};

export const useAffiliateReferrals = () => {
	const { token } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'referrals'],
		queryFn: () => affiliateAPI.getReferrals(token || ''),
		enabled: !!token,
		retry: 1,
	});
};

export const useAffiliateDashboard = () => {
	const { token } = useAuth();
	return useQuery({
		queryKey: ['affiliate', 'dashboard'],
		queryFn: () => affiliateAPI.getDashboard(token || ''),
		enabled: !!token,
	});
};

export const useRecordAffiliateSale = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();

	return useMutation({
		mutationFn: (saleData: any) =>
			affiliateAPI.recordSale(token || '', saleData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['affiliate'] });
		},
	});
};
