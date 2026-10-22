/* eslint-disable @next/next/no-img-element */
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, ExternalLink, Gift, ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useAdminOffers, useCreateOffer, useDeleteOffer, useUpdateOffer } from '@/hooks/useOffers';
import { useAdminProducts } from '@/hooks/useProducts';
import type { Offer, OfferInput, OfferStatus } from '@/services/offers';
import { getErrorMessage } from '@/services/base';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, ErrorState, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { formatDate, formatNaira } from '@/lib/format';
import { handleImageError, resolveImageUrl } from '@/lib/images';

type Product = { _id: string; name: string; price: number; stock?: number; category?: string };

const STATUS: Record<OfferStatus, { label: string; tone: 'success' | 'info' | 'neutral' | 'warning' }> = {
    live: { label: 'Live', tone: 'success' },
    scheduled: { label: 'Scheduled', tone: 'info' },
    ended: { label: 'Ended', tone: 'warning' },
    off: { label: 'Off', tone: 'neutral' },
};

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
// <input type="datetime-local"> works in local time without a zone
const toLocalInput = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null);

type Draft = {
    title: string; slug: string; subtitle: string; badge: string; description: string; product: string;
    bundleSize: string; unitPrice: string; features: string; terms: string; startsAt: string; endsAt: string; isActive: boolean;
};
const blank: Draft = { title: '', slug: '', subtitle: '', badge: '', description: '', product: '', bundleSize: '6', unitPrice: '', features: '', terms: '', startsAt: '', endsAt: '', isActive: true };

