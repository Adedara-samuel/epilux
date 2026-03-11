"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin",
          sizeClasses[size]
        )}
        style={{
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
}

// Modern loading state with blur background
export function ModernLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in-scale">
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-bounce-in">
        <LoadingSpinner size="sm" className="mb-4"  />
        <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}

// Skeleton loading component
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
        className
      )}
    />
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md animate-fade-in-scale">
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

// List skeleton
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 animate-fade-in-scale" style={{ animationDelay: `${i * 0.1}s` }}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}