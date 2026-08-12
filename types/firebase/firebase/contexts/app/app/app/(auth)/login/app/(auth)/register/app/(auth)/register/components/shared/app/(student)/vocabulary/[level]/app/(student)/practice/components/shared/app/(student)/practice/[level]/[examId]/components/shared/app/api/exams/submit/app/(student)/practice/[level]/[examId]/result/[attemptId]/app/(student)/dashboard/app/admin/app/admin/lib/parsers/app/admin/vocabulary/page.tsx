// FILE: app/admin/vocabulary/page.tsx
"use client";

import React, { useState } from "react";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { parseVocabularyFile } from "../../../lib/parsers/fileParser";
import { Button } from "../../../components/ui/Button";
import { JLPTLevel } from "../../../types";
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminVocabularyPage() {
  const [level, setLevel] = useState<JLPTLevel>("N5");
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });

  // Xử lý khi chọn file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsParsing(true);
    setStatusMsg({ type: "", msg: "" });

    const result = await parseVocabularyFile(selectedFile);
    if (result.errors.length > 0) {
      setStatusMsg({ type: "error", msg: result.errors[0] });
    } else {
      // Yêu cầu các cột trong file CSV/Excel phải là: Kanji, Furigana, Meaning, Example
      setPreviewData(result.data);
    }
    setIsParsing(false);
  };

  // Upload lên Firestore
  const handleImport = async () => {
    if (previewData.length === 0) return;
    setIsUploading(true);
    setStatusMsg({ type: "", msg: "" });

    try {
      const batch = writeBatch(db);
      
      previewData.forEach((item) => {
        // Validation cơ bản
        if (!item.Kanji || !item.Meaning) return; 

        const docRef = doc(collection(db, "vocabularies"));
        batch.set(docRef, {
          level: level,
          kanji: item.Kanji || "",
          furigana: item.Furigana || "",
          meaning: item.Meaning || "",
          example: item.Example || "",
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      });

      await batch.commit();
      setStatusMsg({ type: "success", msg: `Import thành công ${previewData.length} từ vựng vào cấp độ ${level}!` });
      setPreviewData([]);
      setFile(null);
      // Reset input file
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error: any) {
      console.error("Lỗi Import:", error);
      setStatusMsg({ type: "error", msg: "Lỗi import vào Database: " + error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-jp-navy">Quản lý Từ vựng</h1>
      </div>

      {/* Khu vực Import */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-jp-navy mb-4">Import hàng loạt (CSV, XLSX)</h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn Cấp Độ</label>
            <select 
              className="w-full h-11 border border-gray-300 rounded-lg px-4 outline-none focus:border-jp-orange"
              value={level}
              onChange={(e) => setLevel(e.target.value as JLPTLevel)}
            >
              {["N5", "N4", "N3", "N2", "N1"].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="w-full md:w-2/4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File (Cột: Kanji, Furigana, Meaning, Example)</label>
            <input 
              id="file-upload"
              type="file" 
              accept=".csv, .xlsx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-jp-orange hover:file:bg-orange-100"
            />
          </div>

          <div className="w-full md:w-1/4 flex gap-2">
            <Button 
              className="w-full" 
              onClick={handleImport} 
              disabled={previewData.length === 0 || isUploading}
              isLoading={isUploading}
            >
              <UploadCloud className="mr-2" size={20} /> Xác nhận Import
            </Button>
          </div>
        </div>

        {statusMsg.msg && (
          <div className={cn("mt-4 p-4 rounded-lg flex items-center gap-2", statusMsg.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
            {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {statusMsg.msg}
          </div>
        )}
      </div>

      {/* Preview Table */}
      {isParsing ? (
        <div className="py-10 text-center text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Đang đọc file...</div>
      ) : previewData.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Preview Dữ liệu ({previewData.length} dòng)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 border-b">STT</th>
                  <th className="px-6 py-3 border-b">Kanji</th>
                  <th className="px-6 py-3 border-b">Furigana</th>
                  <th className="px-6 py-3 border-b">Nghĩa (Meaning)</th>
                  <th className="px-6 py-3 border-b">Ví dụ (Example)</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 50).map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-jp-navy">{row.Kanji || <span className="text-red-400">Thiếu</span>}</td>
                    <td className="px-6 py-4">{row.Furigana}</td>
                    <td className="px-6 py-4">{row.Meaning || <span className="text-red-400">Thiếu</span>}</td>
                    <td className="px-6 py-4 text-gray-500">{row.Example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 50 && <div className="p-4 text-center text-gray-500 text-sm">Chỉ hiển thị tối đa 50 dòng đầu tiên...</div>}
          </div>
        </div>
      ) : null}

    </div>
  );
}
