// src/services/offers.ts
// Promotional bundles managed in Admin → Offers (backend: routes/offers.js)
import { api } from './base';

export type OfferStatus = 'off' | 'scheduled' | 'live' | 'ended';

export interface Offer {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  image: { url: string } | null;
  bundleSize: number;
  unitPrice: number;
  bundlePrice: number;
  regularUnitPrice: number | null;
  regularBundlePrice: number | null;
  savings: number;
  savingsPercent: number;
  features: string[];
  terms?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  status: OfferStatus;
  isLive: boolean;
  isActive?: boolean;
  updatedAt?: string;
  product: {
    _id: string;
    name: string;
    category?: string;
    images?: { url: string; isPrimary?: boolean }[];
    stock?: number;
    inStock: boolean;
  } | null;
}

export interface OfferInput {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  product: string;
  bundleSize: number;
  unitPrice: number;
  features: string[];
  terms?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
}

const toFormData = (input: Partial<OfferInput>, image?: File | null, removeImage?: boolean) => {
  const form = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined) return;
    if (key === 'features') form.append(key, JSON.stringify(value));
    else form.append(key, value === null ? '' : String(value));
  });
  if (image) form.append('images', image);
  if (removeImage) form.append('removeImage', 'true');
  return form;
};

export const offersAPI = {
  // Public
  getLive: async (): Promise<Offer[]> => (await api.get('/api/offers')).data.data || [],
  getBySlug: async (slug: string): Promise<Offer> => (await api.get(`/api/offers/${encodeURIComponent(slug)}`)).data.data,

  // Admin
  getAll: async (): Promise<Offer[]> => (await api.get('/api/offers/admin/all')).data.data || [],
  create: async ({ input, image }: { input: OfferInput; image?: File | null }) =>
    (await api.post('/api/offers', toFormData(input, image), { headers: { 'Content-Type': 'multipart/form-data' } })).data as { success: boolean; message: string; data: Offer },
  update: async ({ id, input, image, removeImage }: { id: string; input: Partial<OfferInput>; image?: File | null; removeImage?: boolean }) =>
    (await api.put(`/api/offers/${id}`, toFormData(input, image, removeImage), { headers: { 'Content-Type': 'multipart/form-data' } })).data as { success: boolean; message: string; data: Offer },
  remove: async (id: string) => (await api.delete(`/api/offers/${id}`)).data as { success: boolean; message: string },
};
