export type MaterialType = 'pdf' | 'ppt' | 'pptx' | 'video';

export type MaterialProcessingStage =
  | 'upload'
  | 'parse'
  | 'ocr'
  | 'vision'
  | 'transcription'
  | 'chunking'
  | 'tagging'
  | 'embedding'
  | 'complete'
  | 'failed';

export interface CourseMaterial {
  id: string;
  courseId: string;
  name: string;
  type: MaterialType;
  size: string;
  uploadedAt: string;
  status: MaterialProcessingStage;
  progress: number;
  chunksCount: number;
  figuresCount: number;
  keyframesCount: number;
  url?: string;
  duration?: number;
  errorMessage?: string;
}

export interface ProcessingStepInfo {
  id: MaterialProcessingStage;
  label: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: string;
}

export interface ProcessingPipelineStatus {
  overallProgress: number;
  currentStage: MaterialProcessingStage;
  steps: ProcessingStepInfo[];
  stats: {
    chunks: number;
    figures: number;
    keyframes: number;
    tokens: number;
  };
  isComplete: boolean;
  hasError: boolean;
}

export interface Course {
  id: string;
  name: string;
  domain: string;
  examDate: string;
  hoursAvailablePerDay: number;
  targetMastery: number;
  createdAt: string;
  materialsCount: number;
  conceptCount: number;
  overallMastery: number;
  activeMisconceptionsCount: number;
}

export interface Concept {
  id: string;
  courseId: string;
  name: string;
  topic: string;
  description: string;
  mastery: number; // 0 - 100
  uncertainty: number; // 0 - 100
  lastPracticedDaysAgo: number;
  forgettingRisk: 'low' | 'medium' | 'high';
  importance: 'core' | 'prerequisite' | 'advanced';
  prerequisites: string[];
  relatedSourceIds: string[];
  sampleQuestionsCount: number;
}

export type EdgeRelationType = 'contains' | 'requires' | 'confusable';

export interface KnowledgeGraphData {
  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: {
      id: string;
      label: string;
      topic: string;
      mastery: number;
      uncertainty: number;
      isKeyConcept?: boolean;
      misconceptionsCount?: number;
      prerequisitesCount?: number;
      forgettingRisk?: 'low' | 'medium' | 'high';
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
    label?: string;
    data?: {
      relation: EdgeRelationType;
      description?: string;
    };
  }>;
}

export interface Citation {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: MaterialType;
  pageNumber?: number;
  slideNumber?: number;
  timestamp?: number;
  duration?: number;
  snippet: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type TutorMode = 'source-backed' | 'partial' | 'not-covered' | 'outside-knowledge';

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  mode?: TutorMode;
  confidence?: number;
  citations?: Citation[];
  outsideKnowledgeText?: string;
  outsideKnowledgeAvailable?: boolean;
  isStreaming?: boolean;
}

export interface VideoTranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
}

export interface SourceDocument {
  id: string;
  courseId: string;
  title: string;
  type: MaterialType;
  fileSize: string;
  totalPages?: number;
  totalSlides?: number;
  videoDuration?: number;
  videoUrl?: string;
  pagesContent?: Array<{
    pageNumber: number;
    heading: string;
    text: string;
    highlightSnippet?: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
  }>;
  slidesContent?: Array<{
    slideNumber: number;
    title: string;
    bullets: string[];
    notes?: string;
    visualMockupType?: 'chart' | 'diagram' | 'formula';
  }>;
  transcript?: VideoTranscriptSegment[];
}

export type QuestionType = 'mcq' | 'short_answer' | 'numerical' | 'conceptual';

export interface QuizQuestion {
  id: string;
  conceptId: string;
  conceptName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: QuestionType;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isMisconceptionDistractor?: boolean;
    misconceptionId?: string;
    misconceptionFeedback?: string;
  }>;
  correctAnswerId: string;
  explanation: string;
  hint: string;
  whySelectedReason: string;
  citation: Citation;
}

export interface UserQuestionSubmission {
  questionId: string;
  selectedOptionId: string;
  confidence: number; // 1 to 5
  timeSpentSeconds: number;
}

export interface QuestionFeedbackResult {
  questionId: string;
  isCorrect: boolean;
  selectedOptionId: string;
  correctOptionId: string;
  explanation: string;
  citation: Citation;
  masteryBefore: number;
  masteryAfter: number;
  masteryDelta: number;
  conceptName: string;
  whySelectedReason: string;
  detectedMisconception?: {
    id: string;
    title: string;
    description: string;
    severity: number;
  };
}

export interface QuizAttempt {
  id: string;
  courseId: string;
  title: string;
  createdAt: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  results: Record<string, QuestionFeedbackResult>;
  completed: boolean;
  scorePercentage?: number;
  weakConceptsIdentified?: string[];
  misconceptionsTriggered?: string[];
  recommendedActions?: string[];
}

export interface Misconception {
  id: string;
  courseId: string;
  conceptId: string;
  conceptName: string;
  title: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  evidenceCount: number;
  evidenceDetails: string[];
  remediation: {
    contrastSummary: string;
    detailedExplanation: string;
    realWorldExample: string;
    analogy: string;
    quickCheckQuestion: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  };
  status: 'active' | 'remediated';
  lastEncounteredDaysAgo: number;
}

export interface StudyPlanBlock {
  id: string;
  day: 'today' | 'tomorrow' | 'upcoming';
  timeSlot: string;
  conceptId: string;
  conceptName: string;
  activity: 'Study' | 'Practice' | 'Revise';
  durationMinutes: number;
  reason: string;
  completed: boolean;
}

export interface PlanUpdateDiff {
  id: string;
  timestamp: string;
  triggerEvent: string;
  changes: Array<{
    type: 'moved_up' | 'moved_down' | 'added' | 'completed';
    conceptName: string;
    note: string;
  }>;
}

export interface EvaluationMetrics {
  ragas: {
    faithfulness: number;
    answerRelevance: number;
    contextRecall: number;
    contextPrecision: number;
  };
  retrieval: {
    ndcg5: number;
    mrr: number;
    hitRate3: number;
    meanLatencyMs: number;
  };
  citations: {
    exactMatchAccuracy: number;
    unsupportedClaimRate: number;
    averageCitationSpanChars: number;
  };
  refusals: {
    outOfScopePrecision: number;
    outOfDomainRejectionRate: number;
    falseRefusalRate: number;
  };
  ablations: Array<{
    variant: string;
    faithfulness: number;
    retrievalHitRate: number;
    latencyMs: number;
    notes: string;
  }>;
  simulator: {
    syntheticStudentsTested: number;
    adaptiveEfficiencyGainPct: number;
    averageMasteryGainPct: number;
    misconceptionRecoveryRatePct: number;
  };
  questionBank: {
    totalQuestions: number;
    coveredConceptsPct: number;
    bloomTaxonomy: {
      Remember: number;
      Understand: number;
      Apply: number;
      Analyze: number;
      Evaluate: number;
    };
  };
}
