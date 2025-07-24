/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payment/PaystackButton.tsx
'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { usePaystackPayment } from 'react-paystack'; // Import the Paystack hook

interface PaystackButtonProps {
    email: string;
    amount: number; // Amount in Naira (e.g., 1000 for ₦1000)
    metadata?: Record<string, any>;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    disabled?: boolean;
    publicKey: string; // Still needed for the hook config
    children?: React.ReactNode;
    className?: string;
}

export default function PaystackButton({
    email,
    amount,
    metadata,
    onSuccess,
    onClose,
    disabled,
    publicKey,
    children,
    className
}: PaystackButtonProps) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Paystack configuration object for the hook
    const config = {
        reference: new Date().getTime().toString(), // Unique reference for each transaction
        email,
        amount: amount * 100, // Amount in kobo (e.g., 100000 for ₦1000)
        publicKey, // Your Paystack public key
        metadata: {
            ...metadata,
            custom_fields: [
                {
                    display_name: "User ID",
                    variable_name: "user_id",
                    value: user?.uid || "guest",
                },
            ],
        },
    };

    // Initialize the Paystack payment hook
    const initializePayment = usePaystackPayment(config);

    const handlePaymentClick = () => {
        if (!publicKey) {
            console.error("Paystack Public Key is not set.");
            toast.error("Payment gateway not configured. Please contact support.");
            return;
        }
        if (!email) {
            toast.error("User email is required for payment.");
            return;
        }
        if (amount <= 0) {
            toast.error("Payment amount must be greater than zero.");
            return;
        }

        setLoading(true); // Start loading state before opening modal

        // Call the initializePayment function provided by the hook
        // This function takes onSuccess and onClose callbacks directly
        initializePayment({
            onSuccess: (response: any) => {
                setLoading(false);
                onSuccess(response);
            },
            onClose: () => {
                setLoading(false);
                onClose();
            },
        });
    };

    return (
        <Button
            onClick={handlePaymentClick} // Use the new handler
            disabled={disabled || loading || !email || amount <= 0}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors shadow-md ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                </>
            ) : (
                children || `Pay ₦${(amount).toLocaleString()}`
            )}
        </Button>
    );
}
