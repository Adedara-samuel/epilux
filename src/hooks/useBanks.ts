import { useQuery } from '@tanstack/react-query';
import { banksAPI } from '@/services/banks';

export const useNigerianBanks = () => {
  return useQuery({
    queryKey: ['banks', 'nigeria'],
    queryFn: () => banksAPI.getNigerianBanks(),
    staleTime: 1000 * 60 * 60 * 12, // the list rarely changes
  });
};

/** Account-name lookup once a bank and a full 10-digit number are entered. */
export const useAccountLookup = (accountNumber: string, bankCode?: string) => {
  const ready = /^\d{10}$/.test(accountNumber) && !!bankCode;
  return useQuery({
    queryKey: ['banks', 'resolve', bankCode, accountNumber],
    queryFn: () => banksAPI.resolveAccount(accountNumber, bankCode as string),
    enabled: ready,
    staleTime: 1000 * 60 * 30,
    retry: false,
  });
};
