export type JLPTLevel = "n5" | "n4" | "n3" | "n2" | "n1";

export interface Vocabulary {
  id?: string;
  level: JLPTLevel;
  word: string; // display word, may contain kanji
  kanji?: string | null; // optional kanji form (if different)
  furigana?: string | null;
  meaning: string;
  example?: string | null;
  exampleFurigana?: string | null;
  exampleMeaning?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  createdAt?: any;
  updatedAt?: any;
}
