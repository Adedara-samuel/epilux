import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Placeholder shown while content is loading.
 */
function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            aria-hidden
            className={cn('skeleton-shimmer rounded-lg', className)}
            {...props}
        />
    );
}

export { Skeleton };
