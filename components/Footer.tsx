"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold text-xl">NVD.JLPT</div>
          <div className="text-sm text-gray-600">Học đúng nền tảng – Luyện đúng trọng tâm – Chinh phục JLPT.</div>
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-700">Trang chủ</Link>
          <Link href="/vocabulary" className="text-gray-700">Từ vựng</Link>
          <Link href="/grammar" className="text-gray-700">Ngữ pháp</Link>
          <Link href="/kanji" className="text-gray-700">Kanji</Link>
          <Link href="/tests" className="text-gray-700">Luyện thi</Link>
        </div>
        <div className="text-sm text-gray-500">
          <div>© {new Date().getFullYear()} NVD.JLPT</div>
          <div className="mt-2"><Link href="/privacy" className="text-gray-600">Chính sách bảo mật</Link></div>
        </div>
      </div>
    </footer>
  );
}
