import { redirect } from 'next/navigation';

export default function AffiliatePage() {
    // This page just redirects to the dashboard
    // Authentication is handled by middleware
    redirect('/affiliate/dashboard');
}