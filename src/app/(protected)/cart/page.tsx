/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// app/cart/page.tsx
'use client';

// Forces the page to be rendered dynamically on every request,
// preventing static prerendering which triggers errors in client-side components
export const dynamic = 'force-dynamic';
import { useCartStore } from '@/stores/cart-store';
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { cartAPI } from '@/services/cart';
import { useQueryClient } from '@tanstack/react-query';
import EmptyState from '@/Components/empty-state';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { shallow } from 'zustand/shallow';
import { API_BASE_URL } from '@/services/base';

// The EmptyState component definition is omitted for brevity but assumed to exist.

export default function CartPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const { data: cartData, isLoading, isError, error } = useCart();
    const cartQueryEnabled = !!token;
    const updateCartItemAPI = useUpdateCartItem();
    const removeFromCartAPI = useRemoveFromCart();
    const clearCartAPI = useClearCart();
    const queryClient = useQueryClient();

    const cart = useCartStore((s) => s.cart);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const clearCartStore = useCartStore((s) => s.clearCart);
    const getTotalItems = useCartStore((s) => s.getTotalItems);
    const getTotalPrice = useCartStore((s) => s.getTotalPrice);

    // Only use API cart data for logged-in users, don't fall back to local store
    const normalizedCartItems = cartData && cartData.data && cartData.data.items ? (cartData.data.items as any[])
        .filter(item => {
            if (!item || !item.product) {
                console.warn('Filtering out cart item with missing product:', item);
                return false;
            }
            return true;
        })
        .map(item => ({
            id: item.product,
            name: item.name,
            price: item.price,
            images: item.images,
            image: item.image,
            quantity: item.quantity,
            _id: item.product, // Use product ID for API calls since backend doesn't send cart item _id
        })) : [];


    const cartTotal = (cartData?.data as any)?.subtotal || 0;
    const totalItems = (cartData?.data as any)?.totalItems || 0;

    const handleUpdateQuantity = async (itemId: string | undefined, newQuantity: number, productId: string) => {
        if (newQuantity < 0) return;

        // If new quantity is 0, remove the item instead
        if (newQuantity === 0) {
            await handleRemoveItem(itemId, productId);
            return;
        }

        // 1. Update local store first for instant UI feedback
        updateQuantity(productId, newQuantity);

        // 2. Call API if user is logged in AND we have the API item ID
        try {
            if (token && itemId) { // Added check for itemId
                await cartAPI.updateCartItem(token, itemId, newQuantity);
                // Invalidate and refetch cart data
                queryClient.invalidateQueries({ queryKey: ['cart'] });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update item quantity');
        }
    };

    const handleIncreaseQuantity = async (productId: string, item: any) => {
        // 1. Update local store first for instant UI feedback
        updateQuantity(productId, item.quantity + 1);

        // 2. Call API if user is logged in
        try {
            if (token) {
                const image = item.image || item.images?.[0]?.url || '';
                await cartAPI.addToCart(token, productId, 1, image, item.name, item.price);
                // Invalidate and refetch cart data
                queryClient.invalidateQueries({ queryKey: ['cart'] });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to increase quantity');
        }
    };

    const handleRemoveItem = async (itemId: string | undefined, productId: string) => {
        // 1. Update local store first
        removeFromCart(productId);

        // 2. Call API if user is logged in AND we have the API item ID
        try {
            if (token && itemId) { // Added check for itemId
                await cartAPI.removeFromCart(token, itemId);
                // Invalidate and refetch cart data
                queryClient.invalidateQueries({ queryKey: ['cart'] });
                toast.success('Item removed from cart!');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        // 1. Clear local store first
        clearCartStore();

        // 2. Call API if user is logged in
        try {
            if (token) {
                await cartAPI.clearCart(token);
                // Invalidate and refetch cart data
                queryClient.invalidateQueries({ queryKey: ['cart'] });
                toast.success('Your cart has been cleared!');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to clear cart');
        }
    };

    if (isLoading && cartQueryEnabled) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-xl font-medium text-gray-700">Loading your cart...</p>
            </div>
        );
    }

    if (isError && cartQueryEnabled) {
        // If API fails, show error instead of falling back to local data
        console.error("Cart API Error:", error);
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Cart</h2>
                    <p className="text-gray-600 mb-6">
                        There was an error loading your cart. Please try refreshing the page.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Refresh Page
                    </Button>
                </div>
            </div>
        );
    }

    if (normalizedCartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <EmptyState
                    title="Your Cart is Empty"
                    description="Looks like you haven't added anything to your cart yet. Explore our products!"
                    actionText="Start Shopping"
                    actionLink="/products"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                            <p className="text-gray-600 text-sm md:text-base">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
                        </div>
                    </div>

                    {/* Clear Cart Button */}
                    {normalizedCartItems.length > 0 && (
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                            onClick={handleClearCart}
                            disabled={clearCartAPI.isPending}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cart
                        </Button>
                    )}
                </div>

                {normalizedCartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
                        </p>
                        <Link href="/products">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {normalizedCartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center gap-4">
                                            {/* Product Image */}
                                            <Link href={`/products/${item.id}`} className="flex-shrink-0">
                                                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                    <img
                                                        src={item.images?.[0]?.url ? `${API_BASE_URL}${item.images[0].url}` : (item.image ? `${API_BASE_URL}${item.image}` : '/images/placeholder.jpg')}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            if ((e.target as HTMLImageElement).src !== '/images/placeholder.jpg') {
                                                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-grow min-w-0">
                                                <Link href={`/products/${item.id}`}>
                                                    <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-600 text-sm mb-3">
                                                    ₦{(item.price || 0).toLocaleString()} each
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 text-gray-600 hover:bg-white hover:text-red-600 rounded-l-xl"
                                                            onClick={() => {
                                                                const newQuantity = item.quantity === 5 ? 0 : item.quantity - 1;
                                                                handleUpdateQuantity(item._id, newQuantity, item.id);
                                                            }}
                                                            disabled={item.quantity < 5}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>

                                                        <div className="px-4 py-2 min-w-16 text-center">
                                                            <span className="font-semibold text-gray-900">{item.quantity}</span>
                                                        </div>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 text-gray-600 hover:bg-white hover:text-green-600 rounded-r-xl"
                                                            onClick={() => handleIncreaseQuantity(item.id, item)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Item Total */}
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900 text-lg">
                                                            ₦{((item.price || 0) * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl flex-shrink-0"
                                                onClick={() => handleRemoveItem(item._id, item.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 text-sm">🧾</span>
                                        </div>
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                                            <span className="font-semibold text-gray-900">₦{cartTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-green-600 font-medium">Free</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="text-green-600 font-medium">Calculated at checkout</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-lg text-gray-900">Total</span>
                                                <span className="font-bold text-2xl text-blue-600">₦{cartTotal.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => router.push('/checkout')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
                                    >
                                        Proceed to Checkout
                                    </Button>

                                    <Link href="/products">
                                        <Button
                                            variant="outline"
                                            className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 py-3 transition-all duration-200"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Continue Shopping
                                        </Button>
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500">🔒</span>
                                                <span>Secure</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-500">🚚</span>
                                                <span>Free Shipping</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}