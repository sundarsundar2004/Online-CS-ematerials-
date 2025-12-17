export interface Topic {
  id: string;
  title: string;
  prompt: string; // The prompt to send to Gemini to generate the initial material
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  iconName: string; // string identifier for Lucide icon
  topics: Topic[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GeneratedContentState {
  isLoading: boolean;
  content: string | null;
  error: string | null;
  topicId: string | null;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizState {
  isOpen: boolean;
  isLoading: boolean;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  showResults: boolean;
}