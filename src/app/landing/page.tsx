'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  UploadCloud,
  BotMessageSquare,
  Network,
  BookOpen,
  Presentation,
  Video,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { INITIAL_COURSE } from '@/lib/mockData';
import { CourseCard } from '@/components/CourseCard';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  const steps = [
    {
      num: '01',
      title: 'Upload Course Materials',
      desc: 'Drop in your textbooks, lecture slides (PPTX), and video recordings. KnowTrace parses formulas, figures, and timestamped audio automatically.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Ask & Practice Adaptively',
      desc: 'Ask questions to a strict source-grounded AI tutor and take diagnostic quizzes that adapt dynamically to your personal knowledge boundaries.',
      icon: BotMessageSquare,
    },
    {
      num: '03',
      title: 'Learn & Close Misconceptions',
      desc: 'Track mastery across an interactive knowledge map, resolve recurring misconceptions through step-by-step remediation, and follow daily study plans.',
      icon: Network,
    },
  ];

  const features = [
    {
      title: '100% Grounded Citations',
      desc: 'Never wonder if an AI answer is a hallucination. Every response cites exact PDF pages, slide numbers, and video timestamps.',
      icon: ShieldCheck,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      title: 'Adaptive Bayesian Knowledge Tracing',
      desc: 'Quizzes measure both answer accuracy and your confidence level to compute calibrated mastery estimates with Bayesian uncertainty bands.',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'Misconception Diagnosis',
      desc: 'Pinpoints specific distractor patterns (e.g. confusing Precision with Recall adjustments) and guides you through 5-step interactive remediation.',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Logo href="/" size="md" priority />

        <div className="flex items-center gap-3">
          <Link
            href="/courses/new"
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white px-3 py-1.5"
          >
            Create Course
          </Link>
          <Link
            href={`/courses/${INITIAL_COURSE.id}/dashboard`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <span>Try Demo Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden pt-16 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Adaptive Learning & Multimodal Tracing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
          Learn Smarter with <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Visible AI Grounding
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Upload your lecture PDFs, slide decks, and class videos. KnowTrace maps course concepts,
          pinpoints your misconceptions, and guides your study with exact source citations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/courses/${INITIAL_COURSE.id}/dashboard`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 transition-all active:scale-95"
          >
            <span>Try the Demo Course</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/courses/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm transition-all shadow-xs"
          >
            <span>Create New Course</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium">
            <BookOpen className="w-4 h-4 text-indigo-500" /> PDF Textbooks
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Presentation className="w-4 h-4 text-amber-500" /> PPT / PPTX Slides
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Video className="w-4 h-4 text-rose-500" /> Lecture Videos
          </span>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              How KnowTrace Works
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              The Three-Step Adaptive Workflow
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                        {s.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                      {s.title}
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Core Capabilities
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Visible Grounding & Metacognitive Feedback
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {f.title}
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12 px-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Interactive Demo Course Ready to Explore
            </h3>
            <p className="text-xs text-zinc-500">
              Pre-loaded with 8 concepts, citations, slide decks & quizzes
            </p>
          </div>
          <Link
            href={`/courses/${INITIAL_COURSE.id}/dashboard`}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Launch Course →
          </Link>
        </div>

        <CourseCard course={INITIAL_COURSE} />
      </section>

      <footer className="mt-auto py-8 px-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo href="/" size="sm" />
            <span className="text-zinc-500">• Multimodal Knowledge Tracing & Adaptive Tutoring</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/courses/${INITIAL_COURSE.id}/evaluation`} className="hover:underline">
              Evaluation Metrics (RAGAS)
            </Link>
            <Link href="/courses/new" className="hover:underline">
              New Course
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
