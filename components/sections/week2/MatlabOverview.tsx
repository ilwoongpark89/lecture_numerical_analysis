"use client";

import { motion } from "framer-motion";

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

/* ── Why MATLAB cards data ── */
const whyCards = [
  {
    icon: "🧮",
    title: "행렬 연산에 최적화",
    subtitle: "Matrix-Optimized",
    desc: "MATLAB은 이름 자체가 MATrix LABoratory입니다. 행렬과 벡터 연산이 언어의 핵심이며, 별도 라이브러리 없이 즉시 사용할 수 있습니다.",
    accent: "emerald",
  },
  {
    icon: "📦",
    title: "풍부한 내장 함수",
    subtitle: "Built-in Functions",
    desc: "fzero, ode45, eig, interp1, fft 등 수치해석에 필요한 함수가 기본 제공됩니다. 알고리즘 구현보다 문제 해결에 집중할 수 있습니다.",
    accent: "cyan",
  },
  {
    icon: "📊",
    title: "강력한 시각화",
    subtitle: "Powerful Visualization",
    desc: "plot, surf, contour 등 한 줄 명령으로 2D/3D 그래프를 즉시 생성할 수 있어, 결과를 직관적으로 확인할 수 있습니다.",
    accent: "teal",
  },
  {
    icon: "🏭",
    title: "산업 표준",
    subtitle: "Industry Standard",
    desc: "항공우주, 자동차, 반도체, 로봇공학 등 엔지니어링 분야에서 널리 사용됩니다. Simulink와 함께 시스템 시뮬레이션의 사실상 표준입니다.",
    accent: "violet",
  },
];

const accentMap: Record<string, string> = {
  emerald: "border-emerald-500/30 text-emerald-400",
  cyan: "border-cyan-500/30 text-cyan-400",
  teal: "border-teal-500/30 text-teal-400",
  violet: "border-violet-500/30 text-violet-400",
};

const accentBg: Record<string, string> = {
  emerald: "bg-emerald-500/10",
  cyan: "bg-cyan-500/10",
  teal: "bg-teal-500/10",
  violet: "bg-violet-500/10",
};

/* ── Comparison table data ── */
const comparisonRows = [
  { label: "문법 난이도", matlab: "쉬움 (직관적)", python: "쉬움", cpp: "어려움" },
  { label: "행렬 연산", matlab: "★★★★★", python: "★★★★☆ (NumPy)", cpp: "★★★☆☆ (Eigen)" },
  { label: "시각화", matlab: "★★★★★ (내장)", python: "★★★★☆ (Matplotlib)", cpp: "★★☆☆☆ (외부 라이브러리)" },
  { label: "실행 속도", matlab: "보통", python: "느림", cpp: "매우 빠름" },
  { label: "라이선스", matlab: "유료 (학교 제공)", python: "무료 (오픈소스)", cpp: "무료 (오픈소스)" },
  { label: "수치해석 생태계", matlab: "★★★★★", python: "★★★★☆ (SciPy)", cpp: "★★★☆☆" },
];

