// FILE: components/layout/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-jp-navy text-gray-300 py-10 mt-auto">
      <div className="container mx-auto px-4 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            NVD.<span className="text-jp-orange">JLPT</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Nền tảng học tiếng Nhật và luyện thi JLPT hàng đầu, giúp bạn chinh phục mục tiêu ngoại ngữ một cách khoa học và hiệu quả.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Khám phá</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/vocabulary" className="hover:text-jp-orange transition-colors">Từ vựng</a></li>
            <li><a href="/grammar" className="hover:text-jp-orange transition-colors">Ngữ pháp</a></li>
            <li><a href="/kanji" className="hover:text-jp-orange transition-colors">Kanji</a></li>
            <li><a href="/practice" className="hover:text-jp-orange transition-colors">Luyện thi JLPT</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Liên hệ</h4>
          <p className="text-sm mb-2">Email: contact@nvdjlpt.com</p>
          <p className="text-sm">Đại học FPT Cần Thơ</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-sm text-center">
        &copy; {new Date().getFullYear()} NVD.JLPT. All rights reserved.
      </div>
    </footer>
  );
}
