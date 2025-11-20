/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// app/cart/page.tsx
'use client';
import { useCartStore } from '@/stores/cart-store';
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import EmptyState from '@/Components/empty-state';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
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

    const cart = useCartStore((s) => s.cart);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const clearCartStore = useCartStore((s) => s.clearCart);
    const getTotalItems = useCartStore((s) => s.getTotalItems);
    const getTotalPrice = useCartStore((s) => s.getTotalPrice);

    // Normalize cart items to handle both API and local store data consistently
    const normalizedCartItems = cartData ? (cartData.data.items as any[])
        .filter(item => {
            if (!item.product) {
                console.warn('Filtering out cart item with missing product:', item);
                return false;
            }
            return true;
        })
        .map(item => ({
            id: item.product, // Product ID
            name: item.name,
            price: item.price,
            images: item.images,
            image: item.image,
            quantity: item.quantity,
            _id: item._id, // Cart item ID (if exists)
        })) : cart;

    const cartTotal = (cartData?.data as any)?.subtotal || normalizedCartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

    const handleUpdateQuantity = async (itemId: string | undefined, newQuantity: number, productId: string) => {
        if (newQuantity < 1) return;

        // 1. Update local store first for instant UI feedback
        updateQuantity(productId, newQuantity);

        // 2. Call API if user is logged in AND we have the API item ID
        try {
            if (token && itemId) { // Added check for itemId
                await updateCartItemAPI.mutateAsync({ itemId, quantity: newQuantity });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update item quantity');
        }
    };

    const handleRemoveItem = async (itemId: string | undefined, productId: string) => {
        // 1. Update local store first
        removeFromCart(productId);

        // 2. Call API if user is logged in AND we have the API item ID
        try {
            if (token && itemId) { // Added check for itemId
                await removeFromCartAPI.mutateAsync(itemId);
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
                await clearCartAPI.mutateAsync();
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
        // If API fails (e.g., 401 unauthorized), we still render with local data
        console.error("Cart API Error:", error);
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
        <div className="bg-gray-50 min-h-screen pt-12 pb-24">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart ({normalizedCartItems.length})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {normalizedCartItems.map((item) => (
                            // Use the more reliable item.id for local items, or item._id for API items
                            <div key={item._id || item.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex items-center space-x-4">
                                {/* Product Image */}
                                <Link href={`/products/${item.id || item._id}`} className="flex-shrink-0">
                                    <img
                                        src={item.images?.[0]?.url ? `${API_BASE_URL}${item.images[0].url}` : (item.image ? `${API_BASE_URL}${item.image}` : '/images/placeholder.jpg')}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                        onError={(e) => {
                                            // Don't set fallback if already set to avoid infinite loop
                                            if ((e.target as HTMLImageElement).src !== '/images/placeholder.jpg') {
                                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                            }
                                        }}
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="flex-grow min-w-0">
                                    <Link href={`/products/${item.id || item._id}`}>
                                        <h2 className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                                            {item.name}
                                        </h2>
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        ₦{(item.price || 0).toLocaleString()} per unit
                                    </p>
                                </div>

                                {/* Quantity Control & Price */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                                            // 👇 CORRECTED: Pass item._id for API call, and item.id || item._id for local store product ID
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1, item.id || item._id!)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newQuantity = parseInt(e.target.value);
                                                if (!isNaN(newQuantity) && newQuantity >= 1) {
                                                    // 👇 CORRECTED: Pass item._id for API call, and item.id || item._id for local store product ID
                                                    handleUpdateQuantity(item._id, newQuantity, item.id || item._id!);
                                                }
                                            }}
                                            className="w-12 text-center border-y-0 text-base h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                                            // 👇 CORRECTED: Pass item._id for API call, and item.id || item._id for local store product ID
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1, item.id || item._id!)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="font-semibold text-gray-900 w-20 text-right">
                                        ₦{((item.price || 0) * item.quantity).toLocaleString()}
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                                        // 👇 CORRECTED: Pass item._id for API call, and item.id || item._id for local store product ID
                                        onClick={() => handleRemoveItem(item._id, item.id || item._id!)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart Button */}
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={handleClearCart}
                                disabled={clearCartAPI.isPending}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({normalizedCartItems.length} items)</span>
                                    <span>₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-600">Calculated at Checkout</span>
                                </div>
                                <div className="flex justify-between text-gray-600 border-t pt-4">
                                    <span className="font-medium text-lg">Total (Estimated)</span>
                                    <span className="font-bold text-xl text-blue-600">₦{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button
                                    onClick={() => {
                                        console.log('Checkout button clicked, navigating to /checkout');
                                        router.push('/checkout');
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg transition-colors"
                                >
                                    Proceed to Checkout
                                </Button>

                                <div className="mt-6 text-center">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        <span>Continue Shopping</span>
                                        <span className="text-xl">→</span>
                                    </Link>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                    <div className="flex items-center gap-3 text-sm text-blue-800">
                                        <span className="text-lg">🔒</span>
                                        <div>
                                            <p className="font-medium">Secure Checkout</p>
                                            <p className="text-blue-600">SSL encrypted & protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}