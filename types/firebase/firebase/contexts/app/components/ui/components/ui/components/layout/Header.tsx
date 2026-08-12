// FILE: components/layout/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { logoutUser } from "../../firebase/auth";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export default function Header() {
  const { currentUser, userProfile, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Từ vựng", href: "/vocabulary" },
    { name: "Ngữ pháp", href: "/grammar" },
    { name: "Kanji", href: "/kanji" },
    { name: "Luyện thi", href: "/practice" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-jp-red rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">JP</span>
          </div>
          <span className="text-2xl font-bold text-jp-navy tracking-tight">
            NVD.<span className="text-jp-orange">JLPT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-jp-orange transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && (
            currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-jp-navy">
                  Chào, {userProfile?.name?.split(" ")[0] || "Bạn"}
                </span>
                <Link href={userProfile?.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logoutUser}>Đăng xuất</Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Đăng ký</Button>
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-jp-navy p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={cn(
        "md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 transition-all duration-300 overflow-hidden",
        isMobileMenuOpen ? "max-h-96 py-4 px-4" : "max-h-0"
      )}>
        <nav className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-lg font-medium text-gray-700 hover:text-jp-orange"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <hr className="my-2" />
          {!loading && (
            currentUser ? (
              <div className="flex flex-col gap-3">
                 <Link href={userProfile?.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-jp-red" onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Đăng nhập</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Đăng ký</Button>
                </Link>
              </div>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
