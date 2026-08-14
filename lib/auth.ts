import { auth, db } from "../firebase/firebaseClient";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function registerWithEmail(name: string, email: string, password: string, phone?: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // create user doc in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    phone: phone || null,
    role: "user",
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  await sendEmailVerification(user);
  return user;
}

export async function loginWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // ensure user doc exists
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "No name",
      email: user.email,
      phone: user.phoneNumber || null,
      role: "user",
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  return user;
}

export async function logout() {
  return await signOut(auth);
}

export async function sendResetEmail(email: string) {
  return await sendPasswordResetEmail(auth, email);
}
