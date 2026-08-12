// FILE: scripts/seed.ts
import * as admin from 'firebase-admin';

// Cấu hình Admin SDK (Sử dụng service account key)
const serviceAccount = require('../firebase-service-account.json'); // Bạn cần tải file này từ Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  console.log("Bắt đầu tạo dữ liệu mẫu N5...");

  // 1. Tạo 1 Đề thi Small Test mẫu
  const examRef = db.collection('exams').doc('seed_exam_n5_01');
  await examRef.set({
    title: "Small Test N5 - Đánh giá định kỳ 01",
    level: "N5",
    type: "small_test",
    durationMinutes: 15,
    totalQuestions: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    questions: [
      {
        id: "q_001",
        section: "vocabulary",
        content: "私は毎日学校＿＿行きます。",
        options: { A: "を", B: "に", C: "で", D: "が" },
        correctAnswer: "B",
        explanation: "Chỉ hướng di chuyển dùng trợ từ に hoặc へ.",
        difficulty: "easy"
      },
      {
        id: "q_002",
        section: "grammar_reading",
        content: "これは＿＿の本ですか。",
        options: { A: "だれ", B: "なん", C: "どこ", D: "いつ" },
        correctAnswer: "A",
        explanation: "Hỏi về sở hữu, dùng だれ (ai).",
        difficulty: "easy"
      }
    ]
  });

  // 2. Tạo Từ vựng mẫu
  await db.collection('vocabularies').add({
    level: "N5",
    kanji: "学校",
    furigana: "がっこう",
    meaning: "Trường học",
    example: "学校へ行きます。",
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  console.log("Seed dữ liệu hoàn tất! Bạn có thể vào website để kiểm tra.");
}

seedData().catch(console.error);
