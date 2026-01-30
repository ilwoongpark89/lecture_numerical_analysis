"use client";

import { motion } from "framer-motion";

const roadmap = [
  {
    phase: "기초",
    weeks: "1–3",
    color: "from-blue-500 to-cyan-500",
    dotColor: "bg-blue-500",
    topics: [
      { week: 1, title: "Introduction", desc: "수치해석 개론" },
      { week: 2, title: "MATLAB", desc: "프로그래밍 도구" },
      { week: 3, title: "Errors", desc: "반올림/절단 오차" },
    ],
  },
  {
    phase: "방정식",
    weeks: "4–7",
    color: "from-rose-500 to-violet-500",
    dotColor: "bg-rose-500",
    topics: [
      { week: 4, title: "Nonlinear Eq. I", desc: "Bisection, Newton-Raphson" },
      { week: 5, title: "Nonlinear Eq. II", desc: "Secant, 응용" },
      { week: 6, title: "Linear Systems I", desc: "Gauss Elimination, LU" },
      { week: 7, title: "Linear Systems II", desc: "Jacobi, Gauss-Seidel" },
    ],
  },
  {
    phase: "데이터",
    weeks: "9–10",
    color: "from-emerald-500 to-teal-500",
    dotColor: "bg-emerald-500",
    topics: [
      { week: 9, title: "Curve Fitting", desc: "최소자승법, 회귀" },
      { week: 10, title: "Interpolation", desc: "Lagrange, Spline" },
    ],
  },
  {
    phase: "미적분",
    weeks: "11–14",
    color: "from-purple-500 to-indigo-500",
    dotColor: "bg-purple-500",
    topics: [
      { week: 11, title: "Integration", desc: "Simpson, Gauss" },
      { week: 12, title: "Differentiation", desc: "유한차분" },
      { week: 13, title: "ODE", desc: "Euler, Runge-Kutta" },
      { week: 14, title: "PDE & Eigenvalues", desc: "유한차분, Power Method" },
    ],
  },
];

export default function CourseRoadmap() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            Roadmap
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            강의 로드맵
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            이번 학기에 배우게 될 내용의 전체 구조
          </p>
        </motion.div>

        <div className="space-y-12">
          {roadmap.map((phase, pi) => (
            <motion.div
              key={pi}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: pi * 0.1 }}
            >
              {/* Phase header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${phase.color} text-white font-bold text-sm shadow-lg`}>
                  {phase.phase}
                </div>
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-sm text-gray-500 font-mono">
                  Week {phase.weeks}
                </span>
              </div>

              {/* Topics grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pl-4">
                {phase.topics.map((topic, ti) => (
                  <motion.div
                    key={ti}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: pi * 0.1 + ti * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex flex-col items-center mt-1">
                      <div className={`w-3 h-3 rounded-full ${phase.dotColor}`} />
                      {ti < phase.topics.length - 1 && (
                        <div className="w-px h-full bg-slate-800 mt-1" />
                      )}
                    </div>
                    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">W{topic.week}</span>
                        <h4 className="text-sm font-semibold text-white">{topic.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500">{topic.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Exam markers */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
              <span className="text-sm text-gray-400">Week 8: 중간고사</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
              <span className="text-sm text-gray-400">Week 15: 기말고사</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
