/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Save, Mail, Shield, Store, Loader2, DollarSign, Percent } from 'lucide-react'; 
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/useAdmin';
import { useChangePassword } from '@/hooks';
// FIXED IMPORT: Using sonner for toast messages
import { toast } from 'sonner';

// Define the shape of the data returned by the API for clarity
interface SettingsApiResponse {
    commissionRate: number; // e.g., 0.1
    minWithdrawal: number; // e.g., 50
    paymentMethods: string[]; // e.g., ["bank_transfer", "paypal"]
    currency: string; // e.g., "USD"
}

export default function AdminSettingsPage() {
    const { data: settingsData } = useAdminSettings() as { data?: { data: SettingsApiResponse }};
    const updateSettingsMutation = useUpdateAdminSettings();
    const changePasswordMutation = useChangePassword();
    
    // NOTE: useToast initialization is removed as sonner's 'toast' is directly exported.

    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [settings, setSettings] = useState({
        // General Settings (Defaulted to empty strings, will be set by user or other API fields)
        storeName: '',
        storeEmail: '',
        storePhone: '',
        timezone: '',
        smtpHost: '',
        smtpPort: '',
        smtpUser: '',
        smtpPassword: '',

        // Financial/Affiliate Settings from Backend Response (Set initial defaults)
        currency: 'USD',
        commissionRate: 0.1,
        minWithdrawal: 50,
        paymentMethods: 'bank_transfer, paypal, crypto', 
    });

    useEffect(() => {
        if (settingsData?.data) {
            const apiData = settingsData.data;

            setSettings(prev => ({
                ...prev,
                currency: apiData.currency || prev.currency,
                commissionRate: apiData.commissionRate ?? prev.commissionRate,
                minWithdrawal: apiData.minWithdrawal ?? prev.minWithdrawal,
                
                paymentMethods: Array.isArray(apiData.paymentMethods) 
                    ? apiData.paymentMethods.join(', ') 
                    : prev.paymentMethods,
            }));
        }
    }, [settingsData]);

    const handleSave = () => {
        const dataToSave = {
            ...settings,
            commissionRate: parseFloat(settings.commissionRate.toString()), 
            minWithdrawal: parseInt(settings.minWithdrawal.toString()),
            paymentMethods: settings.paymentMethods.split(',').map(m => m.trim()).filter(m => m.length > 0), 
        };

        updateSettingsMutation.mutate(dataToSave, {
            onSuccess: () => {
                // CHANGED to sonner toast.success
                toast.success('Settings Saved', {
                    description: 'Your store and financial settings have been successfully updated.',
                });
            },
            onError: (error: any) => {
                // CHANGED to sonner toast.error
                toast.error('Error Saving Settings', {
                    description: `Failed to save settings: ${error.message || 'Please check your connection and try again.'}`,
                });
            }
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            // CHANGED to sonner toast.error
            toast.error('Password Mismatch', {
                description: 'The new password and confirmation password do not match.',
            });
            return;
        }

        changePasswordMutation.mutate({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        }, {
            onSuccess: () => {
                setPasswordDialogOpen(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                // CHANGED to sonner toast.success
                toast.success('Password Changed', {
                    description: 'Your admin password has been updated successfully.',
                });
            },
            onError: (error: any) => {
                // CHANGED to sonner toast.error
                toast.error('Password Change Failed', {
                    description: `Failed to change password: ${error.message}`,
                });
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Manage your store settings and preferences</p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={updateSettingsMutation.isPending}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    {updateSettingsMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* Store Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Store className="w-5 h-5" />
                        Store Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                            <Input
                                id="storeName"
                                value={settings.storeName}
                                onChange={(e) => handleInputChange('storeName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                            <Input
                                id="storeEmail"
                                type="email"
                                value={settings.storeEmail}
                                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">Store Phone</label>
                            <Input
                                id="storePhone"
                                value={settings.storePhone}
                                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                id="currency"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={settings.currency}
                                onChange={(e) => handleInputChange('currency', e.target.value)}
                            >
                                <option value="NGN">NGN (₦)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Affiliate & Financial Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Affiliate & Financial Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-1">
                                Commission Rate (%)
                            </label>
                            <div className="relative">
                                <Input
                                    id="commissionRate"
                                    type="number"
                                    value={(parseFloat(settings.commissionRate.toString()) * 100)}
                                    onChange={(e) => 
                                        handleInputChange('commissionRate', (parseFloat(e.target.value) / 100).toString())
                                    }
                                    className="pr-10"
                                />
                                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Stored Value: **{settings.commissionRate}** (decimal)</p>
                        </div>

                        <div>
                            <label htmlFor="minWithdrawal" className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Withdrawal ({settings.currency})
                            </label>
                            <Input
                                id="minWithdrawal"
                                type="number"
                                value={settings.minWithdrawal}
                                onChange={(e) => handleInputChange('minWithdrawal', e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="paymentMethods" className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Methods (Comma Separated)
                            </label>
                            <Input
                                id="paymentMethods"
                                placeholder="bank_transfer, paypal, crypto"
                                value={settings.paymentMethods}
                                onChange={(e) => handleInputChange('paymentMethods', e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">Current Methods: **{settings.paymentMethods}**</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Email Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                            <Input
                                id="smtpHost"
                                placeholder="smtp.gmail.com"
                                value={settings.smtpHost}
                                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                            <Input
                                id="smtpPort"
                                placeholder="587"
                                value={settings.smtpPort}
                                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                            <Input
                                id="smtpUser"
                                placeholder="your-email@gmail.com"
                                value={settings.smtpUser}
                                onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                            <Input
                                id="smtpPassword"
                                type="password"
                                placeholder="Your SMTP password"
                                value={settings.smtpPassword}
                                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                            />
                        </div>
                    </div>
                    <Button variant="outline" className="mt-4 cursor-pointer">
                        Test Email Configuration
                    </Button>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements</h4>
                            <p className="text-sm text-gray-600 mb-3">Configure password strength requirements</p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <label className="text-sm">Minimum 8 characters</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <label className="text-sm">Require uppercase letter</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <label className="text-sm">Require lowercase letter</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <label className="text-sm">Require number</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t">
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                            onClick={() => setPasswordDialogOpen(true)}
                        >
                            Change Admin Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Password Change Dialog */}
            {passwordDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setPasswordDialogOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Change Admin Password</h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="currentPassword" className="text-gray-700 font-medium">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="mt-1"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="mt-1"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="mt-1"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setPasswordDialogOpen(false)}
                                    className="flex-1 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePasswordChange}
                                    disabled={changePasswordMutation.isPending}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                >
                                    {changePasswordMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Changing...
                                        </>
                                    ) : (
                                        'Change Password'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}