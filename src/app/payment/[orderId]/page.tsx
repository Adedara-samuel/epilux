'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { paymentAPI } from '@/services/payment';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { Loader2, CreditCard, Wallet } from 'lucide-react';

export default function PaymentPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    const router = useRouter();
    const { user } = useAuth();
    const clearCart = useCartStore((s) => s.clearCart);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'online' | null>('online');

    useEffect(() => {
        if (!user) {
            router.push('/login?redirect=/payment/' + orderId);
        }
    }, [user, router, orderId]);

    const handlePayment = async (method: 'wallet' | 'online') => {
        setIsProcessing(true);
        try {
            // For now, using dummy data as per the example. In real app, fetch order details
            const paymentPayload = {
                items: [
                    {
                        product: "64a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
                        quantity: 1,
                        price: 2500
                    }
                ],
                shippingAddress: {
                    address: "123 Main Street",
                    city: "Lagos",
                    state: "Lagos",
                    country: "Nigeria"
                },
                customerInfo: {
                    name: "John Doe",
                    phone: "+234800000000",
                    email: "john@example.com"
                },
                paymentMethod: 'wallet',
                totalAmount: 2500
            };

            const paymentData = await paymentAPI.initializePayment(orderId, paymentPayload);

            if (method === 'wallet') {
                toast.success("Payment completed successfully!");
                clearCart();
                router.push(`/order/success?orderId=${orderId}`);
            } else if (method === 'online' && paymentData.paymentUrl) {
                window.location.href = paymentData.paymentUrl;
            } else {
                toast.success("Payment initialized successfully!");
                clearCart();
                router.push(`/order/success?orderId=${orderId}`);
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Payment failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Choose Payment Method</h1>
                    <p className="text-gray-600">Select how you'd like to pay for your order</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                    <div className="space-y-6">
                        {/* Wallet Payment Option */}
                        <div
                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedMethod === 'wallet'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                            }`}
                            onClick={() => setSelectedMethod('wallet')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">Wallet Payment</h3>
                                    <p className="text-gray-600">Pay instantly using your wallet balance</p>
                                </div>
                                {selectedMethod === 'wallet' && (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Online Payment Option */}
                        <div
                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedMethod === 'online'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedMethod('online')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">Online Payment</h3>
                                    <p className="text-gray-600">Pay securely with card, bank transfer, or other methods via Flutterwave</p>
                                </div>
                                {selectedMethod === 'online' && (
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pay Button */}
                        <Button
                            onClick={() => selectedMethod && handlePayment(selectedMethod)}
                            disabled={!selectedMethod || isProcessing}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg disabled:opacity-50 cursor-pointer transform hover:scale-105"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                `Pay Now ${selectedMethod === 'wallet' ? 'with Wallet' : selectedMethod === 'online' ? 'Online' : ''}`
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}