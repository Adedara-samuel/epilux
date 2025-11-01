import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartAPI, Cart, CartItem } from '@/services/cart';
import { useAuth } from './useAuth';

export const useCart = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => cartAPI.getCart(user?.token || ''),
        enabled: true,
        retry: 1,
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: ({ productId, quantity, image, name, price }: { productId: string; quantity: number; image: string; name?: string; price?: number }) =>
            cartAPI.addToCart(user?.token || '', productId, quantity, image || '', name, price),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            cartAPI.updateCartItem(user?.token || '', itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (itemId: string) =>
            cartAPI.removeFromCart(user?.token || '', itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: () => cartAPI.clearCart(user?.token || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};