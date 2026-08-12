// FILE: components/shared/QuizEngine.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Exam, Question } from "../../types";
import { SecureQuestion } from "../../app/(student)/practice/[level]/[examId]/page";
import Timer from "./Timer";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Menu, X, Volume2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface QuizEngineProps {
  exam: Exam;
  questions: SecureQuestion[];
}

export default function QuizEngine({ exam, questions }: QuizEngineProps) {
  const { currentUser } = useAuth();
  const router = useRouter();

  // States
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'vocabulary' | 'grammar_reading' | 'listening'>('vocabulary');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Phân loại câu hỏi theo section
  const sectionQuestions = {
    vocabulary: questions.filter(q => q.section === 'vocabulary'),
    grammar_reading: questions.filter(q => q.section === 'grammar_reading'),
    listening: questions.filter(q => q.section === 'listening'),
  };

  // Khôi phục đáp án đang làm dở từ Local Storage
  useEffect(() => {
    const draft = localStorage.getItem(`draft_${exam.id}`);
    if (draft) {
      try {
        setAnswers(JSON.parse(draft));
      } catch (e) {
        console.error("Lỗi đọc draft:", e);
      }
    }
  }, [exam.id]);

  // Lưu đáp án vào Local Storage mỗi khi có thay đổi
  const handleSelectAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    localStorage.setItem(`draft_${exam.id}`, JSON.stringify(newAnswers));
  };

  const unansweredCount = questions.length - Object.keys(answers).length;

  const handleSubmit = useCallback(async () => {
    if (!currentUser) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          userId: currentUser.uid,
          answers: answers,
          startedAt: Date.now() - (exam.durationMinutes * 60 * 1000), // Ước tính
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        localStorage.removeItem(`draft_${exam.id}`);
        // Chuyển hướng sang trang kết quả (sẽ xây dựng ở phần sau)
        router.push(`/practice/${exam.level.toLowerCase()}/${exam.id}/result/${result.attemptId}`);
      } else {
        alert("Có lỗi khi nộp bài: " + result.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Lỗi nộp bài:", error);
      alert("Lỗi mạng. Không thể nộp bài lúc này.");
      setIsSubmitting(false);
    }
  }, [currentUser, exam, answers, router]);

  // Cảnh báo thời gian
  const handleTimeWarning = (minutesLeft: number) => {
    // Có thể dùng thư viện toast (react-hot-toast) ở đây để thông báo
    console.warn(`Chỉ còn ${minutesLeft} phút!`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden pt-20">
      {/* Sidebar Navigation (Desktop & Mobile) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 pt-20 md:pt-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-jp-navy">Tiến độ làm bài</h3>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {(['vocabulary', 'grammar_reading', 'listening'] as const).map(section => (
            <div key={section} className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {section === 'vocabulary' ? '① Từ vựng' : section === 'grammar_reading' ? '② Ngữ pháp + Đọc' : '③ Nghe'}
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {sectionQuestions[section].map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setActiveSection(section);
                        document.getElementById(`question-${q.id}`)?.scrollIntoView({ behavior: 'smooth' });
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        "h-10 rounded-md font-medium text-sm flex items-center justify-center transition-colors border",
                        isAnswered ? "bg-jp-orange text-white border-jp-orange" : "bg-white text-gray-500 border-gray-200 hover:border-jp-orange"
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <Button 
            className="w-full" 
            onClick={() => setShowSubmitModal(true)}
            variant={unansweredCount === 0 ? "primary" : "secondary"}
          >
            Nộp bài
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            <h2 className="font-bold text-jp-navy text-lg hidden sm:block">{exam.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Timer 
              initialSeconds={exam.durationMinutes * 60} 
              onTimeUp={() => handleSubmit()} 
              onWarning={handleTimeWarning}
            />
          </div>
        </header>

        {/* Section Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 flex gap-6 overflow-x-auto shrink-0">
          {(['vocabulary', 'grammar_reading', 'listening'] as const).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={cn(
                "py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors",
                activeSection === section 
                  ? "border-jp-orange text-jp-orange" 
                  : "border-transparent text-gray-500 hover:text-jp-navy"
              )}
            >
              {section === 'vocabulary' ? '① Từ vựng' : section === 'grammar_reading' ? '② Ngữ pháp & Đọc' : '③ Nghe'}
            </button>
          ))}
        </div>

        {/* Questions Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">
            {sectionQuestions[activeSection].map((q, index) => (
              <div key={q.id} id={`question-${q.id}`} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-jp-orange font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-jp-navy whitespace-pre-wrap font-medium">{q.content}</p>
                    {q.imageUrl && (
                      <img src={q.imageUrl} alt="Question image" className="mt-4 max-w-full rounded-lg max-h-64 object-contain bg-gray-50" />
                    )}
                    {q.audioUrl && (
                      <div className="mt-4 flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                        <Volume2 className="text-gray-400" />
                        <audio controls controlsList="nodownload" className="h-10 w-full max-w-xs">
                          <source src={q.audioUrl} type="audio/mpeg" />
                        </audio>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <label 
                      key={opt}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        answers[q.id] === opt 
                          ? "border-jp-orange bg-orange-50" 
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      )}
                    >
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleSelectAnswer(q.id, opt)}
                        className="hidden"
                      />
                      <span className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                        answers[q.id] === opt ? "border-jp-orange text-jp-orange" : "border-gray-300 text-gray-400"
                      )}>
                        {opt}
                      </span>
                      <span className="text-gray-700">{q.options[opt as keyof typeof q.options]}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-200">
            {unansweredCount > 0 ? (
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-jp-navy mb-2">Xác nhận nộp bài</h3>
            
            {unansweredCount > 0 ? (
              <p className="text-gray-500 mb-6">
                Bạn còn <span className="font-bold text-jp-red">{unansweredCount}</span> câu chưa trả lời. Bạn có chắc chắn muốn nộp bài bây giờ không?
              </p>
            ) : (
              <p className="text-gray-500 mb-6">
                Bạn đã hoàn thành tất cả câu hỏi. Sẵn sàng xem kết quả chưa?
              </p>
            )}

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowSubmitModal(false)} disabled={isSubmitting}>
                Kiểm tra lại
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleSubmit} isLoading={isSubmitting}>
                Nộp bài ngay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
