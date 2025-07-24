// components/EmptyState.tsx
import { Button } from './ui/button';
import Link from 'next/link';

interface EmptyStateProps {
    title: string;
    description: string;
    actionText: string;
    actionLink: string;
}

export default function EmptyState({
    title,
    description,
    actionText,
    actionLink,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{description}</p>
                <Button asChild>
                    <Link href={actionLink}>{actionText}</Link>
                </Button>
            </div>
        </div>
    );
}