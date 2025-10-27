/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, Book } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import Link from 'next/link';
import { useAdminProducts, useAdminProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  // Add global animations
  useEffect(() => {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounceIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        * { cursor: default; }
        button, a, input, textarea, select { cursor: pointer; }

        .scroll-smooth { scroll-behavior: smooth; }
        .transition-all { transition: all 0.3s ease; }
        .hover-lift { transition: transform 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        .hover-glow { transition: box-shadow 0.3s ease; }
        .hover-glow:hover { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
      `;
      document.head.appendChild(styleSheet);

      // Add smooth scrolling to body
      document.body.classList.add('scroll-smooth');

      return () => {
        document.head.removeChild(styleSheet);
        document.body.classList.remove('scroll-smooth');
      };
  }, []);

  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useAdminProducts({ limit: 100 });
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Deduplicate the products array based on 'id' or '_id' for unique keys.
  // Assuming the unique identifier for mapping is 'id' OR '_id' if 'id' is missing.
  const uniqueProducts = productsData?.products
    ? Array.from(new Map(productsData.products.map((product: any) => [product.id || product._id, product])).values())
    : [];

  const products = uniqueProducts || [];

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      image: product.image || '',
    });
    setEditOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleUpdateProduct = () => {
    // Generate unique SKU if not present
    const generateSKU = () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      return `SKU-${timestamp}-${random}`.toUpperCase();
    };

    updateMutation.mutate(
      {
        // FIX: Use selectedProduct._id to get the unique identifier,
        // and pass it as 'id' as the backend service expects.
        id: selectedProduct._id,
        data: {
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          category: editForm.category,
          stock: parseInt(editForm.stock),
          image: editForm.image,
          sku: selectedProduct.sku || generateSKU(), // Add unique SKU
        } as any,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    // Also ensuring delete uses the correct _id, though you only mentioned update.
    deleteMutation.mutate(selectedProduct._id, { 
      onSuccess: () => {
        setDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      },
    });
  };

  const filteredProducts = products.filter((product: any) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounceIn">
                Products Management
              </h1>
              <p className="text-gray-600 mt-1 animate-fadeIn animation-delay-300">Manage your product catalog and inventory</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover-lift animate-fadeIn animation-delay-500">
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6 animate-fadeIn animation-delay-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-gray-200"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 hover-lift">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn animation-delay-900">
        {filteredProducts.map((product: any) => (
          // Using product.id || product._id for the key ensures a unique key is used.
          <Card key={product.id || product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== '/images/placeholder.jpg') {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }
                }}
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(product.stock > 0 ? 'active' : 'out_of_stock')}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ₦{product.price?.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className='cursor-pointer'>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className='cursor-pointer' onClick={() => handleEditProduct(product)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer' onClick={() => handleViewProduct(product)}>
                        <Book className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDeleteProduct(product)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {filteredProducts.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fadeIn animation-delay-1100">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
              </p>
              <Button asChild className="cursor-pointer hover-lift">
                <Link href="/admin/products/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

      {/* View Product Dialog */}
      {viewOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setViewOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Price:</strong> ₦{selectedProduct.price?.toLocaleString()}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
              <p><strong>Created:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setViewOpen(false)} className="cursor-pointer">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Dialog */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setEditOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button onClick={handleUpdateProduct} disabled={updateMutation.isPending} className="cursor-pointer">
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setDeleteOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
            <p>Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteMutation.isPending} className="cursor-pointer">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}