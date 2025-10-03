'use client';

import { useState } from 'react';
import { AdminSidebar, AdminHeader } from '@/Components/admin';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex"> 
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
                <main className="flex-1 p-6">
                    <div className="">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}