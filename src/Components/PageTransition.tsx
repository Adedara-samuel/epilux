'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
    const pathname = usePathname();
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Trigger progress animation on route change
        setShow(true);
        const t = setTimeout(() => setShow(false), 650);
        return () => clearTimeout(t);
    }, [pathname]);

    return (
        <div aria-hidden className={`page-progress ${show ? 'show' : ''}`}>
            <div className="bar" />
        </div>
    );
}
