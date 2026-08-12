// FILE: app/layout.tsx
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css"; // Hãy chắc chắn bạn đã tạo file này khi init Next.js (có chứa cấu hình tailwind cơ bản)
import { AuthProvider } from "../contexts/AuthContext";

// Sử dụng font Noto Sans JP để hiển thị chữ Kanji, Hiragana, Katakana đẹp và chuẩn xác nhất
const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "700"] 
});

export const metadata: Metadata = {
  title: "NVD.JLPT - Học đúng nền tảng, Luyện đúng phương pháp",
  description: "Nền tảng học tiếng Nhật và luyện thi JLPT từ N5 đến N1, giúp người học xây dựng vốn từ vựng, nắm chắc ngữ pháp, chinh phục Kanji và luyện tập đề thi theo từng cấp độ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${notoSansJP.className} text-jp-navy bg-jp-cream min-h-screen flex flex-col`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
