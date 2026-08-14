"use client";
import React, { useEffect, useState } from "react";
import { fetchVocabByLevel } from "../lib/vocab";
import { Vocabulary, JLPTLevel } from "../types/vocabulary";
import VocabularyCard from "./VocabularyCard";

export default function VocabularyList({ level }: { level: JLPTLevel }) {
  const [items, setItems] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [pageSize] = useState(20);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchVocabByLevel(level, pageSize);
      setItems(res.data);
      setLastDoc(res.lastDoc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!lastDoc) return;
    setLoading(true);
    try {
      const res = await fetchVocabByLevel(level, pageSize, lastDoc);
      setItems((s) => [...s, ...res.data]);
      setLastDoc(res.lastDoc);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return (
    <div>
      {loading && items.length === 0 ? <div>Đang tải...</div> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <VocabularyCard key={it.id} item={it} onOpen={() => { /* navigate handled in parent */ }} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {lastDoc ? <button onClick={loadMore} className="px-4 py-2 bg-gray-100 rounded">Tải thêm</button> : <div className="text-sm text-gray-500">Hết dữ liệu</div>}
      </div>
    </div>
  );
}
