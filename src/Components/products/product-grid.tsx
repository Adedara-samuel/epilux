// components/ProductGrid.tsx
'use client';
import { Product } from '@/types/product'; // Import Product type
import ProductCard from './product-card';

interface ProductGridProps {
    products: Product[]; // Expects an array of Product
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.length === 0 ? (
                <p className="col-span-full text-center text-gray-600">No products found in this category.</p>
            ) : (
                products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            )}
        </div>
    );
}