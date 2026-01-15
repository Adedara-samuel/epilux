'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePackageTracking, useDeliveryRates, useDeliveryEstimate } from '@/hooks/useDelivery';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Package, Truck, MapPin, Clock, DollarSign, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryTrackingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [trackingNumber, setTrackingNumber] = useState('');
    const [estimateData, setEstimateData] = useState({
        weight: '',
        dimensions: { length: '', width: '', height: '' },
        destination: '',
        carrier: 'dhl'
    });

    const { data: trackingData, refetch: refetchTracking } = usePackageTracking(trackingNumber);
    const { data: ratesData } = useDeliveryRates();
    const estimateMutation = useDeliveryEstimate();

    const handleTrackPackage = () => {
        if (!trackingNumber.trim()) {
            toast.error('Please enter a tracking number');
            return;
        }
        refetchTracking();
    };

    const handleEstimateCost = () => {
        if (!estimateData.weight || !estimateData.destination) {
            toast.error('Please fill in weight and destination');
            return;
        }

        estimateMutation.mutate({
            weight: parseFloat(estimateData.weight),
            dimensions: {
                length: parseFloat(estimateData.dimensions.length) || 0,
                width: parseFloat(estimateData.dimensions.width) || 0,
                height: parseFloat(estimateData.dimensions.height) || 0,
            },
            destination: estimateData.destination,
            carrier: estimateData.carrier
        });
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="app-content min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Account
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">Delivery Tracking</h1>
                        <p className="text-gray-600 mt-2">Track your packages and estimate shipping costs</p>
                    </div>
                    <div></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Package Tracking */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Track Package</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="tracking" className="text-sm font-medium text-gray-700">
                                    Tracking Number
                                </Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="tracking"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Enter tracking number"
                                        className="flex-1"
                                    />
                                    <Button onClick={handleTrackPackage} className="flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Track
                                    </Button>
                                </div>
                            </div>

                            {trackingData?.data && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-semibold">Package Status</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                trackingData.data.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                trackingData.data.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {trackingData.data.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Carrier:</span>
                                            <span className="text-sm font-medium">{trackingData.data.carrier.toUpperCase()}</span>
                                        </div>

                                        {trackingData.data.estimatedDelivery && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Estimated Delivery:</span>
                                                <span className="text-sm font-medium">
                                                    {new Date(trackingData.data.estimatedDelivery).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}

                                        {trackingData.data.statusHistory && trackingData.data.statusHistory.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Tracking History</h4>
                                                <div className="space-y-2">
                                                    {trackingData.data.statusHistory.slice(-3).reverse().map((event: any, index: number) => (
                                                        <div key={index} className="flex items-start gap-3 p-2 bg-white rounded border">
                                                            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium">{event.description}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(event.timestamp).toLocaleString()}
                                                                </p>
                                                                {event.location && (
                                                                    <p className="text-xs text-gray-500">{event.location}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cost Estimation */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Estimate Shipping Cost</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                                        Weight (kg)
                                    </Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={estimateData.weight}
                                        onChange={(e) => setEstimateData(prev => ({ ...prev, weight: e.target.value }))}
                                        placeholder="2.5"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="carrier" className="text-sm font-medium text-gray-700">
                                        Carrier
                                    </Label>
                                    <select
                                        id="carrier"
                                        value={estimateData.carrier}
                                        onChange={(e) => setEstimateData(prev => ({ ...prev, carrier: e.target.value }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="dhl">DHL</option>
                                        <option value="fedex">FedEx</option>
                                        <option value="ups">UPS</option>
                                        <option value="local_courier">Local Courier</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                                    Destination
                                </Label>
                                <Input
                                    id="destination"
                                    value={estimateData.destination}
                                    onChange={(e) => setEstimateData(prev => ({ ...prev, destination: e.target.value }))}
                                    placeholder="City, State/Country"
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <Label htmlFor="length" className="text-sm font-medium text-gray-700">
                                        Length (cm)
                                    </Label>
                                    <Input
                                        id="length"
                                        type="number"
                                        value={estimateData.dimensions.length}
                                        onChange={(e) => setEstimateData(prev => ({
                                            ...prev,
                                            dimensions: { ...prev.dimensions, length: e.target.value }
                                        }))}
                                        placeholder="30"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                                        Width (cm)
                                    </Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        value={estimateData.dimensions.width}
                                        onChange={(e) => setEstimateData(prev => ({
                                            ...prev,
                                            dimensions: { ...prev.dimensions, width: e.target.value }
                                        }))}
                                        placeholder="20"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                                        Height (cm)
                                    </Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={estimateData.dimensions.height}
                                        onChange={(e) => setEstimateData(prev => ({
                                            ...prev,
                                            dimensions: { ...prev.dimensions, height: e.target.value }
                                        }))}
                                        placeholder="15"
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleEstimateCost}
                                disabled={estimateMutation.isPending}
                                className="w-full"
                            >
                                {estimateMutation.isPending ? 'Calculating...' : 'Estimate Cost'}
                            </Button>

                            {estimateMutation.data?.data && (
                                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">Estimated Cost</span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Cost:</strong> ${estimateMutation.data.data.cost}</p>
                                        <p><strong>Carrier:</strong> {estimateMutation.data.data.carrier.toUpperCase()}</p>
                                        <p><strong>Delivery Time:</strong> {estimateMutation.data.data.estimatedDays} days</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Available Rates */}
                {ratesData?.data && (
                    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Shipping Rates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ratesData.data.map((rate: any, index: number) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{rate.carrier.toUpperCase()}</h3>
                                        <span className="text-sm text-gray-600">{rate.service}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-blue-600">${rate.cost}</p>
                                        <p className="text-sm text-gray-600">{rate.estimatedDays} days</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}