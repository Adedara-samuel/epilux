/* eslint-disable @next/next/no-img-element */
// app/products/[id]/page.tsx
'use client'; // Convert to client component

import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/app/context/cart-context';
import { Button } from '@/Components/ui/button';
import { useProduct } from '@/hooks/useProducts';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [quantity, setQuantity] = useState<number>(1);
    const { addToCart } = useCartStore();

    // Use API to fetch product
    const { data: productData, isLoading, error } = useProduct(id);

    const product = productData?.product;

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-700">Loading Product...</h1>
            </div>
        );
    }

    if (error || !product) {
        notFound(); // Renders Next.js not-found page if product isn't found
    }

    const handleAddToCart = () => {
        addToCart(product, quantity); // Pass quantity to addToCart
        toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-xl">
                <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    />
                </div>

                <div>
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-3">{product.name}</h1>
                    {product.category && (
                        <p className="text-lg text-gray-500 mb-4">Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    )}

                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500/10 text-blue-600 border border-blue-200"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold text-blue-700">
                            ₦{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xl text-gray-500 line-through">
                                ₦{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                    <div className="mb-6 bg-green-50 p-3 rounded-md border border-green-200">
                        <h3 className="font-semibold text-green-700 mb-1">Affiliate Commission:</h3>
                        <p className="text-green-800 font-bold text-lg">
                            ₦{product.affiliateCommission.toLocaleString()} per unit
                        </p>
                    </div>

                    <div className="flex items-end gap-4 mb-8">
                        <div className="w-32">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <select
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            >
                                {[...Array(product.stock > 10 ? 10 : product.stock)].map((_, i) => ( // Limit to 10 or stock if less
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            {product.stock <= 10 && product.stock > 0 && (
                                <p className="text-sm text-yellow-600 mt-1">Only {product.stock} left in stock!</p>
                            )}
                            {product.stock === 0 && (
                                <p className="text-sm text-red-600 mt-1">Out of stock</p>
                            )}
                        </div>

                        <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-lg transition-colors"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0} // Disable if out of stock
                        >
                            Add to Cart
                        </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-xl text-gray-800 mb-3">Product Specifications</h3>
                        <ul className="text-base text-gray-700 space-y-2">
                            <li><strong className="font-medium">SKU:</strong> {product.id.toUpperCase()}</li>
                            <li><strong className="font-medium">Category:</strong> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
                            <li><strong className="font-medium">Availability:</strong> {product.stock > 0 ? `${product.stock} units in stock` : 'Out of Stock'}</li>
                            <li><strong className="font-medium">Delivery:</strong> Free delivery on orders above ₦10,000</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}