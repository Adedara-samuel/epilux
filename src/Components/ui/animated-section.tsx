"use client";

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in';
  delay?: number;
  threshold?: number;
  style?: React.CSSProperties;
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1,
  style
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation(threshold);

  const animationClasses = {
    'fade-in': 'animate-fade-in-scale',
    'slide-up': 'animate-slide-in-bottom',
    'slide-left': 'animate-slide-in-left',
    'slide-right': 'animate-slide-in-right',
    'scale-in': 'animate-bounce-in'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? animationClasses[animation] : 'opacity-0 translate-y-8',
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
        opacity: isVisible ? 1 : 0,
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Animated list component with staggered animations
interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function AnimatedList({ children, className, staggerDelay = 100 }: AnimatedListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children.map((child, index) => (
        <AnimatedSection
          key={index}
          animation="slide-up"
          delay={index * staggerDelay}
          className="animate-fade-in-scale"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </AnimatedSection>
      ))}
    </div>
  );
}