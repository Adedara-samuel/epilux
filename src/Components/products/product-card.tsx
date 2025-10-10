/* eslint-disable @next/next/no-img-element */
// components/products/product-card.tsx
'use client';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '../ui/button';
import { Product } from '@/types/product'; // Import Product interface

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCartStore();

    if (!product) {
        return <div className="bg-white rounded-lg shadow p-4">Product not available</div>;
    }

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart`);
    };

    // Construct the redirect URL for the product detail page
    const productDetailRedirectUrl = `/products/${product.id}`;
    const loginLinkHref = `/login?redirect=${encodeURIComponent(productDetailRedirectUrl)}`;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            {/* Link to product details, now redirects to login */}
            <Link href={loginLinkHref}>
                <div className="aspect-square bg-gray-100 relative">
                    <img
                        src={product.image} // Ensure your Product interface has an 'image' property
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/product-1.jpeg'; // Fallback image
                        }}
                    />
                </div>
            </Link>
            <div className="p-4">
                {/* Link to product details, now redirects to login */}
                <Link href={loginLinkHref}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">{product.name}</h3>
                </Link>
                {product.category && (
                    <p className="text-sm text-gray-500 mb-2">{product.category.charAt(0).toUpperCase() + product.category.slice(1)} Water</p>
                )}
                <div className="flex items-center justify-between mt-2">
                    <div>
                        <span className="font-bold text-blue-700 text-xl">₦{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                                ₦{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <Button
                        size="sm"
                        onClick={handleAddToCart}
                        className="gap-1 bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Add</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}