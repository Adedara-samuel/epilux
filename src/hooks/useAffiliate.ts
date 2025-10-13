// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { affiliateAPI } from '@/services/affiliate';
// import { useAuth } from './useAuth';

// export const useAffiliateProfile = () => {
//   const { user } = useAuth();
//   return useQuery({
//     queryKey: ['affiliate', 'profile'],
//     queryFn: () => affiliateAPI.getProfile(user?.token || ''),
//     enabled: !!user?.token && user.role === 'affiliate',
//   });
// };

// export const useUpdateAffiliateProfile = () => {
//   const queryClient = useQueryClient();
//   const { user } = useAuth();

//   return useMutation({
//     mutationFn: (profileData: any) =>
//       affiliateAPI.updateProfile(user?.token || '', profileData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['affiliate', 'profile'] });
//     },
//   });
// };

// export const useAffiliateSales = () => {
//   const { user } = useAuth();
//   return useQuery({
//     queryKey: ['affiliate', 'sales'],
//     queryFn: () => affiliateAPI.getSales(user?.token || ''),
//     enabled: !!user?.token && user.role === 'affiliate',
//   });
// };

// export const useAffiliateReferrals = () => {
//   const { user } = useAuth();
//   return useQuery({
//     queryKey: ['affiliate', 'referrals'],
//     queryFn: () => affiliateAPI.getReferrals(user?.token || ''),
//     enabled: !!user?.token && user.role === 'affiliate',
//   });
// };

// export const useAffiliateDashboard = () => {
//   const { user } = useAuth();
//   return useQuery({
//     queryKey: ['affiliate', 'dashboard'],
//     queryFn: () => affiliateAPI.getDashboard(user?.token || ''),
//     enabled: !!user?.token && user.role === 'affiliate',
//   });
// };

// export const useRecordAffiliateSale = () => {
//   const queryClient = useQueryClient();
//   const { user } = useAuth();

//   return useMutation({
//     mutationFn: (saleData: any) =>
//       affiliateAPI.recordSale(user?.token || '', saleData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['affiliate'] });
//     },
//   });
// };



/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateAPI } from '@/services/affiliate';
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
    mutationFn: (profileData: any) => affiliateAPI.updateProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate', 'profile'] });
    },
  });
};

export const useAffiliateSales = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['affiliate', 'sales'],
    queryFn: () => affiliateAPI.getSales(),
    enabled: !!user?.token && user.role === 'affiliate',
  });
};

export const useAffiliateReferrals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['affiliate', 'referrals'],
    queryFn: () => affiliateAPI.getReferrals(),
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
    mutationFn: (saleData: any) => affiliateAPI.recordSale(saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate'] });
    },
  });
};
