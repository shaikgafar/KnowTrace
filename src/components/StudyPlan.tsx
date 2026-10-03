'use client';

import React from 'react';
import { StudyPlanBlock } from '@/types';
import { Clock, CheckCircle2, Circle, ArrowRight, BookOpen, HelpCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface StudyPlanProps {
  blocks: StudyPlanBlock[];
  courseId: string;
  onToggleBlock: (blockId: string) => void;
}

export function StudyPlan({ blocks, courseId, onToggleBlock }: StudyPlanProps) {
  const grouped = {
    today: blocks.filter((b) => b.day === 'today'),
    tomorrow: blocks.filter((b) => b.day === 'tomorrow'),
    upcoming: blocks.filter((b) => b.day === 'upcoming'),
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'Study':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Practice':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-500" />;
      case 'Revise':
        return <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case 'Study':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Practice':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Revise':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const renderSection = (title: string, list: StudyPlanBlock[], isToday = false) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h3
            className={`text-xs font-bold uppercase tracking-wider ${
              isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'
            }`}
          >
            {title}
          </h3>
          <span className="text-[11px] text-zinc-400 font-mono">
            {list.reduce((acc, b) => acc + (b.completed ? 0 : b.durationMinutes), 0)} min remaining
          </span>
        </div>

        {list.length === 0 ? (
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 text-center">
            No tasks scheduled for this period.
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.map((block) => (
              <div
                key={block.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  block.completed
                    ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 opacity-60'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
              >
                {/* Left check and info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleBlock(block.id)}
                    className="mt-0.5 text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                  >
                    {block.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 hover:text-indigo-500" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-bold ${
                          block.completed
                            ? 'line-through text-zinc-400'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {block.conceptName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getActivityBadge(
                          block.activity
                        )}`}
                      >
                        {getActivityIcon(block.activity)}
                        <span>{block.activity}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                      <span>{block.timeSlot}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {block.durationMinutes} min
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 pt-1 leading-relaxed">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400">Reason: </span>
                      {block.reason}
                    </p>
                  </div>
                </div>

                {/* Right Action */}
                {!block.completed && (
                  <Link
                    href={
                      block.activity === 'Practice'
                        ? `/courses/${courseId}/quiz/new?concept=${block.conceptId}`
                        : `/courses/${courseId}/tutor?prompt=${encodeURIComponent(`Let's study ${block.conceptName}`)}`
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-indigo-50 dark:bg-zinc-800 dark:hover:bg-indigo-950/50 text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-300 text-xs font-semibold transition-all shrink-0 active:scale-95"
                  >
                    <span>Start</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderSection('Today', grouped.today, true)}
      {renderSection('Tomorrow', grouped.tomorrow)}
      {renderSection('Later This Week', grouped.upcoming)}
    </div>
  );
}
