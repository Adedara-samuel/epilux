"use client";

import { useEffect, useState } from 'react';

export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, threshold]);

  return { ref: setElement, isVisible };
}

// Hook for staggered animations
export function useStaggeredAnimation(count: number, delay = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const addVisibleItem = (index: number) => {
    setVisibleItems(prev => new Set([...prev, index]));
  };

  const isVisible = (index: number) => visibleItems.has(index);

  return { addVisibleItem, isVisible, delay };
}