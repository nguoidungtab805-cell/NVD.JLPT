// FILE: app/(student)/practice/[level]/[examId]/result/[attemptId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../../../firebase/config";
import { Exam, ExamAttempt, Question } from "../../../../../../../types";
import { Button } from "../../../../../../../components/ui/Button";
import { Loader2, CheckCircle, XCircle, ArrowLeft, RotateCcw, Target, Clock, BookOpen } from "lucide-react";
import { cn, formatTime } from "../../../../../../../lib/utils";

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const attemptId = params.attemptId as string;
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        const [examSnap, attemptSnap] = await Promise.all([
          getDoc(doc(db, "exams", examId)),
          getDoc(doc(db, "attempts", attemptId))
        ]);

        if (examSnap.exists() && attemptSnap.exists()) {
          setExam({ id: examSnap.id, ...examSnap.data() } as Exam);
          setAttempt({ id: attemptSnap.id, ...attemptSnap.data() } as ExamAttempt);
        }
      } catch (error) {
        console.error("Lỗi tải kết quả thi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (examId && attemptId) fetchResultData();
  }, [examId, attemptId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-12 h-12 animate-spin text-jp-orange mb-4" />
        <p className="text-gray-500">Đang phân tích kết quả bài làm...</p>
      </div>
    );
  }

  if (!exam || !attempt) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-jp-red mb-4">Không tìm thấy kết quả.</p>
        <Button onClick={() => router.push("/practice")}>Về danh sách đề</Button>
      </div>
    );
  }

  const timeTakenSeconds = Math.floor((attempt.completedAt! - attempt.startedAt) / 1000);
  const scoreColor = attempt.score! >= 80 ? "text-green-500" : attempt.score! >= 50 ? "text-orange-500" : "text-red-500";

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header Navigation */}
        <button onClick={() => router.push("/practice")} className="flex items-center gap-2 text-gray-500 hover:text-jp-navy mb-6 font-medium transition-colors">
          <ArrowLeft size={20} /> Về danh sách đề thi
        </button>

        {/* Tổng quan kết quả (Overview Card) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
          <h1 className="text-2xl font-bold text-jp-navy mb-2">Báo Cáo Kết Quả</h1>
          <p className="text-gray-500 mb-8">{exam.title} - Cấp độ {exam.level}</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-8 border-gray-50 flex items-center justify-center relative mb-3">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="60" cy="60" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gray-100" />
                  <circle 
                    cx="60" cy="60" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" 
                    className={scoreColor}
                    strokeDasharray={351} 
                    strokeDashoffset={351 - (351 * attempt.score!) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={cn("text-3xl font-extrabold", scoreColor)}>{attempt.score}%</span>
              </div>
              <span className="font-bold text-gray-600 uppercase tracking-wide text-sm">Điểm số</span>
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-10 text-left">
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Target size={18} /> <span className="text-sm font-medium">Số câu đúng</span>
                </div>
                <p className="text-2xl font-bold text-jp-navy">{attempt.correctCount} <span className="text-base text-gray-400 font-normal">/ {attempt.totalQuestions}</span></p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Clock size={18} /> <span className="text-sm font-medium">Thời gian</span>
                </div>
                <p className="text-2xl font-bold text-jp-navy">{formatTime(timeTakenSeconds)}</p>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <BookOpen size={18} /> <span className="text-sm font-medium">Chi tiết từng phần</span>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">Từ vựng: {attempt.sectionScores?.vocabulary || 0}</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Ngữ pháp: {attempt.sectionScores?.grammar_reading || 0}</span>
                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">Nghe: {attempt.sectionScores?.listening || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="gap-2" onClick={() => router.push(`/practice/${exam.level.toLowerCase()}/${exam.id}`)}>
              <RotateCcw size={18} /> Làm lại đề này
            </Button>
          </div>
        </div>

        {/* Chi tiết từng câu (Review Answers) */}
        <h3 className="text-xl font-bold text-jp-navy mb-6">Chi tiết bài làm</h3>
        <div className="space-y-6">
          {exam.questions.map((q, index) => {
            const userAnswer = attempt.answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            const isSkipped = !userAnswer;

            return (
              <div key={q.id} className={cn(
                "bg-white p-6 rounded-2xl border-l-4 shadow-sm",
                isCorrect ? "border-green-500" : isSkipped ? "border-gray-400" : "border-red-500"
              )}>
                <div className="flex gap-4 mb-4">
                  <div className="shrink-0 mt-1">
                    {isCorrect ? <CheckCircle className="text-green-500" /> : isSkipped ? <div className="w-6 h-6 rounded-full border-2 border-gray-400 bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">-</div> : <XCircle className="text-red-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-500 text-sm mb-1">Câu {index + 1} <span className="uppercase text-xs ml-2 px-2 py-0.5 bg-gray-100 rounded">{q.section.replace('_', ' ')}</span></p>
                    <p className="text-lg text-jp-navy font-medium whitespace-pre-wrap">{q.content}</p>
                    {q.imageUrl && <img src={q.imageUrl} alt="Image" className="mt-3 max-h-48 rounded-lg" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10 mb-4">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const isSelected = userAnswer === opt;
                    const isActualCorrect = q.correctAnswer === opt;
                    
                    return (
                      <div key={opt} className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 transition-colors",
                        isActualCorrect ? "border-green-500 bg-green-50" :
                        isSelected && !isCorrect ? "border-red-500 bg-red-50" : "border-gray-100 bg-gray-50"
                      )}>
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          isActualCorrect ? "bg-green-500" :
                          isSelected && !isCorrect ? "bg-red-500" : "bg-gray-300 text-gray-600"
                        )}>
                          {opt}
                        </span>
                        <span className={cn(
                          "text-sm font-medium",
                          isActualCorrect ? "text-green-700" :
                          isSelected && !isCorrect ? "text-red-700" : "text-gray-600"
                        )}>
                          {q.options[opt as keyof typeof q.options]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="ml-10 bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
                    <span className="font-bold mr-2">Giải thích:</span> 
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
