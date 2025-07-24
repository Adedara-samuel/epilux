
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/card';

const data = [
  { name: 'Jan', sales: 40 },
  { name: 'Feb', sales: 30 },
  { name: 'Mar', sales: 50 },
  { name: 'Apr', sales: 27 },
  { name: 'May', sales: 18 },
  { name: 'Jun', sales: 23 },
  { name: 'Jul', sales: 34 },
];

export default function SalesTracker() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Your Sales Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#0066CC" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}