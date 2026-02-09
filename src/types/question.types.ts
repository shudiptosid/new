// TypeScript types for Questions System

export type QuestionType = "mcq" | "short_answer";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  category: string;
  difficulty: DifficultyLevel;
  explanation?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface MCQOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
}

export interface ShortAnswer {
  id: string;
  question_id: string;
  correct_answer: string;
  alternative_answers?: string[];
  created_at: string;
}

export interface QuestionWithOptions extends Question {
  mcq_options?: MCQOption[];
  short_answer?: ShortAnswer;
}

export interface UserQuizAttempt {
  id: string;
  user_id: string;
  category?: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken_seconds?: number;
  completed_at: string;
}

export interface UserQuestionProgress {
  id: string;
  user_id: string;
  question_id: string;
  is_correct: boolean;
  user_answer: string;
  attempted_at: string;
}

export interface QuizSession {
  questions: QuestionWithOptions[];
  category?: string;
  startTime: number;
  currentIndex: number;
  answers: { [questionId: string]: string };
  correctCount: number;
}

export interface QuestionFormData {
  question_text: string;
  question_type: QuestionType;
  category: string;
  difficulty: DifficultyLevel;
  explanation?: string;
  is_active: boolean;
  mcq_options?: {
    option_text: string;
    is_correct: boolean;
  }[];
  short_answer?: {
    correct_answer: string;
    alternative_answers?: string[];
  };
}
