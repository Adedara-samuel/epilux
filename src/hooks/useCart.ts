import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartAPI, Cart, CartItem } from '@/services/cart';
import { useAuth } from './useAuth';

export const useCart = () => {
    const { token } = useAuth();
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => cartAPI.getCart(token || ''),
        enabled: !!token,
        retry: 1,
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    const { token, user } = useAuth();

    return useMutation({
        mutationFn: ({ productId, quantity, image, name, price }: { productId: string; quantity: number; image: string; name?: string; price?: number }) =>
            cartAPI.addToCart(token || '', productId, quantity, image || '', name, price, user?.id || user?._id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            cartAPI.updateCartItem(token || '', itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: (itemId: string) =>
            cartAPI.removeFromCart(token || '', itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: () => cartAPI.clearCart(token || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};