// FILE: lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Hỗ trợ merge class cho Tailwind (rất cần khi code React components)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Chuyển đổi giây thành format mm:ss cho Timer
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Hàm render Furigana chuẩn HTML Ruby
export function renderRuby(kanjiText: string, furigana: string) {
  // Logic đơn giản: Nếu có cả 2, render thẻ ruby.
  // Trong thực tế, có thể sử dụng Regex để match từng chữ nếu data phức tạp hơn.
  return (
    `<ruby>${kanjiText}<rt>${furigana}</rt></ruby>`
  );
}
