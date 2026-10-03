'use client';

import React from 'react';

export function LoadingSkeleton({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
        <div className="h-4 w-4/5 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
      </div>
      <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
    </div>
  );
}