/* ── IDE panel data ── */
const idePanels = [
  {
    key: "editor",
    label: "Editor (편집기)",
    desc: "스크립트(.m 파일)를 작성하고 저장",
    area: "col-span-2 row-span-2",
    content: (
      <div className="font-mono text-xs leading-relaxed text-gray-300 space-y-0.5">
        <p><span className="text-gray-500">1</span> <span className="text-green-400">% my_script.m</span></p>
        <p><span className="text-gray-500">2</span> <span className="text-cyan-300">clc</span>; <span className="text-cyan-300">clear</span>;</p>
        <p><span className="text-gray-500">3</span> A = [<span className="text-orange-300">1 2 3</span>; <span className="text-orange-300">4 5 6</span>];</p>
        <p><span className="text-gray-500">4</span> B = A&apos;;</p>
        <p><span className="text-gray-500">5</span> C = A * B;</p>
        <p><span className="text-gray-500">6</span> <span className="text-cyan-300">disp</span>(C);</p>
      </div>
    ),
  },
  {
    key: "workspace",
    label: "Workspace (작업 공간)",
    desc: "현재 메모리에 저장된 변수 목록",
    area: "col-span-1 row-span-1",
    content: (
      <div className="font-mono text-xs text-gray-400 space-y-1">
        <div className="flex justify-between border-b border-slate-600 pb-1 text-gray-500">
          <span>Name</span><span>Value</span>
        </div>
        <div className="flex justify-between"><span className="text-sky-300">A</span><span>2×3 double</span></div>
        <div className="flex justify-between"><span className="text-sky-300">B</span><span>3×2 double</span></div>
        <div className="flex justify-between"><span className="text-sky-300">C</span><span>2×2 double</span></div>
      </div>
    ),
  },
  {
    key: "command",
    label: "Command Window (명령 창)",
    desc: "명령어를 직접 입력하고 결과를 확인",
    area: "col-span-2 row-span-1",
    content: (
      <div className="font-mono text-xs text-gray-300 space-y-0.5">
        <p><span className="text-yellow-400">&gt;&gt;</span> A = [1 2 3; 4 5 6]</p>
        <p className="text-gray-500 pl-4">A = 2×3 double</p>
        <p><span className="text-yellow-400">&gt;&gt;</span> det(A*A&apos;)</p>
        <p className="text-gray-500 pl-4">ans = -27</p>
        <p><span className="text-yellow-400">&gt;&gt;</span> <span className="animate-pulse">_</span></p>
      </div>
    ),
  },
  {
    key: "folder",
    label: "Current Folder (현재 폴더)",
    desc: "파일 탐색기",
    area: "col-span-1 row-span-2",
    content: (
      <div className="font-mono text-xs text-gray-400 space-y-1">
        <p>📁 Documents</p>
        <p className="pl-3">📁 MATLAB</p>
        <p className="pl-6">📄 my_script.m</p>
        <p className="pl-6">📄 bisection.m</p>
        <p className="pl-6">📄 newton.m</p>
      </div>
    ),
  },
  {
    key: "history",
    label: "Command History",
    desc: "이전에 입력한 명령어 기록",
    area: "col-span-1 row-span-1",
    content: (
      <div className="font-mono text-xs text-gray-500 space-y-0.5">
        <p>clc; clear;</p>
        <p>A = [1 2 3; 4 5 6]</p>
        <p>det(A*A&apos;)</p>
        <p>plot(x, y)</p>
      </div>
    ),
  },
];

