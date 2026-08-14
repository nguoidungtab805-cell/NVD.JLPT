import Link from "next/link";
import LevelSelector from "../components/LevelSelector";
import Flashcard from "../components/Flashcard";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-nvdOrange font-semibold">NVD.JLPT</div>
          <h1 className="text-4xl md:text-5xl font-bold mt-4">「日本語を学び、JLPTを超える。」</h1>
          <p className="mt-4 text-gray-700">Học tiếng Nhật mỗi ngày – Chinh phục JLPT từng bước.</p>
          <div className="mt-6 flex space-x-4">
            <Link href="/vocabulary" className="px-6 py-3 bg-nvdOrange text-white rounded-md">Bắt đầu học</Link>
            <Link href="/tests" className="px-6 py-3 border border-nvdOrange text-nvdOrange rounded-md">Luyện thi ngay</Link>
          </div>
          <div className="mt-8">
            <LevelSelector base="/vocabulary" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Illustration placeholder */}
          <div className="w-full max-w-sm">
            <div className="bg-gradient-to-br from-pink-50 to-indigo-50 rounded-xl p-6 shadow-lg">
              <div className="h-56 flex items-center justify-center">
                <img src="/images/hero-illustration.png" alt="hero" className="max-h-48 object-contain" />
              </div>
            </div>
          </div>

          <div className="w-full mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card hover:scale-105 transition">
                <div className="text-xl font-bold text-nvdOrange">TỪ VỰNG</div>
                <div className="text-sm text-gray-600 mt-2">Học từ vựng qua flashcard, hình ảnh, furigana và phát âm.</div>
              </div>
              <div className="card hover:scale-105 transition">
                <div className="text-xl font-bold text-emerald-600">NGỮ PHÁP</div>
                <div className="text-sm text-gray-600 mt-2">Hiểu cấu trúc ngữ pháp và luyện tập qua ví dụ thực tế.</div>
              </div>
              <div className="card hover:scale-105 transition">
                <div className="text-xl font-bold text-red-600">KANJI</div>
                <div className="text-sm text-gray-600 mt-2">Ghi nhớ Kanji bằng âm On, Kun, ý nghĩa và ví dụ.</div>
              </div>
              <div className="card hover:scale-105 transition">
                <div className="text-xl font-bold text-indigo-600">LUYỆN THI</div>
                <div className="text-sm text-gray-600 mt-2">Luyện đề JLPT N5–N1 với đồng hồ và hệ thống chấm điểm tự động.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example flashcard preview */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Ví dụ Flashcard</h2>
        <p className="text-sm text-gray-500">Ấn vào card để lật và xem nghĩa.</p>
        <div className="mt-6">
          <Flashcard kanji="日本" furigana="にほん" meaning="Nhật Bản" />
        </div>
      </section>
    </div>
  );
}
