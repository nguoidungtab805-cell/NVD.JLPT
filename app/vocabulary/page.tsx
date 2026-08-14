import LevelSelector from "../../components/LevelSelector";

export default function VocabularyHome() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Từ vựng JLPT</h1>
      <p className="text-gray-600 mb-6">Chọn cấp độ để bắt đầu học từ vựng theo JLPT.</p>

      <LevelSelector base="/vocabulary" />
    </div>
  );
}
