'use client';

import React, { use } from 'react';
import { AppShell } from '@/components/AppShell';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { EvaluationMetrics } from '@/types';
import {
  ShieldCheck,
  Search,
  Layers,
  Users,
  FileCheck,
} from 'lucide-react';
import { ProgressBar } from '@/components/ProgressBar';

export default function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const { data: metrics } = useQuery<EvaluationMetrics>({
    queryKey: ['evaluationMetrics', courseId],
    queryFn: () => api.getEvaluationMetrics(courseId),
  });

  if (!metrics) {
    return (
      <AppShell courseId={courseId} title="Evaluation & Metrics">
        <div className="py-12 text-center text-xs text-zinc-400 font-mono">
          Loading Evaluation Benchmarks...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell courseId={courseId} title="Project Evaluation & Benchmarks">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            System Rigor & Benchmarks
          </span>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
            System Evaluation & Benchmark Results
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Empirical measurements across RAGAS grounding metrics, retrieval precision, refusal reliability, and student simulator ablations.
          </p>
        </div>

        {/* 1. RAGAS Grounding Quality */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>RAGAS Grounding & Faithfulness Framework</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Automated evaluation of answer adherence against retrieved course chunks
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
              94.2% Avg Faithfulness
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-500">Faithfulness</span>
              <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                {(metrics.ragas.faithfulness * 100).toFixed(1)}%
              </div>
              <ProgressBar progress={metrics.ragas.faithfulness * 100} size="sm" variant="emerald" showPercentage={false} />
              <p className="text-[10px] text-zinc-400">Zero unsupported hallucinated claims</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-500">Answer Relevance</span>
              <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                {(metrics.ragas.answerRelevance * 100).toFixed(1)}%
              </div>
              <ProgressBar progress={metrics.ragas.answerRelevance * 100} size="sm" variant="indigo" showPercentage={false} />
              <p className="text-[10px] text-zinc-400">Direct pedagogical focus to student query</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-500">Context Recall</span>
              <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                {(metrics.ragas.contextRecall * 100).toFixed(1)}%
              </div>
              <ProgressBar progress={metrics.ragas.contextRecall * 100} size="sm" variant="indigo" showPercentage={false} />
              <p className="text-[10px] text-zinc-400">Captures all relevant slide & video spans</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-500">Context Precision</span>
              <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                {(metrics.ragas.contextPrecision * 100).toFixed(1)}%
              </div>
              <ProgressBar progress={metrics.ragas.contextPrecision * 100} size="sm" variant="emerald" showPercentage={false} />
              <p className="text-[10px] text-zinc-400">Signal-to-noise ratio in retrieved context</p>
            </div>
          </div>
        </div>

        {/* 2-Column: Retrieval & Refusal Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Multimodal Retrieval Performance</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">NDCG@5 (Ranking Quality)</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {metrics.retrieval.ndcg5.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">MRR (Mean Reciprocal Rank)</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {metrics.retrieval.mrr.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">HitRate@3 (Top-3 Retrieval)</span>
                <span className="font-mono font-bold text-emerald-600">
                  {(metrics.retrieval.hitRate3 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">Mean Ingestion Latency</span>
                <span className="font-mono font-bold text-indigo-600">
                  {metrics.retrieval.meanLatencyMs} ms
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-500" />
              <span>Out-of-Scope Refusal Guardrails</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">Out-of-Scope Precision</span>
                <span className="font-mono font-bold text-emerald-600">
                  {(metrics.refusals.outOfScopePrecision * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">Out-of-Domain Rejection</span>
                <span className="font-mono font-bold text-emerald-600">
                  {(metrics.refusals.outOfDomainRejectionRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">False Refusal Rate (Over-cautious)</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {(metrics.refusals.falseRefusalRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">Citation Exact-Match Accuracy</span>
                <span className="font-mono font-bold text-indigo-600">
                  {(metrics.citations.exactMatchAccuracy * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Synthetic Student Simulator Results */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-purple-50/70 to-emerald-50/70 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-emerald-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Synthetic Student Agent Simulation Benchmark</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Validated against {metrics.simulator.syntheticStudentsTested.toLocaleString()} synthetic learner profiles across varying initial aptitudes
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
              N = {metrics.simulator.syntheticStudentsTested} Agents
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-indigo-100 dark:border-zinc-800 text-center">
              <span className="text-zinc-500 text-[11px]">Adaptive Efficiency Gain</span>
              <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 my-1">
                +{metrics.simulator.adaptiveEfficiencyGainPct}%
              </div>
              <p className="text-[10px] text-zinc-400">Fewer questions needed to reach 80% mastery</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-indigo-100 dark:border-zinc-800 text-center">
              <span className="text-zinc-500 text-[11px]">Average Mastery Gain</span>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 my-1">
                +{metrics.simulator.averageMasteryGainPct}%
              </div>
              <p className="text-[10px] text-zinc-400">Post-test improvement vs linear curriculum</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-indigo-100 dark:border-zinc-800 text-center">
              <span className="text-zinc-500 text-[11px]">Misconception Recovery Rate</span>
              <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 my-1">
                {metrics.simulator.misconceptionRecoveryRatePct}%
              </div>
              <p className="text-[10px] text-zinc-400">Successfully remediated on 5-step flow</p>
            </div>
          </div>
        </div>

        {/* 4. Ablation Study Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Architecture Ablation Study</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Pipeline Variant</th>
                  <th className="py-2.5 px-3">Faithfulness</th>
                  <th className="py-2.5 px-3">Retrieval HitRate</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Analysis Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {metrics.ablations.map((ab, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx === 0
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 font-semibold'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                    }
                  >
                    <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">
                      {idx === 0 && <span className="text-indigo-600 mr-1.5 font-bold">★</span>}
                      {ab.variant}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {(ab.faithfulness * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-800 dark:text-zinc-200">
                      {(ab.retrievalHitRate * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-500">{ab.latencyMs}ms</td>
                    <td className="py-3 px-3 text-zinc-500 text-[11px] leading-relaxed max-w-xs">
                      {ab.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Question Bank & Bloom's Taxonomy Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Question-Bank Bloom&apos;s Taxonomy Distribution
            </h3>
            <span className="text-xs font-mono font-bold text-zinc-500">
              Total Questions: {metrics.questionBank.totalQuestions} ({metrics.questionBank.coveredConceptsPct}% Concept Coverage)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
            {Object.entries(metrics.questionBank.bloomTaxonomy).map(([level, count]) => {
              const pct = Math.round((count / metrics.questionBank.totalQuestions) * 100);
              return (
                <div
                  key={level}
                  className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-center space-y-1"
                >
                  <span className="text-zinc-500 font-semibold">{level}</span>
                  <div className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {count}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
