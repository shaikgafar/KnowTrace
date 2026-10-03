'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {course.domain}
          </span>
          {course.activeMisconceptionsCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
              <AlertTriangle className="w-3 h-3" />
              {course.activeMisconceptionsCount} Misconceptions
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
          {course.name}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Exam: {course.examDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{course.hoursAvailablePerDay}h / day</span>
          </div>
        </div>

        <div className="mb-6">
          <ProgressBar
            progress={course.overallMastery}
            label="Overall Mastery"
            variant={course.overallMastery >= 75 ? 'emerald' : course.overallMastery >= 50 ? 'amber' : 'rose'}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="text-xs text-zinc-400">
          <span>{course.conceptCount} Concepts • {course.materialsCount} Materials</span>
        </div>

        <Link
          href={`/courses/${course.id}/dashboard`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white dark:text-zinc-900 dark:hover:text-white text-xs font-semibold shadow-xs transition-all active:scale-95 group-hover:bg-indigo-600 group-hover:text-white"
        >
          <span>Open Course</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
