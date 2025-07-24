/* eslint-disable react/no-unescaped-entities */
// app/contact/page.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/context/auth-context';
import { toast } from 'sonner';
import { db } from '@/lib/firebase'; // Import db directly from firebase config

const contactFormSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject is required').max(200, 'Subject is too long'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

export default function ContactPage() {
    const { user } = useAuth(); // Get user from auth context
    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: user?.displayName || '', // Pre-fill name if user is logged in
            email: user?.email || '', // Pre-fill email if user is logged in
            subject: '',
            message: '',
        },
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
        setIsSubmitting(true);
        if (!db) {
            toast.error("Database not initialized. Cannot send message.");
            setIsSubmitting(false);
            return;
        }

        // Use user.uid for userId if logged in, otherwise generate a random UUID for anonymous messages
        const currentUserId = user?.uid || crypto.randomUUID();

        try {
            // Determine appId based on environment
            const appId = typeof __app_id !== 'undefined' ? __app_id : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'default-app-id';

            await addDoc(collection(db, "artifacts", appId, "public", "contactMessages"), {
                ...values,
                timestamp: serverTimestamp(),
                userId: currentUserId,
            });
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
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Contact Us</h1>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
                    We'd love to hear from you! Whether you have a question about our products, services, or anything else, our team is ready to help.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Send Us a Message</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium">Your Name</FormLabel>
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
                                            <FormLabel className="text-gray-700 font-medium">Your Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="you@example.com" {...field} />
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
                                            <FormLabel className="text-gray-700 font-medium">Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Inquiry about..." {...field} />
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
                                                <Textarea rows={5} placeholder="Type your message here..." className="resize-y" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full shadow-md" disabled={isSubmitting}>
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

                    <div className="bg-blue-700 text-white rounded-xl shadow-lg p-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 border-b border-blue-500 pb-4">Our Contact Details</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-blue-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-xl mb-1">Email Us</h3>
                                        <p className="text-blue-200">info@epiluxwater.com</p>
                                        <p className="text-sm text-blue-300">We respond within 24 hours.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-blue-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-xl mb-1">Call Us</h3>
                                        <p className="text-blue-200">+234 800 000 0000</p>
                                        <p className="text-sm text-blue-300">Mon - Fri, 9 AM - 5 PM (WAT)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-blue-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-xl mb-1">Visit Our Office</h3>
                                        <p className="text-blue-200">123 Waterway Road, Hydration City, Nigeria</p>
                                        <p className="text-sm text-blue-300">Appointments recommended.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 text-center">
                            <p className="text-blue-300 text-sm">
                                Follow us on social media for updates and promotions!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}