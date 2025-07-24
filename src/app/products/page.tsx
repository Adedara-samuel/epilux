/* eslint-disable @typescript-eslint/no-unused-vars */
// app/products/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product, products as allProducts } from '@/types/product';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/Components/products/product-grid';
import { useSearch } from '@/app/context/search-context'; // Import useSearch

// Note: Metadata export is moved to app/layout.tsx for client components.
// If you need dynamic titles based on filters, you'd update the document title client-side.

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';
    const { searchQuery } = useSearch(); // Get searchQuery from context

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

    const filteredProducts = useMemo(() => {
        let productsToFilter = allProducts;

        // Filter by category first
        if (selectedCategory !== 'all') {
            productsToFilter = productsToFilter.filter(product => product.category === selectedCategory);
        }

        // Then filter by global search query
        if (searchQuery) {
            const lowerCaseSearchQuery = searchQuery.toLowerCase();
            productsToFilter = productsToFilter.filter(
                product =>
                    product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
                    product.description.toLowerCase().includes(lowerCaseSearchQuery) ||
                    product.category.toLowerCase().includes(lowerCaseSearchQuery) ||
                    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchQuery)))
            );
        }

        return productsToFilter;
    }, [selectedCategory, searchQuery]); // Depend on searchQuery from context

    return (
        <div className="flex">

            {/* Main Content Area */}
            <main className="flex-1 py-4 lg:py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-3">Our Water Products</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Explore premium quality sachet, bottled, and bulk water options, plus dispensers and accessories for every need.
                    </p>
                </div>

                {/* Category Filter (can be moved into the sidebar if preferred, but keeping here for clarity) */}
                <div className="lg:hidden mb-6">
                    <label htmlFor="mobile-category-select" className="sr-only">Select Category</label>
                    <select
                        id="mobile-category-select"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                        {[
                            { name: 'All', value: 'all' },
                            { name: 'Sachet Water', value: 'sachet' },
                            { name: 'Bottled Water', value: 'bottled' },
                            { name: 'Water Dispensers', value: 'dispenser' },
                            { name: 'Accessories', value: 'accessories' },
                            { name: 'Bulk Orders', value: 'bulk' },
                        ].map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 ml-6">
                    {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.value === selectedCategory)?.name + ' Products'}
                </h2>
                <ProductGrid products={filteredProducts} />
            </main>
        </div>
    );
}

// Define categories outside the component for consistent access
const categories = [
    { name: 'All', value: 'all' },
    { name: 'Sachet Water', value: 'sachet' },
    { name: 'Bottled Water', value: 'bottled' },
    { name: 'Water Dispensers', value: 'dispenser' },
    { name: 'Accessories', value: 'accessories' },
    { name: 'Bulk Orders', value: 'bulk' },
];