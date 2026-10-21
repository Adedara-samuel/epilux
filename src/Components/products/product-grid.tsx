'use client';

import { Stagger, StaggerItem } from '@/Components/motion';
import ProductCard, { ProductCardSkeleton } from './product-card';
import type { Product } from '@/types/product';

export default function ProductGrid({ products, loading = false, skeletonCount = 8 }: { products: Product[]; loading?: boolean; skeletonCount?: number }) {
    const gridClass = 'grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4';

    if (loading) {
        return (
            <div className={gridClass} aria-busy>
                {Array.from({ length: skeletonCount }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <Stagger className={gridClass} stagger={0.05} immediate>
            {products.map((product) => (
                <StaggerItem key={String((product as Product & { _id?: string })._id || product.id)} className="h-full">
                    <ProductCard product={product} />
                </StaggerItem>
            ))}
        </Stagger>
    );
}
