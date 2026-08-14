"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Vocabulary } from "../types/vocabulary";
import FuriganaText from "./FuriganaText";
import { motion } from "framer-motion";
import { useUserProgress } from "../hooks/useUserProgress";

type Props = {
  items: Vocabulary[];
};

function shuffleArray<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AdvancedFlashcard({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [orderKey, setOrderKey] = useState(0);
  const [localList, setLocalList] = useState<Vocabulary[]>(() => items);
  const current = localList[index];
  useEffect(() => {
    setLocalList(items);
    setIndex(0);
    setOrderKey((k) => k + 1);
  }, [items]);

  // per-item progress hook
  const vocabId = current?.id;
  const { progress, loading: progressLoading, setMemorized } = useUserProgress(vocabId);

  function next() {
    setIndex((i) => Math.min(i + 1, localList.length - 1));
  }
  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
  }
  function onShuffle() {
    setLocalList(shuffleArray(localList));
    setIndex(0);
    setOrderKey((k) => k + 1);
  }
  async function mark(bool: boolean) {
    if (!vocabId) return;
    try {
      await setMemorized(bool);
      next();
    } catch (err) {
      console.error(err);
      alert("Bạn cần đăng nhập để lưu tiến độ.");
    }
  }

  const completed = useMemo(() => {
    return localList.filter((it) => false).length;
  }, [localList]);

  if (!current) return <div>Không có dữ liệu.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">Từ {index + 1} / {localList.length}</div>
        <div className="flex items-center space-x-2">
          <button onClick={onShuffle} className="px-3 py-1 border rounded">Shuffle</button>
        </div>
      </div>

      <motion.div
        key={orderKey + "-" + current.id}
        initial={{ rotateY: 0, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center">
          <div className="text-5xl font-bold">
            <FuriganaText kanji={current.word} furigana={current.furigana || ""} />
          </div>
          <div className="text-lg text-gray-700 mt-4">{current.meaning}</div>
          {current.imageUrl && <img src={current.imageUrl} alt={current.word} className="mx-auto mt-4 max-h-48 object-contain" loading="lazy" />}
          {current.audioUrl && (
            <div className="mt-4">
              <audio controls preload="none">
                <source src={current.audioUrl} />
              </audio>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-4 flex items-center justify-between">
        <div className="space-x-2">
          <button onClick={prev} className="px-4 py-2 bg-gray-100 rounded">Previous</button>
          <button onClick={next} className="px-4 py-2 bg-gray-100 rounded">Next</button>
        </div>

        <div className="space-x-2">
          <button onClick={() => mark(false)} className="px-4 py-2 bg-red-100 rounded">Chưa nhớ</button>
          <button onClick={() => mark(true)} className="px-4 py-2 bg-green-100 rounded">Đã nhớ</button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {progressLoading ? "Đang tải tiến độ..." : progress ? `Đã lưu: ${progress.memorized ? "Đã nhớ" : "Chưa nhớ"}` : "Chưa có tiến độ"}
      </div>
    </div>
  );
}
