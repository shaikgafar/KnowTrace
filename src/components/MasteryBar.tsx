'use client';

import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { getMasteryColor } from '@/lib/utils';

interface MasteryBarProps {
  name: string;
  mastery: number; // 0 - 100
  uncertainty?: number; // +/- interval e.g. 15
  forgettingRisk?: 'low' | 'medium' | 'high';
  lastPracticedDaysAgo?: number;
  onClick?: () => void;
}

export function MasteryBar({
  name,
  mastery,
  uncertainty = 10,
  forgettingRisk,
  lastPracticedDaysAgo,
  onClick,
}: MasteryBarProps) {
  const color = getMasteryColor(mastery);
  const minEstimate = Math.max(0, mastery - uncertainty);
  const maxEstimate = Math.min(100, mastery + uncertainty);

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
              {name}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color.bg} ${color.border}`}
            >
              {color.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
            {uncertainty !== undefined && (
              <span className="font-mono text-[11px]">
                Estimate: <strong className="text-zinc-700 dark:text-zinc-300">{mastery}%</strong> (±{uncertainty}%)
              </span>
            )}
            {lastPracticedDaysAgo !== undefined && (
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                {lastPracticedDaysAgo === 0 ? 'Today' : `${lastPracticedDaysAgo}d ago`}
              </span>
            )}
          </div>
        </div>

        {forgettingRisk === 'high' && (
          <div className="flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-md border border-rose-200 dark:border-rose-900 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px]">Needs Revision</span>
          </div>
        )}
      </div>

      {/* Bar with uncertainty shadow interval */}
      <div className="relative w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        {/* Uncertainty Range Band (subtle hatched or lighter shade) */}
        <div
          className="absolute top-0 bottom-0 bg-indigo-200/50 dark:bg-indigo-900/40 transition-all duration-500"
          style={{
            left: `${minEstimate}%`,
            width: `${maxEstimate - minEstimate}%`,
          }}
          title={`Bayesian confidence interval: ${minEstimate}% - ${maxEstimate}%`}
        />

        {/* Primary Mastery Bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            mastery >= 75
              ? 'bg-emerald-500'
              : mastery >= 50
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
          style={{ width: `${mastery}%` }}
        />
      </div>
    </div>
  );
}
