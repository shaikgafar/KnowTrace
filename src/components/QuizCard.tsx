'use client';

import React, { useState } from 'react';
import { QuizQuestion, QuestionFeedbackResult, Citation } from '@/types';
import { ConfidenceSlider } from './ConfidenceSlider';
import { CitationChip } from './CitationChip';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  onSubmit: (data: { selectedOptionId: string; confidence: number }) => Promise<QuestionFeedbackResult>;
  onNext: () => void;
  onCitationClick?: (citation: Citation) => void;
  isLastQuestion?: boolean;
}

export function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  onSubmit,
  onNext,
  onCitationClick,
  isLastQuestion = false,
}: QuizCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [result, setResult] = useState<QuestionFeedbackResult | null>(null);

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await onSubmit({
        selectedOptionId,
        confidence,
      });
      setResult(res);
      if (res.isCorrect) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyColors = {
    easy: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    hard: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              difficultyColors[question.difficulty]
            }`}
          >
            {question.difficulty}
          </span>
        </div>

        <div className="text-xs font-medium text-zinc-500">
          Target: <strong className="text-zinc-800 dark:text-zinc-200">{question.conceptName}</strong>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-200">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Adaptive Selection Reason: </span>
          <span className="text-indigo-800 dark:text-indigo-300">{question.whySelectedReason}</span>
        </div>
      </div>

      <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
        {question.question}
      </div>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isSubmitted = !!result;
          const isCorrect = isSubmitted && opt.id === result.correctOptionId;
          const isWrongSelection = isSubmitted && isSelected && !result.isCorrect;

          return (
            <div
              key={opt.id}
              onClick={() => !isSubmitted && setSelectedOptionId(opt.id)}
              className={`p-4 rounded-xl border transition-all text-sm flex items-start gap-3.5 ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold'
                    : isWrongSelection
                    ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 font-semibold'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-60'
                  : isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-xs cursor-pointer'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : isWrongSelection
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-zinc-300 dark:border-zinc-700'
                    : isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
              >
                {isSubmitted ? (
                  isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isWrongSelection ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : null
                ) : isSelected ? (
                  <div className="w-2 h-2 rounded-full bg-white" />
                ) : null}
              </div>

              <div className="flex-1 leading-relaxed">
                <span>{opt.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {!result && (
        <div className="space-y-4 pt-2">
          <ConfidenceSlider
            value={confidence}
            onChange={setConfidence}
            disabled={isSubmitting}
          />

          {question.hint && (
            <div>
              {showHint ? (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Pedagogical Hint: </span>
                    <span>{question.hint}</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Need a hint?</span>
                </button>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!selectedOptionId || isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in duration-300">
          <div
            className={`p-4 rounded-xl flex items-center justify-between ${
              result.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2.5 font-bold text-sm">
              {result.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Correct Answer! Well done.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Incorrect Answer.</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-mono text-xs">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                {result.conceptName}:
              </span>
              <span className="text-zinc-500">{result.masteryBefore}%</span>
              <span>→</span>
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  result.masteryDelta >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {result.masteryDelta >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {result.masteryAfter}% ({result.masteryDelta >= 0 ? `+${result.masteryDelta}` : result.masteryDelta}%)
              </span>
            </div>
          </div>

          {result.detectedMisconception && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  Detected Misconception: {result.detectedMisconception.title}
                </span>
                <p className="leading-relaxed">{result.detectedMisconception.description}</p>
                <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 pt-1">
                  Added to your personal Misconceptions tab for remediation.
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs leading-relaxed space-y-2">
            <div className="font-bold text-zinc-900 dark:text-zinc-100">Grounded Explanation:</div>
            <p className="text-zinc-700 dark:text-zinc-300">{result.explanation}</p>

            {result.citation && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-zinc-400 font-semibold text-[11px]">Cited Source:</span>
                <CitationChip citation={result.citation} onClick={onCitationClick} />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{isLastQuestion ? 'View Complete Results' : 'Next Adaptive Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
