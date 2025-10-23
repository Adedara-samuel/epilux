/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';

export default function AdminMarketerAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API calls
  const assignments = [
    {
      id: '1',
      marketer: { name: 'John Doe', id: 'm1' },
      orders: [
        { id: 'o1', customer: 'Alice Johnson', location: 'Lagos, Nigeria', status: 'pending', items: '2x Water Bottles' },
        { id: 'o2', customer: 'Bob Smith', location: 'Lagos, Nigeria', status: 'delivered', items: '1x Sachet Pack' }
      ],
      totalOrders: 2,
      completedOrders: 1,
      location: 'Lagos Central',
      assignedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      marketer: { name: 'Jane Smith', id: 'm2' },
      orders: [
        { id: 'o3', customer: 'Charlie Brown', location: 'Abuja, Nigeria', status: 'in_transit', items: '3x Water Bottles' },
        { id: 'o4', customer: 'Diana Prince', location: 'Abuja, Nigeria', status: 'pending', items: '1x Bulk Order' }
      ],
      totalOrders: 2,
      completedOrders: 0,
      location: 'Abuja North',
      assignedAt: '2024-01-15T11:30:00Z'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Delivered</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-100 text-blue-800"><Truck className="w-3 h-3 mr-1" />In Transit</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.marketer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketer Assignments</h1>
          <p className="text-gray-600">Track and manage order assignments to marketers</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{assignment.marketer.name}</CardTitle>
                <Badge variant="outline">{assignment.totalOrders} orders</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {assignment.location}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{assignment.completedOrders}/{assignment.totalOrders} completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(assignment.completedOrders / assignment.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Orders */}
                <div>
                  <Label className="text-sm font-medium">Assigned Orders</Label>
                  <div className="mt-2 space-y-2">
                    {assignment.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-sm">Order #{order.id}</div>
                            <div className="text-xs text-gray-500">{order.customer}</div>
                            <div className="text-xs text-gray-500">{order.items}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <div className="text-xs text-gray-500 mt-1">{order.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Reassign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create new assignments.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}