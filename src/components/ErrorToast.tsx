'use client';

import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export function ErrorToast({ message, onRetry, onClose }: ErrorToastProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm shadow-md animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
        <span className="font-medium">{message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 dark:hover:bg-rose-900 text-xs font-semibold text-rose-900 dark:text-rose-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
