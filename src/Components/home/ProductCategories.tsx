// components/home/ProductCategories.tsx
import { products, Product } from "@/types/product";
import ProductCard from "../products/product-card";
import { Button } from "../ui/button";
import Link from "next/link";
import React from 'react';

const ProductCategories: React.FC = () => {
    const featuredProducts: Product[] = products.filter(p => ['sachet', 'bottled', 'dispenser'].includes(p.category)).slice(0, 3).map(p => ({
        ...p,
        id: p.id || p._id || 'unknown'
    })) as Product[];

    return (
        <section className="container mx-auto px-6 py-16 bg-blue-50 rounded-lg shadow-lg -mt-8 relative z-20">
            <div className="text-center mb-14">
                <h2 className="text-4xl font-bold text-blue-700 mb-4 tracking-tight">Discover Our Premium Products</h2>
                <p className="text-lg text-blue-600 max-w-3xl mx-auto leading-relaxed">
                    Explore our range of high-quality drinking water, meticulously purified for your health and refreshment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredProducts.map((product) => (
                    // ProductCard itself handles the login redirection for its internal links
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-16 text-center">
                <Button asChild variant="outline" className="border-blue-500 bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-3 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                    <Link href="/login?redirect=/products">View All Products</Link>
                </Button>
            </div>
        </section>
    );
}

export default ProductCategories;