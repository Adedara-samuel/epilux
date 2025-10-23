/* eslint-disable @next/next/no-img-element */
// components/products/product-card.tsx
'use client';
import { ShoppingCart, Plus, Minus, Eye, Star, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [showDetails, setShowDetails] = useState(false);

    if (!product) {
        return <div className="bg-white rounded-lg shadow p-4">Product not available</div>;
    }

    // Construct the redirect URL for the product detail page
    const productDetailRedirectUrl = `/products/${product.id}`;
    const loginLinkHref = `/login?redirect=${encodeURIComponent(productDetailRedirectUrl)}`;

    const handleQuantityChange = (change: number) => {
        const newQuantity = Math.max(1, quantity + change);
        setQuantity(newQuantity);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sachet': return '💧';
            case 'bottled': return '🥤';
            case 'dispenser': return '🏢';
            case 'bulk': return '📦';
            case 'accessories': return '🔧';
            default: return '🛍️';
        }
    };

    const getStockStatus = (stock: number) => {
        if (stock > 50) return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
        if (stock > 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'Limited', color: 'bg-red-100 text-red-800' };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <Card className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200">
            {/* Product Image */}
            <div className="relative">
                <Link href={loginLinkHref}>
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/product-1.jpeg';
                            }}
                        />
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </div>
                        )}
                        <div className="absolute top-3 left-3">
                            <Badge className={`${stockStatus.color} text-xs font-medium`}>
                                {stockStatus.text}
                            </Badge>
                        </div>
                        {/* Quick View Button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowDetails(true);
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Quick View
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-xl">
                                            <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                                            {product.name}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                                        {/* Product Image */}
                                        <div className="space-y-4">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/product-1.jpeg';
                                                    }}
                                                />
                                            </div>
                                            {/* Product Tags */}
                                            {product.tags && product.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {product.tags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="space-y-4">
                                            {/* Category & Stock */}
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary" className="capitalize">
                                                    {getCategoryIcon(product.category)} {product.category} Water
                                                </Badge>
                                                <Badge className={stockStatus.color}>
                                                    {product.stock} in stock
                                                </Badge>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {product.description}
                                                </p>
                                            </div>

                                            {/* Pricing */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        ₦{product.price.toLocaleString()}
                                                    </span>
                                                    {product.originalPrice && (
                                                        <span className="text-lg text-gray-500 line-through">
                                                            ₦{product.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                                    <Star className="w-4 h-4" />
                                                    Earn ₦{product.affiliateCommission.toLocaleString()} per sale
                                                </div>
                                            </div>

                                            {/* Quantity Selector */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Quantity</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(-1)}
                                                            disabled={quantity <= 1}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(1)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        Total: ₦{(product.price * quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Commission Info */}
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                                                    <Info className="w-4 h-4" />
                                                    Affiliate Commission
                                                </div>
                                                <p className="text-green-600 text-sm mt-1">
                                                    You'll earn ₦{(product.affiliateCommission * quantity).toLocaleString()} when this sells
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-2">
                                                <Link href={`/login?redirect=/products/${product.id}?quantity=${quantity}`}>
                                                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium">
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Add to Cart
                                                    </Button>
                                                </Link>
                                                <Link href={loginLinkHref}>
                                                    <Button variant="outline" className="w-full">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Full Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </Link>
            </div>

            <CardContent className="p-4">
                {/* Product Info */}
                <div className="space-y-3">
                    <div>
                        <Link href={loginLinkHref}>
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-orange-600 transition-colors text-sm leading-tight">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 capitalize">{product.category} Water</span>
                            <span className="text-xs">{getCategoryIcon(product.category)}</span>
                        </div>
                    </div>

                    {/* Price & Commission */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    ₦{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <Star className="w-3 h-3" />
                            ₦{product.affiliateCommission.toLocaleString()}/sale
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Dialog open={showDetails} onOpenChange={setShowDetails}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs hover-lift"
                                    onClick={() => setShowDetails(true)}
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Details
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                        <Link href={`/login?redirect=/products/${product.id}?quantity=${quantity}`} className="flex-1">
                            <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs">
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}