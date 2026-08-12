// FILE: firebase/auth.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { UserProfile } from "../types";

const googleProvider = new GoogleAuthProvider();

// Đăng ký bằng Email/Password
export const registerWithEmail = async (email: string, password: string, name: string, phone: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Gửi email xác nhận
  await sendEmailVerification(user);

  // Tạo user profile trong Firestore
  const userRef = doc(db, "users", user.uid);
  const newUserProfile: Partial<UserProfile> = {
    uid: user.uid,
    name,
    email,
    phone,
    role: "student", // Mặc định không bao giờ là admin
    emailVerified: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(userRef, newUserProfile);
  return user;
};

// Đăng nhập bằng Email/Password
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Đăng nhập bằng Google
export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Kiểm tra xem user đã có trong Firestore chưa
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // Nếu chưa có, tạo mới
    const newUserProfile: Partial<UserProfile> = {
      uid: user.uid,
      name: user.displayName || "Người dùng Google",
      email: user.email || "",
      role: "student",
      emailVerified: user.emailVerified,
      avatarUrl: user.photoURL || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(userRef, newUserProfile);
  }

  return user;
};

// Đăng xuất
export const logoutUser = async () => {
  await signOut(auth);
  // Xóa cookie session ở client
  document.cookie = "nvd_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Quên mật khẩu
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
