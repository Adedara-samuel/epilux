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

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    images: string[];
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
            await createProduct.mutateAsync(data);
            toast.success('Product created successfully');
            router.push('/admin/products');
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
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium">Image Input Type</label>
                                                <select
                                                    value={imageInputType}
                                                    onChange={(e) => setImageInputType(e.target.value as 'url' | 'file')}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                >
                                                    <option value="url">Enter URLs</option>
                                                    <option value="file">Upload Files</option>
                                                </select>
                                            </div>
                                            {imageInputType === 'url' ? (
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter image URLs, one per line"
                                                        className="min-h-[80px]"
                                                        value={field.value?.join('\n') || ''}
                                                        onChange={(e) => {
                                                            const urls = e.target.value.split('\n').filter(url => url.trim());
                                                            field.onChange(urls);
                                                        }}
                                                    />
                                                </FormControl>
                                            ) : (
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            const dataUrls: string[] = [];
                                                            for (const file of files) {
                                                                const reader = new FileReader();
                                                                reader.onload = () => {
                                                                    dataUrls.push(reader.result as string);
                                                                    if (dataUrls.length === files.length) {
                                                                        field.onChange(dataUrls);
                                                                    }
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            )}
                                        </div>
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