/* eslint-disable @next/next/no-img-element */
// app/cart/page.tsx
'use client';
import { useCart } from '@/app/context/cart-context';
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
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Your Shopping Cart ({totalItems} items)</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg items-center">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col sm:flex-row justify-between items-center w-full">
                                        <div className="text-center sm:text-left mb-3 sm:mb-0">
                                            <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-500">₦{item.price.toLocaleString()} per unit</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="text-gray-600 hover:bg-gray-100 p-2"
                                                >
                                                    <Minus size={16} />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                    className="w-16 text-center border-y-0 border-x border-gray-300 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-1"
                                                    min="1"
                                                    max={item.stock} // Added max attribute for quantity input
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="text-gray-600 hover:bg-gray-100 p-2"
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                            </div>

                                            <div className="font-bold text-lg text-blue-700 w-24 text-right">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2 ml-2"
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700">
                                Clear Cart
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6 border-b border-gray-200 pb-4">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>₦{subtotal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-gray-700">
                                <span>Delivery Fee</span>
                                <span>₦{deliveryFee.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-xl text-blue-800">
                            <span>Total</span>
                            <span>₦{(subtotal + deliveryFee).toLocaleString()}</span>
                        </div>

                        <Button asChild className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                            <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>

                        <div className="mt-4 text-center text-sm text-gray-500">
                            or{' '}
                            <Link href="/products" className="text-blue-600 hover:underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}