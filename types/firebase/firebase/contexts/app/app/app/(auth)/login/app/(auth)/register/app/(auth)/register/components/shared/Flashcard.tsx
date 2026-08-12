// FILE: components/shared/Flashcard.tsx
"use client";

import React, { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Volume2, RotateCw } from "lucide-react";
import { Vocabulary } from "../../types";

interface FlashcardProps {
  vocab: Vocabulary;
}

export default function Flashcard({ vocab }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Xử lý phát âm thanh
  const playAudio = (e: MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ làm lật thẻ
    if (vocab.audioUrl) {
      const audio = new Audio(vocab.audioUrl);
      audio.play().catch((err) => console.error("Lỗi phát audio:", err));
    }
  };

  return (
    <div 
      className="relative w-full max-w-md h-96 mx-auto cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative rounded-2xl shadow-lg ring-1 ring-gray-100"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* ================= MẶT TRƯỚC ================= */}
        <div 
          className="absolute inset-0 w-full h-full bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Pattern trang trí góc */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full opacity-50"></div>
          
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <ruby className="text-6xl font-bold text-jp-navy mb-4 font-jp tracking-widest">
              {vocab.kanji}
              <rt className="text-xl text-jp-orange font-normal tracking-normal mb-1">
                {vocab.furigana}
              </rt>
            </ruby>
          </div>

          <div className="w-full flex justify-between items-center mt-auto border-t border-gray-100 pt-4">
            <button 
              onClick={playAudio}
              disabled={!vocab.audioUrl}
              className="p-3 rounded-full text-gray-400 hover:text-jp-orange hover:bg-orange-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Nghe phát âm"
            >
              <Volume2 size={24} />
            </button>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <RotateCw size={16} />
              <span>Chạm để lật</span>
            </div>
          </div>
        </div>

        {/* ================= MẶT SAU ================= */}
        <div 
          className="absolute inset-0 w-full h-full bg-jp-cream rounded-2xl p-8 flex flex-col backface-hidden border-2 border-jp-orange"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <h3 className="text-2xl font-bold text-jp-navy mb-4 text-center border-b border-gray-200 pb-4">
              {vocab.meaning}
            </h3>
            
            {vocab.imageUrl && (
              <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <img src={vocab.imageUrl} alt={vocab.meaning} className="max-h-full object-contain" />
              </div>
            )}

            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-orange-100 flex-1">
              <p className="text-sm font-semibold text-gray-500 mb-1">Ví dụ:</p>
              <p className="text-lg text-jp-navy mb-2">{vocab.example}</p>
              {vocab.exampleTranslation && (
                <p className="text-sm text-gray-600 italic">"{vocab.exampleTranslation}"</p>
              )}
            </div>
          </div>

          <div className="w-full flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
            <button 
              onClick={playAudio}
              disabled={!vocab.audioUrl}
              className="p-3 rounded-full text-gray-400 hover:text-jp-orange hover:bg-orange-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
