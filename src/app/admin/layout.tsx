'use client';

// Forces the page to be rendered dynamically on every request,
// preventing static prerendering which triggers errors in client-side components
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminHeader } from '@/Components/admin';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
            {/* Sidebar */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <AdminHeader setSidebarOpen={setSidebarOpen} />
                {/* Page content */}
                <main className="flex-1 p-6 lg:pl-72 mt-16 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}