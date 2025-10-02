/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC } from 'react';
import { Card } from '../ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart as BarChartIcon } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sample data for the bar chart
const salesData = [
  { name: 'Jan', bags: 4000 },
  { name: 'Feb', bags: 3000 },
  { name: 'Mar', bags: 5000 },
  { name: 'Apr', bags: 2700 },
  { name: 'May', bags: 1800 },
  { name: 'Jun', bags: 2300 },
  { name: 'Jul', bags: 3400 },
];

// Transform for Chart.js
const data = {
  labels: salesData.map((item) => item.name),
  datasets: [
    {
      label: 'Bags Sold',
      data: salesData.map((item) => item.bags),
      backgroundColor: '#3B82F6',
      borderRadius: 6,
      barThickness: 30,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `Bags Sold: ${context.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#4B5563', // text-gray-600
        font: {
          size: 12,
        },
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: '#4B5563',
        font: {
          size: 12,
        },
      },
      grid: {
        color: '#E5E7EB', // gray-200
        borderDash: [4, 4],
      },
    },
  },
};

export const SalesTracker: FC = () => {
  return (
    <Card className="p-6 h-full shadow-lg border border-gray-100">
      <h3 className="flex items-center text-xl font-bold text-gray-800 mb-2">
        <BarChartIcon className="h-5 w-5 mr-2 text-blue-600" />
        Monthly Sales Performance
      </h3>
      <p className="text-sm text-gray-500 mb-6">Bags of water sold over the last 7 months.</p>
      <div className="h-80 w-full">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};
