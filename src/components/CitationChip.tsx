'use client';

import React, { useState } from 'react';
import { Citation } from '@/types';
import { BookOpen, Presentation, Video, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CitationChipProps {
  citation: Citation;
  onClick?: (citation: Citation) => void;
  showSnippetPreview?: boolean;
}

export function CitationChip({ citation, onClick, showSnippetPreview = true }: CitationChipProps) {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  const getIcon = () => {
    switch (citation.sourceType) {
      case 'pdf':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'ppt':
      case 'pptx':
        return <Presentation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getSubLabel = () => {
    if (citation.pageNumber) return `Page ${citation.pageNumber}`;
    if (citation.slideNumber) return `Slide ${citation.slideNumber}`;
    if (citation.timestamp) {
      const mins = Math.floor(citation.timestamp / 60);
      const secs = citation.timestamp % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return '';
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(citation);
    } else {
      router.push(`/view/${citation.sourceId}?page=${citation.pageNumber || ''}&slide=${citation.slideNumber || ''}&time=${citation.timestamp || ''}`);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 text-xs font-medium text-indigo-900 dark:text-indigo-200 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
      >
        {getIcon()}
        <span className="font-semibold">{citation.sourceTitle}</span>
        {getSubLabel() && (
          <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
            • {getSubLabel()}
          </span>
        )}
        <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 text-indigo-700 dark:text-indigo-300 transition-opacity" />
      </button>

      {/* Snippet Preview Tooltip */}
      {showSnippetPreview && showTooltip && citation.snippet && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-zinc-900 text-zinc-100 text-xs rounded-xl shadow-xl border border-zinc-700 pointer-events-none transform -translate-x-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-semibold text-indigo-300">
            {getIcon()}
            <span>Exact Cited Excerpt</span>
          </div>
          <p className="line-clamp-4 text-zinc-300 leading-relaxed italic text-[11px]">
            &ldquo;{citation.snippet}&rdquo;
          </p>
          <div className="mt-2 text-[10px] text-zinc-400 font-medium">Click to inspect exact location ↗</div>
        </div>
      )}
    </div>
  );
}
