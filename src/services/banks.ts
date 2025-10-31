/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './base';

export interface NigerianBank {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export const banksAPI = {
  // Get all Nigerian banks from Paystack API
  getNigerianBanks: async (): Promise<NigerianBank[]> => {
    try {
      const response = await api.get('https://api.paystack.co/bank');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch Nigerian banks:', error);
      // Fallback to static list if API fails
      return getFallbackBanks();
    }
  },
};

// Fallback static list of Nigerian banks
const getFallbackBanks = (): NigerianBank[] => [
  { name: "Access Bank", slug: "access-bank", code: "044", longcode: "044150149", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 1, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Citibank Nigeria", slug: "citibank-nigeria", code: "023", longcode: "023150005", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 2, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Diamond Bank", slug: "diamond-bank", code: "063", longcode: "063150162", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 3, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Ecobank Nigeria", slug: "ecobank-nigeria", code: "050", longcode: "050150010", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 4, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Fidelity Bank", slug: "fidelity-bank", code: "070", longcode: "070150003", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 5, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "First Bank of Nigeria", slug: "first-bank-of-nigeria", code: "011", longcode: "011151003", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 6, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "First City Monument Bank", slug: "first-city-monument-bank", code: "214", longcode: "214150018", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 7, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Guaranty Trust Bank", slug: "guaranty-trust-bank", code: "058", longcode: "058152036", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 8, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Heritage Bank", slug: "heritage-bank", code: "030", longcode: "030159992", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 9, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Keystone Bank", slug: "keystone-bank", code: "082", longcode: "082150017", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 10, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Polaris Bank", slug: "polaris-bank", code: "076", longcode: "076151006", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 11, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Providus Bank", slug: "providus-bank", code: "101", longcode: "101152838", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 12, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Stanbic IBTC Bank", slug: "stanbic-ibtc-bank", code: "221", longcode: "221159522", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 13, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Standard Chartered Bank", slug: "standard-chartered-bank", code: "068", longcode: "068150015", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 14, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Sterling Bank", slug: "sterling-bank", code: "232", longcode: "232150016", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 15, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Suntrust Bank", slug: "suntrust-bank", code: "100", longcode: "100152049", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 16, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Union Bank of Nigeria", slug: "union-bank-of-nigeria", code: "032", longcode: "032080474", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 17, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "United Bank for Africa", slug: "united-bank-for-africa", code: "033", longcode: "033153513", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 18, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Unity Bank", slug: "unity-bank", code: "215", longcode: "215154097", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 19, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Wema Bank", slug: "wema-bank", code: "035", longcode: "035150103", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 20, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" },
  { name: "Zenith Bank", slug: "zenith-bank", code: "057", longcode: "057150013", gateway: null, pay_with_bank: false, active: true, country: "Nigeria", currency: "NGN", type: "nuban", id: 21, createdAt: "2016-07-14T10:04:29.000Z", updatedAt: "2020-02-18T20:24:17.000Z" }
];