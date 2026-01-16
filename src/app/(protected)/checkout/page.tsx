'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = 'force-dynamic';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/stores/cart-store';
import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { Input } from '@/Components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/Components/ui/form';
import { Button } from '@/Components/ui/button';
// import PaystackButton from '@/Components/payment/paystackbutton';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
// import ClientPaystackButton from '@/Components/payment/ClientPaystackButton';
import { useCreateOrder, useCancelOrder } from '@/hooks/useOrders';
import { orderActionsAPI } from '@/services/orders';
import { useUserAddresses } from '@/hooks/useUser';
import { useCart } from '@/hooks/useCart';
import { paymentAPI } from '@/services/payment';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

const formSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(11, 'Valid phone number is required (min 11 digits)').max(15, 'Phone number too long'),
    address: z.string().min(5, 'Delivery address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    additionalInfo: z.string().optional(),
});

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading: authLoading, token } = useAuth();
    const cart = useCartStore((s) => s.cart);
    const clearCart = useCartStore((s) => s.clearCart);
    const createOrderMutation = useCreateOrder();
    const cancelOrderMutation = useCancelOrder();
    const { data: cartData, isLoading: cartLoading } = useCart();
    const { data: addresses, isLoading: addressesLoading } = useUserAddresses();
    const cartQueryEnabled = !!token;

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Normalize cart items to handle both API and local store data consistently
    const normalizedCartItems = cartData ? (cartData.data.items as any[])
        .filter(item => item.product)
        .map(item => ({
            id: item.product,
            name: item.name,
            price: item.price,
            images: item.images,
            image: item.image,
            quantity: item.quantity,
            _id: item._id,
        })) : cart;

    const subtotal = normalizedCartItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 10000 ? 0 : 1500;
    const totalAmount = subtotal + deliveryFee;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // Ensure this default value access is safe. useAuth should return a default 
            // empty/null user during server rendering to prevent errors.
            fullName: user ? `${user.firstName} ${user.lastName}` : '',
            phone: '',
            address: '',
            city: '',
            state: '',
            additionalInfo: '',
        },
    });

    useEffect(() => {
        if (authLoading || addressesLoading || (cartQueryEnabled && cartLoading)) {
            return;
        }

        if (!user) {
            router.push('/login?redirect=/checkout');
            return;
        }

        if (normalizedCartItems.length === 0) {
            console.log('No items in cart, redirecting to cart page');
            router.push('/cart');
            return;
        }

        // Only reset form with user data if the user is available and form hasn't been touched
        if (user && !form.formState.isDirty) {
            // Handle different response formats: { addresses: [...] } or direct array
            const addressList = addresses?.addresses || addresses?.data || addresses || [];
            const defaultAddress = Array.isArray(addressList)
                ? addressList.find((addr: any) => addr.isDefault) || addressList[0]
                : addressList;

            form.reset({
                ...form.getValues(),
                fullName: `${user.firstName} ${user.lastName}`,
                address: defaultAddress?.street || '',
                city: defaultAddress?.city || '',
                state: defaultAddress?.state || '',
            });
        }
    }, [user, authLoading, normalizedCartItems.length, router, form, addresses, addressesLoading, cartQueryEnabled, cartLoading]);


    const handlePayment = async () => {
        console.log('Pay now button clicked');
        console.log('Form valid:', form.formState.isValid);


        setIsProcessingPayment(true);
        console.log('Starting payment process...');

        try {
            const deliveryInfo = form.getValues();
            const orderData = {
                items: normalizedCartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    street: deliveryInfo.address,
                    city: deliveryInfo.city,
                    state: deliveryInfo.state,
                    zipCode: '000000',
                    country: 'Nigeria',
                },
                billingAddress: {
                    street: deliveryInfo.address,
                    city: deliveryInfo.city,
                    state: deliveryInfo.state,
                    zipCode: '000000',
                    country: 'Nigeria',
                },
                paymentMethod: 'wallet',
                buyer: user?.id,
                userId: user?.id,
                totalAmount: totalAmount,
                shipping: deliveryFee,
                tax: 0,
                subtotal: subtotal,
                notes: deliveryInfo.additionalInfo,
            };

            console.log('Creating order with data:', orderData);
            // Create order first
            const orderResponse = await (createOrderMutation.mutateAsync as any)(orderData);
            console.log('Order created:', orderResponse);

            // Redirect to payment method selection page
            router.push(`/payment/${orderResponse.id}`);
        } catch (error: any) {
            console.error('Error processing payment:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to process payment. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsProcessingPayment(false);
        }
    };


    if (authLoading || (cartQueryEnabled && cartLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading checkout data...</p>
            </div>
        );
    }

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="app-content min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        onClick={handleGoBack}
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cart
                    </Button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Secure Checkout</h1>
                    <p className="text-gray-600">Complete your order with confidence</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    <div className="lg:w-2/3 space-y-6 lg:space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">1</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Delivery Information</h2>
                            </div>
                            <Form {...form}>
                                <form className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your full name"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="e.g., 08012345678"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Delivery Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Street address, building name"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">City</FormLabel>
                                                    <FormControl>
                                                            <Input
                                                                placeholder="e.g., Lagos"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                                {...field}
                                                            />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500 text-sm" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">State</FormLabel>
                                                    <FormControl>
                                                            <Input
                                                                placeholder="e.g., Lagos State"
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                                {...field}
                                                            />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500 text-sm" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="additionalInfo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Additional Information (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Apartment number, nearby landmarks, delivery instructions"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-bold text-sm">2</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Payment Method</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="p-8 border-2 border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-100 rounded-full -ml-8 -mb-8 opacity-50"></div>

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-xl text-green-700 mb-3">Secure Payment</h3>
                                        <p className="text-gray-600 mb-6 max-w-md">
                                            Complete your order with our secure payment system. All transactions are protected and encrypted.
                                        </p>
                                        {user?.email ? (
                                            <Button
                                                onClick={handlePayment}
                                                disabled={isProcessingPayment || createOrderMutation.isPending}
                                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50 cursor-pointer transform hover:scale-105"
                                            >
                                                {isProcessingPayment ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Processing Payment...
                                                    </>
                                                ) : (
                                                    'Pay now'
                                                )}
                                            </Button>
                                        ) : (
                                            <Button disabled className="w-full bg-gray-400 text-white py-4 px-8 rounded-xl cursor-pointer">
                                                Login to Pay Online
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
            
                            {/* Progress Indicator */}
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <span className="ml-2 text-sm font-medium text-blue-600">Cart</span>
                                    </div>
                                    <div className="w-8 h-0.5 bg-blue-600"></div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <span className="ml-2 text-sm font-medium text-blue-600">Checkout</span>
                                    </div>
                                    <div className="w-8 h-0.5 bg-gray-300"></div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                        <span className="ml-2 text-sm font-medium text-gray-400">Payment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-sm">3</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Order Summary</h2>
                            </div>

                            <div className="space-y-4 mb-8">
                                {normalizedCartItems.map((item: CartItem) => (
                                    <div key={item.id} className="flex justify-between items-center py-4 px-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × ₦{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="font-bold text-gray-800 text-lg">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-800">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-semibold text-gray-800">₦{deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                                    <span className="font-bold text-xl text-gray-800">Total</span>
                                    <span className="font-bold text-2xl text-purple-700">₦{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}