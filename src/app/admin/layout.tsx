'use client';

// Forces the page to be rendered dynamically on every request,
// preventing static prerendering which triggers errors in client-side components
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminHeader } from '@/Components/admin';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Listen for sidebar collapse changes from AdminSidebar
    useEffect(() => {
        const handleSidebarCollapse = (event: CustomEvent) => {
            setSidebarCollapsed(event.detail.collapsed);
        };

        window.addEventListener('sidebarCollapse', handleSidebarCollapse as EventListener);
        return () => window.removeEventListener('sidebarCollapse', handleSidebarCollapse as EventListener);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
            {/* Sidebar */}
            <AdminSidebar />
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <AdminHeader />
                {/* Page content */}
                <main className={cn(
                    "flex-1 mt-12 lg:mt-16 overflow-y-auto transition-all duration-300",
                    // Desktop: adjust padding based on sidebar state
                    "lg:px-6 lg:py-6",
                    sidebarCollapsed ? "lg:pl-20" : "lg:pl-72",
                    // Mobile: account for bottom navigation
                    "pb-20 lg:pb-6"
                )}>
                    <div className="max-w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}