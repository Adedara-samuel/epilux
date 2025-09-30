/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipContentProps } from 'recharts';
import { BarChart as BarChartIcon } from 'lucide-react';

const salesData = [
  { name: 'Jan', bags: 4000 },
  { name: 'Feb', bags: 3000 },
  { name: 'Mar', bags: 5000 },
  { name: 'Apr', bags: 2700 },
  { name: 'May', bags: 1800 },
  { name: 'Jun', bags: 2300 },
  { name: 'Jul', bags: 3400 },
];

const CustomTooltip = (props: TooltipContentProps<any, any>) => {
    if (props.active && props.payload && props.payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-sm">
                <p className="font-semibold text-gray-800">{props.payload[0].payload.name}</p>
                <p className="text-blue-600 mt-1">Bags Sold: <span className="font-bold">{props.payload[0].value?.toLocaleString()}</span></p>
            </div>
        );
    }
    return null;
};

export const SalesTracker = () => {
  return (
    <Card className="p-6 h-full">
      <h3 className="flex items-center text-xl font-bold text-gray-800 mb-2">
          <BarChartIcon className="h-5 w-5 mr-2 text-blue-600" />
          Monthly Sales Performance
      </h3>
      <p className="text-sm text-gray-500 mb-6">Bags of water sold over the last 7 months.</p>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} className="text-xs" />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="bags" fill="#3B82F6" name="Bags Sold" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
