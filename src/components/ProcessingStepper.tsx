'use client';

import React from 'react';
import { MaterialProcessingStage, ProcessingStepInfo } from '@/types';
import {
  CheckCircle2,
  Clock,
  FileText,
  ScanText,
  Eye,
  Headphones,
  Split,
  Tags,
  Database,
  Sparkles,
  Layers,
  ImageIcon,
  Film,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface ProcessingStepperProps {
  currentStage: MaterialProcessingStage;
  overallProgress: number;
  steps: ProcessingStepInfo[];
  stats: {
    chunks: number;
    figures: number;
    keyframes: number;
    tokens?: number;
  };
  isComplete: boolean;
  hasError?: boolean;
}

const STAGE_ICONS: Record<string, React.ReactNode> = {
  upload: <FileText className="w-4 h-4" />,
  parse: <FileText className="w-4 h-4" />,
  ocr: <ScanText className="w-4 h-4" />,
  vision: <Eye className="w-4 h-4" />,
  transcription: <Headphones className="w-4 h-4" />,
  chunking: <Split className="w-4 h-4" />,
  tagging: <Tags className="w-4 h-4" />,
  embedding: <Database className="w-4 h-4" />,
  complete: <Sparkles className="w-4 h-4" />,
};

export function ProcessingStepper({
  currentStage,
  overallProgress,
  steps,
  stats,
  isComplete,
  hasError: _hasError,
}: ProcessingStepperProps) {
  return (
    <div className="space-y-6">
      {/* Top Progress & Metrics Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Multimodal Processing Pipeline</span>
              {isComplete && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Ready
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Extracting mathematical formulas, slides, audio transcripts & knowledge concepts
            </p>
          </div>
          <span className="text-xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
            {overallProgress}%
          </span>
        </div>

        <ProgressBar
          progress={overallProgress}
          size="lg"
          variant={isComplete ? 'emerald' : 'gradient'}
          showPercentage={false}
        />

        {/* Real-time Artifact Extraction Counters */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs mb-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Chunks</span>
            </div>
            <div className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {stats.chunks}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs mb-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Figures</span>
            </div>
            <div className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {stats.figures}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs mb-1">
              <Film className="w-3.5 h-3.5 text-rose-500" />
              <span>Keyframes</span>
            </div>
            <div className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {stats.keyframes}
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Pipeline List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
          Pipeline Progression Stages
        </h4>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isDone = step.status === 'completed';
            const isCurrent = step.status === 'in_progress' || (step.id === currentStage && !isDone);

            return (
              <div key={step.id} className="flex items-start gap-4 relative">
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 -bottom-4 w-0.5 ${
                      isDone ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  />
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    STAGE_ICONS[step.id] || <Clock className="w-4 h-4" />
                  ) : (
                    STAGE_ICONS[step.id] || <Clock className="w-4 h-4 opacity-50" />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isDone
                          ? 'text-zinc-900 dark:text-zinc-100'
                          : isCurrent
                          ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        isDone
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : isCurrent
                          ? 'text-indigo-600 font-bold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {isDone ? '✓ Completed' : isCurrent ? '● Processing...' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
