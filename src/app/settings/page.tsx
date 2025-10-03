/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Loader2, User, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateProfile, useChangePassword } from '@/hooks';

// Zod schemas for validation
const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'Name too long').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Name too long').optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(6, 'Confirm new password is required'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});


export default function SettingsPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const updateProfileMutation = useUpdateProfile();
    const changePasswordMutation = useChangePassword();

    // Forms for different sections
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });


    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/settings');
        }
        if (user) {
            profileForm.reset({ firstName: user.firstName || '', lastName: user.lastName || '' });
        }
    }, [user, authLoading, router, profileForm]);


    const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
        if (!user) return;
        updateProfileMutation.mutate(values, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
            },
            onError: (error: any) => {
                console.error("Error updating profile:", error);
                toast.error(`Failed to update profile: ${error.message}`);
            },
        });
    };

    const handlePasswordChange = async (values: z.infer<typeof passwordSchema>) => {
        if (!user) return;

        changePasswordMutation.mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        }, {
            onSuccess: () => {
                toast.success("Password updated successfully!");
                passwordForm.reset();
            },
            onError: (error: any) => {
                console.error("Error updating password:", error);
                toast.error(`Failed to update password: ${error.message}`);
            },
        });
    };



    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading settings...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-700 text-center">Please log in to manage your account settings.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Account Settings
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Manage your personal information, security settings, and account preferences
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Information Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                    <p className="text-gray-600">Update your personal details</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                                    <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Address</h3>
                                        <Input
                                            value={user.email || 'N/A'}
                                            disabled
                                            className="bg-white border-gray-200 cursor-not-allowed rounded-xl"
                                        />
                                        <p className="text-sm text-gray-500 mt-2">Email cannot be changed here for security reasons.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your first name"
                                                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your last name"
                                                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={profileForm.formState.isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-lg"
                                    >
                                        {profileForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Updating Profile...
                                            </>
                                        ) : (
                                            'Update Profile'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Key className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                                    <p className="text-gray-600">Change your password to keep your account secure</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium text-lg">Current Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter your current password"
                                                        className="rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">New Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            className="rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmNewPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            className="rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1 bg-yellow-100 rounded-lg">
                                                <Key className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-yellow-800">Password Requirements</h4>
                                                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                                                    <li>• At least 6 characters long</li>
                                                    <li>• Use a mix of letters and numbers</li>
                                                    <li>• Avoid common passwords</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={passwordForm.formState.isSubmitting}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-lg"
                                    >
                                        {passwordForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Changing Password...
                                            </>
                                        ) : (
                                            'Change Password'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Actions</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                <div>
                                    <h3 className="font-medium text-gray-800">Export Account Data</h3>
                                    <p className="text-sm text-gray-600">Download a copy of your account data</p>
                                </div>
                                <Button variant="outline" className="rounded-xl">
                                    Export Data
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-xl">
                                <div>
                                    <h3 className="font-medium text-red-800">Delete Account</h3>
                                    <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
