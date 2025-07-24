// components/home/FeaturedProducts.tsx
import { products, Product } from '@/types/product';
import Link from 'next/link';
import ProductCard from '../products/product-card';
import { Button } from '../ui/button';
import React from 'react';

const FeaturedProducts: React.FC = () => {
    const bestSellerProducts: Product[] = products.filter(product => product.tags?.includes('popular') || product.tags?.includes('best-seller')).slice(0, 3);

    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-blue-700 mb-4 tracking-tight">Our Bestsellers</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover what our customers love most. These are our top-rated and most purchased water products.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {bestSellerProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button asChild variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-3 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                        <Link href="/login?redirect=/products">View All Products</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default FeaturedProducts;