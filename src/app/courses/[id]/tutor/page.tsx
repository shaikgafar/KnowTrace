'use client';

import React, { useRef, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell, useCitationViewer } from '@/components/AppShell';
import { TutorChat } from '@/components/TutorChat';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TutorMessage, Citation } from '@/types';

export default function CourseTutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { openCitation } = useCitationViewer();

  const hasTriggeredRef = useRef(false);

  const { data: messages = [] } = useQuery<TutorMessage[]>({
    queryKey: ['tutorMessages', courseId],
    queryFn: () => api.getTutorMessages(courseId),
  });

  const sendMutation = useMutation({
    mutationFn: ({ text, allowOutside }: { text: string; allowOutside: boolean }) =>
      api.sendTutorMessage(courseId, text, allowOutside),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorMessages', courseId] });
    },
  });

  // Handle URL prefilled prompt if coming from Concept Panel or Study Plan
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    if (initialPrompt && !hasTriggeredRef.current && messages.length > 0) {
      hasTriggeredRef.current = true;
      sendMutation.mutate({ text: initialPrompt, allowOutside: false });
    }
  }, [searchParams, messages.length, sendMutation]);

  const handleSendMessage = async (text: string, allowOutside: boolean) => {
    await sendMutation.mutateAsync({ text, allowOutside });
  };

  const handleCitationClick = (citation: Citation) => {
    openCitation(citation);
  };

  return (
    <AppShell courseId={courseId} title="AI Tutor with Grounded Citations">
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Source-Grounded AI Tutor
            </h1>
            <p className="text-xs text-zinc-500">
              Every claim is attributed to textbook pages, slide figures, or lecture speech spans.
            </p>
          </div>
        </div>

        <TutorChat
          messages={messages}
          onSendMessage={handleSendMessage}
          onCitationClick={handleCitationClick}
          isLoading={sendMutation.isPending}
        />
      </div>
    </AppShell>
  );
}
