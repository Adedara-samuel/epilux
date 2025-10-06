/* eslint-disable react/no-unescaped-entities */
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

const contactFormSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject is required').max(200, 'Subject is too long'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

export default function ContactPage() {
    // 1. Get the loading state from useAuth
    const { user, loading } = useAuth();
    const router = useRouter();

    // 2. Initialize form with a useEffect or conditionally to ensure 'user' is ready.
    // However, the current conditional logic for defaultValues is usually fine if we handle the loading/redirect correctly.
    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            // These lines depend on 'user' being available or null/undefined, which is safe.
            name: user ? `${user.firstName} ${user.lastName}` : '',
            email: user?.email || '',
            subject: '',
            message: '',
        },
        // We will manually reset or re-initialize based on loading state if needed,
        // but for now, the critical fix is in the render logic.
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // --- CRITICAL FIX START ---
    // Handle Loading State: Render a loader while authenticating.
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // Handle Redirect on Client Side: Only redirect if 'loading' is false and 'user' is null.
    // This runs only after the authentication state has been resolved on the client.
    if (!user) {
        // Use a client-side effect if a server-side redirect is still problematic in your setup,
        // but this direct check after loading is often sufficient.
        router.push('/login');
        return null;
    }
    // --- CRITICAL FIX END ---

    const onSubmit = async () => {
        setIsSubmitting(true);
        // ... (rest of onSubmit logic remains the same)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Your message has been sent successfully!");
            form.reset();
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="flex items-center gap-2 border-none cursor-pointer bg-transparent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to profile
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Contact Us
                        </h1>
                        <p className="text-gray-600 mt-2">Get in touch with our support team</p>
                    </div>
                    <div></div> {/* Spacer for centering */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
                                <p className="text-gray-600">We'll get back to you within 24 hours</p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Your Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                        {...field}
                                                    />
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
                                                <FormLabel className="text-gray-700 font-medium">Your Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">Subject</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="How can we help you?"
                                                    className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                    {...field}
                                                />
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
                                            <FormLabel className="text-gray-700 font-medium">Your Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={5}
                                                    placeholder="Tell us more about your inquiry..."
                                                    className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
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

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Get in Touch</h2>
                                    <p className="text-blue-100">Multiple ways to reach our team</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Mail className="h-6 w-6 text-blue-200 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-xl mb-1">Email Support</h3>
                                        <p className="text-blue-100">epiluxcompany@gmail.com</p>
                                        <p className="text-sm text-blue-200">We respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Phone className="h-6 w-6 text-blue-200 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-xl mb-1">Phone Support</h3>
                                        <p className="text-blue-100">+234 800 000 0000</p>
                                        <p className="text-sm text-blue-200">Mon - Fri, 9 AM - 5 PM (WAT)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <MapPin className="h-6 w-6 text-blue-200 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-xl mb-1">Visit Our Office</h3>
                                        <p className="text-blue-100">123 Waterway Road</p>
                                        <p className="text-blue-100">Hydration City, Nigeria</p>
                                        <p className="text-sm text-blue-200">Appointments recommended</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                            <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                            <div className="space-y-1 text-sm text-blue-100">
                                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                                <p>Saturday: 10:00 AM - 2:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    );
}