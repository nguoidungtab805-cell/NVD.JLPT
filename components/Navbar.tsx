"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { logout } from "../lib/auth";
import { User } from "firebase/auth";
import { Menu, UserCircle2 } from "lucide-react";

export default function Navbar() {
  const { user } = useContext(AuthContext) as any;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <nav className="w-full bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-nvdOrange flex items-center justify-center text-white font-bold">N</div>
            <div>
              <div className="font-semibold">NVD.JLPT</div>
              <div className="text-xs text-gray-500">日本語を学び、JLPTを超える。</div>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/vocabulary" className="text-gray-700 hover:text-nvdOrange">Từ vựng</Link>
          <Link href="/grammar" className="text-gray-700 hover:text-nvdOrange">Ngữ pháp</Link>
          <Link href="/kanji" className="text-gray-700 hover:text-nvdOrange">Kanji</Link>
          <Link href="/tests" className="text-gray-700 hover:text-nvdOrange">Luyện thi</Link>
        </div>

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link href="/login" className="px-4 py-2 bg-nvdOrange text-white rounded-md">Đăng nhập</Link>
              <Link href="/register" className="px-4 py-2 border border-nvdOrange text-nvdOrange rounded-md">Đăng ký</Link>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-sm">
                <div>{(user.displayName || user.email)}</div>
                <div className="text-xs text-gray-500">{user.emailVerified ? "Verified" : "Unverified"}</div>
              </div>
              <div className="relative">
                <button onClick={() => setOpen((s) => !s)} className="p-1 rounded-full bg-gray-100">
                  <UserCircle2 />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow rounded-md py-2">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50">Hồ sơ</Link>
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-50">Tiến độ học</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50">Đăng xuất</button>
                  </div>
                )}
              </div>
            </div>
          )}

          <button className="md:hidden p-2" aria-label="menu" onClick={() => setOpen((s) => !s)}>
            <Menu />
          </button>
        </div>
      </div>
      {/* mobile menu */}
      {/* not a full mobile drawer for brevity */}
    </nav>
  );
}
