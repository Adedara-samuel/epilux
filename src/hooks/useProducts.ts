// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '@/services';

// Hook for getting products
export const useProducts = (params?: Parameters<typeof productsAPI.getProducts>[0]) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsAPI.getProducts(params),
  });
};

// Hook for getting single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProduct(id),
    enabled: !!id,
  });
};

// Hook for creating product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hook for updating product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof productsAPI.updateProduct>[1] }) =>
      productsAPI.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

// Hook for deleting product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hook for getting categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsAPI.getCategories,
  });
};

// Hook for getting brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: productsAPI.getBrands,
  });
};