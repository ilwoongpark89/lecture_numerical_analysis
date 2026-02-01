"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MatlabOverview from "@/components/sections/week2/MatlabOverview";
import MatlabBasics from "@/components/sections/week2/MatlabBasics";
import MatlabVectorMatrix from "@/components/sections/week2/MatlabVectorMatrix";
import MatlabControlFlow from "@/components/sections/week2/MatlabControlFlow";
import MatlabFunctions from "@/components/sections/week2/MatlabFunctions";
import MatlabPlotting from "@/components/sections/week2/MatlabPlotting";
import MatlabPracticeW2 from "@/components/sections/week2/MatlabPracticeW2";
import PythonComparison from "@/components/sections/week2/PythonComparison";
import LectureGuard from "@/components/LectureGuard";

export default function Lecture2() {
  return (
    <LectureGuard>
    <main className="min-h-screen bg-slate-950">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">강의 목록</span>
          </Link>
          <span className="text-sm text-gray-500">Week 2 — MATLAB Fundamentals</span>
        </div>
      </nav>

      <div className="pt-14">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 z-[1]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-600/15 rounded-full blur-3xl opacity-60 -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-gray-300">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Week 2
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                MATLAB
              </span>{" "}
              Fundamentals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              수치해석의 핵심 도구, MATLAB의 기초를 완벽하게 익히기
            </motion.p>

            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-3 text-sm"
            >
              {[
                { label: "MATLAB 소개", icon: "💻" },
                { label: "기본 문법", icon: "🔤" },
                { label: "벡터/행렬", icon: "📊" },
                { label: "제어문", icon: "🔄" },
                { label: "함수", icon: "⚙️" },
                { label: "시각화", icon: "📈" },
                { label: "실습", icon: "🧪" },
                { label: "Python", icon: "🐍" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-gray-400"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        <MatlabOverview />
        <MatlabBasics />
        <MatlabVectorMatrix />
        <MatlabControlFlow />
        <MatlabFunctions />
        <MatlabPlotting />
        <MatlabPracticeW2 />
        <PythonComparison />

        {/* Next Lecture Teaser */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-500 mb-4">다음 시간</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Week 3: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Errors</span>
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                반올림 오차와 절단 오차 — 수치해석의 정확도를 이해합니다
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      <footer className="py-8 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">2026 Fall Semester | Numerical Analysis | Inha University</p>
        </div>
      </footer>
    </main>
    </LectureGuard>
  );
}
