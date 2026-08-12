// FILE: types/index.ts

export type Role = 'admin' | 'student';
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type ExamType = 'jlpt_mock' | 'small_test' | 'semester_exam';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Vocabulary {
  id?: string;
  level: JLPTLevel;
  kanji: string;      // VD: 学校
  furigana: string;   // VD: がっこう (Sẽ được parse thành <ruby> ở frontend)
  meaning: string;    // VD: Trường học
  example: string;    // VD: 学校へ行きます。
  exampleTranslation?: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface KanjiInfo {
  id?: string;
  level: JLPTLevel;
  kanji: string;      // VD: 学
  onYomi: string;     // VD: ガク
  kunYomi: string;    // VD: まなぶ
  meaning: string;    // VD: Học
  strokeCount?: number;
  examples: string[]; // Chứa JSON stringified hoặc array các từ ghép
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Grammar {
  id?: string;
  level: JLPTLevel;
  title: string;      // VD: ～です
  meaning: string;
  structure: string;  // VD: N1 は N2 です。
  usage: string;      // Cách sử dụng/Lưu ý
  examples: { jp: string; vi: string }[];
  createdAt: number;
  updatedAt: number;
}

// === EXAM SYSTEM ===

export interface Question {
  id: string;
  section: 'vocabulary' | 'grammar_reading' | 'listening';
  content: string;    // Câu hỏi chính
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D'; // Chỉ lấy ở server khi submit
  explanation?: string;
  imageUrl?: string;
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exam {
  id?: string;
  title: string;
  level: JLPTLevel;
  type: ExamType;
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[]; // Có thể để dạng subcollection, nhưng với Firestore document limit 1MB, một đề ~50 câu lưu chung 1 doc vẫn rất tối ưu (đọc 1 lần).
  createdAt: number;
  updatedAt: number;
}

export interface ExamAttempt {
  id?: string;
  userId: string;
  examId: string;
  examTitle: string;
  level: JLPTLevel;
  startedAt: number;
  completedAt?: number;
  status: 'in_progress' | 'completed';
  answers: Record<string, string>; // { questionId: 'A' }
  score?: number;
  correctCount?: number;
  totalQuestions: number;
  sectionScores?: {
    vocabulary: number;
    grammar_reading: number;
    listening: number;
  };
}

export interface UserProgress {
  userId: string;
  learnedVocabIds: string[];
  learnedKanjiIds: string[];
  totalStudyTimeMinutes: number;
}
