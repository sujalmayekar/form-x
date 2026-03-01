export type QuestionType = 'multiple_choice' | 'text' | 'long_text' | 'date' | 'rating';

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  required: boolean;
  allowMultiple?: boolean;
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
  published?: boolean;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceTheme {
  primaryColor: string;
  logoUrl?: string;
  note?: string;
}

export type InvoiceStatus = 'draft' | 'paid' | 'overdue';

export interface Invoice {
  _id?: string;
  userId: string;
  invoiceNumber: string;
  date: Date | string;
  dueDate?: Date | string;
  fromDetails: {
    name: string;
    email: string;
    address: string;
  };
  toDetails: {
    name: string;
    email: string;
    address: string;
  };
  lineItems: InvoiceLineItem[];
  currency: string;
  taxRate: number;
  theme: InvoiceTheme;
  status: InvoiceStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
