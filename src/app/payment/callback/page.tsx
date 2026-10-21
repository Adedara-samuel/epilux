'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, Package, RefreshCw, XCircle } from 'lucide-react';
import { useVerifyPayment } from '@/hooks/usePayment';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Panel } from '@/Components/ui/kit';
import { formatNaira } from '@/lib/format';

type Outcome =
    | { kind: 'verifying' }
    | { kind: 'success'; orderId: string; orderNumber: string; amount: number }
    | { kind: 'pending'; orderId?: string }
    | { kind: 'failed'; message: string; orderId?: string }
    | { kind: 'cancelled' };

function Confetti() {
    const reduce = useReducedMotion();
    if (reduce) return null;
    const colors = ['#2563eb', '#38bdf8', '#facc15', '#fb923c', '#22c55e'];
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => {
                const left = (i * 37) % 100;
                return (
                    <motion.span
                        key={i}
                        className="absolute top-0 block h-2.5 w-1.5 rounded-sm"
                        style={{ left: `${left}%`, background: colors[i % colors.length] }}
                        initial={{ y: -20, opacity: 0, rotate: 0 }}
                        animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: 360 + i * 20 }}
                        transition={{ duration: 2.2 + (i % 5) * 0.25, delay: (i % 7) * 0.08, ease: 'easeOut' }}
                    />
                );
            })}
        </div>
    );
}

function CallbackContent() {
    const params = useSearchParams();
    const status = params.get('status');
    const transactionId = params.get('transaction_id');
    const verify = useVerifyPayment();
    const [outcome, setOutcome] = useState<Outcome>({ kind: 'verifying' });
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        if (!transactionId || status === 'cancelled') {
            setOutcome({ kind: 'cancelled' });
            return;
        }

        // The URL is never trusted; the server verifies with Flutterwave
        verify.mutate(transactionId, {
            onSuccess: (res) => {
                const d = res.data;
                if (d.status === 'success') setOutcome({ kind: 'success', orderId: d.orderId, orderNumber: d.orderNumber, amount: d.amount });
                else if (d.status === 'pending') setOutcome({ kind: 'pending', orderId: d.orderId });
                else setOutcome({ kind: 'failed', message: d.message || 'Your payment was not completed.', orderId: d.orderId });
            },
            onError: (err) => setOutcome({ kind: 'failed', message: getErrorMessage(err, 'We could not confirm your payment.') }),
        });
    }, [status, transactionId, verify]);

    return (
        <div className="mx-auto max-w-lg py-6">
            <Panel className="relative overflow-hidden p-8 text-center sm:p-10">
                {outcome.kind === 'success' && <Confetti />}

                {outcome.kind === 'verifying' && (
                    <div className="animate-fade-in">
                        <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-accent text-primary"><Loader2 className="size-9 animate-spin" /></span>
                        <h1 className="mt-6 text-2xl font-extrabold">Confirming your payment…</h1>
                        <p className="mt-2 text-muted-foreground">This only takes a moment. Please don&apos;t close this page.</p>
                    </div>
                )}

                {outcome.kind === 'success' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                        <motion.span
                            className="mx-auto grid size-20 place-items-center rounded-3xl bg-success/10 text-success"
                            initial={{ scale: 0.4, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                        >
                            <CheckCircle2 className="size-10" />
                        </motion.span>
                        <h1 className="mt-6 text-2xl font-extrabold">Payment successful!</h1>
                        <p className="mt-2 text-muted-foreground">
                            We received <span className="font-semibold text-foreground">{formatNaira(outcome.amount)}</span> for order{' '}
                            <span className="font-semibold text-foreground">{outcome.orderNumber}</span>. A marketer is being assigned to deliver it.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button asChild variant="brand" size="lg" className="flex-1"><Link href={`/account/orders/${outcome.orderId}`}><Package /> Track order</Link></Button>
                            <Button asChild variant="outline" size="lg" className="flex-1"><Link href="/products">Keep shopping</Link></Button>
                        </div>
                    </motion.div>
                )}

                {outcome.kind === 'pending' && (
                    <div className="animate-fade-in">
                        <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-amber-50 text-amber-600"><Clock className="size-10" /></span>
                        <h1 className="mt-6 text-2xl font-extrabold">Payment is processing</h1>
                        <p className="mt-2 text-muted-foreground">Your bank is still confirming this payment. We&apos;ll update your order automatically.</p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button variant="brand" size="lg" className="flex-1" onClick={() => window.location.reload()}><RefreshCw /> Check again</Button>
                            <Button asChild variant="outline" size="lg" className="flex-1"><Link href={outcome.orderId ? `/account/orders/${outcome.orderId}` : '/account/orders'}>View order</Link></Button>
                        </div>
                    </div>
                )}

                {(outcome.kind === 'failed' || outcome.kind === 'cancelled') && (
                    <div className="animate-fade-in">
                        <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-destructive/10 text-destructive"><XCircle className="size-10" /></span>
                        <h1 className="mt-6 text-2xl font-extrabold">{outcome.kind === 'cancelled' ? 'Payment cancelled' : 'Payment not completed'}</h1>
                        <p className="mt-2 text-muted-foreground">
                            {outcome.kind === 'cancelled' ? 'No money was taken. Your order is saved, so you can pay for it any time.' : outcome.message}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            {outcome.kind === 'failed' && outcome.orderId ? (
                                <Button asChild variant="brand" size="lg" className="flex-1"><Link href={`/payment/${outcome.orderId}`}>Try again</Link></Button>
                            ) : (
                                <Button asChild variant="brand" size="lg" className="flex-1"><Link href="/account/orders">Go to my orders</Link></Button>
                            )}
                            <Button asChild variant="outline" size="lg" className="flex-1"><Link href="/cart">Back to cart</Link></Button>
                        </div>
                    </div>
                )}
            </Panel>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={null}>
            <CallbackContent />
        </Suspense>
    );
}
