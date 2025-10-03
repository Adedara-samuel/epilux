/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft, User, Bell, CreditCard, Shield, Mail, Phone, MapPin, Save, Eye, EyeOff } from 'lucide-react';

export default function AffiliateSettingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [settings, setSettings] = useState({
        // Profile Settings
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        bio: '',

        // Notification Settings
        emailNotifications: true,
        commissionAlerts: true,
        referralAlerts: true,
        marketingEmails: false,

        // Payment Settings
        bankName: '',
        accountNumber: '',
        accountName: '',

        // Security Settings
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    if (!user || user.role !== 'affiliate') {
        router.push('/login');
        return null;
    }

    const handleSaveProfile = () => {
        // TODO: Implement profile update API call
        console.log('Saving profile settings:', settings);
        alert('Profile settings saved successfully!');
    };

    const handleSaveNotifications = () => {
        // TODO: Implement notification settings API call
        console.log('Saving notification settings:', settings);
        alert('Notification settings saved successfully!');
    };

    const handleSavePayment = () => {
        // TODO: Implement payment settings API call
        console.log('Saving payment settings:', settings);
        alert('Payment settings saved successfully!');
    };

    const handleChangePassword = () => {
        if (settings.newPassword !== settings.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        if (settings.newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        // TODO: Implement password change API call
        console.log('Changing password');
        alert('Password changed successfully!');
        setSettings(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // TODO: Implement account deletion API call
            console.log('Deleting account');
            logout();
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/affiliate/profile')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Profile
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                            <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Settings Navigation */}
                    <div className="lg:col-span-1">
                        <Card className="p-6">
                            <nav className="space-y-2">
                                <a href="#profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </a>
                                <a href="#notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
                                    <Bell className="h-5 w-5" />
                                    Notifications
                                </a>
                                <a href="#payment" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Details
                                </a>
                                <a href="#security" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
                                    <Shield className="h-5 w-5" />
                                    Security
                                </a>
                            </nav>
                        </Card>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information */}
                        <Card className="p-6" id="profile">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="h-6 w-6 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <Input
                                        value={settings.firstName}
                                        onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <Input
                                        value={settings.lastName}
                                        onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <Input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <Input
                                        value={settings.phone}
                                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <Textarea
                                        value={settings.bio}
                                        onChange={(e) => setSettings({...settings, bio: e.target.value})}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Profile
                            </Button>
                        </Card>

                        {/* Notification Settings */}
                        <Card className="p-6" id="notifications">
                            <div className="flex items-center gap-3 mb-6">
                                <Bell className="h-6 w-6 text-green-600" />
                                <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                        <p className="text-sm text-gray-600">Receive email updates about your account</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Commission Alerts</h3>
                                        <p className="text-sm text-gray-600">Get notified when you earn commissions</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.commissionAlerts}
                                            onChange={(e) => setSettings({...settings, commissionAlerts: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Referral Alerts</h3>
                                        <p className="text-sm text-gray-600">Notifications for new referrals and activities</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.referralAlerts}
                                            onChange={(e) => setSettings({...settings, referralAlerts: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                                        <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.marketingEmails}
                                            onChange={(e) => setSettings({...settings, marketingEmails: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <Button onClick={handleSaveNotifications} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Notifications
                            </Button>
                        </Card>

                        {/* Payment Settings */}
                        <Card className="p-6" id="payment">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="h-6 w-6 text-purple-600" />
                                <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                    <Input
                                        value={settings.bankName}
                                        onChange={(e) => setSettings({...settings, bankName: e.target.value})}
                                        placeholder="Enter your bank name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                    <Input
                                        value={settings.accountNumber}
                                        onChange={(e) => setSettings({...settings, accountNumber: e.target.value})}
                                        placeholder="Enter your account number"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                                    <Input
                                        value={settings.accountName}
                                        onChange={(e) => setSettings({...settings, accountName: e.target.value})}
                                        placeholder="Enter account holder name"
                                    />
                                </div>
                            </div>

                            <Button onClick={handleSavePayment} className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Save Payment Info
                            </Button>
                        </Card>

                        {/* Security Settings */}
                        <Card className="p-6" id="security">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="h-6 w-6 text-red-600" />
                                <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={settings.currentPassword}
                                            onChange={(e) => setSettings({...settings, currentPassword: e.target.value})}
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <Input
                                        type="password"
                                        value={settings.newPassword}
                                        onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <Input
                                        type="password"
                                        value={settings.confirmPassword}
                                        onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleChangePassword} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Change Password
                                </Button>
                            </div>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="p-6 border-red-200 bg-red-50">
                            <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
                            <p className="text-red-700 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button
                                onClick={handleDeleteAccount}
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Account
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}