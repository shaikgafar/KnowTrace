'use client';

import React, { use } from 'react';
import { AppShell } from '@/components/AppShell';
import { StudyPlan } from '@/components/StudyPlan';
import { PlanDiff } from '@/components/PlanDiff';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StudyPlanBlock, PlanUpdateDiff } from '@/types';
import { RefreshCw } from 'lucide-react';

export default function StudyPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const queryClient = useQueryClient();

  const { data: blocks = [] } = useQuery<StudyPlanBlock[]>({
    queryKey: ['studyPlan', courseId],
    queryFn: () => api.getStudyPlan(courseId),
  });

  const { data: diffs = [] } = useQuery<PlanUpdateDiff[]>({
    queryKey: ['planDiffs', courseId],
    queryFn: () => api.getPlanDiffs(courseId),
  });

  const toggleMutation = useMutation({
    mutationFn: (blockId: string) => api.toggleStudyBlock(courseId, blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlan', courseId] });
    },
  });

  const handleRebalance = async () => {
    await api.updateStudyPlanAfterQuiz(courseId, ['Regularization (L1 & L2)', 'ROC & AUC Curves']);
    queryClient.invalidateQueries({ queryKey: ['planDiffs', courseId] });
  };

  return (
    <AppShell courseId={courseId} title="Personalized Study Plan">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Personalized Spaced Repetition
            </span>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
              Personalized Study Schedule
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Dynamically adapted to your exam deadline, daily available hours, and knowledge gaps.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRebalance}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Adaptive Re-balance</span>
          </button>
        </div>

        {diffs.length > 0 && <PlanDiff diff={diffs[0]} />}

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <StudyPlan
            blocks={blocks}
            courseId={courseId}
            onToggleBlock={(id) => toggleMutation.mutate(id)}
          />
        </div>
      </div>
    </AppShell>
  );
}
