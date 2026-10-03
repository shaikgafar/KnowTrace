'use client';

import React, { useState, useRef } from 'react';
import { SourceDocument, MaterialType } from '@/types';
import {
  BookOpen,
  Presentation,
  Video,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  Highlighter,
} from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface SourceViewerProps {
  document: SourceDocument;
  initialPage?: number;
  initialSlide?: number;
  initialTime?: number;
  highlightSnippet?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export function SourceViewer({
  document,
  initialPage = 1,
  initialSlide = 1,
  initialTime = 0,
  highlightSnippet,
  onClose,
  isModal = false,
}: SourceViewerProps) {
  // Navigation states initialized from props
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [currentSlide, setCurrentSlide] = useState<number>(initialSlide);
  const [copied, setCopied] = useState<boolean>(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDocIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'ppt':
      case 'pptx':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-500" />;
    }
  };

  const pageData =
    document.pagesContent?.find((p) => p.pageNumber === currentPage) ||
    document.pagesContent?.[0] || {
      pageNumber: currentPage,
      heading: `Page ${currentPage} Content`,
      text: 'Document content is rendered here with highlighted coordinate anchors.',
      highlightSnippet: highlightSnippet,
    };

  const totalPages = document.totalPages || 48;

  const slideData =
    document.slidesContent?.find((s) => s.slideNumber === currentSlide) ||
    document.slidesContent?.[0] || {
      slideNumber: currentSlide,
      title: `Slide ${currentSlide}: Overview`,
      bullets: ['Slide content and diagrams grounded here.'],
      notes: 'Speaker notes and pedagogical emphasis.',
    };

  const totalSlides = document.totalSlides || 32;

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-zinc-900 ${isModal ? 'p-6' : ''}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
            {getDocIcon(document.type)}
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{document.title}</h2>
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span className="uppercase font-semibold">{document.type}</span>
              <span>•</span>
              <span>{document.fileSize}</span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        )}
      </div>

      {/* Main View based on type */}
      <div className="flex-1 min-h-[480px]">
        {document.type === 'pdf' && (
          <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            {/* PDF Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  PDF Document Viewer
                </span>
                <span className="text-zinc-400 font-mono">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono px-2 font-bold">{currentPage}</span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Realistic Page Canvas / Paper */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-zinc-200/60 dark:bg-zinc-950">
              <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-xl rounded-lg p-8 sm:p-12 relative border border-zinc-200 dark:border-zinc-800 min-h-[550px] flex flex-col justify-between">
                <div>
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6 flex justify-between items-center text-xs text-zinc-400">
                    <span className="font-mono uppercase tracking-wider">{document.title}</span>
                    <span className="font-bold">PAGE {currentPage}</span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 font-serif">
                    {pageData.heading}
                  </h3>

                  <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed font-serif space-y-4">
                    <p className="whitespace-pre-line">{pageData.text}</p>

                    {(highlightSnippet || pageData.highlightSnippet) && (
                      <div className="my-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 shadow-xs relative font-sans">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                          <Highlighter className="w-4 h-4 text-amber-600" />
                          <span>Exact Grounded Citation Anchor</span>
                        </div>
                        <blockquote className="text-sm font-medium text-amber-900 dark:text-amber-100 italic leading-relaxed">
                          &ldquo;{highlightSnippet || pageData.highlightSnippet}&rdquo;
                        </blockquote>
                        <div className="mt-2 flex justify-between items-center text-[11px] text-amber-700 dark:text-amber-400 font-sans">
                          <span>Coordinates: x: 12%, y: 38% (OCR Bounding Box)</span>
                          <button
                            type="button"
                            onClick={() => copyText(highlightSnippet || pageData.highlightSnippet || '')}
                            className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Copied' : 'Copy Excerpt'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[11px] text-zinc-400 font-mono">
                  <span>KnowTrace Grounded Parser • ID: {document.id}</span>
                  <span>- {currentPage} -</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(document.type === 'ppt' || document.type === 'pptx') && (
          <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Slide Deck Viewer</span>
                <span className="text-zinc-400 font-mono">
                  Slide {currentSlide} of {totalSlides}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentSlide <= 1}
                  onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono px-2 font-bold">{currentSlide}</span>
                <button
                  type="button"
                  disabled={currentSlide >= totalSlides}
                  onClick={() => setCurrentSlide((s) => Math.min(totalSlides, s + 1))}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-3xl aspect-video bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-mono mb-2">
                    <span>{document.title}</span>
                    <span>SLIDE #{slideData.slideNumber}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
                    {slideData.title}
                  </h2>

                  <ul className="space-y-3 text-sm sm:text-base text-zinc-300">
                    {slideData.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono">KnowTrace Visual Grounding System</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-semibold">
                    High-Relevance Slide
                  </span>
                </div>
              </div>

              {slideData.notes && (
                <div className="w-full max-w-3xl mt-4 p-4 rounded-xl bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="font-bold text-amber-800 dark:text-amber-400">Instructor Emphasis:</span>{' '}
                  {slideData.notes}
                </div>
              )}
            </div>
          </div>
        )}

        {document.type === 'video' && (
          <VideoPlayerSection document={document} initialTime={initialTime} />
        )}
      </div>
    </div>
  );
}

// Subcomponent for video player to prevent accessing refs inside render functions
function VideoPlayerSection({
  document,
  initialTime = 0,
}: {
  document: SourceDocument;
  initialTime?: number;
}) {
  const [currentTime, setCurrentTime] = useState<number>(initialTime);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const transcript = document.transcript || [];
  const activeSegment = transcript.find(
    (t) => currentTime >= t.start && currentTime <= t.end
  );

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    const el = videoRef.current;
    if (el) {
      el.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 bg-zinc-100 dark:bg-zinc-950 rounded-xl p-4 overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="flex-1 flex flex-col">
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
          {document.videoUrl ? (
            <video
              ref={videoRef}
              src={document.videoUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-zinc-400 flex flex-col items-center gap-2">
              <Video className="w-12 h-12 text-zinc-600" />
              <span className="text-xs">Video Feed Simulation</span>
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="font-mono font-bold">
                {formatTime(currentTime)} / {formatTime(document.videoDuration || 1455)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 opacity-75" />
              <span className="text-[11px] bg-rose-600 px-2 py-0.5 rounded-full font-bold">
                REC
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              Active Grounded Timestamp
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {formatTime(currentTime)}
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
            {activeSegment
              ? `"${activeSegment.text}"`
              : 'Click any segment in the transcript to jump directly to that cited lecture timestamp.'}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-xs text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
          <span>Interactive Transcript</span>
          <span className="text-[10px] text-zinc-400">Synced to Audio</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {transcript.map((seg) => {
            const isCurrent = currentTime >= seg.start && currentTime <= seg.end;
            return (
              <div
                key={seg.id}
                onClick={() => handleSeek(seg.start)}
                className={`p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 border-l-4 border-indigo-600 font-medium shadow-2xs'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                  <span>{formatTime(seg.start)}</span>
                  {isCurrent && (
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      PLAYING NOW
                    </span>
                  )}
                </div>
                <p className="leading-relaxed">{seg.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
