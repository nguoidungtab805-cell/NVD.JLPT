import "./styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../providers/AuthProvider";

export const metadata = {
  title: "NVD.JLPT – Luyện thi JLPT N5-N1",
  description: "NVD.JLPT – Học đúng nền tảng, luyện đúng trọng tâm, tự tin chinh phục JLPT N5–N1."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
