'use client';

import React, { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SourceDocument } from '@/types';
import { SourceViewer } from '@/components/SourceViewer';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function StandaloneSourceViewerPage({
  params,
}: {
  params: Promise<{ sourceId: string }>;
}) {
  const resolvedParams = use(params);
  const sourceId = resolvedParams.sourceId;
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const slide = searchParams.get('slide') ? parseInt(searchParams.get('slide')!, 10) : 1;
  const time = searchParams.get('time') ? parseInt(searchParams.get('time')!, 10) : 0;

  const { data: document, isLoading } = useQuery<SourceDocument | null>({
    queryKey: ['sourceDoc', sourceId],
    queryFn: () => api.getSourceDocument(sourceId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs font-mono">
        Loading Grounded Source Document...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-300 p-6 space-y-4">
        <h2 className="text-lg font-bold">Source Document Not Found</h2>
        <p className="text-xs text-zinc-400">ID: {sourceId}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-semibold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
      <header className="h-16 px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Session</span>
        </button>

        <Logo href="/" size="sm" />
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        <SourceViewer
          document={document}
          initialPage={page}
          initialSlide={slide}
          initialTime={time}
        />
      </main>
    </div>
  );
}
