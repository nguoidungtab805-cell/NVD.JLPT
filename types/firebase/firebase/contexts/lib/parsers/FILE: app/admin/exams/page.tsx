// FILE: app/admin/exams/page.tsx
"use client";

import React, { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Exam, JLPTLevel, ExamType, Question } from "../../../types";
import { parseRawExamText } from "../../../lib/parsers/examParser";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Save, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function AdminExamsPage() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<JLPTLevel>("N5");
  const [type, setType] = useState<ExamType>("small_test");
  const [duration, setDuration] = useState("30");
  
  const [rawText, setRawText] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });

  const handleParse = () => {
    setStatusMsg({ type: "", msg: "" });
    const { questions, errors } = parseRawExamText(rawText);
    setParsedQuestions(questions);
    setParseErrors(errors);
  };

  const handleSaveExam = async () => {
    if (!title || parsedQuestions.length === 0) {
      setStatusMsg({ type: "error", msg: "Vui lòng nhập tên đề và đảm bảo có ít nhất 1 câu hỏi." });
      return;
    }

    setIsSaving(true);
    setStatusMsg({ type: "", msg: "" });

    try {
      const examRef = doc(collection(db, "exams"));
      const newExam: Exam = {
        title,
        level,
        type,
        durationMinutes: parseInt(duration) || 30,
        totalQuestions: parsedQuestions.length,
        questions: parsedQuestions, // Lưu toàn bộ câu hỏi vào trong array của Document
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await setDoc(examRef, newExam);
      
      setStatusMsg({ type: "success", msg: "Lưu đề thi thành công!" });
      // Reset form
      setTitle("");
      setRawText("");
      setParsedQuestions([]);
    } catch (error: any) {
      console.error("Lỗi khi lưu đề thi:", error);
      setStatusMsg({ type: "error", msg: "Lỗi lưu Database: " + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-jp-navy mb-6">Trình Soạn Thảo Đề Thi</h1>

      {statusMsg.msg && (
        <div className={cn("mb-6 p-4 rounded-lg flex items-center gap-2 font-medium", statusMsg.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
          {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {statusMsg.msg}
        </div>
      )}

      {/* Thông tin chung */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input label="Tên đề thi" placeholder="VD: Đề thi thử JLPT N5 - Tháng 12/2026" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cấp độ</label>
          <select className="w-full h-12 border border-gray-300 rounded-lg px-4" value={level} onChange={(e) => setLevel(e.target.value as JLPTLevel)}>
            {["N5", "N4", "N3", "N2", "N1"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loại bài</label>
          <select className="w-full h-12 border border-gray-300 rounded-lg px-4" value={type} onChange={(e) => setType(e.target.value as ExamType)}>
            <option value="small_test">Kiểm tra nhỏ</option>
            <option value="semester_exam">Thi học kỳ</option>
            <option value="jlpt_mock">Thi thử JLPT</option>
          </select>
        </div>
        <div>
          <Input label="Thời gian (phút)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
      </div>

      {/* Khu vực Paste dữ liệu thô */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-jp-navy">Soạn thảo nhanh (Raw Text)</h2>
          <Button variant="outline" size="sm" onClick={handleParse}>
            <RefreshCw size={16} className="mr-2" /> Phân tích dữ liệu
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">
          Cú pháp bắt buộc cho mỗi câu (các câu cách nhau bằng 1 dòng trống):<br/>
          <code className="bg-gray-100 px-2 py-1 rounded text-jp-orange font-mono">
            SECTION: vocabulary<br/>
            QUESTION: Nội dung câu hỏi...<br/>
            A: Lựa chọn A<br/>
            B: Lựa chọn B<br/>
            C: Lựa chọn C<br/>
            D: Lựa chọn D<br/>
            ANSWER: B<br/>
            EXPLANATION: Giải thích chi tiết...
          </code>
        </p>

        <textarea 
          className="w-full h-64 border border-gray-300 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-jp-orange transition-colors"
          placeholder="Dán nội dung đề thi của bạn vào đây..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        
        {parseErrors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            <p className="font-bold mb-1">Cảnh báo lỗi cú pháp:</p>
            <ul className="list-disc pl-5 space-y-1">
              {parseErrors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Khu vực Preview */}
      {parsedQuestions.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-jp-navy">Xem trước ({parsedQuestions.length} câu)</h2>
            <Button onClick={handleSaveExam} isLoading={isSaving} className="bg-green-600 hover:bg-green-700">
              <Save size={18} className="mr-2" /> Lưu lên hệ thống
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar p-2">
            {parsedQuestions.map((q, idx) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-jp-navy text-sm">Câu {idx + 1} ({q.section})</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Đáp án: {q.correctAnswer}</span>
                </div>
                <p className="font-medium mb-3">{q.content}</p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div className={cn("p-2 rounded border", q.correctAnswer === 'A' ? "bg-green-50 border-green-200" : "bg-white")}>A. {q.options.A}</div>
                  <div className={cn("p-2 rounded border", q.correctAnswer === 'B' ? "bg-green-50 border-green-200" : "bg-white")}>B. {q.options.B}</div>
                  <div className={cn("p-2 rounded border", q.correctAnswer === 'C' ? "bg-green-50 border-green-200" : "bg-white")}>C. {q.options.C}</div>
                  <div className={cn("p-2 rounded border", q.correctAnswer === 'D' ? "bg-green-50 border-green-200" : "bg-white")}>D. {q.options.D}</div>
                </div>
                {q.explanation && <p className="text-xs text-gray-500 italic border-t pt-2 mt-2">Giải thích: {q.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
