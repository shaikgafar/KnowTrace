'use client';

import React, { useState } from 'react';
import { Misconception } from '@/types';
import {
  AlertTriangle,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MisconceptionCardProps {
  misconception: Misconception;
  onRemediate: (id: string) => Promise<void>;
  onPracticeConcept: (conceptId: string) => void;
}

export function MisconceptionCard({
  misconception,
  onRemediate,
  onPracticeConcept,
}: MisconceptionCardProps) {
  const [isOpenRemediation, setIsOpenRemediation] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedQuickCheck, setSelectedQuickCheck] = useState<number | null>(null);
  const [isCheckSubmitted, setIsCheckSubmitted] = useState<boolean>(false);

  const steps = [
    { title: 'The Confusion', key: 'contrast' },
    { title: 'Deep Explanation', key: 'explanation' },
    { title: 'Real-World Case', key: 'example' },
    { title: 'Intuitive Analogy', key: 'analogy' },
    { title: 'Quick Check Drill', key: 'check' },
  ];

  const handleQuickCheckSubmit = async () => {
    if (selectedQuickCheck === null) return;
    setIsCheckSubmitted(true);
    const isCorrect =
      selectedQuickCheck === misconception.remediation.quickCheckQuestion.correctIndex;
    if (isCorrect) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      await onRemediate(misconception.id);
    }
  };

  const renderSeverityDots = (level: number) => {
    return (
      <div className="flex items-center gap-1" title={`Severity ${level}/5`}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx < level ? 'bg-rose-500' : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {misconception.conceptName}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-semibold">Severity:</span>
            {renderSeverityDots(misconception.severity)}
          </div>
        </div>

        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {misconception.title}
        </h3>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
          {misconception.description}
        </p>

        {/* Evidence Box */}
        <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs mb-6 space-y-1.5">
          <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Behavioral Evidence ({misconception.evidenceCount} occurrences):</span>
          </div>
          <ul className="list-disc list-inside text-rose-800 dark:text-rose-300 space-y-1 text-[11px]">
            {misconception.evidenceDetails.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {misconception.status === 'remediated' ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Remediated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-3.5 h-3.5" /> Active Confusion
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPracticeConcept(misconception.conceptId)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Practice
          </button>
          <button
            type="button"
            onClick={() => setIsOpenRemediation(true)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Review Difference
          </button>
        </div>
      </div>

      {/* Interactive 5-Step Remediation Modal */}
      {isOpenRemediation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Adaptive Remediation Flow
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {misconception.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpenRemediation(false);
                  setActiveStep(0);
                  setIsCheckSubmitted(false);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 overflow-x-auto">
              {steps.map((s, idx) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    activeStep === idx
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-900'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {idx + 1}. {s.title}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed space-y-4">
              {activeStep === 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Contrast & Clarification
                  </h4>
                  <p className="text-zinc-700 dark:text-zinc-300 bg-indigo-50/60 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                    {misconception.remediation.contrastSummary}
                  </p>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Detailed Mathematical & Conceptual Explanation
                  </h4>
                  <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    {misconception.remediation.detailedExplanation}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Real-World Practical Case
                  </h4>
                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-100 text-xs sm:text-sm">
                    {misconception.remediation.realWorldExample}
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Memorable Intuitive Analogy
                  </h4>
                  <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-950 dark:text-purple-100 text-xs sm:text-sm">
                    {misconception.remediation.analogy}
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    Quick Check Diagnostic Drill
                  </h4>

                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {misconception.remediation.quickCheckQuestion.question}
                  </div>

                  <div className="space-y-2">
                    {misconception.remediation.quickCheckQuestion.options.map((opt, i) => {
                      const isSelected = selectedQuickCheck === i;
                      const isCorrect =
                        i === misconception.remediation.quickCheckQuestion.correctIndex;

                      return (
                        <div
                          key={i}
                          onClick={() => !isCheckSubmitted && setSelectedQuickCheck(i)}
                          className={`p-3 rounded-xl border text-xs flex items-center gap-3 transition-all ${
                            isCheckSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
                                : isSelected
                                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 font-bold'
                                : 'opacity-50 border-zinc-200 dark:border-zinc-800'
                              : isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-100 font-medium cursor-pointer'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-zinc-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {isCheckSubmitted && (
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs space-y-2">
                      <div className="font-bold flex items-center gap-1.5">
                        {selectedQuickCheck ===
                        misconception.remediation.quickCheckQuestion.correctIndex ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct! Misconception remediated (+12% Mastery update).
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Not quite right. Review the explanation in Step 2.
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {misconception.remediation.quickCheckQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {!isCheckSubmitted && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        disabled={selectedQuickCheck === null}
                        onClick={handleQuickCheckSubmit}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Submit Check
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-xs">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold cursor-pointer"
              >
                Previous Step
              </button>

              <span className="text-zinc-400 font-mono">
                Step {activeStep + 1} of {steps.length}
              </span>

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOpenRemediation(false)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
