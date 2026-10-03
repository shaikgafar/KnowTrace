'use client';

import React, { useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, useCitationViewer } from '@/components/AppShell';
import { QuizCard } from '@/components/QuizCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QuizAttempt, Citation } from '@/types';
import { ProgressBar } from '@/components/ProgressBar';

export default function ActiveQuizPage({
  params,
}: {
  params: Promise<{ id: string; aid: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const attemptId = resolvedParams.aid;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openCitation } = useCitationViewer();

  const questionStartTimeRef = useRef<number>(0);

  const { data: attempt, isLoading } = useQuery<QuizAttempt | null>({
    queryKey: ['quizAttempt', attemptId],
    queryFn: () => api.getQuizAttempt(attemptId),
  });

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [attempt?.currentQuestionIndex]);

  const submitMutation = useMutation({
    mutationFn: (data: { selectedOptionId: string; confidence: number }) => {
      const currentQuestion = attempt?.questions[attempt.currentQuestionIndex];
      if (!currentQuestion) throw new Error('No active question');
      const start = questionStartTimeRef.current || Date.now();
      const timeSpent = Math.max(1, Math.round((Date.now() - start) / 1000));
      return api.submitQuestionAnswer(attemptId, {
        questionId: currentQuestion.id,
        selectedOptionId: data.selectedOptionId,
        confidence: data.confidence,
        timeSpentSeconds: timeSpent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizAttempt', attemptId] });
      queryClient.invalidateQueries({ queryKey: ['concepts', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });

  if (isLoading) {
    return (
      <AppShell courseId={courseId} title="Loading Quiz...">
        <div className="max-w-2xl mx-auto py-12 text-center text-xs text-zinc-400 font-mono">
          Loading Adaptive Diagnostic Quiz...
        </div>
      </AppShell>
    );
  }

  if (!attempt || attempt.questions.length === 0) {
    return (
      <AppShell courseId={courseId} title="Quiz Not Found">
        <div className="max-w-md mx-auto py-12 text-center space-y-4">
          <h2 className="text-base font-bold">Quiz Session Not Found</h2>
          <button
            onClick={() => router.push(`/courses/${courseId}/quiz/new`)}
            className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-semibold cursor-pointer"
          >
            Start New Quiz
          </button>
        </div>
      </AppShell>
    );
  }

  const currentQ = attempt.questions[attempt.currentQuestionIndex];
  const isLastQuestion = attempt.currentQuestionIndex === attempt.totalQuestions - 1;
  const progressPct = ((attempt.currentQuestionIndex + 1) / attempt.totalQuestions) * 100;

  const handleNext = () => {
    if (isLastQuestion) {
      router.push(`/courses/${courseId}/results/${attemptId}`);
    } else {
      questionStartTimeRef.current = Date.now();
      queryClient.invalidateQueries({ queryKey: ['quizAttempt', attemptId] });
    }
  };

  const handleCitationClick = (citation: Citation) => {
    openCitation(citation);
  };

  return (
    <AppShell courseId={courseId} title={attempt.title}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{attempt.title}</span>
            <span className="font-mono text-zinc-400">
              {attempt.currentQuestionIndex + 1} of {attempt.totalQuestions} Questions
            </span>
          </div>
          <ProgressBar progress={progressPct} size="sm" showPercentage={false} />
        </div>

        {currentQ && (
          <QuizCard
            key={currentQ.id}
            question={currentQ}
            currentIndex={attempt.currentQuestionIndex}
            totalQuestions={attempt.totalQuestions}
            onSubmit={(data) => submitMutation.mutateAsync(data)}
            onNext={handleNext}
            onCitationClick={handleCitationClick}
            isLastQuestion={isLastQuestion}
          />
        )}
      </div>
    </AppShell>
  );
}
