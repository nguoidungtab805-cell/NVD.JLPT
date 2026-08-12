// FILE: app/(student)/practice/[level]/[examId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase/config";
import { Exam, Question } from "../../../../../types";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import QuizEngine from "../../../../../components/shared/QuizEngine";

// Kiểu dữ liệu câu hỏi đã bị tước đáp án để an toàn ở Frontend
export type SecureQuestion = Omit<Question, 'correctAnswer' | 'explanation'>;

export default function ExamTakingPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const level = (params.level as string).toUpperCase();
  
  const [examData, setExamData] = useState<Exam | null>(null);
  const [secureQuestions, setSecureQuestions] = useState<SecureQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examRef = doc(db, "exams", examId);
        const examSnap = await getDoc(examRef);
        
        if (examSnap.exists()) {
          const data = examSnap.data() as Exam;
          setExamData({ id: examSnap.id, ...data });

          // BẢO MẬT: Tước bỏ correctAnswer và explanation trước khi truyền vào state của client
          const sanitizedQuestions = data.questions.map(q => {
            const { correctAnswer, explanation, ...safeQuestion } = q;
            return safeQuestion;
          });
          setSecureQuestions(sanitizedQuestions);
        } else {
          setError("Không tìm thấy đề thi này.");
        }
      } catch (err) {
        console.error("Lỗi khi tải đề thi:", err);
        setError("Lỗi kết nối máy chủ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchExam();
  }, [examId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-jp-orange mb-4" />
        <h2 className="text-xl font-bold text-jp-navy">Đang nạp đề thi...</h2>
        <p className="text-gray-500">Vui lòng chuẩn bị sẵn sàng</p>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-jp-navy mb-2">{error}</h2>
        <Button onClick={() => router.back()} className="mt-4">Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Component QuizEngine xử lý toàn bộ logic làm bài */}
      <QuizEngine 
        exam={examData} 
        questions={secureQuestions} 
      />
    </div>
  );
}
