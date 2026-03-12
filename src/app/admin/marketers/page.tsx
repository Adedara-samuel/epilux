'use client';

import { useState } from 'react';
import {
    MapPin, Package, Truck, CheckCircle, Clock, Navigation, Phone,
    MessageSquare, Search, Filter, User, RefreshCw, LogOut, LayoutDashboard,
    TrendingUp, Calendar, Star, Bell, ChevronRight, Map as MapIcon
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useMarketerOrders, useMarketerStats, useUpdateOrderStatus } from '@/hooks/useMarketer';
import GoogleMap from '@/Components/GoogleMap';
import { Order } from '@/services/marketer';

export default function MarketerPage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile'>('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // API Hooks
    const { data: statsData, isLoading: statsLoading } = useMarketerStats();

    // Only calls API when activeTab is 'orders'
    const {
        data: ordersData,
        isLoading: ordersLoading,
        refetch: refetchOrders
    } = useMarketerOrders({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    }, activeTab === 'orders');

    const updateStatusMutation = useUpdateOrderStatus();

    const orders: Order[] = ordersData?.orders || [];

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'in_transit': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 px-4 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Package className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 leading-none">Marketer Portal</h1>
                            <p className="text-xs text-slate-500 mt-1">Welcome back, {user.firstName}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="relative text-slate-600">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <CardContent className="p-4">
                                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Total Tasks</p>
                                    <h3 className="text-2xl font-bold mt-1">{statsData?.totalOrders || 0}</h3>
                                    <TrendingUp className="w-4 h-4 mt-2 text-blue-200" />
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm bg-white">
                                <CardContent className="p-4">
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900">{statsData?.pendingOrders || 0}</h3>
                                    <Clock className="w-4 h-4 mt-2 text-amber-500" />
                                </CardContent>
                            </Card>
                        </div>

                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-slate-800 text-lg">Quick Actions</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={() => setActiveTab('orders')}
                                    className="h-24 bg-white hover:bg-slate-50 border-0 shadow-sm text-slate-900 flex flex-col gap-2 group transition-all"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span>View My Orders</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-24 bg-white border-0 shadow-sm text-slate-900 flex flex-col gap-2"
                                    onClick={() => setShowMap(!showMap)}
                                >
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <Navigation className="w-5 h-5" />
                                    </div>
                                    <span>Delivery Map</span>
                                </Button>
                            </div>
                        </section>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-4 sticky top-16 bg-slate-50/95 backdrop-blur-sm pb-4 z-[5]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by order ID or customer..."
                                    className="pl-10 bg-white border-0 shadow-sm focus-visible:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {['all', 'pending', 'in_transit', 'delivered'].map((f) => (
                                    <Button
                                        key={f}
                                        variant={statusFilter === f ? 'default' : 'secondary'}
                                        size="sm"
                                        className="capitalize rounded-full px-4"
                                        onClick={() => setStatusFilter(f)}
                                    >
                                        {f.replace('_', ' ')}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {ordersLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                                    <p>Fetching your orders...</p>
                                </div>
                            ) : orders.length > 0 ? (
                                orders.map((order: Order) => (
                                    <Card key={order._id} className="border-0 shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
                                        <CardContent className="p-0">
                                            <div className="p-4 border-b border-slate-50 flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mb-1">Order #{order.orderNumber}</p>
                                                    <h4 className="font-bold text-slate-900">{order.customer?.firstName && order.customer?.lastName ? `${order.customer.firstName} ${order.customer.lastName}` : order.customerPhone || 'N/A'}</h4>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" /> {order.address}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                                    {order.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="p-3 bg-slate-50/50 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-blue-600 h-8 px-2"
                                                        onClick={() => window.open(`tel:${order.customerPhone}`)}
                                                    >
                                                        <Phone className="w-4 h-4 mr-1" /> Call
                                                    </Button>
                                                </div>
                                                {order.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                        onClick={() => handleStatusUpdate(order._id, 'in_transit')}
                                                    >
                                                        Start Delivery
                                                    </Button>
                                                )}
                                                {order.status === 'in_transit' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                                    >
                                                        Mark Delivered
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-500">No orders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <CardContent className="relative pt-12 pb-6 px-6">
                                <div className="absolute -top-10 left-6 w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                                    <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                                        <User className="w-10 h-10 text-slate-400" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                    <Badge className="mt-2 bg-blue-50 text-blue-600 border-blue-100 capitalize">{user.role}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            variant="destructive"
                            className="w-full h-12 rounded-xl shadow-lg shadow-red-100"
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                )}
            </main>

            {/* Navigation Dock (Mobile optimized) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t px-6 py-3 flex justify-between items-center z-20">
                {[
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
                    { id: 'orders', icon: Package, label: 'Orders' },
                    { id: 'profile', icon: User, label: 'Account' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'animate-bounce-short' : ''}`} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Map Overlay */}
            {showMap && (
                <div className="fixed inset-0 z-[50] bg-white animate-in slide-in-from-right duration-300">
                    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => setShowMap(false)}>
                            <ChevronRight className="rotate-180 w-5 h-5" />
                        </Button>
                    </div>
                    <GoogleMap
                        orders={orders}
                        selectedOrder={selectedOrder}
                    />
                </div>
            )}
        </div>
    );
}