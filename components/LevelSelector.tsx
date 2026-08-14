"use client";
import React from "react";
import Link from "next/link";

const levels = [
  { key: "n5", label: "N5", jp: "初級", color: "bg-orange-100" },
  { key: "n4", label: "N4", jp: "初級", color: "bg-yellow-100" },
  { key: "n3", label: "N3", jp: "中級", color: "bg-blue-100" },
  { key: "n2", label: "N2", jp: "上級", color: "bg-indigo-100" },
  { key: "n1", label: "N1", jp: "最上級", color: "bg-red-100" }
];

export default function LevelSelector({ base = "/vocabulary" }: { base?: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {levels.map((l) => (
        <Link key={l.key} href={`${base}/${l.key}`} className={`p-4 rounded-lg shadow-sm flex flex-col items-center justify-center hover:scale-105 transition ${l.color}`}>
          <div className="text-lg font-bold">{l.label}</div>
          <div className="text-xs text-gray-600">{l.jp}</div>
        </Link>
      ))}
    </div>
  );
}
