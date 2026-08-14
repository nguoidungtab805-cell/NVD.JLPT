/**
 * Server-side script to seed demo vocabulary into Firestore using Firebase Admin SDK.
 * Usage:
 * 1. Place your serviceAccountKey.json in scripts/ (DO NOT COMMIT).
 * 2. Run: ts-node scripts/seed-vocab.ts  (or compile to JS and run node)
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("Missing serviceAccountKey.json in scripts/ - follow scripts/admin-setup.md to create one.");
  process.exit(1);
}
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const demo: any[] = [
  { level: "n5", word: "学校", furigana: "がっこう", meaning: "trường học", example: "私は学校へ行きます。", exampleFurigana: "わたしはがっこうへいきます。", exampleMeaning: "Tôi đến trường." },
  { level: "n5", word: "学生", furigana: "がくせい", meaning: "học sinh, sinh viên" },
  { level: "n5", word: "先生", furigana: "せんせい", meaning: "giáo viên" },
  { level: "n5", word: "日本", furigana: "にほん", meaning: "Nhật Bản" },
  { level: "n5", word: "友達", furigana: "ともだち", meaning: "bạn bè" },
  { level: "n5", word: "食べる", furigana: "たべる", meaning: "ăn" },
  { level: "n5", word: "行く", furigana: "いく", meaning: "đi" },
  { level: "n5", word: "見る", furigana: "みる", meaning: "nhìn, xem" },
  { level: "n5", word: "買う", furigana: "かう", meaning: "mua" },
  { level: "n5", word: "読む", furigana: "よむ", meaning: "đọc" },
  { level: "n5", word: "書く", furigana: "かく", meaning: "viết" },
  { level: "n5", word: "話す", furigana: "はなす", meaning: "nói chuyện" },
  { level: "n5", word: "休む", furigana: "やすむ", meaning: "nghỉ" },
  { level: "n5", word: "働く", furigana: "はたらく", meaning: "làm việc" },
  { level: "n5", word: "勉強する", furigana: "べんきょうする", meaning: "học" }
];

async function seed() {
  const collectionRef = db.collection("vocabularies");
  for (const item of demo) {
    const docRef = await collectionRef.add({
      ...item,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("Added:", docRef.id, item.word);
  }
  console.log("Seeding finished.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
