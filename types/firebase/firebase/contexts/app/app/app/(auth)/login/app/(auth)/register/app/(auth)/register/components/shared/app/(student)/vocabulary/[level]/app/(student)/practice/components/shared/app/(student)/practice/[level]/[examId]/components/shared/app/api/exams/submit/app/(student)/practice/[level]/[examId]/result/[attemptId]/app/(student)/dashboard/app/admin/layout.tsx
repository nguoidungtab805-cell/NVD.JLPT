// FILE: app/admin/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, LayoutDashboard, BookOpen, ScrollText, Type, FileText, Users, Settings, LogOut } from "lucide-react";
import { logoutUser } from "../../firebase/auth";
import { cn } from "../../lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userProfile, loading, currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/login?redirect=/admin");
      } else if (userProfile?.role !== "admin") {
        // Nếu không phải admin, đá về trang chủ
        router.replace("/");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [loading, currentUser, userProfile, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-jp-navy" />
      </div>
    );
  }

  const menuItems = [
    { name: "Tổng quan", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Từ vựng", href: "/admin/vocabulary", icon: <BookOpen size={20} /> },
    { name: "Ngữ pháp", href: "/admin/grammar", icon: <ScrollText size={20} /> },
    { name: "Kanji", href: "/admin/kanji", icon: <Type size={20} /> },
    { name: "Đề thi", href: "/admin/exams", icon: <FileText size={20} /> },
    { name: "Người dùng", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Cài đặt", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-jp-navy text-white flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              ADMIN.<span className="text-jp-orange">JLPT</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-jp-orange text-white" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logoutUser}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-jp-navy">{userProfile?.name}</p>
              <p className="text-xs text-gray-500 capitalize">Quản trị viên</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 text-jp-orange flex items-center justify-center font-bold">
              {userProfile?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
