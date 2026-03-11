/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';

import { useAdminOrders, useUpdateOrderStatus, useCancelOrder } from '@/hooks/useOrders';

type Order = any;

const ITEMS_PER_PAGE = 10;

function OrderActions({
    order,
    onStatusUpdate,
    onCancel,
}: {
    order: Order;
    onStatusUpdate: (id: string, status: string) => void;
    onCancel: (id: string) => void;
}) {
    const [statusOpen, setStatusOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    const handleStatusSubmit = () => {
        if (selectedStatus !== order.status) {
            onStatusUpdate(order._id, selectedStatus);
            toast.success(`Order ${order.orderNumber} status updated`);
        }
        setStatusOpen(false);
    };

    const confirmCancel = () => {
        onCancel(order._id);
        toast.error(`Order ${order.orderNumber} cancelled`);
        setCancelOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusOpen(true)}>
                        Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setCancelOpen(true)}>
                        Cancel Order
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Details */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Order {order.orderNumber}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Customer</p>
                                <p className="font-medium">
                                    {order.buyer?.firstName} {order.buyer?.lastName}
                                </p>
                                <p className="text-muted-foreground">{order.buyer?.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge variant="outline" className="mt-1 capitalize">
                                    {order.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-medium">₦{(order.totalAmount || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Items</p>
                                <p className="font-medium">{order.items?.length || 0}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Placed on</p>
                                <p>
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleString('en-NG', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })
                                        : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Status Update */}
            <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Status</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleStatusSubmit}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Confirmation */}
            <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Order {order.orderNumber}?</DialogTitle>
                        <DialogDescription>This cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelOpen(false)}>
                            No, keep it
                        </Button>
                        <Button variant="destructive" onClick={confirmCancel}>
                            Yes, cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: ordersData, isLoading } = useAdminOrders();
    const { mutate: updateOrderStatus } = useUpdateOrderStatus();
    const { mutate: cancelOrder } = useCancelOrder();

    const allOrders = ordersData?.orders || [];

    // Sort newest first
    const sortedOrders = useMemo(() => {
        return [...allOrders].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [allOrders]);

    // Filter
    const filteredOrders = useMemo(() => {
        return sortedOrders.filter((order) => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            if (!matchesStatus) return false;

            const searchLower = searchTerm.toLowerCase();
            const name = `${order.buyer?.firstName || ''} ${order.buyer?.lastName || ''}`.toLowerCase();
            const email = order.buyer?.email?.toLowerCase() || '';
            const orderNum = order.orderNumber?.toLowerCase() || '';

            return orderNum.includes(searchLower) || name.includes(searchLower) || email.includes(searchLower);
        });
    }, [sortedOrders, statusFilter, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleUpdateOrderStatus = (id: string, status: string) => {
        updateOrderStatus(
            { id, status },
            {
                onSuccess: () => toast.success("Status updated"),
                onError: () => toast.error("Failed to update status"),
            }
        );
    };

    const handleCancelOrder = (id: string) => {
        cancelOrder(id, {
            onError: () => toast.error("Failed to cancel order"),
        });
    };

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            processing: "bg-blue-100   text-blue-800   border-blue-300",
            shipped: "bg-purple-100 text-purple-800 border-purple-300",
            delivered: "bg-green-100  text-green-800  border-green-300",
            cancelled: "bg-red-100    text-red-800    border-red-300",
        } as const;

        const style = statusStyles[status as keyof typeof statusStyles] ?? "";

        return (
            <Badge variant="outline" className={style}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg animate-pulse">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
                <div className="container px-4 sm:px-6 py-4">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Orders Management
                    </h1>
                    <p className="mt-1 text-gray-600">Manage and track customer orders</p>
                </div>
            </div>

            <div className="container px-4 sm:px-6 py-6 md:py-8">
                {/* Filters */}
                <Card className="mb-6 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search order #, customer name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Card className="shadow-sm overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle>
                            Orders {filteredOrders.length > 0 && `(${filteredOrders.length})`}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left px-6 py-3.5 text-sm font-medium text-muted-foreground w-16">S/N</th>
                                        <th className="text-left px-6 py-3.5 text-sm font-medium text-muted-foreground">Order #</th>
                                        <th className="text-left px-6 py-3.5 text-sm font-medium text-muted-foreground">Customer</th>
                                        <th className="text-left px-6 py-3.5 text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="text-left px-6 py-3.5 text-sm font-medium text-muted-foreground">Items</th>
                                        <th className="text-left px-6 py-3.5 text-sm font-medium text-muted-foreground">Total</th>
                                        <th className="text-left px-6 py-3.5 text-sm font-medium text-muted-foreground">Date</th>
                                        <th className="w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {paginatedOrders.map((order, idx) => {
                                        const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                        return (
                                            <tr key={order._id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4 text-muted-foreground font-medium">{rowNumber}</td>
                                                <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">
                                                        {order.buyer?.firstName || ''} {order.buyer?.lastName || ''}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{order.buyer?.email || '—'}</div>
                                                </td>
                                                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                                <td className="px-6 py-4 text-center">{order.items?.length || 0}</td>
                                                <td className="px-6 py-4 font-medium">
                                                    ₦{(order.totalAmount || 0).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <OrderActions
                                                        order={order}
                                                        onStatusUpdate={handleUpdateOrderStatus}
                                                        onCancel={handleCancelOrder}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y">
                            {paginatedOrders.map((order, idx) => {
                                const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                return (
                                    <div key={order._id} className="p-4 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-sm font-medium text-muted-foreground w-8 text-right">
                                                {rowNumber}.
                                            </span>
                                            <div className="flex-1">
                                                <div className="font-medium">{order.orderNumber}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {order.buyer?.email || '—'}
                                                </div>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Customer</p>
                                                <p className="font-medium">
                                                    {order.buyer?.firstName} {order.buyer?.lastName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total</p>
                                                <p className="font-medium">₦{(order.totalAmount || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Items</p>
                                                <p className="font-medium">{order.items?.length || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Date</p>
                                                <p className="font-medium text-sm">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <OrderActions
                                                order={order}
                                                onStatusUpdate={handleUpdateOrderStatus}
                                                onCancel={handleCancelOrder}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {filteredOrders.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {paginatedOrders.length} of {filteredOrders.length} orders
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Prev
                                    </Button>

                                    <span className="text-sm font-medium min-w-[100px] text-center">
                                        Page {currentPage} of {totalPages || 1}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage >= totalPages}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {filteredOrders.length === 0 && (
                            <div className="py-16 text-center text-muted-foreground">
                                <div className="text-6xl mb-4 opacity-60">📦</div>
                                <p className="text-lg font-medium">No orders found</p>
                                <p className="mt-2">Try adjusting your search or filter</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}