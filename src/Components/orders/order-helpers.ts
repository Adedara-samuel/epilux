// Shared order types and helpers for customer order screens
export type OrderProduct = { _id?: string; name?: string; price?: number; images?: { url: string; isPrimary?: boolean }[]; category?: string };

export type CustomerOrder = {
    orderId: string;
    _id?: string;
    orderNumber: string;
    status: string;
    statusHistory?: { status: string; changedAt: string; note?: string }[];
    items: { product?: OrderProduct | string; quantity: number; price: number }[];
    subtotal?: number;
    deliveryFee?: number;
    totalAmount: number;
    paymentMethod?: string;
    paymentStatus?: string;
    isPaid?: boolean;
    paidAt?: string;
    marketer?: { firstName?: string; lastName?: string; profile?: { phone?: string } } | string | null;
    assignedAt?: string;
    inTransitAt?: string;
    deliveredAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    customerConfirmed?: boolean;
    commissionRate?: number;
    commissionAmount?: number;
    commissionReleased?: boolean;
    referralInfo?: { referredBy?: string | null; userShare?: number; referrerShare?: number };
    shippingAddress?: { address?: string; city?: string; state?: string; landmark?: string; deliveryInstructions?: string };
    createdAt: string;
    updatedAt?: string;
};

export const orderId = (o: CustomerOrder) => o.orderId || o._id || '';

export const itemProduct = (item: CustomerOrder['items'][number]): OrderProduct | undefined =>
    typeof item.product === 'object' && item.product ? item.product : undefined;

/** Reward the customer gets (or got) for this order. */
export const customerReward = (o: CustomerOrder) => {
    if (o.commissionReleased && o.referralInfo?.userShare !== undefined) return o.referralInfo.userShare;
    if (o.referralInfo?.userShare) return o.referralInfo.userShare;
    const base = o.subtotal || o.totalAmount - (o.deliveryFee || 0);
    return Math.round(((base * (o.commissionRate || 0)) / 100) * 100) / 100;
};

export const canPay = (o: CustomerOrder) => !o.isPaid && o.status === 'pending';
export const canCancel = (o: CustomerOrder) => !o.isPaid && ['pending', 'processing', 'assigned'].includes(o.status);
export const canConfirm = (o: CustomerOrder) => o.status === 'delivered' && !o.customerConfirmed;
