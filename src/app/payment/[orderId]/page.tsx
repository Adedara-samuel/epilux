/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, PackageX, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrder } from '@/hooks/useOrders';
import { useInitializePayment } from '@/hooks/usePayment';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { EmptyState, OrderStatusPill, Panel } from '@/Components/ui/kit';
import { formatDate, formatNaira, fullName } from '@/lib/format';
import { handleImageError, productImageUrl } from '@/lib/images';

type OrderItem = { product?: { _id?: string; name?: string; images?: { url: string; isPrimary?: boolean }[] } | string; quantity: number; price: number };

// Pay (or retry paying) for an existing order. The amount is the order's own
// total from the server.
export default function PayForOrderPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { data, isLoading, isError } = useOrder(orderId);
    const initPayment = useInitializePayment();

    const order = data?.data;

    const pay = () => {
        initPayment.mutate({ orderId, customer: { email: user?.email, phone: user?.profile?.phone, name: fullName(user) } }, {
            onSuccess: (res) => {
                const url = res?.data?.paymentUrl || res?.data?.link;
                if (url) window.location.href = url;
                else toast.error('Could not open the payment page. Please try again.');
            },
            onError: (err) => toast.error(getErrorMessage(err, 'Could not start payment')),
        });
    };

    if (isLoading) {
        return <div className="mx-auto max-w-lg"><div className="skeleton-shimmer h-[420px] rounded-3xl" /></div>;
    }

    if (isError || !order) {
        return <EmptyState icon={PackageX} title="Order not found" description="We couldn't find this order on your account." action={{ label: 'My orders', href: '/account/orders' }} />;
    }

    const items: OrderItem[] = order.items || [];
    const alreadyPaid = order.isPaid || order.paymentStatus === 'completed';
    const closed = ['cancelled', 'rejected'].includes(order.status);

    return (
        <div className="mx-auto max-w-lg">
            <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Back
            </button>
            <Panel className="animate-fade-in overflow-hidden">
                <div className="aurora px-6 py-7 text-white">
                    <p className="text-sm text-white/70">Order {order.orderNumber}</p>
                    <p className="mt-1 text-4xl font-extrabold tracking-tight tabular-nums">{formatNaira(order.totalAmount)}</p>
                    <p className="mt-1 text-sm text-white/70">Placed {formatDate(order.createdAt)}</p>
                </div>
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="font-bold">Order summary</h1>
                        <OrderStatusPill status={order.status} />
                    </div>
                    <ul className="space-y-3">
                        {items.map((item, i) => {
                            const product = typeof item.product === 'object' ? item.product : undefined;
                            return (
                                <li key={i} className="flex items-center gap-3">
                                    <img src={productImageUrl(product)} alt="" onError={handleImageError} className="size-12 rounded-xl object-cover" />
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{product?.name || 'Product'} <span className="text-muted-foreground">× {item.quantity}</span></span>
                                    <span className="text-sm font-semibold tabular-nums">{formatNaira(item.price * item.quantity)}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <dl className="mt-5 space-y-2 border-t border-border/70 pt-4 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{formatNaira(order.subtotal ?? order.totalAmount - (order.deliveryFee || 0))}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{order.deliveryFee ? formatNaira(order.deliveryFee) : 'Free'}</dd></div>
                        <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd className="tabular-nums">{formatNaira(order.totalAmount)}</dd></div>
                    </dl>

                    {alreadyPaid ? (
                        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-success/10 p-4 text-sm font-medium text-success">
                            <CheckCircle2 className="size-5 shrink-0" /> This order has been paid.
                        </div>
                    ) : closed ? (
                        <p className="mt-6 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">This order was {order.status} and can no longer be paid.</p>
                    ) : (
                        <Button variant="brand" size="xl" className="mt-6 w-full rounded-xl" onClick={pay} loading={initPayment.isPending}>
                            <Lock /> Pay {formatNaira(order.totalAmount)}
                        </Button>
                    )}

                    <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><ShieldCheck className="size-3.5" /> Secured by Flutterwave</span>
                        <span className="flex items-center gap-1"><CreditCard className="size-3.5" /> Card · Transfer · USSD</span>
                    </div>
                    <p className="mt-4 text-center text-sm">
                        <Link href={`/account/orders/${orderId}`} className="font-semibold text-primary hover:underline">View order details</Link>
                    </p>
                </div>
            </Panel>
        </div>
    );
}
