import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Skeleton component provides a placeholder for content while it's loading.
 * It's based on the common implementation pattern for shadcn/ui.
 *
 * @param className Optional classes to apply to the skeleton element.
 * @param props HTML div element properties.
 */
function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)}
            {...props}
        />
    );
}

export { Skeleton };