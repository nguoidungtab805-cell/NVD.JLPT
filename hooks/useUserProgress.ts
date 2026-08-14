"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

/**
 * Hook to manage per-user progress for a specific vocabulary item.
 * Stores documents at: users/{uid}/vocabProgress/{vocabId}
 */
export function useUserProgress(vocabId?: string) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<{ memorized: boolean; updatedAt?: any } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUserId(u ? u.uid : null);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!userId || !vocabId) {
      setProgress(null);
      setLoading(false);
      return;
    }
    const docRef = doc(db, "users", userId, "vocabProgress", vocabId);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setProgress(snap.data() as any);
      } else {
        setProgress(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("progress onSnapshot error", err);
      setLoading(false);
    });
    return () => unsub();
  }, [userId, vocabId]);

  async function setMemorized(memorized: boolean) {
    if (!userId || !vocabId) throw new Error("Not authenticated or missing vocabId");
    const docRef = doc(db, "users", userId, "vocabProgress", vocabId);
    await setDoc(docRef, { memorized, updatedAt: new Date() }, { merge: true });
  }

  return { progress, loading, setMemorized };
}
