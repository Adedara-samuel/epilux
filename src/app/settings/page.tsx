/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Loader2, User, Key, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import auth directly
import { Label } from '@/components/ui/label';
import { Card } from '@/Components/ui/card';

// Zod schemas for validation
const profileSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(6, 'Confirm new password is required'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});

const reauthenticateSchema = z.object({
    password: z.string().min(1, 'Password is required to confirm action'),
});

export default function SettingsPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [isReauthenticating, setIsReauthenticating] = useState(false);
    const [reauthAction, setReauthAction] = useState<'password' | 'delete' | null>(null);

    // Forms for different sections
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName || '',
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

    const reauthForm = useForm<z.infer<typeof reauthenticateSchema>>({
        resolver: zodResolver(reauthenticateSchema),
        defaultValues: {
            password: '',
        },
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/settings');
        }
        if (user) {
            profileForm.reset({ displayName: user.displayName || '' });
        }
    }, [user, authLoading, router, profileForm]);


    const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
        if (!user) return;
        try {
            await updateProfile(user, { displayName: values.displayName });
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(`Failed to update profile: ${error.message}`);
        }
    };

    const handlePasswordChange = async (values: z.infer<typeof passwordSchema>) => {
        if (!user) return;

        // Re-authenticate user first for security
        setReauthAction('password');
        setIsReauthenticating(true);
        // The reauth form will handle the actual password change after successful re-authentication
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        // Re-authenticate user first for security
        setReauthAction('delete');
        setIsReauthenticating(true);
        // The reauth form will handle the actual account deletion after successful re-authentication
    };

    const handleReauthenticate = async (values: z.infer<typeof reauthenticateSchema>) => {
        if (!user || !auth.currentUser) {
            toast.error("User not logged in.");
            return;
        }

        setIsReauthenticating(true); // Keep loading state
        try {
            const credential = EmailAuthProvider.credential(user.email!, values.password);
            await reauthenticateWithCredential(auth.currentUser, credential);
            toast.success("Re-authentication successful!");
            reauthForm.reset(); // Clear password field

            if (reauthAction === 'password') {
                // Proceed with password change
                await updatePassword(auth.currentUser, passwordForm.getValues().newPassword);
                toast.success("Password updated successfully!");
                passwordForm.reset(); // Clear password fields
            } else if (reauthAction === 'delete') {
                // Proceed with account deletion
                await auth.currentUser.delete();
                toast.success("Account deleted successfully!");
                logout(); // Log out after deletion
            }
            setIsReauthenticating(false);
            setReauthAction(null); // Reset action
        } catch (error: any) {
            console.error("Error during re-authentication or subsequent action:", error);
            toast.error(`Action failed: ${error.message}. Please check your password.`);
            setIsReauthenticating(false);
        }
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
        <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">Account Settings</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-10">
                Manage your personal information, security settings, and account preferences here.
            </p>

            <div className="max-w-3xl mx-auto space-y-10">
                {/* Profile Information */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-3">
                        <User className="h-6 w-6 text-blue-600" /> Profile Information
                    </h2>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                            <FormItem>
                                <Label className="text-gray-700 font-medium">Email Address</Label>
                                <Input value={user.email || 'N/A'} disabled className="bg-gray-50 cursor-not-allowed" />
                                <p className="text-sm text-gray-500 mt-1">Email cannot be changed here.</p>
                            </FormItem>
                            <FormField
                                control={profileForm.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Display Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={profileForm.formState.isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full">
                                {profileForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Update Profile
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-yellow-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-3">
                        <Key className="h-6 w-6 text-yellow-600" /> Change Password
                    </h2>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter current password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter new password" {...field} />
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
                                        <FormLabel className="text-gray-700 font-medium">Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-full">
                                {passwordForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Change Password
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Delete Account */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-red-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-3">
                        <Trash2 className="h-6 w-6 text-red-600" /> Delete Account
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button onClick={handleDeleteAccount} disabled={isReauthenticating} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full">
                        {isReauthenticating && reauthAction === 'delete' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Delete My Account
                    </Button>
                </div>

                {/* Re-authentication Modal (or inline form) */}
                {isReauthenticating && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <Card className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Your Password</h2>
                            <p className="text-gray-600 mb-6">
                                Please re-enter your password to proceed with {reauthAction === 'password' ? 'changing your password' : 'deleting your account'}.
                            </p>
                            <Form {...reauthForm}>
                                <form onSubmit={reauthForm.handleSubmit(handleReauthenticate)} className="space-y-6">
                                    <FormField
                                        control={reauthForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Your password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end gap-4 mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsReauthenticating(false);
                                                setReauthAction(null);
                                                reauthForm.reset();
                                            }}
                                            disabled={reauthForm.formState.isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={reauthForm.formState.isSubmitting}>
                                            {reauthForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Confirm
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
