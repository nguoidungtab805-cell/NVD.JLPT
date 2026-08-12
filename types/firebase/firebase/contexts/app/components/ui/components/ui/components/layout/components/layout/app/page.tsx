// FILE: app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ScrollText, Type, Clock } from "lucide-react";
import { Button } from "../components/ui/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cards = [
    {
      title: "TỪ VỰNG",
      icon: <BookOpen size={40} className="text-jp-orange mb-4" />,
      color: "hover:border-jp-orange",
      bgHover: "group-hover:bg-orange-50",
      description: "Học và ghi nhớ từ vựng tiếng Nhật bằng Flashcard thông minh.",
      link: "/vocabulary"
    },
    {
      title: "NGỮ PHÁP",
      icon: <ScrollText size={40} className="text-blue-600 mb-4" />,
      color: "hover:border-blue-600",
      bgHover: "group-hover:bg-blue-50",
      description: "Nắm vững cấu trúc ngữ pháp từ cơ bản đến nâng cao.",
      link: "/grammar"
    },
    {
      title: "KANJI",
      icon: <Type size={40} className="text-jp-red mb-4" />,
      color: "hover:border-jp-red",
      bgHover: "group-hover:bg-red-50",
      description: "Học Kanji theo cấp độ, âm On, âm Kun và ví dụ thực tế.",
      link: "/kanji"
    },
    {
      title: "LUYỆN THI",
      icon: <Clock size={40} className="text-purple-600 mb-4" />,
      color: "hover:border-purple-600",
      bgHover: "group-hover:bg-purple-50",
      description: "Luyện đề JLPT N5–N1 với thời gian thực và chấm điểm tự động.",
      link: "/practice"
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-jp-cream py-20 lg:py-32">
          {/* Background Japanese Element (Tượng trưng bằng div CSS) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-jp-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-jp-red rounded-full mix-blend-multiply filter blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-jp-navy mb-6 tracking-tight leading-tight">
                Học đúng nền tảng – <br className="hidden md:block" />
                Luyện đúng phương pháp – <br className="hidden md:block" />
                <span className="text-jp-orange">Chinh phục JLPT</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Nền tảng học tiếng Nhật và luyện thi JLPT từ N5 đến N1, giúp người học xây dựng vốn từ vựng, nắm chắc ngữ pháp, chinh phục Kanji và luyện tập đề thi theo từng cấp độ.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/vocabulary">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-10">
                    Bắt đầu học
                  </Button>
                </Link>
                <Link href="/practice">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 bg-white">
                    Luyện thi JLPT
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4 Feature Cards Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {cards.map((card, index) => (
                <Link href={card.link} key={index} className="block group">
                  <motion.div 
                    variants={itemVariants}
                    className={`h-full bg-white border-2 border-transparent rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${card.color}`}
                  >
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${card.bgHover}`}>
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-jp-navy mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
