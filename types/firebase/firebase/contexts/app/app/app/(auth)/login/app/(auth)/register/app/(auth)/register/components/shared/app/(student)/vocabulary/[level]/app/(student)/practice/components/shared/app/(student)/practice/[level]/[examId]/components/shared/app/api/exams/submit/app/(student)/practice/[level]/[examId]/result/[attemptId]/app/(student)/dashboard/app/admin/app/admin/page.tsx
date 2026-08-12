// FILE: app/admin/page.tsx
"use client";

import React from "react";
import { Users, BookOpen, Type, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Tổng Người Dùng", value: "1,245", icon: <Users className="text-blue-500" size={24} />, bg: "bg-blue-50" },
    { title: "Từ Vựng", value: "3,420", icon: <BookOpen className="text-orange-500" size={24} />, bg: "bg-orange-50" },
    { title: "Kanji", value: "1,150", icon: <Type className="text-red-500" size={24} />, bg: "bg-red-50" },
    { title: "Đề Thi", value: "48", icon: <FileText className="text-purple-500" size={24} />, bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-jp-navy mb-6">Tổng Quan Hệ Thống</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-jp-navy">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-jp-navy mb-4">Biểu đồ tiến độ hệ thống sẽ được hiển thị tại đây</h2>
        <div className="w-full h-64 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>
    </div>
  );
}
