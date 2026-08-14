"use client";
import React, { useState } from "react";
import { registerWithEmail } from "../../lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Mật khẩu phải dài ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu không khớp.");
      return;
    }
    setLoading(true);
    try {
      const user = await registerWithEmail(name, email, password, phone);
      // show notice to verify email
      alert("Đăng ký thành công. Vui lòng kiểm tra email để xác thực.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Lỗi khi đăng ký.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Đăng ký tài khoản</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm">Họ và tên</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Số điện thoại</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Xác nhận mật khẩu</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="flex items-center text-sm">
            <input type="checkbox" required className="mr-2" /> Tôi đồng ý với điều khoản sử dụng.
          </label>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <button type="submit" disabled={loading} className="w-full bg-nvdOrange text-white px-4 py-2 rounded">
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </div>
      </form>
    </div>
  );
}
