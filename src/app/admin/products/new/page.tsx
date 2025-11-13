'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';
import { useCreateProduct } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { ImageUploadField } from '@/Components/ui/image-upload-field';

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    images: { url: string; alt: string; isPrimary: boolean; file?: File }[];
}

export default function AddProductPage() {
    const router = useRouter();
    const createProduct = useCreateProduct();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');

    const form = useForm<ProductFormData>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: '',
            brand: '',
            stock: 0,
            images: [],
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);
        try {
            // Create FormData for multipart upload
            const formData = new FormData();

            // Add product data
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price.toString());
            formData.append('stock', data.stock.toString());
            formData.append('category', data.category);
            if (data.brand) {
                formData.append('brand', data.brand);
            }

            // Add image files
            data.images.forEach(img => {
                if (img.file) {
                    formData.append('images', img.file);
                }
            });

            // Upload via API
            const response = await fetch('https://epilux-backend.vercel.app/api/admin/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });

            if (response.ok) {
                toast.success('Product created successfully');
                router.push('/admin/products');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to create product');
            }
        } catch (error) {
            toast.error('Failed to create product');
            console.error('Create product error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-600">Create a new product for your catalog</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    rules={{ required: 'Product name is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter product name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    rules={{
                                        required: 'Price is required',
                                        min: { value: 0, message: 'Price must be positive' }
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (₦)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                rules={{ required: 'Description is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter product description"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    rules={{ required: 'Category is required' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Select category</option>
                                                    <option value="bottled">Bottled Water</option>
                                                    <option value="sachet">Sachet Water</option>
                                                    <option value="mineral">Mineral Water</option>
                                                    <option value="sparkling">Sparkling Water</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter brand name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="stock"
                                    rules={{
                                        required: 'Stock is required',
                                        min: { value: 0, message: 'Stock must be non-negative' }
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Images</FormLabel>
                                        <ImageUploadField
                                            value={field.value || []}
                                            onChange={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin/products')}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}