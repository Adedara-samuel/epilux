// src/hooks/useProducts.ts
import { adminProductsAPI, productsAPI } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Hook for getting products
export const useProducts = (params?: { category?: string; search?: string }) => {
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

// Hook for creating product (admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminProductsAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
};

// Hook for updating product (admin)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof adminProductsAPI.updateProduct>[1] }) =>
      adminProductsAPI.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

// Hook for deleting product (admin)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminProductsAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

// Hook for getting categories (admin)
export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminProductsAPI.getCategories,
  });
};

// Hook for getting categories (public)
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsAPI.getCategories,
  });
};

// Hook for getting admin products
export const useAdminProducts = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminProductsAPI.getProducts(params),
  });
};

// Hook for getting admin product
export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => adminProductsAPI.getProduct(id),
    enabled: !!id,
  });
};

// Hook for searching products
export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productsAPI.searchProducts(query),
    enabled: !!query,
  });
};

// Hook for getting products by category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productsAPI.getProductsByCategory(category),
    enabled: !!category,
  });
};

// Hook for getting product reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['product', 'reviews', productId],
    queryFn: () => productsAPI.getProductReviews(productId),
    enabled: !!productId,
  });
};

// Hook for adding product review
export const useAddProductReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }: { productId: string; reviewData: Parameters<typeof productsAPI.addProductReview>[1] }) =>
      productsAPI.addProductReview(productId, reviewData),
    onSuccess: (_, { productId }) => {
      // These invalidations ensure the UI automatically updates with the new review and average rating.
      queryClient.invalidateQueries({ queryKey: ['product', 'reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', 'ratings', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', 'rating-summary', productId] });
      
    },
  });
};

// Hook for getting product ratings
export const useProductRatings = (productId: string) => {
  return useQuery({
    queryKey: ['product', 'ratings', productId],
    queryFn: () => productsAPI.getProductRatings(productId),
    enabled: !!productId,
  });
};

// Hook for getting product rating summary
export const useProductRatingSummary = (productId: string) => {
  return useQuery({
    queryKey: ['product', 'rating-summary', productId],
    queryFn: () => productsAPI.getProductRatingSummary(productId),
    enabled: !!productId,
  });
};

// Hook for uploading product images (admin)
export const useUploadProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, images }: { id: string; images: File[] }) =>
      adminProductsAPI.uploadProductImages(id, images),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', id] });
    },
  });
};

// Hook for getting current user's ratings
export const useUserRatings = () => {
  return useQuery({
    queryKey: ['user', 'ratings'],
    queryFn: productsAPI.getUserRatings,
  });
};