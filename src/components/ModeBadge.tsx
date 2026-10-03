'use client';

import React from 'react';
import { TutorMode } from '@/types';
import { ShieldCheck, AlertTriangle, HelpCircle, Globe } from 'lucide-react';

interface ModeBadgeProps {
  mode?: TutorMode;
  confidence?: number;
}

export function ModeBadge({ mode = 'source-backed', confidence }: ModeBadgeProps) {
  const configs: Record<
    TutorMode,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    'source-backed': {
      label: 'Source-Backed',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    partial: {
      label: 'Partial Grounding',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
    },
    'not-covered': {
      label: 'Not in Course',
      icon: <HelpCircle className="w-3.5 h-3.5 text-rose-500" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
    },
    'outside-knowledge': {
      label: 'Outside Knowledge',
      icon: <Globe className="w-3.5 h-3.5 text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
  };

  const current = configs[mode] || configs['source-backed'];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border} shadow-xs transition-all`}
    >
      {current.icon}
      <span>{current.label}</span>
      {confidence !== undefined && (
        <span className="opacity-75 font-mono text-[11px] ml-0.5">({confidence}%)</span>
      )}
    </div>
  );
}
