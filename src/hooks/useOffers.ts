// src/hooks/useOffers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { offersAPI } from '@/services/offers';

export const useLiveOffers = () => useQuery({ queryKey: ['offers', 'live'], queryFn: offersAPI.getLive, staleTime: 60_000 });

export const useOffer = (slug: string | null) =>
  useQuery({ queryKey: ['offers', 'slug', slug], queryFn: () => offersAPI.getBySlug(slug as string), enabled: !!slug, retry: false });

export const useAdminOffers = () => useQuery({ queryKey: ['offers', 'admin'], queryFn: offersAPI.getAll });

const useOfferMutation = <TVars,>(fn: (vars: TVars) => Promise<unknown>) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }) });
};

export const useCreateOffer = () => useOfferMutation(offersAPI.create);
export const useUpdateOffer = () => useOfferMutation(offersAPI.update);
export const useDeleteOffer = () => useOfferMutation(offersAPI.remove);
