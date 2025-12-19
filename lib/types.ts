export type QuestionType = 'multiple_choice' | 'text' | 'rating';

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[];
  correctAnswer?: number | null;
  maxRating?: number;
}

export interface Form {
  id?: string;
  title: string;
  description: string;
  type: 'quiz' | 'survey';
  questions: Question[];
}
