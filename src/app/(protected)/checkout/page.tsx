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
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useUserAddresses } from '@/hooks/useUser';
import { useCart } from '@/hooks/useCart';
import { useInitializePayment } from '@/hooks/usePayment';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

const formSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
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

    const initializePaymentMutation = useInitializePayment();

    const { data: cartData, isLoading: cartLoading } = useCart();
    const { data: addresses, isLoading: addressesLoading } = useUserAddresses();
    const cartQueryEnabled = !!token;

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    // Be tolerant of different shapes returned by the cart API and local store
    const cartDataAny: any = cartData;
    const storeCartAny: any = cart;

    const rawItems: any[] = cartDataAny?.data?.items || cartDataAny?.items || storeCartAny || [];

    const normalizedCartItems = (Array.isArray(rawItems) ? rawItems : [])
        .filter((item: any) => item && (item.product || item.productId || item._id || item.id))
        .map((item: any) => ({
            id: item.product || item.productId?._id || item._id || item.id,
            name: item.name || item.product?.name || item.productId?.name || '',
            price: item.price || item.product?.price || item.productId?.price || 0,
            image: item.image || item.product?.image || item.productId?.images?.[0]?.url || '',
            quantity: item.quantity || item.qty || 1,
        }));

    const subtotal = normalizedCartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 10000 ? 0 : 1500;
    const totalAmount = subtotal + deliveryFee;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: user ? `${user.firstName} ${user.lastName}` : '',
            email: user?.email || '',
            phone: '',
            address: '',
            city: '',
            state: '',
            additionalInfo: '',
        },
    });

    useEffect(() => {
        if (authLoading || addressesLoading || (cartQueryEnabled && cartLoading)) return;
        if (!user) { router.push('/login?redirect=/checkout'); return; }

        if (user && !form.formState.isDirty) {
            const addressList = addresses?.addresses || addresses?.data || addresses || [];
            const defaultAddress = Array.isArray(addressList) ? addressList.find((addr: any) => addr.isDefault) || addressList[0] : addressList;
            form.reset({
                ...form.getValues(),
                fullName: `${user.firstName} ${user.lastName}`,
                email: user?.email || '',
                address: defaultAddress?.street || '',
                city: defaultAddress?.city || '',
                state: defaultAddress?.state || '',
            });
            if (defaultAddress?._id) {
                setSelectedAddressId(defaultAddress._id);
            }
        }
    }, [user, authLoading, router, form, addresses, addressesLoading, cartQueryEnabled, cartLoading]);

    const handlePayment = async () => {
        const isFormValid = await form.trigger();
        if (!isFormValid) {
            toast.error("Please fill in all delivery details.");
            return;
        }

        // CORRECTED ID PICKING: Trying different possible paths for the ID
        const cartAny: any = cartData;
        const orderId = cartAny?.data?._id || cartAny?._id || cartAny?.data?.id || cartAny?.id || (cart as any)?._id || (cart as any)?.id;

        if (!orderId) {
            console.error("Cart Data structure:", cartData);
            toast.error("Order session not found. Please go back to cart and try again.");
            return;
        }

        setIsProcessingPayment(true);

        try {
            const deliveryInfo = form.getValues();

            const paymentPayload = {
                orderId: orderId,
                paymentData: {
                    // extras required for backend validation
                    amount: totalAmount,
                    email: deliveryInfo.email || user?.email || '',
                    phone: deliveryInfo.phone,
                    name: deliveryInfo.fullName,

                    items: normalizedCartItems.map((item: any) => ({
                        product: item.id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    shippingAddress: {
                        address: deliveryInfo.address,
                        city: deliveryInfo.city,
                        state: deliveryInfo.state,
                        country: 'Nigeria'
                    },
                    customerInfo: {
                        name: deliveryInfo.fullName,
                        phone: deliveryInfo.phone,
                        email: deliveryInfo.email || user?.email || ''
                    },
                    paymentMethod: 'flutterwave',
                    totalAmount: totalAmount
                }
            };

            const response = await initializePaymentMutation.mutateAsync(paymentPayload);

            if (response?.data?.link || response?.link) {
                window.location.href = response.data?.link || response.link;
            } else {
                toast.error("Unable to generate payment link.");
            }

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Payment initialization failed.");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (authLoading || (cartQueryEnabled && cartLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // if there are no items, prompt user to go back
    if (normalizedCartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <Button onClick={() => router.push('/cart')} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Go to Cart
                </Button>
            </div>
        );
    }

    return (
        <div className="app-content min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Button onClick={() => router.back()} variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 transition-all duration-200">
                        <ArrowLeft className="h-4 w-4" /> Back to Cart
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    <div className="lg:w-2/3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Delivery Information</h2>
                                </div>
                                <p className="text-gray-600">Provide the address where you'd like your order delivered. You can choose from a saved address or enter a new one.</p>
                            </div>

                            {/* saved address selector if user has any */}
                            {addresses && Array.isArray(addresses?.addresses || addresses?.data) && (addresses?.addresses || addresses?.data).length > 0 && (
                                <div className="mb-6">
                                    <select
                                        className="w-full border-gray-200 rounded-xl p-2"
                                        value={selectedAddressId || ''}
                                        onChange={(e) => {
                                            const id = e.target.value || null;
                                            setSelectedAddressId(id);
                                            if (id) {
                                                const list = addresses?.addresses || addresses?.data || [];
                                                const found = (Array.isArray(list) ? list : []).find((a: any) => a._id === id);
                                                if (found) {
                                                    form.setValue('address', found.street || '');
                                                    form.setValue('city', found.city || '');
                                                    form.setValue('state', found.state || '');
                                                }
                                            }
                                        }}
                                    >
                                        <option value="">-- Enter a new address --</option>
                                        {(addresses?.addresses || addresses?.data || []).map((addr: any) => (
                                            <option key={addr._id} value={addr._id}>{addr.street}, {addr.city}, {addr.state}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <Form {...form}>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="fullName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Full Name</FormLabel>
                                                <FormControl><Input placeholder="Enter your full name" className="rounded-xl border-gray-200 focus:ring-blue-500" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Email Address</FormLabel>
                                                <FormControl><Input type="email" placeholder="you@example.com" className="rounded-xl border-gray-200" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">Phone Number</FormLabel>
                                                <FormControl><Input placeholder="e.g. 08012345678" className="rounded-xl border-gray-200" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-semibold">Delivery Address</FormLabel>
                                            <FormControl><Input placeholder="House number and street name" className="rounded-xl border-gray-200" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField control={form.control} name="city" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">City</FormLabel>
                                                <FormControl><Input className="rounded-xl border-gray-200" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold">State</FormLabel>
                                                <FormControl><Input className="rounded-xl border-gray-200" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-semibold">Additional Info</FormLabel>
                                            <FormControl><Input placeholder="Apt, suite, landmark (optional)" className="rounded-xl border-gray-200" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </form>
                            </Form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Payment Method</h2>
                            </div>

                            <div className="p-8 border-2 border-green-200 rounded-xl bg-green-50/50 flex flex-col items-center text-center">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">💳</span>
                                </div>
                                <h3 className="font-bold text-xl text-green-800 mb-2">Secure Checkout</h3>
                                <p className="text-green-600 mb-6 max-w-sm">You will be redirected to the secure Flutterwave gateway to complete your payment.</p>

                                <Button
                                    onClick={handlePayment}
                                    disabled={isProcessingPayment}
                                    className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-green-200/50 transition-all duration-300 text-lg"
                                >
                                    {isProcessingPayment ? (
                                        <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Initializing Payment...</span>
                                    ) : (
                                        'Pay Now'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">Order Summary</h2>
                            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {normalizedCartItems.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
                                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-blue-600 font-bold">₦{item.price.toLocaleString()}</p>
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