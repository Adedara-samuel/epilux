'use client';

import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Truck } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { EmptyState, ErrorState, OrderStatusPill, PageHeader, Panel, PanelHeader } from '@/Components/ui/kit';
import { Stagger, StaggerItem } from '@/Components/motion';
import { formatDate, formatNaira, fullName } from '@/lib/format';
import { ORDER_STATUS_META, ORDER_TIMELINE } from '@/lib/constants';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/services/delivery';
import { orderId, type CustomerOrder } from '@/Components/orders/order-helpers';

const ACTIVE = ['processing', 'assigned', 'in_transit', 'delivered'];

const progressFor = (status: string) => {
    const i = ORDER_TIMELINE.indexOf(status as (typeof ORDER_TIMELINE)[number]);
    return i < 0 ? 0 : Math.round((i / (ORDER_TIMELINE.length - 1)) * 100);
};

function DeliveryCard({ order }: { order: CustomerOrder }) {
    const marketer = typeof order.marketer === 'object' ? order.marketer : null;
    const phone = marketer?.profile?.phone;
    const address = [order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(', ');

    return (
        <Panel className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-bold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">Ordered {formatDate(order.createdAt)} · {formatNaira(order.totalAmount)}</p>
                </div>
                <OrderStatusPill status={order.status} />
            </div>

            <Progress value={progressFor(order.status)} className="mt-4 h-2" />
            <p className="mt-2 text-sm text-muted-foreground">{ORDER_STATUS_META[order.status]?.description}</p>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {address && (
                    <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><span className="min-w-0">{address}</span></p>
                )}
                {marketer ? (
                    <p className="flex items-start gap-2"><Truck className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><span>{fullName(marketer)} is delivering</span></p>
                ) : (
                    <p className="flex items-start gap-2 text-muted-foreground"><Truck className="mt-0.5 size-4 shrink-0" />Finding a marketer near you</p>
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant={order.status === 'delivered' ? 'success' : 'default'}>
                    <Link href={`/account/orders/${orderId(order)}`}>{order.status === 'delivered' ? 'Confirm delivery' : 'View order'} <ChevronRight /></Link>
                </Button>
                {phone && <Button asChild size="sm" variant="outline"><a href={`tel:${phone}`}><Phone /> Call marketer</a></Button>}
            </div>
        </Panel>
    );
}

export default function DeliveriesPage() {
    const { data, isLoading, isError, refetch } = useOrders();
    const orders: CustomerOrder[] = data?.data || [];
    const active = orders.filter((o) => ACTIVE.includes(o.status));
    const completed = orders.filter((o) => o.status === 'completed').length;

    return (
        <div className="max-w-5xl">
            <PageHeader title="Deliveries" description="Follow the orders that are on their way to you." actions={<Button asChild variant="outline"><Link href="/account/orders">All orders</Link></Button>} />

            <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
                <div>
                    {isLoading ? (
                        <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="skeleton-shimmer h-48 rounded-3xl" />)}</div>
                    ) : isError ? (
                        <Panel><ErrorState onRetry={() => refetch()} /></Panel>
                    ) : active.length === 0 ? (
                        <Panel>
                            <EmptyState icon={Truck} title="No deliveries in progress" description="Paid orders appear here until you confirm you've received them." action={{ label: 'Order water', href: '/products' }} />
                        </Panel>
                    ) : (
                        <Stagger immediate className="space-y-3">
                            {active.map((o) => <StaggerItem key={orderId(o)}><DeliveryCard order={o} /></StaggerItem>)}
                        </Stagger>
                    )}
                </div>

                <div className="space-y-4">
                    <Panel>
                        <PanelHeader title="Delivery fees" />
                        <dl className="space-y-3 p-5 text-sm">
                            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Standard delivery</dt><dd className="font-semibold">{formatNaira(DELIVERY_FEE)}</dd></div>
                            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Orders from {formatNaira(FREE_DELIVERY_THRESHOLD)}</dt><dd className="font-semibold text-emerald-600">Free</dd></div>
                        </dl>
                    </Panel>
                    <Panel className="p-5">
                        <p className="text-sm text-muted-foreground">Delivered and confirmed</p>
                        <p className="mt-1 text-2xl font-extrabold tabular-nums">{isLoading ? '…' : completed}</p>
                    </Panel>
                </div>
            </div>
        </div>
    );
}
