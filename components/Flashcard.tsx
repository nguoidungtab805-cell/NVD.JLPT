"use client";
import React, { useState } from "react";
import FuriganaText from "./FuriganaText";

type Props = {
  kanji?: string;
  furigana?: string;
  meaning?: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
};

export default function Flashcard({ kanji = "日本", furigana = "にほん", meaning = "Nhật Bản", imageUrl = null, audioUrl = null }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        role="button"
        onClick={() => setFlipped((s) => !s)}
        className={`relative rounded-xl shadow-lg bg-white p-8 h-56 flex flex-col items-center justify-center transform transition-transform duration-300 ${flipped ? "rotate-y-180" : ""}`}
      >
        {!flipped ? (
          <>
            <div className="text-4xl font-semibold mb-2">
              <FuriganaText kanji={kanji} furigana={furigana} />
            </div>
            <div className="text-sm text-gray-500">Ấn để xem nghĩa</div>
          </>
        ) : (
          <>
            <div className="text-xl font-medium">{meaning}</div>
            {imageUrl && <img src={imageUrl} alt={kanji} className="mt-3 max-h-24 object-contain" />}
            {audioUrl && (
              <audio controls className="mt-2">
                <source src={audioUrl} />
                Your browser does not support the audio element.
              </audio>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button className="px-4 py-2 bg-gray-100 rounded">Previous</button>
        <div className="space-x-2">
          <button className="px-3 py-2 bg-green-100 rounded">Đã nhớ</button>
          <button className="px-3 py-2 bg-red-100 rounded">Chưa nhớ</button>
        </div>
        <button className="px-4 py-2 bg-gray-100 rounded">Next</button>
      </div>
    </div>
  );
}
