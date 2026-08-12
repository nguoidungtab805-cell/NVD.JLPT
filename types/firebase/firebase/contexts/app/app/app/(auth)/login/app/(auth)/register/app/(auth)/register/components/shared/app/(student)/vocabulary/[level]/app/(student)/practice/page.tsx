// FILE: app/(student)/practice/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Exam, JLPTLevel } from "../../../types";
import { Button } from "../../../components/ui/Button";
import { Clock, FileText, Loader2, Award } from "lucide-react";
import { cn } from "../../../lib/utils";

const LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export default function PracticeListPage() {
  const [activeLevel, setActiveLevel] = useState<JLPTLevel>("N5");
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "exams"),
          where("level", "==", activeLevel),
          // Nếu có index trên firestore, có thể thêm orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data: Exam[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Exam);
        });
        setExams(data);
      } catch (error) {
        console.error("Lỗi tải danh sách đề thi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [activeLevel]);

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-jp-navy mb-4">Luyện Thi JLPT</h1>
          <p className="text-gray-500">Chọn cấp độ để bắt đầu làm các bài thi thử với thời gian thực.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm w-fit mx-auto border border-gray-100">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={cn(
                "px-6 py-2 rounded-lg font-semibold transition-all duration-300",
                activeLevel === lvl 
                  ? "bg-jp-orange text-white shadow-md" 
                  : "text-gray-500 hover:bg-orange-50 hover:text-jp-orange"
              )}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Exam List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-jp-orange mb-4" />
            <p className="text-gray-500">Đang tải danh sách đề thi {activeLevel}...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-jp-navy mb-2">Chưa có đề thi</h3>
            <p className="text-gray-500">Hiện tại chưa có đề thi nào cho cấp độ {activeLevel}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-jp-navy group-hover:text-jp-orange transition-colors">
                    {exam.title}
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                    {exam.type === 'jlpt_mock' ? 'JLPT Mock' : exam.type === 'small_test' ? 'Small Test' : 'Học kỳ'}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-jp-orange" />
                    <span>{exam.durationMinutes} phút</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText size={16} className="text-blue-500" />
                    <span>{exam.totalQuestions} câu</span>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Award size={18} className="text-gray-400" />
                    <span>Chưa làm</span> {/* Có thể fetch history để update sau */}
                  </div>
                  <Link href={`/practice/${activeLevel.toLowerCase()}/${exam.id}`}>
                    <Button variant="primary" size="sm">Bắt đầu thi</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
