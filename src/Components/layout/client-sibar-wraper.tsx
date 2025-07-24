'use client';

import { useState, useEffect } from 'react';
import Sidebar from './sidebar';

export default function ClientSidebarWrapper() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setMobileSidebarOpen(prev => !prev);
        window.addEventListener('toggleMobileSidebar', handleToggle);
        return () => window.removeEventListener('toggleMobileSidebar', handleToggle);
    }, []);

    return (
        <>
            {/* Mobile sidebar */}
            <Sidebar
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            {/* Desktop sidebar - always visible */}
            <div className="hidden lg:block">
                <Sidebar
                    isOpen={true}
                    onClose={() => { }}
                />
            </div>
        </>
    );
}