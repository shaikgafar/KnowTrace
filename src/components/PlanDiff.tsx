'use client';

import React from 'react';
import { PlanUpdateDiff } from '@/types';
import { ArrowUpRight, ArrowDownRight, PlusCircle, CheckCircle, Sparkles, Clock } from 'lucide-react';

interface PlanDiffProps {
  diff: PlanUpdateDiff;
}

export function PlanDiff({ diff }: PlanDiffProps) {
  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'moved_up':
        return <ArrowUpRight className="w-4 h-4 text-rose-500" />;
      case 'moved_down':
        return <ArrowDownRight className="w-4 h-4 text-emerald-500" />;
      case 'added':
        return <PlusCircle className="w-4 h-4 text-indigo-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-zinc-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getChangeBadge = (type: string) => {
    switch (type) {
      case 'moved_up':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'moved_down':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'added':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-zinc-900 dark:to-zinc-900/60 border border-indigo-200/80 dark:border-zinc-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Adaptive Schedule Re-balanced
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {diff.timestamp}
        </span>
      </div>

      <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
        {diff.triggerEvent}
      </div>

      <div className="space-y-2 pt-1">
        {diff.changes.map((ch, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 dark:bg-zinc-950/50 border border-indigo-100 dark:border-zinc-800/80 text-xs"
          >
            <div className="mt-0.5">{getChangeIcon(ch.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {ch.conceptName}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getChangeBadge(
                    ch.type
                  )}`}
                >
                  {ch.type === 'moved_up'
                    ? '↑ Prioritized'
                    : ch.type === 'moved_down'
                    ? '↓ Deprioritized'
                    : '+ Added'}
                </span>
              </div>
              <p className="text-zinc-500 text-[11px] mt-0.5">{ch.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
