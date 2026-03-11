/* eslint-disable @typescript-eslint/no-explicit-any */
import { banksAPI, NigerianBank } from '@/services/banks';
import { useQuery } from '@tanstack/react-query';

export const useNigerianBanks = () => {
  return useQuery({
    queryKey: ['banks', 'nigeria'],
    queryFn: () => banksAPI.getNigerianBanks(),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
};