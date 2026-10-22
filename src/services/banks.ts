// src/services/banks.ts
import { api } from './base';

export interface Bank {
  code: string;
  name: string;
}

export type AccountLookup =
  | { verified: true; accountName: string }
  | { verified: false; reason?: 'invalid_input' | 'not_configured' | 'not_found' | 'unavailable' | 'rate_limited' | string };

// Used if the bank list can't be loaded (codes are CBN/NIP codes)
const FALLBACK_BANKS: Bank[] = [
  ['044', 'Access Bank'], ['050', 'Ecobank Nigeria'], ['070', 'Fidelity Bank'], ['011', 'First Bank of Nigeria'],
  ['214', 'First City Monument Bank'], ['058', 'Guaranty Trust Bank'], ['082', 'Keystone Bank'], ['50515', 'Moniepoint MFB'],
  ['999992', 'OPay'], ['999991', 'PalmPay'], ['076', 'Polaris Bank'], ['221', 'Stanbic IBTC Bank'], ['232', 'Sterling Bank'],
  ['032', 'Union Bank of Nigeria'], ['033', 'United Bank for Africa'], ['035', 'Wema Bank'], ['057', 'Zenith Bank'],
].map(([code, name]) => ({ code, name }));

export const banksAPI = {
  // All Nigerian banks (served by our backend from Flutterwave, the same provider that verifies accounts)
  getNigerianBanks: async (): Promise<Bank[]> => {
    try {
      const response = await api.get('/api/wallet/banks');
      const banks: Bank[] = response.data?.data || [];
      return banks.length ? banks : FALLBACK_BANKS;
    } catch {
      return FALLBACK_BANKS;
    }
  },

  // Name on the account, if the bank can confirm it. Never throws: a failed check just isn't verified.
  resolveAccount: async (accountNumber: string, bankCode: string): Promise<AccountLookup> => {
    try {
      const response = await api.post('/api/wallet/resolve-account', { accountNumber, bankCode }, { timeout: 12000 });
      return response.data?.data || { verified: false, reason: 'unavailable' };
    } catch {
      return { verified: false, reason: 'unavailable' };
    }
  },
};
