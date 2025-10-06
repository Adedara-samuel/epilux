/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/products/page.tsx
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/Components/products/product-grid';
import { useSearchStore } from '@/stores/search-store';
import { useProducts, useCategories, useBrands } from '@/hooks/useProducts';

// Note: Metadata export is moved to app/layout.tsx for client components.
// If you need dynamic titles based on filters, you'd update the document title client-side.

function ProductsPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';
    const { searchQuery } = useSearchStore(); // Get searchQuery from store

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    // Removed [searchQuery, setSearchQuery] useState and handleSearch function

    // Update category state if URL param changes
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'all');
    }, [searchParams]);

    const handleCategoryChange = (categoryValue: string) => {
        setSelectedCategory(categoryValue);
        // Optionally update URL for persistence/sharing
        const newSearchParams = new URLSearchParams(searchParams.toString());
        if (categoryValue === 'all') {
            newSearchParams.delete('category');
        } else {
            newSearchParams.set('category', categoryValue);
        }
        window.history.pushState(null, '', `?${newSearchParams.toString()}`);
    };

    // Use API for products
    const { data: productsData, isLoading } = useProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
    });

    const products = productsData?.products || [];

    // Get categories and brands for filters
    const { data: categoriesData } = useCategories();
    const { data: brandsData } = useBrands();

    const categories = categoriesData?.categories || [];
    const brands = brandsData?.brands || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Our Premium Water Products
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Discover our complete range of high-quality drinking water solutions, from individual sachets to bulk dispensers
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Category Filter */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Filter by Category</h2>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {products.length} products found
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: 'All Products', value: 'all', icon: '🏷️' },
                            { name: 'Sachet Water', value: 'sachet', icon: '💧' },
                            { name: 'Bottled Water', value: 'bottled', icon: '🥤' },
                            { name: 'Water Dispensers', value: 'dispenser', icon: '🏢' },
                            { name: 'Accessories', value: 'accessories', icon: '🔧' },
                            { name: 'Bulk Orders', value: 'bulk', icon: '📦' },
                        ].map((category) => (
                            <button
                                key={category.value}
                                onClick={() => handleCategoryChange(category.value)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    selectedCategory === category.value
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                                }`}
                            >
                                <span className="text-lg">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {selectedCategory === 'all'
                                ? 'All Products'
                                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
                            }
                        </h2>
                        <div className="text-sm text-gray-600">
                            Showing {products.length} of {products.length} products
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-lg text-gray-700">Loading premium products...</p>
                            </div>
                        </div>
                    ) : products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">🔍</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                We couldn't find any products in this category. Try selecting a different category or check back later.
                            </p>
                            <button
                                onClick={() => handleCategoryChange('all')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🚚</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Free Delivery</h3>
                        <p className="text-gray-600 text-sm">Free delivery on orders above ₦10,000. Fast and reliable service.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
                        <p className="text-gray-600 text-sm">All our products meet the highest quality standards and regulations.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">💳</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
                        <p className="text-gray-600 text-sm">Multiple payment options with bank-grade security and encryption.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
            <ProductsPage />
        </Suspense>
    );
}
