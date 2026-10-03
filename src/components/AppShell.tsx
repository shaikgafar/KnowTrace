'use client';

import React, { useState, createContext, useContext } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SourceViewerModal } from './SourceViewerModal';
import { Citation, Course } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Create a context so any nested page/component can open the citation modal easily
interface CitationViewerContextType {
  openCitation: (citation: Citation) => void;
  closeCitation: () => void;
}

export const CitationViewerContext = createContext<CitationViewerContextType>({
  openCitation: () => {},
  closeCitation: () => {},
});

export const useCitationViewer = () => useContext(CitationViewerContext);

interface AppShellProps {
  courseId: string;
  title?: string;
  children: React.ReactNode;
}

export function AppShell({ courseId, title, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const { data: course } = useQuery<Course>({
    queryKey: ['course', courseId],
    queryFn: () => api.getCourse(courseId),
  });

  const openCitation = (citation: Citation) => {
    setActiveCitation(citation);
  };

  const closeCitation = () => {
    setActiveCitation(null);
  };

  return (
    <CitationViewerContext.Provider value={{ openCitation, closeCitation }}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          courseId={courseId}
          courseName={course?.name || 'CS 229 Machine Learning'}
          activeMisconceptions={course?.activeMisconceptionsCount ?? 2}
          overallMastery={course?.overallMastery ?? 64}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
          <Header
            courseId={courseId}
            courseName={course?.name || 'CS 229 Machine Learning'}
            title={title}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            activeMisconceptions={course?.activeMisconceptionsCount ?? 2}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Source Viewer Modal */}
        <SourceViewerModal citation={activeCitation} onClose={closeCitation} />
      </div>
    </CitationViewerContext.Provider>
  );
}
