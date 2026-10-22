/* eslint-disable @next/next/no-img-element */
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ImagePlus, Pencil, Plus, Search, ShoppingBag, Star, Trash2, X } from 'lucide-react';
import { useAdminCategories, useAdminProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from '@/hooks/useProducts';
import { getErrorMessage } from '@/services/base';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { EmptyState, ErrorState, PageHeader, Panel, Pill } from '@/Components/ui/kit';
import { cn } from '@/lib/utils';
import { formatNaira } from '@/lib/format';
import { handleImageError, productImageUrl, resolveImageUrl } from '@/lib/images';

type ProductImage = { _id?: string; url: string; isPrimary?: boolean; publicId?: string; altText?: string };
type Product = {
    _id: string; name: string; description: string; price: number; stock: number; category: string; brand?: string;
    isActive?: boolean; isFeatured?: boolean; images?: ProductImage[]; primaryImage?: string | null;
};

const LOW_STOCK = 10;
const MAX_IMAGES = 5;
const MAX_FILE_MB = 10;

type Draft = { name: string; description: string; price: string; stock: string; category: string; brand: string; isActive: boolean; isFeatured: boolean };
const emptyDraft: Draft = { name: '', description: '', price: '', stock: '', category: '', brand: '', isActive: true, isFeatured: false };

function ProductEditor({ product, categories, onDone }: { product: Product | null; categories: string[]; onDone: () => void }) {
    const create = useCreateProduct();
    const update = useUpdateProduct();
    const [draft, setDraft] = useState<Draft>(emptyDraft);
    const [existing, setExisting] = useState<ProductImage[]>([]);
    const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
    const [primary, setPrimary] = useState<string>(''); // url of existing image or preview url
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDraft(product ? {
            name: product.name, description: product.description, price: String(product.price), stock: String(product.stock ?? 0),
            category: product.category, brand: product.brand || '', isActive: product.isActive !== false, isFeatured: !!product.isFeatured,
        } : emptyDraft);
        setExisting(product?.images || []);
        setPrimary(product?.images?.find((i) => i.isPrimary)?.url || product?.images?.[0]?.url || '');
        setFiles([]);
    }, [product]);

    // Free preview URLs when they're no longer shown
    useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.preview)), [files]);

    const total = existing.length + files.length;
    const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft((d) => ({ ...d, [k]: e.target.value }));

    const addFiles = (list: FileList | null) => {
        if (!list) return;
        const picked = Array.from(list);
        const tooBig = picked.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
        if (tooBig) return toast.error(`${tooBig.name} is larger than ${MAX_FILE_MB}MB`);
        const room = MAX_IMAGES - total;
        if (room <= 0) return toast.error(`A product can have up to ${MAX_IMAGES} images`);
        const next = picked.slice(0, room).map((file) => ({ file, preview: URL.createObjectURL(file) }));
        if (picked.length > room) toast.message(`Only the first ${room} image${room === 1 ? '' : 's'} were added (max ${MAX_IMAGES})`);
        setFiles((f) => [...f, ...next]);
        if (!primary && next[0]) setPrimary(next[0].preview);
    };

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        const price = Number(draft.price);
        const stock = Number(draft.stock || 0);
        if (draft.name.trim().length < 2) return toast.error('Give the product a name');
        if (draft.description.trim().length < 5) return toast.error('Add a short description');
        if (!draft.category.trim()) return toast.error('Choose or type a category');
        if (!Number.isFinite(price) || price <= 0) return toast.error('Enter a price above ₦0');
        if (!Number.isInteger(stock) || stock < 0) return toast.error('Stock must be a whole number');

        const form = new FormData();
        form.append('name', draft.name.trim());
        form.append('description', draft.description.trim());
        form.append('price', String(price));
        form.append('stock', String(stock));
        form.append('category', draft.category.trim().toLowerCase());
        form.append('brand', draft.brand.trim());
        form.append('isFeatured', String(draft.isFeatured));
        if (product) form.append('isActive', String(draft.isActive));
        // Existing images to keep (JSON) plus new files; the server appends uploads after the kept images
        const mainUpload = files.findIndex((f) => f.preview === primary);
        form.append('images', JSON.stringify(existing.map((img) => ({ ...img, isPrimary: mainUpload < 0 && img.url === primary }))));
        files.forEach((f) => form.append('images', f.file));
        if (mainUpload >= 0) form.append('primaryUploadIndex', String(mainUpload));

        const onError = (err: unknown) => toast.error(getErrorMessage(err, 'Could not save the product'));
        if (product) {
            update.mutate({ id: product._id, data: form }, { onSuccess: () => { toast.success('Product updated'); onDone(); }, onError });
        } else {
            create.mutate(form, { onSuccess: () => { toast.success('Product added'); onDone(); }, onError });
        }
    };

    const saving = create.isPending || update.isPending;

    return (
        <form onSubmit={save} className="flex h-full flex-col">
            <SheetHeader className="border-b border-border/60 px-5 py-4 sm:px-6">
                <SheetTitle>{product ? 'Edit product' : 'Add a product'}</SheetTitle>
                <SheetDescription>{product ? 'Changes show in the shop straight away.' : 'New products appear in the shop as soon as you save.'}</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="space-y-1.5"><Label htmlFor="p-name">Name</Label><Input id="p-name" value={draft.name} onChange={set('name')} className="h-11 rounded-xl" placeholder="e.g. Epilux sachet water (bag of 20)" /></div>
                <div className="space-y-1.5"><Label htmlFor="p-desc">Description</Label><Textarea id="p-desc" rows={3} value={draft.description} onChange={set('description')} className="rounded-xl" /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label htmlFor="p-price">Price (₦ per unit)</Label><Input id="p-price" inputMode="decimal" value={draft.price} onChange={set('price')} className="h-11 rounded-xl" placeholder="230" /></div>
                    <div className="space-y-1.5"><Label htmlFor="p-stock">Units in stock</Label><Input id="p-stock" inputMode="numeric" value={draft.stock} onChange={set('stock')} className="h-11 rounded-xl" placeholder="0" /></div>
                    <div className="space-y-1.5">
                        <Label htmlFor="p-cat">Category</Label>
                        <Input id="p-cat" list="product-categories" value={draft.category} onChange={set('category')} className="h-11 rounded-xl" placeholder="sachet, bottled…" />
                        <datalist id="product-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
                    </div>
                    <div className="space-y-1.5"><Label htmlFor="p-brand">Brand (optional)</Label><Input id="p-brand" value={draft.brand} onChange={set('brand')} className="h-11 rounded-xl" placeholder="Epilux" /></div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Images</Label>
                        <span className="text-xs text-muted-foreground">{total}/{MAX_IMAGES} · tap one to make it the main image</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {existing.map((img) => (
                            <div key={img.url} className={cn('group relative aspect-square overflow-hidden rounded-xl border-2', primary === img.url ? 'border-primary' : 'border-transparent')}>
                                <button type="button" onClick={() => setPrimary(img.url)} className="size-full" aria-label="Make main image">
                                    <img src={resolveImageUrl(img.url)} onError={handleImageError} alt="" className="size-full bg-muted object-cover" />
                                </button>
                                {primary === img.url && <span className="absolute bottom-1 left-1 rounded-md bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">Main</span>}
                                <button type="button" onClick={() => { setExisting((x) => x.filter((i) => i.url !== img.url)); if (primary === img.url) setPrimary(''); }}
                                    className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-90 hover:bg-black/80" aria-label="Remove image">
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        ))}
                        {files.map((f) => (
                            <div key={f.preview} className={cn('relative aspect-square overflow-hidden rounded-xl border-2', primary === f.preview ? 'border-primary' : 'border-dashed border-border')}>
                                <button type="button" onClick={() => setPrimary(f.preview)} className="size-full" aria-label="Make main image">
                                    <img src={f.preview} alt="" className="size-full object-cover" />
                                </button>
                                {primary === f.preview && <span className="absolute bottom-1 left-1 rounded-md bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">Main</span>}
                                <span className="absolute left-1 top-1 rounded-md bg-amber-500 px-1.5 text-[10px] font-bold text-white">New</span>
                                <button type="button" onClick={() => { setFiles((x) => x.filter((i) => i.preview !== f.preview)); if (primary === f.preview) setPrimary(''); }}
                                    className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="Remove image">
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        ))}
                        {total < MAX_IMAGES && (
                            <button type="button" onClick={() => fileInput.current?.click()}
                                className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                                <span className="flex flex-col items-center gap-1 text-xs font-medium"><ImagePlus className="size-5" /> Add</span>
                            </button>
                        )}
                    </div>
                    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                    <p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to {MAX_FILE_MB}MB each.</p>
                </div>

                <div className="space-y-3 rounded-2xl border border-border/70 p-4">
                    <label className="flex items-center justify-between gap-4">
                        <span><span className="block text-sm font-semibold">Featured</span><span className="block text-xs text-muted-foreground">Highlighted at the top of the shop</span></span>
                        <Switch checked={draft.isFeatured} onCheckedChange={(v) => setDraft((d) => ({ ...d, isFeatured: v }))} />
                    </label>
                    {product && (
                        <label className="flex items-center justify-between gap-4">
                            <span><span className="block text-sm font-semibold">Visible in the shop</span><span className="block text-xs text-muted-foreground">Turn off to hide it without deleting</span></span>
                            <Switch checked={draft.isActive} onCheckedChange={(v) => setDraft((d) => ({ ...d, isActive: v }))} />
                        </label>
                    )}
                </div>
            </div>

            <div className="flex gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:px-6">
                <Button type="button" variant="ghost" onClick={onDone} disabled={saving}>Cancel</Button>
                <Button type="submit" className="ml-auto" loading={saving}>{product ? 'Save changes' : 'Add product'}</Button>
            </div>
        </form>
    );
}

function ProductsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const debounced = useDebounce(search.trim(), 350);
    const { data, isLoading, isError, refetch } = useAdminProducts({ limit: 200, search: debounced || undefined });
    const { data: categoryData } = useAdminCategories();
    const update = useUpdateProduct();
    const remove = useDeleteProduct();
    const [toDelete, setToDelete] = useState<Product | null>(null);

    const products: Product[] = useMemo(() => (data as { products?: Product[] } | undefined)?.products || [], [data]);
    const categories: string[] = (categoryData as { categories?: string[] } | undefined)?.categories || [];
    const editing = searchParams.get('edit');
    const editingProduct = editing && editing !== 'new' ? products.find((p) => p._id === editing) || null : null;
    const lowStock = products.filter((p) => (p.stock ?? 0) < LOW_STOCK).length;

    const openEditor = (id: string | null) => {
        const next = new URLSearchParams(searchParams.toString());
        if (id) next.set('edit', id); else next.delete('edit');
        router.replace(`${pathname}${next.toString() ? `?${next}` : ''}`, { scroll: false });
    };

    const toggle = (p: Product, field: 'isActive' | 'isFeatured', value: boolean) =>
        update.mutate({ id: p._id, data: { [field]: value } }, {
            onSuccess: () => toast.success(field === 'isActive' ? (value ? `${p.name} is visible in the shop` : `${p.name} is hidden from the shop`) : value ? 'Marked as featured' : 'No longer featured'),
            onError: (err) => toast.error(getErrorMessage(err, 'Could not update the product')),
        });

    return (
        <div>
            <PageHeader
                title="Products"
                description={lowStock ? `${lowStock} product${lowStock === 1 ? ' is' : 's are'} running low on stock.` : 'Manage what customers can order.'}
                actions={<Button onClick={() => openEditor('new')}><Plus /> Add product</Button>}
            />

            <div className="relative mb-4 max-w-sm">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="h-10 rounded-xl pl-10" aria-label="Search products" />
            </div>

            <Panel className="overflow-hidden">
                {isLoading ? (
                    <div className="space-y-2 p-5">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-14 rounded-xl" />)}</div>
                ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                ) : products.length === 0 ? (
                    <EmptyState icon={ShoppingBag} title={debounced ? 'No matching products' : 'No products yet'} action={debounced ? undefined : { label: 'Add your first product', onClick: () => openEditor('new') }} />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5 sm:pl-6">Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="hidden md:table-cell">Visible</TableHead>
                                <TableHead className="pr-5 text-right sm:pr-6"><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((p) => (
                                <TableRow key={p._id} className={p.isActive === false ? 'opacity-60' : undefined}>
                                    <TableCell className="pl-5 sm:pl-6">
                                        <div className="flex items-center gap-3">
                                            <img src={productImageUrl(p)} onError={handleImageError} alt="" className="size-11 shrink-0 rounded-xl bg-muted object-cover" />
                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1.5 truncate font-semibold">{p.name}{p.isFeatured && <Star className="size-3.5 fill-amber-400 text-amber-400" aria-label="Featured" />}</p>
                                                <p className="text-xs capitalize text-muted-foreground">{p.category}{p.brand ? ` · ${p.brand}` : ''}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="tabular-nums">{formatNaira(p.price)}</TableCell>
                                    <TableCell>
                                        {(p.stock ?? 0) === 0 ? <Pill tone="danger">Out of stock</Pill> : (p.stock ?? 0) < LOW_STOCK ? <Pill tone="warning">{p.stock} left</Pill> : <span className="tabular-nums">{p.stock}</span>}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Switch checked={p.isActive !== false} onCheckedChange={(v) => toggle(p, 'isActive', v)} aria-label={`Show ${p.name} in the shop`} />
                                    </TableCell>
                                    <TableCell className="pr-5 text-right sm:pr-6">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon-sm" onClick={() => openEditor(p._id)} aria-label={`Edit ${p.name}`}><Pencil /></Button>
                                            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`}><Trash2 /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Panel>

            <Sheet open={!!editing} onOpenChange={(o) => !o && openEditor(null)}>
                <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
                    {editing && <ProductEditor product={editingProduct} categories={categories} onDone={() => openEditor(null)} />}
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !remove.isPending && setToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
                        <AlertDialogDescription>It is removed from the shop and its images are deleted. Past orders keep their details. To stop selling it for now, hide it instead.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={remove.isPending}>Keep it</AlertDialogCancel>
                        {toDelete?.isActive !== false && (
                            <Button variant="outline" onClick={() => { if (toDelete) toggle(toDelete, 'isActive', false); setToDelete(null); }}>Hide instead</Button>
                        )}
                        <Button variant="destructive" loading={remove.isPending} onClick={() => toDelete && remove.mutate(toDelete._id, {
                            onSuccess: () => { toast.success('Product deleted'); setToDelete(null); },
                            onError: (err) => toast.error(getErrorMessage(err, 'Could not delete the product')),
                        })}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function AdminProductsPage() {
    return (
        <Suspense fallback={null}>
            <ProductsContent />
        </Suspense>
    );
}
