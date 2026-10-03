'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'gradient';
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  label,
  subLabel,
  size = 'md',
  variant = 'indigo',
  showPercentage = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantGradients = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <div className="flex items-center gap-2">
            {label && <span className="font-semibold text-zinc-800 dark:text-zinc-200">{label}</span>}
            {subLabel && <span className="text-zinc-400 text-[11px]">{subLabel}</span>}
          </div>
          {showPercentage && (
            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantGradients[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
