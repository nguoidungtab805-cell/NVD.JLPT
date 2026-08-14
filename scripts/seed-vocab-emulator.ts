/**
 * Seed demo vocab into Firestore.
 * Usage:
 * 1) To seed into Emulator:
 *    - Start emulator: npx firebase emulators:start --only auth,firestore,storage
 *    - Run: USE_EMULATOR=true npx ts-node scripts/seed-vocab-emulator.ts
 * 2) To seed into real Firebase:
 *    - Place serviceAccountKey.json in scripts/
 *    - Run: npx ts-node scripts/seed-vocab-emulator.ts
 */

import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const useEmulator = process.env.USE_EMULATOR === "true" || !!process.env.FIRESTORE_EMULATOR_HOST;

if (useEmulator) {
  // Initialize Admin SDK for emulator (no credentials required)
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project"
  });
  // Make sure emulator env var set for Firestore if not already
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  }
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  }
  console.log("Seeding to Emulator. FIRESTORE_EMULATOR_HOST =", process.env.FIRESTORE_EMULATOR_HOST);
} else {
  // Production: require serviceAccountKey.json
  const keyPath = path.join(__dirname, "serviceAccountKey.json");
  if (!fs.existsSync(keyPath)) {
    console.error("serviceAccountKey.json not found in scripts/. For real project seeding, create service account JSON.");
    process.exit(1);
  }
  const serviceAccount = require(keyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Seeding to REAL project with admin credentials.");
}

const db = admin.firestore();

const demo = [
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
  const col = db.collection("vocabularies");
  for (const item of demo) {
    const docRef = await col.add({
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
