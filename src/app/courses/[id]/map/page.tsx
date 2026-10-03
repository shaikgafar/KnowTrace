'use client';

import React, { useState, use } from 'react';
import { AppShell, useCitationViewer } from '@/components/AppShell';
import { KnowledgeMap } from '@/components/KnowledgeMap';
import { ConceptPanel } from '@/components/ConceptPanel';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { KnowledgeGraphData, Concept } from '@/types';

export default function KnowledgeMapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const { openCitation } = useCitationViewer();

  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  const { data: graphData } = useQuery<KnowledgeGraphData>({
    queryKey: ['knowledgeGraph', courseId],
    queryFn: () => api.getKnowledgeGraph(courseId),
  });

  const { data: concepts = [] } = useQuery<Concept[]>({
    queryKey: ['concepts', courseId],
    queryFn: () => api.getConcepts(courseId),
  });

  const selectedConcept = selectedConceptId
    ? concepts.find((c) => c.id === selectedConceptId) || null
    : null;

  return (
    <AppShell courseId={courseId} title="Interactive Knowledge Graph">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Curriculum Concept Graph
            </span>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
              Knowledge Map & Prerequisite Structure
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Explore conceptual dependencies, confusable topic boundaries, and live Bayesian mastery estimates.
            </p>
          </div>
        </div>

        {graphData ? (
          <div className="relative">
            <KnowledgeMap
              graphData={graphData}
              onSelectConcept={(id) => setSelectedConceptId(id)}
              selectedConceptId={selectedConceptId}
            />

            <ConceptPanel
              concept={selectedConcept}
              courseId={courseId}
              onClose={() => setSelectedConceptId(null)}
              onOpenSource={(srcId) => {
                openCitation({
                  id: 'cit-' + srcId,
                  sourceId: srcId,
                  sourceTitle: selectedConcept?.name || 'Course Note',
                  sourceType: srcId.includes('video') ? 'video' : 'pdf',
                  snippet: selectedConcept?.description || '',
                  pageNumber: 42,
                  timestamp: 1112,
                });
              }}
            />
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-xs text-zinc-400 font-mono">
            Loading Knowledge Map DAG...
          </div>
        )}
      </div>
    </AppShell>
  );
}
