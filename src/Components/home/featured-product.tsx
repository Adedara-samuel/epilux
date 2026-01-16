// components/home/FeaturedProducts.tsx
'use client';

import Link from 'next/link';
import ProductCard from '../products/product-card';
import { Button } from '../ui/button';
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';

const FeaturedProducts: React.FC = () => {
    const { data: productsData, isLoading } = useProducts();
    const products = productsData?.data || [];

    // Filter for featured products (you can adjust the criteria)
    const featuredProducts = products.filter((product: Product) =>
        product.category === 'bottled' || product.category === 'sachet'
    ).slice(0, 3).map((p: any) => ({
        ...p,
        id: p.id || p._id || 'unknown'
    })) as Product[];

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <p>Loading featured products...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-16 bg-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-4 tracking-tight">Our Bestsellers</h2>
                    <p className="text-base sm:text-lg text-blue-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Discover what our customers love most. These are our top-rated and most purchased water products.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {featuredProducts.map((product: Product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 md:mt-16 text-center">
                    <Button asChild variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 sm:px-8 py-3 text-base sm:text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                        <Link href="/products">View All Products</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default FeaturedProducts;