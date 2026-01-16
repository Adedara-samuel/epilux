'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Settings, Users, Calendar, Clock, Percent, Edit, Save, X } from 'lucide-react';
import { adminSettingsAPI } from '@/services/admin';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CommissionSettings {
  commissionRate: number;
  excludedRoles: string[];
  withdrawalWindow: {
    endDay: number;
    startDay: number;
  };
  updatedAt: string;
}

interface CommissionSettingsDisplayProps {
  settings: CommissionSettings;
}

export default function CommissionSettingsDisplay({ settings }: CommissionSettingsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    commissionRate: settings?.commissionRate || 0,
    excludedRoles: settings?.excludedRoles || [],
    withdrawalWindow: settings?.withdrawalWindow || { startDay: 26, endDay: 30 }
  });
  const queryClient = useQueryClient();

  // Update form data when settings change
  React.useEffect(() => {
    if (settings) {
      setFormData({
        commissionRate: settings.commissionRate || 0,
        excludedRoles: settings.excludedRoles || [],
        withdrawalWindow: settings.withdrawalWindow || { startDay: 26, endDay: 30 }
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Transform formData to match API payload (commissionRate -> rate)
      const payload = {
        rate: formData.commissionRate,
        excludedRoles: formData.excludedRoles,
        withdrawalWindow: formData.withdrawalWindow
      };
      await adminSettingsAPI.updateSettings(payload);
      await queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      setIsEditing(false);
      toast.success('Commission settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update commission settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      commissionRate: settings?.commissionRate || 0,
      excludedRoles: settings?.excludedRoles || [],
      withdrawalWindow: settings?.withdrawalWindow || { startDay: 26, endDay: 30 }
    });
    setIsEditing(false);
  };

  // Early return if settings is not available
  if (!settings) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow animate-fadeIn">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Loading commission settings...</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getWithdrawalWindowText = () => {
    const { startDay, endDay } = settings.withdrawalWindow || { startDay: 26, endDay: 30 };
    return `${startDay}${startDay === 1 ? 'st' : startDay === 2 ? 'nd' : startDay === 3 ? 'rd' : 'th'} - ${endDay}${endDay === 1 ? 'st' : endDay === 2 ? 'nd' : endDay === 3 ? 'rd' : 'th'} of each month`;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover-glow animate-fadeIn">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Commission Settings
          </CardTitle>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Commission Rate */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Commission Rate</h3>
              <p className="text-sm text-gray-600">Default commission percentage</p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.commissionRate}
                onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) || 0 }))}
                className="w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-blue-600">{settings.commissionRate || 0}%</div>
          )}
        </div>

        {/* Excluded Roles */}
        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Excluded Roles</h3>
              <p className="text-sm text-gray-600">Roles not eligible for commissions</p>
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="excludedRoles" className="text-sm text-gray-700">
                Enter roles separated by commas
              </Label>
              <Input
                id="excludedRoles"
                value={formData.excludedRoles.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  excludedRoles: e.target.value.split(',').map(role => role.trim()).filter(role => role)
                }))}
                placeholder="admin, marketer"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(settings.excludedRoles || []).map((role) => (
                <Badge key={role} variant="destructive" className="capitalize">
                  {role}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal Window */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Withdrawal Window</h3>
              <p className="text-sm text-gray-600">Monthly withdrawal period</p>
            </div>
          </div>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDay" className="text-sm text-gray-700">Start Day</Label>
                <Input
                  id="startDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.withdrawalWindow.startDay}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    withdrawalWindow: {
                      ...prev.withdrawalWindow,
                      startDay: parseInt(e.target.value) || 1
                    }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="endDay" className="text-sm text-gray-700">End Day</Label>
                <Input
                  id="endDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.withdrawalWindow.endDay}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    withdrawalWindow: {
                      ...prev.withdrawalWindow,
                      endDay: parseInt(e.target.value) || 30
                    }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="text-lg font-semibold text-green-600">{getWithdrawalWindowText()}</div>
          )}
        </div>

        {/* Last Updated */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Last Updated</h3>
              <p className="text-sm text-gray-600">Settings modification timestamp</p>
            </div>
          </div>
          <div className="text-sm font-medium text-purple-600">
            {isEditing ? 'Will be updated when saved' : (settings.updatedAt ? formatDate(settings.updatedAt) : 'Not available')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}