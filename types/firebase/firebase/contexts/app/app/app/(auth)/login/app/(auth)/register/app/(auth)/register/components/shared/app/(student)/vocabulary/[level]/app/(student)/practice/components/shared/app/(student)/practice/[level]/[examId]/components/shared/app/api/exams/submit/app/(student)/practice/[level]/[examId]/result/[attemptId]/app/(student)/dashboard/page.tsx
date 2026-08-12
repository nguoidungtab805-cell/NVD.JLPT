// FILE: app/(student)/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { ExamAttempt } from "../../../types";
import { Loader2, TrendingUp, Clock, FileText, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";

export default function StudentDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const [recentAttempts, setRecentAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userProfile?.uid) return;
      try {
        const q = query(
          collection(db, "attempts"),
          where("userId", "==", userProfile.uid),
          // orderBy("completedAt", "desc"), // Cần bật index Firestore nếu sử dụng orderBy kết hợp where
          limit(5)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamAttempt));
        // Sort thủ công ở client nếu chưa setup index
        data.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
        setRecentAttempts(data);
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchHistory();
    }
  }, [userProfile, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-jp-orange" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Welcome Section */}
        <div className="bg-jp-navy rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-jp-orange rounded-full mix-blend-screen opacity-20 transform translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Xin chào, {userProfile?.name}! 🇯🇵</h1>
            <p className="text-gray-300 max-w-lg leading-relaxed">
              Chào mừng bạn trở lại NVD.JLPT. Hãy tiếp tục duy trì thói quen học tập để đạt kết quả tốt nhất trong kỳ thi JLPT sắp tới nhé.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/practice"><Button variant="primary">Luyện đề ngay</Button></Link>
              <Link href="/vocabulary"><Button className="bg-white/10 hover:bg-white/20 text-white">Ôn từ vựng</Button></Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Recent Exams) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-jp-navy flex items-center gap-2">
                <FileText size={20} className="text-jp-orange" /> Bài thi gần đây
              </h2>
            </div>

            {recentAttempts.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-jp-orange w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">Chưa có dữ liệu</h3>
                <p className="text-gray-500 mb-6 text-sm">Bạn chưa thực hiện bài thi nào. Hãy bắt đầu làm đề để hệ thống ghi nhận kết quả nhé!</p>
                <Link href="/practice"><Button variant="outline">Đến trang Luyện thi</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map(attempt => {
                  const date = new Date(attempt.completedAt || 0).toLocaleDateString('vi-VN');
                  const isPass = attempt.score! >= 50; // Giả định >= 50% là Đạt
                  
                  return (
                    <div key={attempt.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-bold text-xs rounded uppercase">{attempt.level}</span>
                          <h4 className="font-bold text-jp-navy text-lg group-hover:text-jp-orange transition-colors">
                            {attempt.examTitle}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                          <Clock size={14} /> Hoàn thành: {date}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Kết quả</p>
                          <p className={cn("text-xl font-black", isPass ? "text-green-500" : "text-red-500")}>
                            {attempt.score}%
                          </p>
                        </div>
                        <Link href={`/practice/${attempt.level.toLowerCase()}/${attempt.examId}/result/${attempt.id}`}>
                          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-jp-orange group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Area (Quick Stats / Progress) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-jp-navy mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Tổng quan
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-gray-600">Từ vựng đã học</span>
                    <span className="text-jp-navy">0 / 1000</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-jp-orange w-0"></div> {/* Data cứng demo */}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-gray-600">Kanji đã học</span>
                    <span className="text-jp-navy">0 / 500</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-jp-red w-0"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-gray-600">Ngữ pháp đã học</span>
                    <span className="text-jp-navy">0 / 200</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-0"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-400 mt-4 italic">* Tính năng biểu đồ chi tiết sẽ được cập nhật thêm.</p>
            </div>
            
            {/* Quick Links */}
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
              <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                <BookOpen size={18} /> Phím tắt ôn tập
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/kanji" className="text-orange-700 hover:underline hover:font-bold transition-all">→ Học Kanji N5</Link></li>
                <li><Link href="/grammar" className="text-orange-700 hover:underline hover:font-bold transition-all">→ Ôn Ngữ pháp cơ bản</Link></li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
