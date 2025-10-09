'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Forces the page to be rendered dynamically on every request, 
// preventing static prerendering which triggers the 'window is not defined' error 
// in certain client-side dependencies.
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
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ClientPaystackButton from '@/Components/payment/ClientPaystackButton';
import { useCreateOrder } from '@/hooks/useOrders';

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
    const { user, loading: authLoading } = useAuth();
    const { cart, clearCart } = useCartStore();
    const createOrderMutation = useCreateOrder();

    const subtotal = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
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
        if (authLoading) {
            return;
        }

        if (!user) {
            router.push('/login?redirect=/checkout');
            return;
        }

        if (cart.length === 0) {
            router.push('/cart');
            return;
        }

        // Only reset form with user data if the user is available and form hasn't been touched
        if (user && !form.formState.isDirty) {
            form.reset({
                ...form.getValues(),
                fullName: `${user.firstName} ${user.lastName}`,
            });
        }
    }, [user, authLoading, cart.length, router, form]);


    const handlePaymentSuccess = async (reference: any) => {
        console.log('Payment successful:', reference);

        const deliveryInfo = form.getValues();
        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            shippingAddress: {
                street: deliveryInfo.address,
                city: deliveryInfo.city,
                state: deliveryInfo.state,
                zipCode: '000000', // Default
                country: 'Nigeria',
            },
            billingAddress: {
                street: deliveryInfo.address,
                city: deliveryInfo.city,
                state: deliveryInfo.state,
                zipCode: '000000',
                country: 'Nigeria',
            },
            paymentMethod: 'online',
            notes: deliveryInfo.additionalInfo,
        };

        try {
            await createOrderMutation.mutateAsync(orderData);
            toast.success("Order placed successfully!");
            clearCart();
            router.push(`/order/success?reference=${reference.reference}`);
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error("Payment successful but order creation failed. Please contact support.");
        }
    };

    const handleCashOnDelivery = async () => {
        // Trigger form validation first
        const isValid = await form.trigger();
        if (isValid) {
            const deliveryInfo = form.getValues();
            const orderData = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    street: deliveryInfo.address,
                    city: deliveryInfo.city,
                    state: deliveryInfo.state,
                    zipCode: '000000', // Default
                    country: 'Nigeria',
                },
                billingAddress: {
                    street: deliveryInfo.address,
                    city: deliveryInfo.city,
                    state: deliveryInfo.state,
                    zipCode: '000000',
                    country: 'Nigeria',
                },
                paymentMethod: 'cod',
                notes: deliveryInfo.additionalInfo,
            };

            try {
                await createOrderMutation.mutateAsync(orderData);
                toast.success("Order placed successfully!");
                clearCart();
                router.push(`/order/success?reference=cod`);
            } catch (error) {
                console.error('Error creating order:', error);
                toast.error("Failed to place order. Please try again.");
            }
        } else {
            // If validation fails, show an error toast
            toast.error("Please fill in all required delivery details.");
            console.log('Form validation failed for COD.');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading user data...</p>
            </div>
        );
    }

    // Redirect or return null only when authentication is complete and conditions met
    if (!user || cart.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Secure Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-2/3 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Delivery Information</h2>
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

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Payment Method</h2>

                            <div className="space-y-6">
                                <div className="p-6 border border-blue-200 rounded-lg bg-blue-50 flex flex-col items-center text-center">
                                    <h3 className="font-semibold text-xl text-blue-700 mb-3">Pay Online (Card/Bank Transfer)</h3>
                                    <p className="text-gray-600 mb-5">
                                        Securely pay for your order using your debit/credit card or through bank transfer via Paystack.
                                    </p>
                                    {user?.email ? (
                                        <ClientPaystackButton
                                            email={user.email}
                                            amount={totalAmount}
                                            metadata={{
                                                cart: JSON.stringify(cart),
                                                userId: user.id,
                                                // Ensure you only pass data that is safe for JSON serialization
                                                deliveryInfo: JSON.stringify(form.getValues()),
                                            }}
                                            onSuccess={handlePaymentSuccess}
                                            onClose={() => console.log('Payment modal closed')}
                                            publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors shadow-md"
                                        >
                                            Pay Now with Paystack
                                        </ClientPaystackButton>
                                    ) : (
                                        <Button disabled className="w-full bg-gray-400 text-white py-3 px-6 rounded-full">
                                            Login to Pay Online
                                        </Button>
                                    )}
                                </div>

                                <div className="p-6 border border-green-200 rounded-lg bg-green-50 flex flex-col items-center text-center">
                                    <h3 className="font-semibold text-xl text-green-700 mb-3">Cash on Delivery (COD)</h3>
                                    <p className="text-gray-600 mb-5">
                                        Choose to pay conveniently in cash when your order is delivered to your doorstep.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full border-green-600 text-green-600 hover:bg-green-100 font-semibold py-3 px-6 rounded-full transition-colors shadow-md"
                                        onClick={handleCashOnDelivery}
                                    >
                                        Place Order (Cash on Delivery)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24 lg:top-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item: CartItem) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {item.quantity} × ₦{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="font-semibold text-gray-800">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-3">
                                <div className="flex justify-between text-lg text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg text-gray-700">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold">₦{deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-2xl text-blue-700 pt-3 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>₦{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}