"use client";

import { motion } from "framer-motion";
import { weekOf } from "@/lib/curriculum";

// 주차 히어로 — 커리큘럼 SoT 에서 파생(주차별 하드코딩 제거). 현재 다크 테마.
export default function LectureHero({ week }: { week: number }) {
  const m = weekOf(week);
  if (!m) return null;
  return (
    <section className="relative flex min-h-[52vh] items-center justify-center overflow-hidden px-4 py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[520px] w-[520px] translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[520px] w-[520px] -translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" /> Week {week}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-3 text-4xl font-bold tracking-tight text-white md:text-6xl"
        >
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            {m.topic}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto max-w-xl text-lg text-gray-400"
        >
          {m.desc}
        </motion.p>
        {m.sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-2 text-sm"
          >
            {m.sections.map((s) => (
              <a
                key={s.id}
                href={`#sec-${s.id}`}
                className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-gray-400 transition hover:border-blue-500/40 hover:text-blue-300"
              >
                {s.title}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
