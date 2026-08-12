// FILE: app/api/exams/submit/route.ts
import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { Exam, Question, ExamAttempt } from '../../../../types';

// Khởi tạo Firebase Admin an toàn
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Cần replace \n trong private key khi đọc từ env
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examId, userId, answers, startedAt } = body;

    if (!examId || !userId || !answers) {
      return NextResponse.json({ error: "Thiếu dữ liệu đầu vào" }, { status: 400 });
    }

    // 1. Fetch đề thi GỐC từ server (chứa correctAnswer)
    const examRef = db.collection('exams').doc(examId);
    const examSnap = await examRef.get();

    if (!examSnap.exists) {
      return NextResponse.json({ error: "Không tìm thấy đề thi" }, { status: 404 });
    }

    const examData = examSnap.data() as Exam;
    const questions = examData.questions;

    // 2. Chấm điểm logic
    let correctCount = 0;
    const sectionScores = { vocabulary: 0, grammar_reading: 0, listening: 0 };
    const sectionTotals = { vocabulary: 0, grammar_reading: 0, listening: 0 };

    questions.forEach((q: Question) => {
      // Tính tổng số câu mỗi phần
      sectionTotals[q.section]++;

      // So sánh đáp án
      const userAnswer = answers[q.id];
      if (userAnswer && userAnswer === q.correctAnswer) {
        correctCount++;
        sectionScores[q.section]++;
      }
    });

    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // 3. Tạo Attempt record lưu vào Firestore
    const attemptData: ExamAttempt = {
      userId,
      examId,
      examTitle: examData.title,
      level: examData.level,
      startedAt: startedAt || Date.now(),
      completedAt: Date.now(),
      status: 'completed',
      answers, // Lưu lại bài làm của user
      score: scorePercentage,
      correctCount,
      totalQuestions,
      sectionScores
    };

    const attemptRef = await db.collection('attempts').add(attemptData);

    // 4. (Tùy chọn) Cập nhật tổng số bài thi vào User Progress...
    
    // 5. Trả về ID của Attempt để FE chuyển trang sang xem kết quả
    return NextResponse.json({ 
      success: true, 
      attemptId: attemptRef.id,
      score: scorePercentage 
    });

  } catch (error: any) {
    console.error("API Submit Error:", error);
    return NextResponse.json({ error: "Lỗi Server Nội bộ" }, { status: 500 });
  }
}
