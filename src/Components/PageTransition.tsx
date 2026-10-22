'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

/** Thin progress bar along the top of the window on route changes. */
export default function PageTransition() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [show, setShow] = useState(false);
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        setShow(true);
        const t = setTimeout(() => setShow(false), 600);
        return () => clearTimeout(t);
    }, [pathname, searchParams]);

    return (
        <div aria-hidden className={`page-progress ${show ? 'show' : ''}`}>
            <div className="bar" />
        </div>
    );
}

/**
 * Soft entrance for page content inside a layout shell. Uses opacity only on
 * the outer element so `position: fixed` dialogs inside pages are unaffected.
 */
export function AnimatedPage({ children, className }: { children: React.ReactNode; className?: string }) {
    const pathname = usePathname();
    const reduce = useReducedMotion();
    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.1 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
