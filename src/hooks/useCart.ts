import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '@/services/cart';
import { calculateDeliveryFee } from '@/services/delivery';
import { useAuth } from './useAuth';

export interface CartLine {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    stock: number;
    lineTotal: number;
}

type RawCartItem = {
    product?: string | { _id?: string };
    name?: string;
    price?: number;
    quantity?: number;
    image?: string;
    images?: { url: string; isPrimary?: boolean }[];
    productDetails?: { stock?: number };
};

/** Cart lines and totals, shaped the same way everywhere (header, cart, checkout). */
export const useCartSummary = () => {
    const query = useCart();
    const summary = useMemo(() => {
        const raw: RawCartItem[] = (query.data as { data?: { items?: RawCartItem[] } } | undefined)?.data?.items || [];
        const lines: CartLine[] = raw
            .filter((item) => item.product)
            .map((item) => {
                const productId = typeof item.product === 'string' ? item.product : String(item.product?._id || '');
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const primary = item.images?.find((img) => img.isPrimary) || item.images?.[0];
                return {
                    productId,
                    name: item.name || 'Product',
                    price,
                    quantity,
                    image: item.image || primary?.url || null,
                    stock: Number(item.productDetails?.stock ?? 0),
                    lineTotal: price * quantity,
                };
            });
        const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
        const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
        const deliveryFee = lines.length ? calculateDeliveryFee(subtotal) : 0;
        return { lines, subtotal, itemCount, deliveryFee, total: subtotal + deliveryFee };
    }, [query.data]);
    return { ...query, ...summary };
};

export const useCart = () => {
    const { token } = useAuth();
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => cartAPI.getCart(token || ''),
        enabled: !!token,
        retry: 1,
    });
};

// Price, name and image always come from the catalogue on the server;
// extra fields passed by older callers are ignored.
export const useAddToCart = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: string; quantity: number; image?: string; name?: string; price?: number }) =>
            cartAPI.addToCart(token || '', productId, quantity),
        onSuccess: (data) => {
            // Update the header badge immediately, then refetch
            if (data?.data) queryClient.setQueryData(['cart'], data);
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