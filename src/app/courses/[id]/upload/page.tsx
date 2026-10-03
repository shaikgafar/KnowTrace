'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { UploadDropzone } from '@/components/UploadDropzone';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CourseMaterial, MaterialType } from '@/types';
import { ArrowRight, Play } from 'lucide-react';
import { INITIAL_MATERIALS } from '@/lib/mockData';

export default function CourseUploadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: materials = [] } = useQuery<CourseMaterial[]>({
    queryKey: ['materials', courseId],
    queryFn: () => api.getMaterials(courseId),
  });

  const uploadMutation = useMutation({
    mutationFn: (mat: { name: string; type: MaterialType; size: string }) =>
      api.uploadMaterial(courseId, mat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', courseId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (matId: string) => api.removeMaterial(courseId, matId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', courseId] });
    },
  });

  const handlePreloadDemo = async () => {
    for (const m of INITIAL_MATERIALS) {
      await api.uploadMaterial(courseId, {
        name: m.name,
        type: m.type,
        size: m.size,
      });
    }
    queryClient.invalidateQueries({ queryKey: ['materials', courseId] });
  };

  const handleStartProcessing = () => {
    router.push(`/courses/${courseId}/status`);
  };

  return (
    <AppShell courseId={courseId} title="Upload Course Materials">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Upload Course Materials
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Add textbooks, slides, or lecture videos. Our engine will extract formulas, diagrams, and transcripts.
            </p>
          </div>

          <button
            type="button"
            disabled={materials.length === 0}
            onClick={handleStartProcessing}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Start Processing ({materials.length} Files)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <UploadDropzone
          materials={materials}
          onAddMaterial={(mat) => uploadMutation.mutate(mat)}
          onRemoveMaterial={(id) => removeMutation.mutate(id)}
          onPreloadDemoFiles={handlePreloadDemo}
        />

        {materials.length > 0 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Ready to parse <strong className="text-zinc-900 dark:text-zinc-100">{materials.length} files</strong> into knowledge chunks and multimodal embeddings.
            </div>

            <button
              type="button"
              onClick={handleStartProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Multimodal Processing</span>
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
