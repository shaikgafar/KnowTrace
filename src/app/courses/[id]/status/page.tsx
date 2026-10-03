'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { ProcessingStepper } from '@/components/ProcessingStepper';
import { MaterialProcessingStage, ProcessingStepInfo } from '@/types';
import { ArrowRight, CheckCircle } from 'lucide-react';

const STAGES: Array<{ id: MaterialProcessingStage; label: string; desc: string }> = [
  { id: 'upload', label: 'File Upload & Verification', desc: 'Checksums & integrity verified' },
  { id: 'parse', label: 'Document Layout Parsing', desc: 'PDF page trees & text stream decoded' },
  { id: 'ocr', label: 'Math OCR & Equation Extraction', desc: 'LaTeX mathematical formulas recognized' },
  { id: 'vision', label: 'Vision Model Diagram Extraction', desc: 'Slide diagrams & loss curves parsed' },
  { id: 'transcription', label: 'Audio Transcription & Alignment', desc: 'Whisper speech-to-text with word timestamps' },
  { id: 'chunking', label: 'Semantic Hierarchical Chunking', desc: 'Context-preserving passage segmentation' },
  { id: 'tagging', label: 'Concept Extraction & DAG Linking', desc: 'Prerequisite dependencies & topics identified' },
  { id: 'embedding', label: 'Multimodal Vector Indexing', desc: 'Cross-modal embeddings stored in vector index' },
  { id: 'complete', label: 'Knowledge Tracing Ready', desc: 'Full adaptive model initialized' },
];

export default function CourseStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  const [progress, setProgress] = useState<number>(35);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(2);
  const [liveChunks, setLiveChunks] = useState<number>(78);
  const [liveFigures, setLiveFigures] = useState<number>(6);
  const [liveKeyframes, setLiveKeyframes] = useState<number>(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = Math.min(100, prev + 12);
        const stageIndex = Math.min(
          STAGES.length - 1,
          Math.floor((next / 100) * (STAGES.length - 1))
        );
        setCurrentStageIdx(stageIndex);
        setLiveChunks(Math.round((next / 100) * 456));
        setLiveFigures(Math.round((next / 100) * 36));
        setLiveKeyframes(Math.round((next / 100) * 9));
        return next;
      });
    }, 900);

    return () => clearInterval(timer);
  }, []);

  const isComplete = progress >= 100;
  const currentStage = STAGES[currentStageIdx].id;

  const steps: ProcessingStepInfo[] = STAGES.map((s, idx) => ({
    id: s.id,
    label: s.label,
    description: s.desc,
    status:
      idx < currentStageIdx
        ? 'completed'
        : idx === currentStageIdx && !isComplete
        ? 'in_progress'
        : isComplete
        ? 'completed'
        : 'pending',
  }));

  const handleOpenCourse = () => {
    router.push(`/courses/${courseId}/dashboard`);
  };

  return (
    <AppShell courseId={courseId} title="Processing Course Material">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Multimodal Ingestion Pipeline
            </span>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
              Course Material Processing
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Extracting mathematical definitions, visual diagrams, and lecture speech timestamps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isComplete && (
              <button
                type="button"
                onClick={() => {
                  setProgress(100);
                  setCurrentStageIdx(STAGES.length - 1);
                  setLiveChunks(456);
                  setLiveFigures(36);
                  setLiveKeyframes(9);
                }}
                className="text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-colors"
              >
                Fast-forward →
              </button>
            )}

            {isComplete && (
              <button
                type="button"
                onClick={handleOpenCourse}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Open Course Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <ProcessingStepper
          currentStage={currentStage}
          overallProgress={progress}
          steps={steps}
          stats={{
            chunks: liveChunks,
            figures: liveFigures,
            keyframes: liveKeyframes,
            tokens: liveChunks * 400,
          }}
          isComplete={isComplete}
        />

        {isComplete && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Processing Complete & Knowledge Graph Built!
                </h4>
                <p className="text-xs text-zinc-500">
                  8 core concepts extracted, 36 diagrams anchored, and tutor citations indexed.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCourse}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Go to Course Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
