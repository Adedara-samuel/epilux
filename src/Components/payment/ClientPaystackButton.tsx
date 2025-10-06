// components/payment/ClientPaystackButton.tsx
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the PaystackButton, ensuring it's never rendered on the server.
const PaystackButton = dynamic(() => import('./paystackbutton'), {
    ssr: false,
    loading: () => <Loader2 className="h-6 w-6 animate-spin" />,
});

// Re-export the dynamically imported component
export default PaystackButton;

// Note: You'll need to update the import path in your CheckoutPage accordingly.
// For example, if your original PaystackButton is in the same directory, 
// the path in dynamic() should be relative to the new file, or you can 
// move the original PaystackButton component to a different name, e.g., BasePaystackButton.