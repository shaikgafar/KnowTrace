'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, Target } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { api } from '@/lib/api';

export default function CreateCoursePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('Computer Science & AI');
  const [examDate, setExamDate] = useState('2026-11-20');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [targetMastery, setTargetMastery] = useState(85);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const course = await api.createCourse({
        name,
        domain,
        examDate,
        hoursAvailablePerDay: Number(hoursPerDay),
        targetMastery: Number(targetMastery),
      });
      router.push(`/courses/${course.id}/upload`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Logo href="/" size="sm" />
      </div>

      <div className="max-w-xl w-full mx-auto my-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 shadow-xl">
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Step 1 of 3 • Course Setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Create a New Learning Course
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Specify your course details and target timeline so our adaptive engine can formulate
            personalized study schedules and knowledge graph constraints.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
              Course Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CS 229: Machine Learning & Optimization"
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
              Domain / Subject
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Computer Science, Medicine, Organic Chemistry"
              className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Target Exam / Deadline Date</span>
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Hours Available Per Day</span>
              </label>
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                required
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-zinc-400" />
                <span>Target Mastery Threshold</span>
              </label>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                {targetMastery}%
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              step="5"
              value={targetMastery}
              onChange={(e) => setTargetMastery(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>60% (Competency)</span>
              <span>80% (Proficiency)</span>
              <span>95% (Excellence)</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Course...' : 'Create Course & Proceed to Upload'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      <div className="text-center text-xs text-zinc-400">
        KnowTrace Adaptive Learning System • Step 1: Course Configuration
      </div>
    </div>
  );
}