function OfferEditor({ offer, products, onDone }: { offer: Offer | null; products: Product[]; onDone: () => void }) {
    const create = useCreateOffer();
    const update = useUpdateOffer();
    const [d, setD] = useState<Draft>(blank);
    const [slugTouched, setSlugTouched] = useState(false);
    const [file, setFile] = useState<{ file: File; preview: string } | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setD(offer ? {
            title: offer.title, slug: offer.slug, subtitle: offer.subtitle || '', badge: offer.badge || '', description: offer.description || '',
            product: offer.product?._id || '', bundleSize: String(offer.bundleSize), unitPrice: String(offer.unitPrice),
            features: (offer.features || []).join('\n'), terms: offer.terms || '', startsAt: toLocalInput(offer.startsAt), endsAt: toLocalInput(offer.endsAt),
            isActive: offer.isActive !== false,
        } : blank);
        setSlugTouched(!!offer);
        setFile(null);
        setRemoveImage(false);
    }, [offer]);
    useEffect(() => () => { if (file) URL.revokeObjectURL(file.preview); }, [file]);

    const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setD((x) => ({ ...x, [k]: value, ...(k === 'title' && !slugTouched ? { slug: slugify(value) } : {}) }));
    };

    const product = products.find((p) => p._id === d.product);
    const size = Number(d.bundleSize);
    const unit = Number(d.unitPrice);
    const preview = useMemo(() => {
        if (!product || !Number.isInteger(size) || size < 1 || !Number.isFinite(unit) || unit <= 0) return null;
        const bundle = Math.round(unit * size * 100) / 100;
        const regular = Math.round(product.price * size * 100) / 100;
        return { bundle, regular, savings: Math.max(0, regular - bundle), notCheaper: unit >= product.price };
    }, [product, size, unit]);

    const imageUrl = file?.preview || (!removeImage && offer?.image?.url ? resolveImageUrl(offer.image.url) : null);

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (d.title.trim().length < 3) return toast.error('Give the offer a title');
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) return toast.error('The link name may only use lowercase letters, numbers and dashes');
        if (!d.product) return toast.error('Choose the product in this bundle');
        if (!Number.isInteger(size) || size < 1 || size > 1000) return toast.error('Units per bundle must be a whole number from 1 to 1000');
        if (!Number.isFinite(unit) || unit < 1) return toast.error('Enter the offer price per unit');
        if (d.startsAt && d.endsAt && new Date(d.startsAt) > new Date(d.endsAt)) return toast.error('The offer must end after it starts');
        const features = d.features.split('\n').map((f) => f.trim()).filter(Boolean);
        if (features.length > 12) return toast.error('Up to 12 highlights');

        const input: OfferInput = {
            title: d.title.trim(), slug: d.slug, subtitle: d.subtitle.trim(), badge: d.badge.trim(), description: d.description.trim(),
            product: d.product, bundleSize: size, unitPrice: unit, features, terms: d.terms.trim(),
            startsAt: fromLocalInput(d.startsAt), endsAt: fromLocalInput(d.endsAt), isActive: d.isActive,
        };
        const onError = (err: unknown) => toast.error(getErrorMessage(err, 'Could not save the offer'));
        if (offer) {
            update.mutate({ id: offer._id, input, image: file?.file, removeImage: removeImage && !file }, { onSuccess: () => { toast.success('Offer saved'); onDone(); }, onError });
        } else {
            create.mutate({ input, image: file?.file }, { onSuccess: () => { toast.success('Offer created'); onDone(); }, onError });
        }
    };

    const saving = create.isPending || update.isPending;

    return (
        <form onSubmit={save} className="flex h-full flex-col">
            <SheetHeader className="border-b border-border/60 py-4 pl-5 pr-14 sm:pl-6">
                <SheetTitle>{offer ? 'Edit offer' : 'New offer'}</SheetTitle>
                <SheetDescription>Customers order the bundle at the offer price; it’s checked on the server.</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="space-y-1.5"><Label htmlFor="o-title">Title</Label><Input id="o-title" value={d.title} onChange={set('title')} maxLength={120} className="h-11 rounded-xl" placeholder="Festival Hydration Bundle" /></div>
                <div className="space-y-1.5">
                    <Label htmlFor="o-slug">Link name</Label>
                    <div className="flex items-center rounded-xl border border-input bg-card pl-3 text-sm focus-within:ring-[3px] focus-within:ring-ring/40">
                        <span className="shrink-0 text-muted-foreground">/offers/</span>
                        <input id="o-slug" value={d.slug} onChange={(e) => { setSlugTouched(true); setD((x) => ({ ...x, slug: slugify(e.target.value) })); }} maxLength={80} className="h-11 min-w-0 flex-1 bg-transparent pr-3 outline-none" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
                    <div className="space-y-1.5"><Label htmlFor="o-sub">Headline (optional)</Label><Input id="o-sub" value={d.subtitle} onChange={set('subtitle')} maxLength={160} className="h-11 rounded-xl" placeholder="Buy 5 bags, get 1 free" /></div>
                    <div className="space-y-1.5"><Label htmlFor="o-badge">Badge (optional)</Label><Input id="o-badge" value={d.badge} onChange={set('badge')} maxLength={40} className="h-11 rounded-xl" placeholder="Limited time" /></div>
                </div>
                <div className="space-y-1.5"><Label htmlFor="o-desc">Description</Label><Textarea id="o-desc" rows={3} value={d.description} onChange={set('description')} maxLength={2000} className="rounded-xl" /></div>

                <div className="space-y-3 rounded-2xl border border-border/70 p-4">
                    <p className="text-sm font-semibold">Bundle and price</p>
                    <div className="space-y-1.5">
                        <Label htmlFor="o-product">Product</Label>
                        <Select value={d.product} onValueChange={(v) => setD((x) => ({ ...x, product: v }))}>
                            <SelectTrigger id="o-product" className="h-11"><SelectValue placeholder="Choose a product" /></SelectTrigger>
                            <SelectContent>{products.map((p) => <SelectItem key={p._id} value={p._id}>{p.name} · {formatNaira(p.price)}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label htmlFor="o-size">Units per bundle</Label><Input id="o-size" inputMode="numeric" value={d.bundleSize} onChange={set('bundleSize')} className="h-11 rounded-xl" /></div>
                        <div className="space-y-1.5"><Label htmlFor="o-unit">Offer price per unit (₦)</Label><Input id="o-unit" inputMode="decimal" value={d.unitPrice} onChange={set('unitPrice')} className="h-11 rounded-xl" /></div>
                    </div>
                    {preview && (
                        <div className={`rounded-xl p-3 text-sm ${preview.notCheaper ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>
                            {preview.notCheaper ? (
                                <p className="flex items-start gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> The offer price isn’t lower than the regular {formatNaira(product?.price)} per unit, so customers won’t save anything.</p>
                            ) : (
                                <p>Customers pay <strong>{formatNaira(preview.bundle)}</strong> for {size} units instead of {formatNaira(preview.regular)}, saving <strong>{formatNaira(preview.savings)}</strong>.</p>
                            )}
                            {product && typeof product.stock === 'number' && product.stock < size && <p className="mt-1 font-medium">Only {product.stock} units in stock: not enough for one bundle.</p>}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="o-features">Highlights (one per line)</Label>
                    <Textarea id="o-features" rows={4} value={d.features} onChange={set('features')} className="rounded-xl" placeholder={'6 bags of premium sachet water\nPerfect for parties and events'} />
                </div>

                <div className="space-y-2">
                    <Label>Image (optional)</Label>
                    {imageUrl ? (
                        <div className="relative overflow-hidden rounded-2xl border border-border/70">
                            <img src={imageUrl} onError={handleImageError} alt="" className="aspect-[16/9] w-full object-cover" />
                            <Button type="button" variant="secondary" size="icon-sm" className="absolute right-2 top-2" aria-label="Remove image"
                                onClick={() => { if (file) setFile(null); else setRemoveImage(true); }}><X /></Button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => fileInput.current?.click()} className="grid w-full place-items-center rounded-2xl border-2 border-dashed border-border py-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                            <span className="flex flex-col items-center gap-1"><ImagePlus className="size-6" /> Add an image · otherwise the product photo is used</span>
                        </button>
                    )}
                    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = '';
                        if (!f) return;
                        if (f.size > 10 * 1024 * 1024) return toast.error('The image must be under 10MB');
                        setFile({ file: f, preview: URL.createObjectURL(f) });
                        setRemoveImage(false);
                    }} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label htmlFor="o-start">Starts (optional)</Label><Input id="o-start" type="datetime-local" value={d.startsAt} onChange={set('startsAt')} className="h-11 rounded-xl" /></div>
                    <div className="space-y-1.5"><Label htmlFor="o-end">Ends (optional)</Label><Input id="o-end" type="datetime-local" value={d.endsAt} onChange={set('endsAt')} className="h-11 rounded-xl" /></div>
                </div>
                <div className="space-y-1.5"><Label htmlFor="o-terms">Terms (optional)</Label><Textarea id="o-terms" rows={2} value={d.terms} onChange={set('terms')} maxLength={1000} className="rounded-xl" /></div>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 p-4">
                    <span><span className="block text-sm font-semibold">Offer is on</span><span className="block text-xs text-muted-foreground">Turn off to hide it from customers without deleting it</span></span>
                    <Switch checked={d.isActive} onCheckedChange={(v) => setD((x) => ({ ...x, isActive: v }))} />
                </label>
            </div>

            <div className="flex gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:px-6">
                <Button type="button" variant="ghost" onClick={onDone} disabled={saving}>Cancel</Button>
                <Button type="submit" className="ml-auto" loading={saving}>{offer ? 'Save offer' : 'Create offer'}</Button>
            </div>
        </form>
    );
}

function OffersContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: offers = [], isLoading, isError, refetch } = useAdminOffers();
    const { data: productData } = useAdminProducts({ limit: 200 });
    const remove = useDeleteOffer();
    const [toDelete, setToDelete] = useState<Offer | null>(null);

    const products: Product[] = (productData as { products?: Product[] } | undefined)?.products || [];
    const editing = searchParams.get('edit');
    const editingOffer = editing && editing !== 'new' ? offers.find((o) => o._id === editing) || null : null;

    const openEditor = (id: string | null) => {
        const next = new URLSearchParams(searchParams.toString());
        if (id) next.set('edit', id); else next.delete('edit');
        router.replace(`${pathname}${next.toString() ? `?${next}` : ''}`, { scroll: false });
    };

    return (
        <div>
            <PageHeader title="Offers" description="Bundles and seasonal deals customers can order at a special price." actions={<Button onClick={() => openEditor('new')}><Plus /> New offer</Button>} />

            <Panel className="overflow-hidden">
                {isLoading ? (
                    <div className="space-y-2 p-5">{[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-14 rounded-xl" />)}</div>
                ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : offers.length === 0 ? (
                    <EmptyState icon={Gift} title="No offers yet" description="Create a bundle, like 6 bags for a special price, and share its link." action={{ label: 'Create an offer', onClick: () => openEditor('new') }} />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5 sm:pl-6">Offer</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="hidden md:table-cell">Dates</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="pr-5 text-right sm:pr-6"><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offers.map((o) => (
                                <TableRow key={o._id}>
                                    <TableCell className="pl-5 sm:pl-6">
                                        <p className="font-semibold">{o.title}</p>
                                        <p className="text-xs text-muted-foreground">{o.bundleSize} × {o.product?.name || 'product removed'} · /offers/{o.slug}</p>
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {formatNaira(o.bundlePrice)}
                                        {o.savings > 0 ? <span className="block text-xs text-emerald-600">saves {formatNaira(o.savings)}</span> : <span className="block text-xs text-amber-600">no saving</span>}
                                    </TableCell>
                                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                                        {o.startsAt || o.endsAt ? `${o.startsAt ? formatDate(o.startsAt) : 'Now'} – ${o.endsAt ? formatDate(o.endsAt) : 'no end'}` : 'Always'}
                                    </TableCell>
                                    <TableCell><Pill tone={STATUS[o.status].tone} dot>{STATUS[o.status].label}</Pill></TableCell>
                                    <TableCell className="pr-5 text-right sm:pr-6">
                                        <div className="flex justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon-sm" aria-label={`Preview ${o.title}`}><Link href={`/offers/${o.slug}`} target="_blank"><ExternalLink /></Link></Button>
                                            <Button variant="ghost" size="icon-sm" onClick={() => openEditor(o._id)} aria-label={`Edit ${o.title}`}><Pencil /></Button>
                                            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => setToDelete(o)} aria-label={`Delete ${o.title}`}><Trash2 /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Panel>

            <Sheet open={!!editing} onOpenChange={(open) => !open && openEditor(null)}>
                <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
                    {editing && <OfferEditor offer={editingOffer} products={products} onDone={() => openEditor(null)} />}
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !remove.isPending && setToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {toDelete?.title}?</AlertDialogTitle>
                        <AlertDialogDescription>Its page stops working. Orders already placed keep their prices. To pause it instead, switch it off in the editor.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={remove.isPending}>Keep it</AlertDialogCancel>
                        <Button variant="destructive" loading={remove.isPending} onClick={() => toDelete && remove.mutate(toDelete._id, {
                            onSuccess: () => { toast.success('Offer deleted'); setToDelete(null); },
                            onError: (err) => toast.error(getErrorMessage(err, 'Could not delete the offer')),
                        })}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function AdminOffersPage() {
    return (
        <Suspense fallback={null}>
            <OffersContent />
        </Suspense>
    );
}
