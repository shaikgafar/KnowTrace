'use client';

import React from 'react';
import { Concept } from '@/types';
import { getMasteryColor } from '@/lib/utils';
import {
  X,
  BookOpen,
  HelpCircle,
  ArrowRight,
  BotMessageSquare,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ConceptPanelProps {
  concept: Concept | null;
  courseId: string;
  onClose: () => void;
  onOpenSource?: (sourceId: string) => void;
}

export function ConceptPanel({
  concept,
  courseId,
  onClose,
  onOpenSource,
}: ConceptPanelProps) {
  const router = useRouter();
  if (!concept) return null;

  const color = getMasteryColor(concept.mastery);

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {concept.topic}
          </span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            {concept.name}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-500">Current Mastery</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold border text-xs ${color.bg} ${color.border}`}
            >
              {color.label} ({concept.mastery}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                concept.mastery >= 75
                  ? 'bg-emerald-500'
                  : concept.mastery >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${concept.mastery}%` }}
            />
          </div>

          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span>Model Uncertainty: ±{concept.uncertainty}%</span>
            <span>Last reviewed: {concept.lastPracticedDaysAgo}d ago</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Description</h4>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs">
            {concept.description}
          </p>
        </div>

        {concept.forgettingRisk === 'high' && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Elevated Forgetting Risk</span>
              <p className="text-[11px] leading-relaxed">
                Spaced repetition algorithm estimates a 38% retention decay since your last quiz.
              </p>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Grounded Course Materials</span>
          </h4>

          <div className="space-y-2">
            <div
              onClick={() => onOpenSource ? onOpenSource('mat-pdf-1') : router.push('/view/mat-pdf-1?page=42')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 bg-white dark:bg-zinc-800/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Lecture 04 Notes • Page 42
                </div>
                <div className="text-[10px] text-zinc-400">Geometric intuition of L1 vs L2</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500" />
            </div>

            <div
              onClick={() => onOpenSource ? onOpenSource('mat-video-1') : router.push('/view/mat-video-1?time=1112')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 bg-white dark:bg-zinc-800/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Lecture Video • 18:32
                </div>
                <div className="text-[10px] text-zinc-400">Audio explanation & threshold trade-offs</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col gap-2">
        <Link
          href={`/courses/${courseId}/quiz/new?concept=${concept.id}`}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Practice This Concept</span>
        </Link>

        <Link
          href={`/courses/${courseId}/tutor?prompt=${encodeURIComponent(`Can you explain ${concept.name} step-by-step with examples from my course material?`)}`}
          className="w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-center text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <BotMessageSquare className="w-4 h-4 text-indigo-500" />
          <span>Ask Tutor About This</span>
        </Link>
      </div>
    </div>
  );
}
