export type QuestionType = 'multiple_choice' | 'text' | 'long_text' | 'date' | 'rating';

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[];
  correctAnswer?: number | null;
  maxRating?: number;
}

export interface FormTheme {
  primaryColor?: string;
  backgroundColor?: string;
  cardBackground?: string;
  textColor?: string;
  borderColor?: string;
  fontFamily?: 'inter' | 'roboto' | 'open-sans' | 'lato' | 'montserrat' | 'playfair' | 'poppins' | 'merriweather';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  headerStyle?: 'default' | 'centered' | 'minimal' | 'banner';
  backgroundPattern?: 'none' | 'grid' | 'polka' | 'stripes' | 'wavy' | 'solid';
}

export interface Form {
  id?: string;
  title: string;
  description: string;
  type: 'quiz' | 'survey';
  questions: Question[];
  theme?: FormTheme;
  isOpen?: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
  thankYouTitle?: string;
  thankYouDescription?: string;
}
