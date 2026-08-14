"use client";
import React, { useState } from "react";
import { loginWithEmail, loginWithGoogle, sendResetEmail } from "../../lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (!res.user.emailVerified) {
        alert("Vui lòng xác thực email trước khi sử dụng đầy đủ chức năng. Một email đã được gửi.");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setErr(err.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setErr("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setErr(err.message || "Đăng nhập Google thất bại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setErr("Nhập email để gửi link reset.");
      return;
    }
    try {
      await sendResetEmail(email);
      alert("Email reset đã được gửi.");
    } catch (err: any) {
      setErr(err.message || "Không thể gửi email reset.");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
      <form onSubmit={handleEmailLogin} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>

        {err && <div className="text-red-600">{err}</div>}

        <div>
          <button type="submit" disabled={loading} className="w-full bg-nvdOrange text-white px-4 py-2 rounded">Đăng nhập</button>
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={handleGoogle} className="px-4 py-2 border rounded">Đăng nhập với Google</button>
          <button type="button" onClick={handleReset} className="text-sm text-gray-600">Quên mật khẩu?</button>
        </div>
      </form>
    </div>
  );
}
