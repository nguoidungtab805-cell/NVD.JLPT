// FILE: lib/parsers/examParser.ts
import { Question } from "../../types";

export const parseRawExamText = (rawText: string): { questions: Question[], errors: string[] } => {
  const questions: Question[] = [];
  const errors: string[] = [];
  
  // Tách các câu hỏi bằng khoảng trắng kép hoặc đường kẻ
  const blocks = rawText.split(/\n\s*\n/).filter(block => block.trim() !== "");

  blocks.forEach((block, index) => {
    try {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l !== "");
      
      let section = 'vocabulary';
      let content = '';
      let options = { A: '', B: '', C: '', D: '' };
      let correctAnswer = '';
      let explanation = '';

      lines.forEach(line => {
        if (line.startsWith('SECTION:')) section = line.replace('SECTION:', '').trim().toLowerCase();
        else if (line.startsWith('QUESTION:')) content = line.replace('QUESTION:', '').trim();
        else if (line.startsWith('A:')) options.A = line.replace('A:', '').trim();
        else if (line.startsWith('B:')) options.B = line.replace('B:', '').trim();
        else if (line.startsWith('C:')) options.C = line.replace('C:', '').trim();
        else if (line.startsWith('D:')) options.D = line.replace('D:', '').trim();
        else if (line.startsWith('ANSWER:')) correctAnswer = line.replace('ANSWER:', '').trim().toUpperCase();
        else if (line.startsWith('EXPLANATION:')) explanation = line.replace('EXPLANATION:', '').trim();
      });

      // Validation
      if (!content) throw new Error("Thiếu nội dung câu hỏi (QUESTION:)");
      if (!options.A || !options.B || !options.C || !options.D) throw new Error("Thiếu các đáp án (A:, B:, C:, D:)");
      if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) throw new Error("Đáp án (ANSWER:) phải là A, B, C hoặc D");
      if (!['vocabulary', 'grammar_reading', 'listening'].includes(section)) section = 'vocabulary';

      questions.push({
        id: `q_${Date.now()}_${index}`,
        section: section as any,
        content,
        options,
        correctAnswer: correctAnswer as 'A'|'B'|'C'|'D',
        explanation,
        difficulty: 'medium'
      });
    } catch (error: any) {
      errors.push(`Lỗi ở block thứ ${index + 1}: ${error.message}`);
    }
  });

  return { questions, errors };
};
