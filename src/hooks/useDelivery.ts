// src/hooks/useDelivery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryAPI } from '@/services/delivery';

// Hook for tracking package
export const usePackageTracking = (trackingNumber: string) => {
  return useQuery({
    queryKey: ['delivery', 'tracking', trackingNumber],
    queryFn: () => deliveryAPI.trackPackage(trackingNumber),
    enabled: !!trackingNumber,
  });
};

// Hook for getting delivery rates
export const useDeliveryRates = () => {
  return useQuery({
    queryKey: ['delivery', 'rates'],
    queryFn: () => deliveryAPI.getDeliveryRates(),
  });
};

// Hook for estimating delivery cost
export const useDeliveryEstimate = () => {
  return useMutation({
    mutationFn: deliveryAPI.estimateDeliveryCost,
  });
};