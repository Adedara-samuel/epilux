/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// app/cart/page.tsx
'use client';
import { useCartStore } from '@/stores/cart-store';
import EmptyState from '@/Components/empty-state';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

// You might need to create this EmptyState component if you don't have it:
// components/empty-state.tsx
// 'use client';
// import Link from 'next/link';
// import { Button } from './ui/button';
//
// interface EmptyStateProps {
//   title: string;
//   description: string;
//   actionText: string;
//   actionLink: string;
// }
//
// export default function EmptyState({ title, description, actionText, actionLink }: EmptyStateProps) {
//   return (
//     <div className="container mx-auto px-4 py-12 text-center bg-white rounded-lg shadow-md mt-8">
//       <h2 className="text-3xl font-bold mb-4 text-blue-800">{title}</h2>
//       <p className="text-lg text-gray-600 mb-6">{description}</p>
//       <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
//         <Link href={actionLink}>{actionText}</Link>
//       </Button>
//     </div>
//   );
// }


export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore();
    const subtotal = totalPrice;
    const deliveryFee = subtotal >= 10000 ? 0 : 1500; // Adjusted for >= 10,000 for consistency

    if (cart.length === 0) {
        return <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet."
            actionText="Browse Products"
            actionLink="/products"
        />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Your Shopping Cart
                    </h1>
                    <p className="text-lg text-gray-600">
                        {totalItems > 0 ? `${totalItems} items in your cart` : 'Your cart is waiting for products'}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900">Cart Items</h2>
                                <p className="text-gray-600 mt-1">Review and manage your selected products</p>
                            </div>

                            <div className="p-6">
                                {cart.length > 0 ? (
                                    <div className="space-y-6">
                                        {cart.map((item) => (
                                            <div key={item.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                                                <div className="flex flex-col sm:flex-row gap-6 items-center">
                                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 w-full">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                                            <div>
                                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                                                                <p className="text-gray-600">₦{item.price.toLocaleString()} per unit</p>
                                                            </div>
                                                            <div className="text-2xl font-bold text-gray-900 mt-2 sm:mt-0">
                                                                ₦{(item.price * item.quantity).toLocaleString()}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                        className="text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-l-xl"
                                                                    >
                                                                        <Minus size={18} />
                                                                    </Button>
                                                                    <Input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                                        className="w-16 text-center border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold"
                                                                        min="1"
                                                                        max={item.stock}
                                                                    />
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        className="text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-r-xl"
                                                                    >
                                                                        <Plus size={18} />
                                                                    </Button>
                                                                </div>

                                                                <span className="text-sm text-gray-500">
                                                                    {item.stock > 10 ? 'In stock' : item.stock > 0 ? `Only ${item.stock} left` : 'Out of stock'}
                                                                </span>
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-red-500 hover:bg-red-50 hover:text-red-700 p-3 rounded-xl hover:shadow-md transition-all duration-300"
                                                            >
                                                                <Trash2 size={20} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-end pt-6 border-t border-gray-100">
                                            <Button
                                                variant="outline"
                                                onClick={clearCart}
                                                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 px-6 py-3 rounded-lg font-medium transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Clear All Items
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <span className="text-4xl">🛒</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h3>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                            Looks like you haven't added any items to your cart yet. Discover our premium water products!
                                        </p>
                                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-colors">
                                            <Link href="/products">Start Shopping</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    {cart.length > 0 && (
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                                        <p className="text-gray-600 text-sm">Review your order details</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-700 font-medium">Subtotal ({totalItems} items)</span>
                                        <span className="font-semibold text-gray-800">₦{subtotal.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-gray-700 font-medium">Delivery Fee</span>
                                        <span className="font-semibold text-gray-800">
                                            {deliveryFee === 0 ? (
                                                <span className="text-green-600 font-bold">FREE</span>
                                            ) : (
                                                `₦${deliveryFee.toLocaleString()}`
                                            )}
                                        </span>
                                    </div>

                                    {deliveryFee === 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <p className="text-green-800 text-sm flex items-center gap-2">
                                                <span className="text-lg">🎉</span>
                                                Congratulations! You qualify for free delivery.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-600 rounded-lg p-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-bold text-lg">Total</span>
                                        <span className="text-white font-bold text-2xl">₦{(subtotal + deliveryFee).toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-lg">
                                    <Link href="/checkout">
                                        Proceed to Checkout
                                    </Link>
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
                    )}
                </div>
            </div>
        </div>
    );
}