/* ════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════ */
export default function MatlabOverview() {
  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden">
      {/* subtle radial bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Badge ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            MATLAB Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            MATLAB이란?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-white">MAT</strong>rix{" "}
            <strong className="text-white">LAB</strong>oratory — MathWorks에서
            개발한 공학 및 과학 계산을 위한 통합 컴퓨팅 환경입니다. 수치 계산,
            데이터 시각화, 프로그래밍을 하나의 플랫폼에서 수행할 수 있습니다.
          </p>
        </motion.div>

        {/* ══════════ 1. MATLAB IDE Tour ══════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={1}
          className="mb-20"
        >
          <h3 className="text-2xl font-semibold text-white mb-2 text-center">
            MATLAB IDE 둘러보기
          </h3>
          <p className="text-gray-500 text-center mb-8 text-sm">
            MATLAB을 실행하면 아래와 같은 통합 개발 환경(IDE)이 나타납니다.
          </p>

          {/* IDE mockup frame */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 overflow-hidden shadow-2xl">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-sm text-gray-400 font-medium">
                MATLAB R2024b
              </span>
            </div>

            {/* Panels grid */}
            <div className="grid grid-cols-3 grid-rows-3 gap-px bg-slate-700 min-h-[420px]">
              {/* Current Folder — left column spanning 2 rows at top */}
              <div className="bg-slate-900 p-3 row-span-2">
                <div className="text-xs font-semibold text-teal-400 mb-1">
                  Current Folder (현재 폴더)
                </div>
                <p className="text-[10px] text-gray-500 mb-2">파일 탐색기</p>
                {idePanels.find((p) => p.key === "folder")?.content}
              </div>

              {/* Editor — center+right spanning 2 cols, 2 rows */}
              <div className="bg-slate-900 p-3 col-span-2 row-span-2">
                <div className="text-xs font-semibold text-emerald-400 mb-1">
                  Editor (편집기)
                </div>
                <p className="text-[10px] text-gray-500 mb-2">
                  스크립트(.m 파일)를 작성하고 저장
                </p>
                {idePanels.find((p) => p.key === "editor")?.content}
              </div>

              {/* Command Window — bottom left + center */}
              <div className="bg-slate-900 p-3 col-span-2">
                <div className="text-xs font-semibold text-yellow-400 mb-1">
                  Command Window (명령 창)
                </div>
                <p className="text-[10px] text-gray-500 mb-2">
                  명령어를 직접 입력하고 결과를 확인
                </p>
                {idePanels.find((p) => p.key === "command")?.content}
              </div>

              {/* Right column: Workspace + History */}
              {/* This is actually row 3, col 3 but we placed workspace here */}
              <div className="bg-slate-900 p-3 flex flex-col">
                <div className="flex-1 mb-2">
                  <div className="text-xs font-semibold text-sky-400 mb-1">
                    Workspace (작업 공간)
                  </div>
                  <p className="text-[10px] text-gray-500 mb-1">변수 목록</p>
                  {idePanels.find((p) => p.key === "workspace")?.content}
                </div>
                <div className="border-t border-slate-700 pt-2">
                  <div className="text-xs font-semibold text-purple-400 mb-1">
                    Command History
                  </div>
                  <p className="text-[10px] text-gray-500 mb-1">명령어 기록</p>
                  {idePanels.find((p) => p.key === "history")?.content}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════ 2. Why MATLAB? ══════════ */}
        <div className="mb-20">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl font-semibold text-white mb-8 text-center"
          >
            왜 수치해석에 MATLAB을 사용하는가?
          </motion.h3>

          <div className="grid sm:grid-cols-2 gap-5">
            {whyCards.map((card, i) => (
              <motion.div
                key={card.subtitle}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
                className={`rounded-2xl bg-slate-900/60 border border-slate-800 p-6 hover:border-slate-700 transition-colors`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold">{card.title}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${accentBg[card.accent]} ${accentMap[card.accent]} border`}
                    >
                      {card.subtitle}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════ 3. Comparison Table ══════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={2}
        >
          <h3 className="text-2xl font-semibold text-white mb-2 text-center">
            MATLAB vs 다른 언어
          </h3>
          <p className="text-gray-500 text-center mb-8 text-sm">
            수치해석 관점에서 주요 프로그래밍 언어를 비교합니다.
          </p>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="text-left text-gray-400 font-medium px-5 py-3">
                      비교 항목
                    </th>
                    <th className="text-center text-emerald-400 font-semibold px-5 py-3">
                      MATLAB
                    </th>
                    <th className="text-center text-sky-400 font-semibold px-5 py-3">
                      Python
                    </th>
                    <th className="text-center text-orange-400 font-semibold px-5 py-3">
                      C++
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={`border-b border-slate-800/60 ${
                        i % 2 === 0 ? "bg-slate-900/30" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-gray-300 font-medium">
                        {row.label}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-300">
                        {row.matlab}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-400">
                        {row.python}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-400">
                        {row.cpp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footnote */}
          <p className="text-gray-600 text-xs mt-4 text-center">
            * 본 수업에서는 MATLAB을 사용합니다. 학교에서 라이선스를 제공하므로
            별도 비용 없이 사용할 수 있습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
