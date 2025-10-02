'use client';

import React, { ReactNode } from 'react';

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <>
        {children}
    </>;
};

export { useSearchStore as useSearch } from '@/stores/search-store';