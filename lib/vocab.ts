import { db } from "../firebase/firebaseClient";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { Vocabulary, JLPTLevel } from "../types/vocabulary";

const VOCAB_COLLECTION = "vocabularies";

/**
 * Fetch vocabularies by level with pagination.
 * cursorDoc can be passed to get next page.
 */
export async function fetchVocabByLevel(level: JLPTLevel, pageSize = 20, cursorDoc?: QueryDocumentSnapshot<DocumentData>) {
  const col = collection(db, VOCAB_COLLECTION);
  const constraints: QueryConstraint[] = [where("level", "==", level), orderBy("createdAt", "desc"), limit(pageSize)];
  let q = query(col, ...constraints);
  if (cursorDoc) {
    q = query(col, ...constraints, startAfter(cursorDoc));
  }
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Vocabulary[];
  const last = snap.docs[snap.docs.length - 1];
  return { data: docs, lastDoc: last || null };
}

/**
 * Simple helper to add demo vocab (used by seed script or admin)
 */
export async function addVocab(v: Vocabulary) {
  const col = collection(db, VOCAB_COLLECTION);
  const docRef = await addDoc(col, { ...v, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
}
