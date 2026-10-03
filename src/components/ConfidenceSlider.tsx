'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const CONFIDENCE_LEVELS = [
  { level: 1, label: 'Pure Guess', desc: 'No idea', color: 'text-rose-500' },
  { level: 2, label: 'Uncertain', desc: 'Slightly leaning', color: 'text-amber-500' },
  { level: 3, label: 'Moderate', desc: '50/50 intuition', color: 'text-yellow-600' },
  { level: 4, label: 'Confident', desc: 'Pretty certain', color: 'text-teal-600' },
  { level: 5, label: 'Certain', desc: '100% positive', color: 'text-emerald-600' },
];

export function ConfidenceSlider({ value, onChange, disabled = false }: ConfidenceSliderProps) {
  const current = CONFIDENCE_LEVELS.find((l) => l.level === value) || CONFIDENCE_LEVELS[2];

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <span>Metacognitive Confidence</span>
          <span title="Rating your confidence helps the adaptive model diagnose guessing vs misconceptions">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold ${current.color}`}>
            {value} / 5
          </span>
          <span className="text-xs text-zinc-500 font-medium">({current.label})</span>
        </div>
      </div>

      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Level markers */}
        <div className="flex justify-between text-[11px] text-zinc-400 mt-2 font-mono">
          {CONFIDENCE_LEVELS.map((lvl) => (
            <button
              key={lvl.level}
              type="button"
              disabled={disabled}
              onClick={() => onChange(lvl.level)}
              className={`flex flex-col items-center transition-colors cursor-pointer ${
                value === lvl.level ? 'text-indigo-600 font-bold dark:text-indigo-400' : 'hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              <span>{lvl.level}</span>
              <span className="text-[10px] hidden sm:inline">{lvl.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
