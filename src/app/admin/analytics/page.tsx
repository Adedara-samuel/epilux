import { redirect } from 'next/navigation';

// The key numbers live on the dashboard
export default function AnalyticsPage() {
    redirect('/admin/dashboard');
}
