"use client";
import React from "react";
import FuriganaText from "./FuriganaText";
import { Vocabulary } from "../types/vocabulary";

export default function VocabularyCard({ item, onOpen }: { item: Vocabulary; onOpen?: (v: Vocabulary) => void }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.word} className="object-contain w-full h-full" loading="lazy" />
          ) : (
            <div className="text-gray-400">No image</div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold">
            <FuriganaText kanji={item.word} furigana={item.furigana || ""} />
          </div>
          <div className="text-sm text-gray-600 mt-1">{item.meaning}</div>
          {item.example && <div className="text-xs text-gray-500 mt-2">{item.example}</div>}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <button onClick={() => onOpen && onOpen(item)} className="px-3 py-1 bg-nvdOrange text-white rounded">Học</button>
        </div>
      </div>
    </div>
  );
}
