'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BotMessageSquare,
  HelpCircle,
  Network,
  CalendarCheck,
  AlertOctagon,
  BarChart3,
  UploadCloud,
  FileCheck2,
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  courseId: string;
  courseName?: string;
  activeMisconceptions?: number;
  overallMastery?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  courseId,
  courseName = 'CS 229 Machine Learning',
  activeMisconceptions = 2,
  overallMastery = 64,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: `/courses/${courseId}/dashboard`,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'AI Tutor',
      href: `/courses/${courseId}/tutor`,
      icon: BotMessageSquare,
      badge: 'Grounding',
    },
    {
      label: 'Adaptive Quiz',
      href: `/courses/${courseId}/quiz/new`,
      icon: HelpCircle,
      badge: null,
    },
    {
      label: 'Knowledge Map',
      href: `/courses/${courseId}/map`,
      icon: Network,
      badge: 'Graph',
    },
    {
      label: 'Study Plan',
      href: `/courses/${courseId}/plan`,
      icon: CalendarCheck,
      badge: null,
    },
    {
      label: 'Misconceptions',
      href: `/courses/${courseId}/misconceptions`,
      icon: AlertOctagon,
      badge: activeMisconceptions > 0 ? `${activeMisconceptions} active` : null,
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      label: 'Evaluation & Metrics',
      href: `/courses/${courseId}/evaluation`,
      icon: BarChart3,
      badge: 'RAGAS',
    },
  ];

  const secondaryItems = [
    {
      label: 'Upload Materials',
      href: `/courses/${courseId}/upload`,
      icon: UploadCloud,
    },
    {
      label: 'Processing Status',
      href: `/courses/${courseId}/status`,
      icon: FileCheck2,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800">
          <Logo href="/" size="md" priority />
        </div>

        {/* Current Course Snippet Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-zinc-900 dark:to-zinc-900/50 border border-indigo-100 dark:border-zinc-800">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">
            Active Course
          </div>
          <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate" title={courseName}>
            {courseName}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-100/80 dark:border-zinc-800/80 text-[11px]">
            <span className="text-zinc-500">Mastery</span>
            <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {overallMastery}%
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Learning Modules
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href.includes('/quiz/') && pathname.includes('/quiz'));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono border ${
                      isActive
                        ? 'bg-white/20 text-white border-white/20'
                        : item.badgeColor || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Course Pipeline
          </div>

          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>v1.0 • Adaptive Core</span>
          <Link href="/courses/new" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            + New Course
          </Link>
        </div>
      </aside>
    </>
  );
}
