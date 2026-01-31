"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const career = [
  { year: "2008-2011", label: "B.S. 서울대학교" },
  { year: "2011-2013", label: "M.S. 서울대학교" },
  { year: "2014-2018", label: "Ph.D. NTNU (노르웨이)" },
  { year: "2018-2021", label: "연구교수, 제주대학교" },
  { year: "2022", label: "연구조교수, 서울대학교" },
  { year: "2022-현재", label: "조교수, 인하대학교" },
];

const courseInfo = [
  { label: "강의 시간", value: "TBD" },
  { label: "강의실", value: "TBD" },
  { label: "평가", value: "TBD" },
  { label: "교재", value: "TBD" },
  { label: "소프트웨어", value: "TBD" },
  { label: "조교", value: "TBD" },
];

const weeks = [
  {
    week: 1, topic: "Introduction", color: "from-blue-500 to-cyan-500", ready: true,
    desc: "수치해석 개론",
    details: ["수치해석이란 무엇인가", "해석해 vs 수치해", "공학 응용 사례", "강의 로드맵"],
  },
  {
    week: 2, topic: "MATLAB Fundamentals", color: "from-emerald-500 to-teal-500", ready: true,
    desc: "MATLAB 기초",
    details: ["MATLAB 환경과 기본 문법", "벡터/행렬 연산", "스크립트 및 함수 작성", "그래프 시각화"],
  },
  {
    week: 3, topic: "Errors", color: "from-amber-500 to-orange-500", ready: true,
    desc: "반올림 오차와 절단 오차",
    details: ["IEEE 754 부동소수점", "머신 엡실론, 상쇄 오차", "Taylor 급수와 절단 오차", "오차 전파, 수렴 차수 O(h^n)"],
  },
  {
    week: 4, topic: "Nonlinear Equations I", color: "from-rose-500 to-pink-500", ready: true,
    desc: "Bisection & Newton-Raphson",
    details: ["근의 존재성 (중간값 정리)", "이분법 알고리즘과 수렴 속도", "Newton-Raphson 유도와 구현", "2차 수렴의 의미"],
  },
  {
    week: 5, topic: "Nonlinear Equations II", color: "from-pink-500 to-fuchsia-500", ready: true,
    desc: "Secant Method 및 응용",
    details: ["Secant Method", "다중근과 수렴 실패 사례", "비선형 연립방정식 개요", "MATLAB 구현 실습"],
  },
  {
    week: 6, topic: "Gauss Elimination", color: "from-indigo-500 to-violet-500", ready: true,
    desc: "가우스 소거법과 LU 분해",
    details: ["가우스 소거법", "부분 피벗팅", "LU 분해", "행렬 조건수와 ill-conditioning"],
  },
  {
    week: 7, topic: "Iterative Methods", color: "from-sky-500 to-blue-500", ready: true,
    desc: "연립방정식의 반복법",
    details: ["Jacobi 반복법", "Gauss-Seidel 반복법", "수렴 조건 (대각 우세)", "대규모 희소행렬 응용"],
  },
  {
    week: 8, topic: "Mid-term Exam", color: "from-gray-500 to-slate-500", ready: false, exam: true,
    desc: "중간고사 (Weeks 1–7)",
    details: [],
  },
  {
    week: 9, topic: "Curve Fitting", color: "from-emerald-500 to-teal-500", ready: true,
    desc: "최소자승법과 회귀 분석",
    details: ["최소자승법 원리", "선형 회귀 (직선, 다항식)", "비선형 회귀의 선형화", "결정계수 R² 평가"],
  },
  {
    week: 10, topic: "Interpolation", color: "from-violet-500 to-purple-500", ready: true,
    desc: "보간법",
    details: ["Lagrange 보간 다항식", "Newton 차분 보간", "Runge 현상", "Cubic Spline 보간"],
  },
  {
    week: 11, topic: "Numerical Integration", color: "from-fuchsia-500 to-pink-500", ready: false,
    desc: "수치적분",
    details: ["사다리꼴 공식과 오차", "Simpson 1/3, 3/8 공식", "복합 공식", "Gauss Quadrature"],
  },
  {
    week: 12, topic: "Numerical Differentiation", color: "from-cyan-500 to-sky-500", ready: false,
    desc: "수치미분",
    details: ["전방/후방/중앙 차분", "고차 정확도 공식", "Richardson 외삽법", "편미분의 수치 근사"],
  },
  {
    week: 13, topic: "ODE", color: "from-purple-500 to-indigo-500", ready: false,
    desc: "상미분방정식",
    details: ["Euler 방법", "개선 Euler (Heun)", "4차 Runge-Kutta (RK4)", "연립 ODE, 고차 ODE 변환"],
  },
  {
    week: 14, topic: "PDE & Eigenvalues", color: "from-orange-500 to-amber-500", ready: false,
    desc: "편미분방정식 입문과 고유값 문제",
    details: ["열전도 방정식의 유한차분", "파동 방정식 개요", "Power Method", "고유값 문제의 공학 응용"],
  },
  {
    week: 15, topic: "Final Exam", color: "from-gray-500 to-slate-500", ready: false, exam: true,
    desc: "기말고사 (Weeks 9–14)",
    details: [],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-400">
              2026 Fall Semester | Inha University
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-2"
          >
            Numerical
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
              Analysis
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
          >
            수치해석 — 공학 문제를 컴퓨터로 푸는 방법
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Department of Mechanical Engineering
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              16 Weeks
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Prof. Il Woong Park
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instructor */}
      <section className="relative py-24 bg-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              Instructor
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">강사 소개</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 items-center md:items-start"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-6xl font-bold shadow-xl shadow-blue-500/20">
                  P
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-1">박일웅 (Il Woong Park)</h3>
                <p className="text-lg text-blue-400 mb-4">조교수, 인하대학교 기계공학과</p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  다상유동 및 열공학 연구실(MFTEL)을 이끌고 있으며, 열에너지 저장, 비등 열전달, 원자로 안전 등을 연구하고 있습니다.
                  수치해석은 공학 연구의 핵심 도구이며, 이 강의를 통해 실제 공학 문제를 컴퓨터로 해결하는 능력을 키워드립니다.
                </p>

                {/* Career Timeline */}
                <div className="space-y-3">
                  {career.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="text-sm text-blue-400 font-mono w-24 flex-shrink-0">{item.year}</span>
                      <span className="text-gray-300 text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                  <motion.a
                    href="https://mftel.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    MFTEL Lab
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.a>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm text-gray-300">
                    Inha University
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Info */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              Course Info
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">강의 정보</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {courseInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 text-center"
              >
                <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider mb-2">
                  {info.label}
                </p>
                <p className="text-sm text-white font-medium">{info.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus Grid */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Syllabus
            </h2>
            <p className="text-gray-400">
              주차별 강의 내용을 클릭하여 확인하세요
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeks.map((w, i) => (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
              >
                {w.ready ? (
                  <Link href={`/lecture/${w.week}`} className="block group">
                    <WeekCard w={w} />
                  </Link>
                ) : (
                  <div className="opacity-60">
                    <WeekCard w={w} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            2026 Fall Semester | Numerical Analysis | Inha University, Dept. of Mechanical Engineering
          </p>
        </div>
      </footer>
    </main>
  );
}

function WeekCard({ w }: { w: (typeof weeks)[number] }) {
  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 p-5 h-full ${
        w.exam
          ? "bg-slate-800/40 border-slate-700"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-600 group-hover:border-slate-600"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${w.color} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
        >
          {w.week}
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Week {w.week}
        </div>
        {w.ready && (
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </div>
      <h3 className="text-sm font-semibold text-white leading-snug mb-1">
        {w.topic}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-2">{w.desc}</p>
      {w.details && w.details.length > 0 && (
        <ul className="space-y-1">
          {w.details.map((d, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-600 flex-shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
