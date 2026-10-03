'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { MisconceptionCard } from '@/components/MisconceptionCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Misconception } from '@/types';
import { ShieldAlert } from 'lucide-react';

export default function MisconceptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: misconceptions = [] } = useQuery<Misconception[]>({
    queryKey: ['misconceptions', courseId],
    queryFn: () => api.getMisconceptions(courseId),
  });

  const remediateMutation = useMutation({
    mutationFn: (id: string) => api.remediateMisconception(courseId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['misconceptions', courseId] });
      queryClient.invalidateQueries({ queryKey: ['concepts', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });

  const activeCount = misconceptions.filter((m) => m.status === 'active').length;
  const remediatedCount = misconceptions.filter((m) => m.status === 'remediated').length;

  return (
    <AppShell courseId={courseId} title="Misconception Remediation Center">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Cognitive Diagnosis & Metacognition
            </span>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
              Detected Learning Misconceptions
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              KnowTrace analyzes specific distractor choices to isolate misconceptions before they solidify.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-mono">
              {activeCount} Active Confusions
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
              {remediatedCount} Remediated
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-indigo-50/50 to-purple-50/50 dark:from-rose-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-rose-200/80 dark:border-zinc-800 flex items-start gap-3.5 text-xs text-zinc-700 dark:text-zinc-300">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              Why Remediation Beats More Repetitive Questions
            </span>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              Simply repeating quizzes when a conceptual misconception exists reinforces errors. Each
              remediation card below provides an intuitive contrast, deep mathematical explanation,
              real-world application, and an analogy before verifying understanding with a quick check.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {misconceptions.map((m) => (
            <MisconceptionCard
              key={m.id}
              misconception={m}
              onRemediate={async (id) => {
                await remediateMutation.mutateAsync(id);
              }}
              onPracticeConcept={(conceptId) => {
                router.push(`/courses/${courseId}/quiz/new?concept=${conceptId}`);
              }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
