"use client";
import React from "react";

export default function ProgressBar({ value = 0, max = 100 }: { value?: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full">
      <div className="w-full h-3 bg-gray-200 rounded">
        <div className="h-3 bg-nvdOrange rounded" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-gray-600 mt-1">{value}/{max} ({pct}%)</div>
    </div>
  );
}
