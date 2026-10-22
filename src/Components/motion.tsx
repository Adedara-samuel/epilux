'use client';

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion';
import React from 'react';

// Shared easing: fast start, gentle settle
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsetFor = (direction: Direction, distance: number) => {
    switch (direction) {
        case 'up': return { y: distance };
        case 'down': return { y: -distance };
        case 'left': return { x: distance };
        case 'right': return { x: -distance };
        default: return {};
    }
};

type RevealProps = HTMLMotionProps<'div'> & {
    direction?: Direction;
    delay?: number;
    distance?: number;
    duration?: number;
    /** Animate as soon as mounted instead of when scrolled into view */
    immediate?: boolean;
};

/** Fades and slides content in once, when it scrolls into view. */
export function Reveal({
    direction = 'up',
    delay = 0,
    distance = 20,
    duration = 0.6,
    immediate = false,
    children,
    ...props
}: RevealProps) {
    const reduce = useReducedMotion();
    const hidden = reduce ? { opacity: 0 } : { opacity: 0, ...offsetFor(direction, distance) };
    const shown = { opacity: 1, x: 0, y: 0 };

    return (
        <motion.div
            initial={hidden}
            {...(immediate ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: '0px 0px -60px 0px' } })}
            transition={{ duration: reduce ? 0.2 : duration, delay, ease: EASE_OUT }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

const staggerContainer = (stagger: number, delayChildren: number): Variants => ({
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
});

type StaggerProps = HTMLMotionProps<'div'> & {
    stagger?: number;
    delay?: number;
    immediate?: boolean;
};

/** Parent for <StaggerItem>s; children animate in one after another. */
export function Stagger({ stagger = 0.07, delay = 0, immediate = false, children, ...props }: StaggerProps) {
    return (
        <motion.div
            variants={staggerContainer(stagger, delay)}
            initial="hidden"
            {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -40px 0px' } })}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<'div'>) {
    const reduce = useReducedMotion();
    const variants: Variants = {
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0.2 : 0.5, ease: EASE_OUT } },
    };
    return (
        <motion.div variants={variants} {...props}>
            {children}
        </motion.div>
    );
}

/** Subtle lift on hover / press for cards and tiles. */
export function HoverCard({ children, ...props }: HTMLMotionProps<'div'>) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            whileHover={reduce ? undefined : { y: -4 }}
            whileTap={reduce ? undefined : { scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/** Animates a number counting up to `value` when it scrolls into view. */
export function CountUp({ value, format = (n: number) => n.toLocaleString(), duration = 1.2, className }: {
    value: number;
    format?: (n: number) => string;
    duration?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();
    const [display, setDisplay] = React.useState(reduce ? value : 0);
    const ref = React.useRef<HTMLSpanElement>(null);
    const started = React.useRef(false);

    React.useEffect(() => {
        if (reduce) {
            setDisplay(value);
            return;
        }
        const node = ref.current;
        if (!node) return;
        let frame = 0;
        const run = () => {
            const start = performance.now();
            const tick = (now: number) => {
                const progress = Math.min(1, (now - start) / (duration * 1000));
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplay(value * eased);
                if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        };
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                run();
            }
        }, { threshold: 0.4 });
        observer.observe(node);
        if (started.current) run();
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [value, duration, reduce]);

    return <span ref={ref} className={className}>{format(Math.round(display))}</span>;
}
