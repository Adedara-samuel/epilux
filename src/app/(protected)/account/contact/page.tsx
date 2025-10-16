/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/contact/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Mail, Phone, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useSendMessage } from '@/hooks/useMessages';
import { SendMessagePayload } from '@/services/messageService';

const contactFormSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject is required').max(200, 'Subject is too long'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

export default function ContactPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    // Initialize the mutation hook
    const sendMessageMutation = useSendMessage(); 

    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: user ? `${user.firstName} ${user.lastName}` : '',
            email: user?.email || '',
            subject: '',
            message: '',
        },
    });

    // NOTE: Keeping the original redirect logic for structural consistency, though it may need review
    // if the path '/account/contact' is the current page.
    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login'); // Redirect to login if not authenticated
        }
    }, [user, loading, router]);

    // Handle Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    // UPDATED onSubmit: Use the React Query mutation
    const onSubmit = async (values: SendMessagePayload) => {
        try {
            // Call the mutation function
            await sendMessageMutation.mutateAsync(values);
            
            // Reset form fields after successful submission
            form.reset({
                name: user ? `${user.firstName} ${user.lastName}` : '',
                email: user?.email || '',
                subject: '',
                message: '',
            });
        } catch (error) {
            // Errors handled by the onError callback in useSendMessage
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="flex items-center gap-2 bg-transparent border-none cursor-pointer hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to profile
                    </Button>
                    <div className="text-center flex-1">
                        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                            Contact Us
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">We're here to help! Send us a message.</p>
                    </div>
                    <div></div> {/* Spacer */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Send a Message</h2>
                        <p className="text-gray-600 mb-8">Fill out the form and our support team will get back to you within 24 hours.</p>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@epiluxwater.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Issue with my last order" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Describe your issue or request in detail..." 
                                                    rows={5} 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                    disabled={sendMessageMutation.isPending} // Disable while submitting
                                >
                                    {sendMessageMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Contact Information and FAQ Section */}
                    <div className="space-y-12">
                        {/* Contact Information */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Email Us</h4>
                                        <p className="text-gray-600">support@epiluxwater.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Call Us</h4>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Our Office</h4>
                                        <p className="text-gray-600">123 Aqua Blvd, Water City, WA 98765</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* FAQ Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick FAQ</h2>
                            <div className="space-y-4">
                                <div className="p-4 border border-gray-100 rounded-xl">
                                    <h4 className="font-semibold text-gray-800 mb-2">How long does delivery take?</h4>
                                    <p className="text-gray-600 text-sm">Standard delivery takes 2-3 business days. Express delivery is available for same-day service.</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl">
                                    <h4 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h4>
                                    <p className="text-gray-600 text-sm">We accept all major credit cards, bank transfers, and cash on delivery.</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl">
                                    <h4 className="font-semibold text-gray-800 mb-2">Can I return products?</h4>
                                    <p className="text-gray-600 text-sm">Yes, we offer a 30-day return policy for unopened products in their original packaging.</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl">
                                    <h4 className="font-semibold text-gray-800 mb-2">Do you offer bulk discounts?</h4>
                                    <p className="text-gray-600 text-sm">Yes, we provide special pricing for bulk orders. Contact our sales team for a quote.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}