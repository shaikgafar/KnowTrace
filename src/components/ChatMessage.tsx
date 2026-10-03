'use client';

import React from 'react';
import { TutorMessage, Citation } from '@/types';
import { ModeBadge } from './ModeBadge';
import { CitationChip } from './CitationChip';
import { User, Sparkles, HelpCircle } from 'lucide-react';

interface ChatMessageProps {
  message: TutorMessage;
  onCitationClick?: (citation: Citation) => void;
  onAllowGeneralKnowledge?: () => void;
}

export function ChatMessage({
  message,
  onCitationClick,
  onAllowGeneralKnowledge,
}: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            {message.mode && <ModeBadge mode={message.mode} confidence={message.confidence} />}
            <span className="text-[10px] text-zinc-400 font-mono">{message.timestamp}</span>
          </div>
        )}

        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-xs shadow-xs'
          }`}
        >
          <div className="whitespace-pre-line prose dark:prose-invert prose-sm max-w-none">
            {message.text}
          </div>

          {message.mode === 'not-covered' && message.outsideKnowledgeAvailable && onAllowGeneralKnowledge && (
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                Want general LLM reasoning?
              </span>
              <button
                type="button"
                onClick={onAllowGeneralKnowledge}
                className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Show General Answer
              </button>
            </div>
          )}
        </div>

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              📚 Sources:
            </span>
            {message.citations.map((citation) => (
              <CitationChip
                key={citation.id}
                citation={citation}
                onClick={onCitationClick}
              />
            ))}
          </div>
        )}

        {isUser && (
          <span className="text-[10px] text-zinc-400 font-mono mt-1 mr-1">{message.timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
