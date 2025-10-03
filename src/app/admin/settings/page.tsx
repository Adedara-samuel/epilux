'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Save, Mail, Shield, Store } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'Epilux Water',
    storeEmail: 'admin@epilux.com',
    storePhone: '+234 123 456 7890',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: ''
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', settings);
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your store settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
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
          <Button variant="outline" className="mt-4">
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
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Change Admin Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}