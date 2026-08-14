"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JLPTLevel } from "../../../types/vocabulary";
import VocabularyList from "../../../components/VocabularyList";
import { fetchVocabByLevel } from "../../../lib/vocab";
import AdvancedFlashcard from "../../../components/AdvancedFlashcard";
import { Vocabulary } from "../../../types/vocabulary";

export default function LevelPage() {
  // next/app router dynamic param
  // useParams from next/navigation doesn't provide types; we'll get level from URL via window fallback
  const [level, setLevel] = useState<JLPTLevel>("n5");
  const [mode, setMode] = useState<"list" | "flashcard">("flashcard");
  const [items, setItems] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const parts = path.split("/").filter(Boolean);
    const lvl = parts[1] || "n5";
    if (["n5", "n4", "n3", "n2", "n1"].includes(lvl)) {
      setLevel(lvl as JLPTLevel);
    }
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchVocabByLevel(level, 100);
        setItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [level]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">JLPT {level.toUpperCase()} - Vocabulary</h1>
          <div className="text-sm text-gray-500">Tổng: {items.length}</div>
        </div>
        <div className="space-x-2">
          <button onClick={() => setMode("flashcard")} className={`px-4 py-2 rounded ${mode === "flashcard" ? "bg-nvdOrange text-white" : "bg-gray-100"}`}>Flashcard</button>
          <button onClick={() => setMode("list")} className={`px-4 py-2 rounded ${mode === "list" ? "bg-nvdOrange text-white" : "bg-gray-100"}`}>Danh sách</button>
        </div>
      </div>

      {loading ? <div>Đang tải...</div> : null}

      {mode === "list" ? <VocabularyList level={level} /> : <AdvancedFlashcard items={items} />}
    </div>
  );
}
