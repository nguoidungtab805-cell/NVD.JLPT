// FILE: app/(student)/vocabulary/[level]/page.tsx
"use function";
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { Vocabulary, JLPTLevel } from "../../../../types";
import Flashcard from "../../../../components/shared/Flashcard";
import { Button } from "../../../../components/ui/Button";
import { ChevronLeft, ChevronRight, Shuffle, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function VocabularyLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = (params.level as string).toUpperCase() as JLPTLevel;
  
  const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tạm thời lưu trạng thái nhớ/chưa nhớ ở Client.
  // Thực tế sẽ lưu vào user_progress collection ở Firestore
  const [remembered, setRemembered] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const q = query(
          collection(db, "vocabularies"),
          where("level", "==", level)
        );
        const querySnapshot = await getDocs(q);
        const data: Vocabulary[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Vocabulary);
        });
        setVocabList(data);
      } catch (err) {
        console.error("Lỗi tải từ vựng:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (["N5", "N4", "N3", "N2", "N1"].includes(level)) {
      fetchVocab();
    } else {
      setError("Cấp độ JLPT không hợp lệ.");
      setLoading(false);
    }
  }, [level]);

  const handleNext = () => {
    if (currentIndex < vocabList.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleShuffle = () => {
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    setVocabList(shuffled);
    setCurrentIndex(0);
  };

  const markRemembered = (status: boolean) => {
    const currentVocab = vocabList[currentIndex];
    if (!currentVocab.id) return;
    
    setRemembered(prev => {
      const newSet = new Set(prev);
      if (status) newSet.add(currentVocab.id!);
      else newSet.delete(currentVocab.id!);
      return newSet;
    });
    
    // Tự động chuyển thẻ sau khi đánh dấu (tạo cảm giác flow học liên tục)
    setTimeout(() => handleNext(), 300);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-jp-orange mb-4" />
        <p className="text-gray-500">Đang tải dữ liệu từ vựng {level}...</p>
      </div>
    );
  }

  if (error || vocabList.length === 0) {
    return (
      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-jp-navy mb-2">
          {error || `Chưa có dữ liệu từ vựng cho cấp độ ${level}`}
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Hệ thống đang được cập nhật. Vui lòng quay lại sau hoặc chọn cấp độ khác.
        </p>
        <Link href="/vocabulary">
          <Button variant="outline"><ArrowLeft className="mr-2 w-4 h-4" /> Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const currentVocab = vocabList[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / vocabList.length) * 100);

  return (
    <div className="flex-1 bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* Navigation & Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-jp-navy flex items-center gap-1">
              <ArrowLeft size={20} /> <span className="hidden sm:inline">Quay lại</span>
            </button>
            <h1 className="text-2xl font-bold text-jp-navy">Từ vựng JLPT {level}</h1>
            <button onClick={handleShuffle} className="text-jp-orange hover:bg-orange-50 p-2 rounded-lg flex items-center gap-1 transition-colors">
              <Shuffle size={20} /> <span className="hidden sm:inline text-sm font-medium">Trộn thẻ</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 w-12 text-right">
              {currentIndex + 1} / {vocabList.length}
            </span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-jp-orange transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-jp-orange w-10">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Flashcard Area */}
        <div className="mb-10">
          <Flashcard key={currentVocab.id} vocab={currentVocab} />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white"
              onClick={() => markRemembered(false)}
            >
              <XCircle className="w-5 h-5 mr-2" /> Chưa nhớ
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 bg-white"
              onClick={() => markRemembered(true)}
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Đã nhớ
            </Button>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between px-4">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-4 rounded-full bg-white shadow-sm border border-gray-200 text-jp-navy hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            >
              <ChevronLeft size={28} />
            </button>
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
              Chuyển thẻ
            </p>
            <button 
              onClick={handleNext}
              disabled={currentIndex === vocabList.length - 1}
              className="p-4 rounded-full bg-white shadow-sm border border-gray-200 text-jp-navy hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
