import {
  Course,
  CourseMaterial,
  Concept,
  KnowledgeGraphData,
  TutorMessage,
  SourceDocument,
  QuizAttempt,
  UserQuestionSubmission,
  QuestionFeedbackResult,
  Misconception,
  StudyPlanBlock,
  PlanUpdateDiff,
  EvaluationMetrics,
  ProcessingPipelineStatus,
} from '@/types';
import {
  INITIAL_COURSE,
  INITIAL_MATERIALS,
  INITIAL_CONCEPTS,
  INITIAL_KNOWLEDGE_GRAPH,
  INITIAL_TUTOR_MESSAGES,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_MISCONCEPTIONS,
  INITIAL_STUDY_PLAN,
  INITIAL_PLAN_DIFFS,
  EVALUATION_METRICS,
  SOURCE_DOCUMENTS,
} from './mockData';

// Storage keys
const STORAGE_PREFIX = 'knowtrace_';

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to read from localStorage: ${key}`, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage: ${key}`, e);
  }
}

// Global in-memory / storage sync
export const api = {
  // --- COURSES ---
  async getCourse(id: string): Promise<Course> {
    const courses = getStorage<Record<string, Course>>('courses', {
      [INITIAL_COURSE.id]: INITIAL_COURSE,
    });
    if (!courses[id]) {
      return { ...INITIAL_COURSE, id };
    }
    return courses[id];
  },

  async getAllCourses(): Promise<Course[]> {
    const courses = getStorage<Record<string, Course>>('courses', {
      [INITIAL_COURSE.id]: INITIAL_COURSE,
    });
    return Object.values(courses);
  },

  async createCourse(data: {
    name: string;
    domain: string;
    examDate: string;
    hoursAvailablePerDay: number;
    targetMastery: number;
  }): Promise<Course> {
    const courses = getStorage<Record<string, Course>>('courses', {
      [INITIAL_COURSE.id]: INITIAL_COURSE,
    });
    const id = 'course-' + Date.now();
    const newCourse: Course = {
      id,
      name: data.name,
      domain: data.domain || 'General',
      examDate: data.examDate,
      hoursAvailablePerDay: data.hoursAvailablePerDay || 2,
      targetMastery: data.targetMastery || 80,
      createdAt: new Date().toISOString().split('T')[0],
      materialsCount: 0,
      conceptCount: 0,
      overallMastery: 0,
      activeMisconceptionsCount: 0,
    };
    courses[id] = newCourse;
    setStorage('courses', courses);
    return newCourse;
  },

  // --- MATERIALS & UPLOAD ---
  async getMaterials(courseId: string): Promise<CourseMaterial[]> {
    const all = getStorage<CourseMaterial[]>('materials_' + courseId, INITIAL_MATERIALS);
    return all;
  },

  async uploadMaterial(
    courseId: string,
    file: { name: string; type: 'pdf' | 'ppt' | 'pptx' | 'video'; size: string }
  ): Promise<CourseMaterial> {
    const materials = await this.getMaterials(courseId);
    const newMat: CourseMaterial = {
      id: 'mat-' + Date.now(),
      courseId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toLocaleString(),
      status: 'upload',
      progress: 0,
      chunksCount: 0,
      figuresCount: 0,
      keyframesCount: 0,
    };
    materials.push(newMat);
    setStorage('materials_' + courseId, materials);
    return newMat;
  },

  async removeMaterial(courseId: string, materialId: string): Promise<void> {
    const materials = await this.getMaterials(courseId);
    const filtered = materials.filter((m) => m.id !== materialId);
    setStorage('materials_' + courseId, filtered);
  },

  // --- PROCESSING STATUS ---
  async getProcessingStatus(courseId: string): Promise<ProcessingPipelineStatus> {
    const stored = getStorage<ProcessingPipelineStatus | null>(
      'proc_status_' + courseId,
      null
    );
    if (stored) return stored;

    return {
      overallProgress: 100,
      currentStage: 'complete',
      isComplete: true,
      hasError: false,
      stats: {
        chunks: 456,
        figures: 36,
        keyframes: 9,
        tokens: 182400,
      },
      steps: [
        { id: 'upload', label: 'File Upload', description: 'Course materials uploaded', status: 'completed' },
        { id: 'parse', label: 'Document Parsing', description: 'PDF text & layout extracted', status: 'completed' },
        { id: 'ocr', label: 'OCR & Vision', description: 'Mathematical formulas & figures detected', status: 'completed' },
        { id: 'transcription', label: 'Audio Transcription', description: 'Video speech transcribed with timestamps', status: 'completed' },
        { id: 'chunking', label: 'Semantic Chunking', description: 'Hierarchical passages segmented', status: 'completed' },
        { id: 'tagging', label: 'Concept Extraction', description: 'Knowledge nodes & prerequisites resolved', status: 'completed' },
        { id: 'embedding', label: 'Vector Indexing', description: 'Dense embeddings generated and indexed', status: 'completed' },
        { id: 'complete', label: 'Ready for Learning', description: 'Knowledge map and tutor ready', status: 'completed' },
      ],
    };
  },

  // --- CONCEPTS & MASTERY ---
  async getConcepts(courseId: string): Promise<Concept[]> {
    return getStorage<Concept[]>('concepts_' + courseId, INITIAL_CONCEPTS);
  },

  async getConcept(courseId: string, conceptId: string): Promise<Concept | null> {
    const concepts = await this.getConcepts(courseId);
    return concepts.find((c) => c.id === conceptId) || null;
  },

  // --- KNOWLEDGE GRAPH ---
  async getKnowledgeGraph(courseId: string): Promise<KnowledgeGraphData> {
    const concepts = await this.getConcepts(courseId);
    const graph = getStorage<KnowledgeGraphData>(
      'kg_' + courseId,
      INITIAL_KNOWLEDGE_GRAPH
    );
    const updatedNodes = graph.nodes.map((node) => {
      const match = concepts.find((c) => c.id === node.id);
      if (match) {
        return {
          ...node,
          data: {
            ...node.data,
            mastery: match.mastery,
            uncertainty: match.uncertainty,
            forgettingRisk: match.forgettingRisk,
          },
        };
      }
      return node;
    });
    return { ...graph, nodes: updatedNodes };
  },

  // --- TUTOR CHAT ---
  async getTutorMessages(courseId: string): Promise<TutorMessage[]> {
    return getStorage<TutorMessage[]>('tutor_msgs_' + courseId, INITIAL_TUTOR_MESSAGES);
  },

  async sendTutorMessage(
    courseId: string,
    userText: string,
    allowOutsideKnowledge = false
  ): Promise<TutorMessage> {
    const messages = await this.getTutorMessages(courseId);
    const userMsg: TutorMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    messages.push(userMsg);

    let tutorMsg: TutorMessage;
    const lower = userText.toLowerCase();

    if (lower.includes('regularization') || lower.includes('l1') || lower.includes('l2') || lower.includes('lasso') || lower.includes('ridge')) {
      tutorMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'tutor',
        text: `Regularization prevents overfitting by adding a penalty to the loss function:

$$\\min_w \\mathcal{L}(w) + \\lambda \\Omega(w)$$

* **L2 Regularization (Ridge):** $\\Omega(w) = \\|w\\|_2^2$. The constraint boundary is a smooth hypersphere (circle in 2D). Expanding loss contours intersect the circle at non-zero coordinates, smoothly shrinking all weights without setting them to exact zero.
* **L1 Regularization (Lasso):** $\\Omega(w) = \\|w\\|_1$. The constraint boundary is a diamond (polytope) with sharp vertices along coordinate axes. Loss contours touch these sharp corners first, driving many feature coefficients to **exact zero** (sparsity).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'source-backed',
        confidence: 98,
        citations: [
          {
            id: 'cit-l1-pdf',
            sourceId: 'mat-pdf-1',
            sourceTitle: 'Lecture 04 — Page 42',
            sourceType: 'pdf',
            pageNumber: 42,
            snippet: 'When p=1 (Lasso), the penalty constraint forms a diamond in 2D with sharp corners along coordinate axes. Loss contours make first contact at a vertex where w_i = 0, inducing true parameter sparsity.',
          },
        ],
      };
    } else if (lower.includes('precision') || lower.includes('recall') || lower.includes('threshold') || lower.includes('false positive')) {
      tutorMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'tutor',
        text: `**Precision and Recall have an intrinsic trade-off** dictated by the classification threshold:

* $\\text{Precision} = \\frac{TP}{TP + FP}$ — "How reliable are our positive alerts?"
* $\\text{Recall} = \\frac{TP}{TP + FN}$ — "Did we capture all positive instances in reality?"

When you **increase the decision threshold (e.g. 0.5 → 0.8)**, the model becomes much more conservative:
1. False positives decrease dramatically → **Precision increases**.
2. Borderline true positives are missed as false negatives → **Recall decreases**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'source-backed',
        confidence: 95,
        citations: [
          {
            id: 'cit-pr-ppt',
            sourceId: 'mat-ppt-1',
            sourceTitle: 'Lecture 05 — Slide 14',
            sourceType: 'pptx',
            slideNumber: 14,
            snippet: 'Precision = TP / (TP + FP). Threshold sensitivity: Raising threshold from 0.5 to 0.8 reduces False Positives (Precision ↑), but causes more False Negatives (Recall ↓).',
          },
          {
            id: 'cit-pr-vid',
            sourceId: 'mat-video-1',
            sourceTitle: 'Lecture Video — 18:32',
            sourceType: 'video',
            timestamp: 1112,
            duration: 33,
            snippet: 'When you raise the threshold, you only classify items you are overwhelmingly confident in as positive. This drives down false positives, boosting precision. But you miss borderline positives, dropping recall.',
          },
        ],
      };
    } else if (lower.includes('quantum') || lower.includes('dna') || lower.includes('cooking') || lower.includes('weather') || lower.includes('capital of france')) {
      if (allowOutsideKnowledge) {
        tutorMsg = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'tutor',
          text: `This topic is **not covered in your course material**, but here is general information based on outside knowledge:

${userText.includes('capital') ? 'The capital of France is Paris.' : 'This concept lies outside the current CS 229 Machine Learning curriculum. Please consult specialized documentation for topics outside machine learning and optimization.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'outside-knowledge',
          confidence: 85,
        };
      } else {
        tutorMsg = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'tutor',
          text: `**Not covered in your course material.**

The uploaded course files (Lecture 04, Lecture 05, and Recitation Video) focus on Machine Learning Foundations: Optimization, Regularization, Model Evaluation, and Generalization.

Would you like to toggle **"Allow General Knowledge"** to receive an ungrounded response?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'not-covered',
          confidence: 99,
          outsideKnowledgeAvailable: true,
          outsideKnowledgeText: 'General reasoning available upon request.',
        };
      }
    } else {
      tutorMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'tutor',
        text: `Based on your course materials, this topic connects directly to model optimization and generalizability.

In **Lecture 04**, we establish that minimizing empirical training error alone risks overfitting when model capacity exceeds sample complexity. Optimization algorithms like Gradient Descent must be paired with either proper validation or penalty terms to guarantee test generalization.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'partial',
        confidence: 88,
        citations: [
          {
            id: 'cit-gen-pdf',
            sourceId: 'mat-pdf-1',
            sourceTitle: 'Lecture 04 — Page 14',
            sourceType: 'pdf',
            pageNumber: 14,
            snippet: 'Optimization algorithms like Gradient Descent must be paired with validation to guarantee test generalization.',
          },
        ],
      };
    }

    messages.push(tutorMsg);
    setStorage('tutor_msgs_' + courseId, messages);
    return tutorMsg;
  },

  // --- SOURCE VIEWER ---
  async getSourceDocument(sourceId: string): Promise<SourceDocument | null> {
    return SOURCE_DOCUMENTS[sourceId] || null;
  },

  // --- QUIZZES ---
  async createQuizAttempt(
    courseId: string,
    options: {
      conceptIds: string[];
      questionCount: number;
      mode: 'adaptive' | 'mock';
    }
  ): Promise<QuizAttempt> {
    let candidateQuestions = [...INITIAL_QUIZ_QUESTIONS];
    if (options.conceptIds.length > 0) {
      candidateQuestions = candidateQuestions.filter((q) =>
        options.conceptIds.includes(q.conceptId)
      );
      if (candidateQuestions.length === 0) {
        candidateQuestions = [...INITIAL_QUIZ_QUESTIONS];
      }
    }

    const concepts = await this.getConcepts(courseId);
    candidateQuestions.sort((a, b) => {
      const cA = concepts.find((c) => c.id === a.conceptId)?.mastery ?? 50;
      const cB = concepts.find((c) => c.id === b.conceptId)?.mastery ?? 50;
      return cA - cB;
    });

    const chosen = candidateQuestions.slice(0, Math.min(options.questionCount, candidateQuestions.length));

    const attempt: QuizAttempt = {
      id: 'quiz-' + Date.now(),
      courseId,
      title: options.mode === 'adaptive' ? 'Adaptive Diagnostic Quiz' : 'Mock Exam Simulation',
      createdAt: new Date().toISOString(),
      totalQuestions: chosen.length,
      currentQuestionIndex: 0,
      questions: chosen,
      results: {},
      completed: false,
    };

    setStorage('quiz_attempt_' + attempt.id, attempt);
    return attempt;
  },

  async getQuizAttempt(attemptId: string): Promise<QuizAttempt | null> {
    return getStorage<QuizAttempt | null>('quiz_attempt_' + attemptId, null);
  },

  async submitQuestionAnswer(
    attemptId: string,
    submission: UserQuestionSubmission
  ): Promise<QuestionFeedbackResult> {
    const attempt = await this.getQuizAttempt(attemptId);
    if (!attempt) throw new Error('Quiz attempt not found');

    const question = attempt.questions.find((q) => q.id === submission.questionId);
    if (!question) throw new Error('Question not found');

    const isCorrect = submission.selectedOptionId === question.correctAnswerId;
    const selectedOpt = question.options.find((o) => o.id === submission.selectedOptionId);

    const concepts = await this.getConcepts(attempt.courseId);
    const conceptIndex = concepts.findIndex((c) => c.id === question.conceptId);
    let masteryBefore = 50;
    const masteryDelta = isCorrect ? +9 : -6;
    let masteryAfter = 50;

    if (conceptIndex !== -1) {
      masteryBefore = concepts[conceptIndex].mastery;
      masteryAfter = Math.min(100, Math.max(0, masteryBefore + masteryDelta));
      concepts[conceptIndex].mastery = masteryAfter;
      concepts[conceptIndex].uncertainty = Math.max(5, concepts[conceptIndex].uncertainty - 4);
      concepts[conceptIndex].lastPracticedDaysAgo = 0;
      setStorage('concepts_' + attempt.courseId, concepts);

      const course = await this.getCourse(attempt.courseId);
      const avgMastery = Math.round(
        concepts.reduce((sum, c) => sum + c.mastery, 0) / concepts.length
      );
      course.overallMastery = avgMastery;
      setStorage('courses', { [course.id]: course });
    }

    let detectedMisconception: QuestionFeedbackResult['detectedMisconception'] = undefined;
    if (selectedOpt?.isMisconceptionDistractor && selectedOpt.misconceptionId) {
      const misconceptions = await this.getMisconceptions(attempt.courseId);
      const misc = misconceptions.find((m) => m.id === selectedOpt.misconceptionId);
      if (misc) {
        detectedMisconception = {
          id: misc.id,
          title: misc.title,
          description: selectedOpt.misconceptionFeedback || misc.description,
          severity: misc.severity,
        };
        misc.evidenceCount += 1;
        misc.lastEncounteredDaysAgo = 0;
        setStorage('misconceptions_' + attempt.courseId, misconceptions);
      }
    }

    const result: QuestionFeedbackResult = {
      questionId: question.id,
      isCorrect,
      selectedOptionId: submission.selectedOptionId,
      correctOptionId: question.correctAnswerId,
      explanation: question.explanation,
      citation: question.citation,
      masteryBefore,
      masteryAfter,
      masteryDelta,
      conceptName: question.conceptName,
      whySelectedReason: question.whySelectedReason,
      detectedMisconception,
    };

    attempt.results[question.id] = result;
    if (attempt.currentQuestionIndex < attempt.totalQuestions - 1) {
      attempt.currentQuestionIndex += 1;
    } else {
      attempt.completed = true;
      const correctCount = Object.values(attempt.results).filter((r) => r.isCorrect).length;
      attempt.scorePercentage = Math.round((correctCount / attempt.totalQuestions) * 100);
      attempt.weakConceptsIdentified = Object.values(attempt.results)
        .filter((r) => !r.isCorrect)
        .map((r) => r.conceptName);
      attempt.recommendedActions = [
        'Review Regularization (L1 & L2) on Slide 14 and Page 42',
        'Practice Precision vs Recall threshold adjustments in the Misconceptions tab',
        'Take a 3-question adaptive follow-up drill before tomorrow',
      ];

      await this.updateStudyPlanAfterQuiz(attempt.courseId, attempt.weakConceptsIdentified);
    }

    setStorage('quiz_attempt_' + attemptId, attempt);
    return result;
  },

  // --- MISCONCEPTIONS ---
  async getMisconceptions(courseId: string): Promise<Misconception[]> {
    return getStorage<Misconception[]>('misconceptions_' + courseId, INITIAL_MISCONCEPTIONS);
  },

  async remediateMisconception(courseId: string, misconceptionId: string): Promise<void> {
    const list = await this.getMisconceptions(courseId);
    const item = list.find((m) => m.id === misconceptionId);
    if (item) {
      item.status = 'remediated';
      setStorage('misconceptions_' + courseId, list);

      const concepts = await this.getConcepts(courseId);
      const c = concepts.find((concept) => concept.id === item.conceptId);
      if (c) {
        c.mastery = Math.min(100, c.mastery + 12);
        setStorage('concepts_' + courseId, concepts);
      }
    }
  },

  // --- STUDY PLAN ---
  async getStudyPlan(courseId: string): Promise<StudyPlanBlock[]> {
    return getStorage<StudyPlanBlock[]>('study_plan_' + courseId, INITIAL_STUDY_PLAN);
  },

  async toggleStudyBlock(courseId: string, blockId: string): Promise<void> {
    const plan = await this.getStudyPlan(courseId);
    const item = plan.find((b) => b.id === blockId);
    if (item) {
      item.completed = !item.completed;
      setStorage('study_plan_' + courseId, plan);
    }
  },

  async getPlanDiffs(courseId: string): Promise<PlanUpdateDiff[]> {
    return getStorage<PlanUpdateDiff[]>('plan_diffs_' + courseId, INITIAL_PLAN_DIFFS);
  },

  async updateStudyPlanAfterQuiz(courseId: string, weakConcepts: string[]): Promise<void> {
    if (weakConcepts.length === 0) return;
    const diffs = await this.getPlanDiffs(courseId);

    const newDiff: PlanUpdateDiff = {
      id: 'diff-' + Date.now(),
      timestamp: 'Just now (Post-Quiz Update)',
      triggerEvent: `Dynamic re-ranking triggered by quiz results (${weakConcepts.join(', ')})`,
      changes: weakConcepts.map((cName) => ({
        type: 'moved_up',
        conceptName: cName,
        note: 'Moved to top priority based on error detection',
      })),
    };
    diffs.unshift(newDiff);
    setStorage('plan_diffs_' + courseId, diffs);
  },

  // --- EVALUATION ---
  async getEvaluationMetrics(_courseId: string): Promise<EvaluationMetrics> {
    return EVALUATION_METRICS;
  },

  // Reset to initial demo state
  resetDemoData(courseId = 'cs229-ml'): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_PREFIX + 'courses');
    window.localStorage.removeItem(STORAGE_PREFIX + 'materials_' + courseId);
    window.localStorage.removeItem(STORAGE_PREFIX + 'proc_status_' + courseId);
    window.localStorage.removeItem(STORAGE_PREFIX + 'concepts_' + courseId);
    window.localStorage.removeItem(STORAGE_PREFIX + 'kg_' + courseId);
    window.localStorage.removeItem(STORAGE_PREFIX + 'tutor_msgs_' + courseId);
    window.localStorage.removeItem(STORAGE_PREFIX + 'misconceptions_' + courseId);
    window.localStorage.removeItem(STORAGE_PREFIX + 'study_plan_' + courseId);
    window.localStorage.removeItem(STORAGE_PREFIX + 'plan_diffs_' + courseId);
  },
};
