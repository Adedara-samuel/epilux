// src/lib/constants.ts

// Customers order at least this many units of a product
export const MIN_ORDER_QUANTITY = 5;

export const ORDER_STATUS_META: Record<string, { label: string; tone: 'neutral' | 'info' | 'brand' | 'warning' | 'success' | 'danger'; description: string }> = {
    pending: { label: 'Awaiting payment', tone: 'warning', description: 'Complete payment to send your order for delivery.' },
    processing: { label: 'Paid', tone: 'info', description: 'Payment received. A marketer is being assigned.' },
    assigned: { label: 'Assigned', tone: 'brand', description: 'A marketer has your order and will deliver soon.' },
    in_transit: { label: 'On the way', tone: 'brand', description: 'Your order is out for delivery.' },
    delivered: { label: 'Delivered', tone: 'success', description: 'Confirm you received it to collect your reward.' },
    completed: { label: 'Completed', tone: 'success', description: 'Delivery confirmed. Your reward is in your wallet.' },
    cancelled: { label: 'Cancelled', tone: 'danger', description: 'This order was cancelled.' },
    rejected: { label: 'Rejected', tone: 'danger', description: 'This order could not be fulfilled.' },
};

// Steps shown on the order progress tracker
export const ORDER_TIMELINE = ['pending', 'processing', 'assigned', 'in_transit', 'delivered', 'completed'] as const;
