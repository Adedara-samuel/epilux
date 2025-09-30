import { redirect } from 'next/navigation';

export default function AdminPage() {
    // This page just redirects to the dashboard
    // Authentication is handled by middleware
    redirect('/affiliate/dashboard');
}