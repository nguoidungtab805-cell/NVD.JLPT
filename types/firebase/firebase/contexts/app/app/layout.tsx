// FILE: app/layout.tsx
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "700"] 
});

export const metadata: Metadata = {
  title: "NVD.JLPT - Học đúng nền tảng, Luyện đúng phương pháp",
  description: "Nền tảng học tiếng Nhật và luyện thi JLPT.",
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
          <Header />
          {/* Main chứa nội dung thay đổi giữa các trang */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
