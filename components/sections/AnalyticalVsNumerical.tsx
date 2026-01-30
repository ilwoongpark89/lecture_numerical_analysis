"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

// Bungee jumper parameters (from textbook Example 1.1)
const g = 9.81;
const m = 68.1; // kg
const cd = 0.25; // kg/m

// Analytical solution: v(t) = sqrt(gm/cd) * tanh(sqrt(g*cd/m) * t)
function analyticalV(t: number): number {
  return Math.sqrt((g * m) / cd) * Math.tanh(Math.sqrt((g * cd) / m) * t);
}

// Parameterized versions for Part 4
function analyticalVParam(t: number, mp: number, cdp: number): number {
  return Math.sqrt((g * mp) / cdp) * Math.tanh(Math.sqrt((g * cdp) / mp) * t);
}

function analyticalDataParam(mp: number, cdp: number, tMax: number): { t: number; v: number }[] {
  const steps = Math.round(tMax / 0.1) + 1;
  return Array.from({ length: steps }, (_, i) => {
    const t = i * 0.1;
    return { t, v: analyticalVParam(t, mp, cdp) };
  });
}

function eulerSolveParam(dt: number, tMax: number, mp: number, cdp: number): { t: number; v: number }[] {
  const points: { t: number; v: number }[] = [{ t: 0, v: 0 }];
  let v = 0;
  let t = 0;
  while (t < tMax - dt / 2) {
    const dvdt = g - (cdp / mp) * v * v;
    v = v + dvdt * dt;
    t = t + dt;
    points.push({ t: Math.round(t * 1000) / 1000, v });
  }
  return points;
}

// Euler method numerical solution
function eulerSolve(dt: number, tMax: number): { t: number; v: number }[] {
  const points: { t: number; v: number }[] = [{ t: 0, v: 0 }];
  let v = 0;
  let t = 0;
  while (t < tMax - dt / 2) {
    const dvdt = g - (cd / m) * v * v;
    v = v + dvdt * dt;
    t = t + dt;
    points.push({ t: Math.round(t * 1000) / 1000, v });
  }
  return points;
}

// Analytical data for smooth curve
const analyticalData = Array.from({ length: 121 }, (_, i) => {
  const t = i * 0.1;
  return { t, v: analyticalV(t) };
});

const terminalV = Math.sqrt((g * m) / cd); // ~51.6938

const dtOptions = [
  { label: "Δt = 2 s", value: 2 },
  { label: "Δt = 1 s", value: 1 },
  { label: "Δt = 0.5 s", value: 0.5 },
  { label: "Δt = 0.1 s", value: 0.1 },
];

// Step-by-step Euler walkthrough for Δt = 2
const eulerSteps = [
  {
    i: 0,
    t: 0,
    v: 0,
    slope: "9.81 − (0.25/68.1)·0² = 9.81",
    slopeVal: 9.81,
    next: "0 + 9.81 × 2 = 19.62",
    nextVal: 19.62,
  },
  {
    i: 1,
    t: 2,
    v: 19.62,
    slope: "9.81 − (0.25/68.1)·19.62² = 8.3968",
    slopeVal: 8.3968,
    next: "19.62 + 8.3968 × 2 = 36.4137",
    nextVal: 36.4137,
  },
  {
    i: 2,
    t: 4,
    v: 36.4137,
    slope: "9.81 − (0.25/68.1)·36.41² = 4.9418",
    slopeVal: 4.9418,
    next: "36.4137 + 4.9418 × 2 = 46.2973",
    nextVal: 46.2973,
  },
  {
    i: 3,
    t: 6,
    v: 46.2973,
    slope: "9.81 − (0.25/68.1)·46.30² = 1.9452",
    slopeVal: 1.9452,
    next: "46.2973 + 1.9452 × 2 = 50.1876",
    nextVal: 50.1876,
  },
  {
    i: 4,
    t: 8,
    v: 50.1876,
    slope: "9.81 − (0.25/68.1)·50.19² = 0.5639",
    slopeVal: 0.5639,
    next: "50.1876 + 0.5639 × 2 = 51.3154",
    nextVal: 51.3154,
  },
  {
    i: 5,
    t: 10,
    v: 51.3154,
    slope: "9.81 − (0.25/68.1)·51.32² = 0.1453",
    slopeVal: 0.1453,
    next: "51.3154 + 0.1453 × 2 = 51.6059",
    nextVal: 51.6059,
  },
];

export default function AnalyticalVsNumerical() {
  const [selectedDt, setSelectedDt] = useState(2);
  const [activeDerivStep, setActiveDerivStep] = useState(0);

  // Part 4: two-case parameter comparison
  const [caseA, setCaseA] = useState({ m: 68.1, cd: 0.25 });
  const [caseB, setCaseB] = useState({ m: 100, cd: 0.25 });
  const [showA, setShowA] = useState<"analytical" | "numerical" | "both">("analytical");
  const [showB, setShowB] = useState<"analytical" | "numerical" | "both">("analytical");
  const [p4Dt, setP4Dt] = useState(2);
  const p4TMax = 30;

  const numericalData = useMemo(() => eulerSolve(selectedDt, 12), [selectedDt]);

  const curveA_a = useMemo(() => analyticalDataParam(caseA.m, caseA.cd, p4TMax), [caseA.m, caseA.cd]);
  const curveA_n = useMemo(() => eulerSolveParam(p4Dt, p4TMax, caseA.m, caseA.cd), [p4Dt, caseA.m, caseA.cd]);
  const curveB_a = useMemo(() => analyticalDataParam(caseB.m, caseB.cd, p4TMax), [caseB.m, caseB.cd]);
  const curveB_n = useMemo(() => eulerSolveParam(p4Dt, p4TMax, caseB.m, caseB.cd), [p4Dt, caseB.m, caseB.cd]);
  const terminalA = Math.sqrt((g * caseA.m) / caseA.cd);
  const terminalB = Math.sqrt((g * caseB.m) / caseB.cd);
  const yMaxP4 = Math.ceil(Math.max(terminalA, terminalB, 60) / 10) * 10;

  // SVG chart dimensions
  const W = 600, H = 320, PAD = 50;
  const xMax = 12, yMax = 60;
  const scaleX = (t: number) => PAD + (t / xMax) * (W - PAD * 2);
  const scaleY = (v: number) => H - PAD - (v / yMax) * (H - PAD * 2);

  const derivSteps = [
    {
      title: "Step 1: 문제 설정",
      subtitle: "번지점퍼에 작용하는 힘",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            질량 <span className="text-blue-400 font-mono">m = 68.1 kg</span>인 사람이 번지점프를 합니다.
            자유낙하 중 두 가지 힘이 작용합니다:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <div className="text-emerald-400 font-bold text-sm mb-1">중력 (하향)</div>
              <div className="text-gray-300 text-center text-lg mt-2"><M>{"F_{D} = mg"}</M></div>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
              <div className="text-rose-400 font-bold text-sm mb-1">공기저항 (상향)</div>
              <div className="text-gray-300 text-center text-lg mt-2"><M>{"F_{U} = c_{d}v^{2}"}</M></div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            <M>{"c_{d}"}</M> = 0.25 kg/m (항력계수), v = 속도 (m/s)
          </p>
        </div>
      ),
    },
    {
      title: "Step 2: 뉴턴 제2법칙",
      subtitle: "운동방정식 유도",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            뉴턴 제2법칙 <M>{"F = ma"}</M>를 적용합니다:
          </p>
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-lg p-3 text-center text-gray-300">
              <M>{"ma = mg - c_{d}v^{2}"}</M>
            </div>
            <div className="flex items-center justify-center text-gray-500">↓ 양변을 m으로 나누면</div>
            <div className="bg-slate-900/60 rounded-lg p-3 text-center text-gray-300">
              <M>{"a = \\frac{dv}{dt} = g - \\frac{c_{d}}{m}v^{2}"}</M>
            </div>
            <div className="flex items-center justify-center text-gray-500">↓ 값을 대입하면</div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center text-cyan-300 text-lg">
              <M>{"\\frac{dv}{dt} = 9.81 - (0.003670)v^{2}"}</M>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            이것이 우리가 풀어야 할 <span className="text-cyan-400">1차 상미분방정식(ODE)</span>입니다. 초기조건: v(0) = 0
          </p>
        </div>
      ),
    },
    {
      title: "Step 3: 해석해 (Analytical)",
      subtitle: "미적분으로 정확한 해 구하기",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            이 특정 ODE는 <span className="text-emerald-400">변수분리법</span>으로 풀 수 있습니다:
          </p>
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-lg p-3 text-sm text-center text-gray-300">
              <M>{"\\frac{dv}{g - (c_{d}/m)v^{2}} = dt"}</M>
            </div>
            <div className="flex items-center justify-center text-gray-500">↓ 양변을 적분하면</div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center text-emerald-300">
              <div className="text-lg"><M>{"v(t) = \\sqrt{\\frac{gm}{c_{d}}} \\cdot \\tanh\\!\\left(\\sqrt{\\frac{gc_{d}}{m}} \\cdot t\\right)"}</M></div>
            </div>
            <div className="flex items-center justify-center text-gray-500">↓ 숫자를 넣으면</div>
            <div className="bg-slate-900/60 rounded-lg p-3 text-center text-gray-300">
              <M>{"v(t) = 51.6938 \\cdot \\tanh(0.18977 \\cdot t)"}</M>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            이 해는 <span className="text-white">정확</span>합니다. 하지만 이런 풀이가 가능한 건 이 ODE가 특별히 단순하기 때문입니다.
          </p>
        </div>
      ),
    },
    {
      title: "Step 4: 종단속도",
      subtitle: "t → ∞ 일 때의 속도",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            충분한 시간이 지나면 가속이 멈추고 <span className="text-amber-400">일정한 속도</span>에 도달합니다:
          </p>
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-lg p-3 text-center text-gray-300">
              <M>{"\\frac{dv}{dt} = 0 \\;\\Rightarrow\\; g = \\frac{c_{d}}{m}v^{2}"}</M>
            </div>
            <div className="flex items-center justify-center text-gray-500">↓ v에 대해 풀면</div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
              <div className="text-amber-300 text-lg"><M>{"v_{\\text{terminal}} = \\sqrt{\\frac{gm}{c_{d}}}"}</M></div>
              <div className="text-amber-400 text-xl font-bold mt-2">= 51.6938 m/s</div>
              <div className="text-gray-500 text-sm mt-1">≈ 186 km/h</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            이 값은 해석해에서 tanh(∞) = 1이므로 직접 확인할 수 있습니다.
            물리적으로는 중력과 공기저항이 평형을 이루는 순간입니다.
          </p>
        </div>
      ),
    },
    {
      title: "Step 5: 수치해의 아이디어",
      subtitle: "미분을 유한차분으로 근사",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            만약 해석해를 구할 수 없다면? <span className="text-rose-400">미분을 근사</span>하는 것이 핵심 아이디어입니다:
          </p>
          <div className="space-y-3">
            <div className="bg-slate-900/60 rounded-lg p-3 text-center text-gray-300">
              <M>{"\\frac{dv}{dt} \\approx \\frac{\\Delta v}{\\Delta t} = \\frac{v_{i+1} - v_{i}}{t_{i+1} - t_{i}}"}</M>
            </div>
            <div className="flex items-center justify-center text-gray-500">↓ <M>{"v_{i+1}"}</M>에 대해 정리하면</div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-center">
              <div className="text-rose-300 text-lg"><M>{"v_{i+1} = v_{i} + \\frac{dv_{i}}{dt} \\cdot \\Delta t"}</M></div>
              <div className="text-gray-400 text-sm mt-2">New Value = Old Value + Slope × Step Size</div>
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-3 mt-2">
            <p className="text-xs text-gray-400 leading-relaxed">
              이것이 <span className="text-rose-400 font-bold">Euler Method</span>입니다.
              현재 위치에서의 기울기(slope)를 사용하여 다음 위치를 예측합니다.
              Δt가 작을수록 정확하지만, 계산량이 늘어납니다.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            Bungee Jumper Example
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            수식 유도부터 수치해까지
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            번지점퍼의 자유낙하 — 물리 모델링에서 Euler Method까지 단계별로 따라갑니다
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">

          {/* ===== Part 1: Step-by-step Derivation ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">Part 1</span>
              수식 유도
            </h3>

            {/* Step navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {derivSteps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDerivStep(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDerivStep === i
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>

            {/* Step content */}
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
              <div className="mb-1 text-xs text-gray-500 uppercase tracking-wider">
                {derivSteps[activeDerivStep].title}
              </div>
              <h4 className="text-white font-bold text-lg mb-4">
                {derivSteps[activeDerivStep].subtitle}
              </h4>
              {derivSteps[activeDerivStep].content}
            </div>

            {/* Parameters summary (always visible) */}
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">m = 68.1 kg</span>
              <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300"><M>{"c_{d}"}</M> = 0.25 kg/m</span>
              <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">g = 9.81 m/s<M>{"^{2}"}</M></span>
              <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">v(0) = 0</span>
            </div>
          </motion.div>

          {/* ===== Part 2: Interactive Chart (existing) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">Part 2</span>
              해석해 vs 수치해 비교
            </h3>

            {/* Δt Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {dtOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDt(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDt === opt.value
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }}>
                {/* Grid */}
                {[0, 10, 20, 30, 40, 50, 60].map((v) => (
                  <g key={v}>
                    <line x1={PAD} y1={scaleY(v)} x2={W - PAD} y2={scaleY(v)} stroke="#334155" strokeWidth={0.5} />
                    <text x={PAD - 8} y={scaleY(v) + 4} textAnchor="end" fill="#64748b" fontSize={10}>{v}</text>
                  </g>
                ))}
                {[0, 2, 4, 6, 8, 10, 12].map((t) => (
                  <g key={t}>
                    <line x1={scaleX(t)} y1={PAD / 2} x2={scaleX(t)} y2={H - PAD} stroke="#334155" strokeWidth={0.5} />
                    <text x={scaleX(t)} y={H - PAD + 16} textAnchor="middle" fill="#64748b" fontSize={10}>{t}</text>
                  </g>
                ))}

                {/* Terminal velocity */}
                <line x1={PAD} y1={scaleY(terminalV)} x2={W - PAD} y2={scaleY(terminalV)} stroke="#475569" strokeWidth={1} strokeDasharray="6 4" />
                <text x={W - PAD - 5} y={scaleY(terminalV) - 6} textAnchor="end" fill="#64748b" fontSize={9}>Terminal: {terminalV.toFixed(1)} m/s</text>

                {/* Analytical (smooth cyan line) */}
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  points={analyticalData.map((d) => `${scaleX(d.t)},${scaleY(d.v)}`).join(" ")}
                />

                {/* Numerical (red line with dots) */}
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  points={numericalData.map((d) => `${scaleX(d.t)},${scaleY(d.v)}`).join(" ")}
                />
                {selectedDt >= 0.5 && numericalData.map((d, i) => (
                  <circle key={i} cx={scaleX(d.t)} cy={scaleY(d.v)} r={3} fill="#f43f5e" />
                ))}

                {/* Axis labels */}
                <text x={W / 2} y={H - 5} textAnchor="middle" fill="#94a3b8" fontSize={11}>t (s)</text>
                <text x={12} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize={11} transform={`rotate(-90 12 ${H / 2})`}>v (m/s)</text>

                {/* Legend */}
                <line x1={PAD + 10} y1={20} x2={PAD + 30} y2={20} stroke="#22d3ee" strokeWidth={2} />
                <text x={PAD + 35} y={24} fill="#22d3ee" fontSize={10}>Analytical</text>
                <line x1={PAD + 110} y1={20} x2={PAD + 130} y2={20} stroke="#f43f5e" strokeWidth={2} />
                <circle cx={PAD + 120} cy={20} r={3} fill="#f43f5e" />
                <text x={PAD + 135} y={24} fill="#f43f5e" fontSize={10}>Numerical (Δt = {selectedDt})</text>
              </svg>
            </div>

            {/* Data Table */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 text-sm font-bold text-cyan-400">Analytical Solution</div>
                <div className="divide-y divide-slate-700/50">
                  {[0, 2, 4, 6, 8, 10, 12].map((t) => (
                    <div key={t} className="px-4 py-2 flex justify-between text-sm">
                      <span className="text-gray-500 font-mono">t = {t} s</span>
                      <span className="text-gray-300 font-mono">{analyticalV(t).toFixed(4)} m/s</span>
                    </div>
                  ))}
                  <div className="px-4 py-2 flex justify-between text-sm bg-cyan-500/5">
                    <span className="text-gray-500 font-mono">t = ∞</span>
                    <span className="text-cyan-400 font-mono font-bold">{terminalV.toFixed(4)} m/s</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 text-sm font-bold text-rose-400">Numerical (Δt = {selectedDt} s)</div>
                <div className="divide-y divide-slate-700/50 max-h-[300px] overflow-y-auto">
                  {numericalData.filter((_, i) => selectedDt < 0.5 ? i % Math.round(2 / selectedDt) === 0 : true).map((d, i) => (
                    <div key={i} className="px-4 py-2 flex justify-between text-sm">
                      <span className="text-gray-500 font-mono">t = {d.t.toFixed(selectedDt < 1 ? 1 : 0)} s</span>
                      <span className="text-gray-300 font-mono">{d.v.toFixed(4)} m/s</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Insight */}
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6 text-center">
              <p className="text-white font-medium">
                Δt가 작아질수록 수치해가 해석해에 가까워집니다.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                그러나 수치해의 진정한 힘은 — 해석해가 존재하지 않는 경우에도 적용할 수 있다는 점입니다.
                <br />
                만약 <M>{"c_{d}"}</M>가 속도의 복잡한 함수라면? 해석해는 불가능하지만, 수치해는 동일한 방법으로 구할 수 있습니다.
              </p>
            </div>
          </motion.div>

          {/* ===== Part 3: MATLAB Script & Step-by-step Euler ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-sm">Part 3</span>
              MATLAB로 직접 구현하기
            </h3>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* MATLAB Script */}
              <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-sm font-bold text-white">bungee_euler.m</span>
                </div>
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
                  <code>{`% Bungee Jumper - Euler Method
g  = 9.81;
m  = 68.1;    % kg
cd = 0.25;    % kg/m
dt = 2;       % step size (s)
tEnd = 12;    % end time (s)

% Initial conditions
t = 0;
v = 0;

% Euler iteration
fprintf('  t(s)    v_num    v_exact\\n')
fprintf('----------------------------\\n')

while t <= tEnd
    % Analytical solution
    vExact = sqrt(g*m/cd) * ...
             tanh(sqrt(g*cd/m)*t);

    fprintf('%5.1f  %8.4f  %8.4f\\n',...
            t, v, vExact)

    % Euler step
    dvdt = g - (cd/m)*v^2;
    v = v + dvdt * dt;
    t = t + dt;
end`}</code>
                </pre>
              </div>

              {/* Step-by-step walkthrough */}
              <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-bold text-white">Euler 계산 과정 (Δt = 2s)</span>
                </div>
                <div className="divide-y divide-slate-700/50 max-h-[500px] overflow-y-auto">
                  {eulerSteps.map((step) => (
                    <div key={step.i} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-slate-700 text-xs font-mono text-gray-400">
                          i = {step.i}
                        </span>
                        <span className="text-sm text-white font-medium">
                          t = {step.t}s, v = {step.v.toFixed(4)} m/s
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="text-gray-400">
                          <span className="text-gray-600">slope:</span>{" "}
                          <span className="text-amber-300">{step.slope}</span>
                        </div>
                        <div className="text-gray-400">
                          <span className="text-gray-600"><M>{"v_{\\text{next}}"}</M>:</span>{" "}
                          <span className="text-rose-300">{step.next}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="text-gray-600">해석해:</span>
                        <span className="text-cyan-400 font-mono">{analyticalV(step.t).toFixed(4)}</span>
                        <span className="text-gray-600">오차:</span>
                        <span className={`font-mono ${Math.abs(step.v - analyticalV(step.t)) / (analyticalV(step.t) || 1) > 0.1 ? "text-rose-400" : "text-emerald-400"}`}>
                          {step.t === 0 ? "0%" : `${(Math.abs(step.v - analyticalV(step.t)) / analyticalV(step.t) * 100).toFixed(2)}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison MATLAB scripts for different dt */}
            <div className="mt-8">
              <h4 className="text-white font-bold mb-4">Δt에 따른 오차 비교</h4>
              <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-white">bungee_compare.m</span>
                </div>
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
                  <code>{`% Compare Euler with different step sizes
g = 9.81;  m = 68.1;  cd = 0.25;
tEnd = 12;
dtList = [2, 1, 0.5, 0.1];

figure; hold on;

% Analytical (fine grid)
tExact = 0:0.01:tEnd;
vExact = sqrt(g*m/cd) * tanh(sqrt(g*cd/m)*tExact);
plot(tExact, vExact, 'b-', 'LineWidth', 2)

% Euler for each dt
colors = {'r--o','m--s','g--d','k--'};
for k = 1:length(dtList)
    dt = dtList(k);
    t = 0:dt:tEnd;
    v = zeros(size(t));
    for i = 1:length(t)-1
        dvdt = g - (cd/m)*v(i)^2;
        v(i+1) = v(i) + dvdt*dt;
    end
    plot(t, v, colors{k}, 'LineWidth', 1.5)
end

legend('Analytical','dt=2','dt=1','dt=0.5','dt=0.1')
xlabel('t (s)');  ylabel('v (m/s)')
title('Bungee Jumper: Euler Method Convergence')
grid on`}</code>
                </pre>
              </div>
            </div>

            {/* Error at t=12 comparison table */}
            <div className="mt-6 rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700 text-sm font-bold text-white">
                t = 12s에서의 오차 비교
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-gray-400">
                      <th className="px-4 py-2 text-left font-medium">Δt</th>
                      <th className="px-4 py-2 text-right font-medium">수치해 v(12)</th>
                      <th className="px-4 py-2 text-right font-medium">해석해 v(12)</th>
                      <th className="px-4 py-2 text-right font-medium">오차</th>
                      <th className="px-4 py-2 text-right font-medium">상대오차</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {dtOptions.map((opt) => {
                      const numData = eulerSolve(opt.value, 12);
                      const numV = numData[numData.length - 1].v;
                      const exactV = analyticalV(12);
                      const err = Math.abs(numV - exactV);
                      const relErr = (err / exactV) * 100;
                      return (
                        <tr key={opt.value} className="text-gray-300 font-mono">
                          <td className="px-4 py-2 text-rose-400">{opt.value} s</td>
                          <td className="px-4 py-2 text-right">{numV.toFixed(4)}</td>
                          <td className="px-4 py-2 text-right text-cyan-400">{exactV.toFixed(4)}</td>
                          <td className="px-4 py-2 text-right">{err.toFixed(4)}</td>
                          <td className={`px-4 py-2 text-right ${relErr > 1 ? "text-rose-400" : relErr > 0.1 ? "text-amber-400" : "text-emerald-400"}`}>
                            {relErr.toFixed(4)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise prompt */}
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 p-6">
              <h4 className="text-violet-400 font-bold mb-3">Exercise</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                위의 MATLAB 코드를 직접 실행해보세요.
              </p>
              <ol className="mt-3 space-y-2 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-violet-400 font-bold">1.</span>
                  <span><code className="text-gray-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">bungee_euler.m</code>을 실행하고, Δt를 2, 1, 0.5, 0.1로 바꿔가며 출력을 비교하세요.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 font-bold">2.</span>
                  <span><code className="text-gray-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">bungee_compare.m</code>을 실행하여 그래프로 수렴 과정을 확인하세요.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 font-bold">3.</span>
                  <span>Δt = 0.01로 했을 때 t = 12s에서의 상대오차는 얼마인가요?</span>
                </li>
              </ol>
            </div>
          </motion.div>

          {/* ===== Part 4: Parameter Playground ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">Part 4</span>
              파라미터 실험실
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              질량(m)과 항력계수(<M>{"c_{d}"}</M>)를 바꾸고, 해석해/수치해를 선택하여 두 케이스를 비교해보세요.
            </p>

            {/* Global Δt selector */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-gray-400">Euler Δt:</span>
              {[2, 1, 0.5, 0.1].map((dt) => (
                <button
                  key={dt}
                  onClick={() => setP4Dt(dt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    p4Dt === dt
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                  }`}
                >
                  {dt} s
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Case A */}
              <div className="rounded-2xl bg-cyan-500/5 border border-cyan-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-400" />
                    <h4 className="text-cyan-400 font-bold text-sm">Case A</h4>
                  </div>
                  <div className="flex gap-1">
                    {(["analytical", "numerical", "both"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setShowA(mode)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                          showA === mode
                            ? "bg-cyan-500 text-white"
                            : "bg-slate-800 text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {mode === "analytical" ? "Analytical" : mode === "numerical" ? "Numerical" : "Both"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">질량 m</span>
                      <span className="text-cyan-300 font-mono font-bold">{caseA.m.toFixed(1)} kg</span>
                    </div>
                    <input type="range" min={30} max={150} step={0.1} value={caseA.m}
                      onChange={(e) => setCaseA((p) => ({ ...p, m: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-cyan-400 cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-0.5"><span>30</span><span>150 kg</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">항력계수 <M>{"c_{d}"}</M></span>
                      <span className="text-cyan-300 font-mono font-bold">{caseA.cd.toFixed(2)} kg/m</span>
                    </div>
                    <input type="range" min={0.05} max={1.0} step={0.01} value={caseA.cd}
                      onChange={(e) => setCaseA((p) => ({ ...p, cd: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-cyan-400 cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-0.5"><span>0.05</span><span>1.00</span></div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <span className="text-xs text-gray-500">종단속도: </span>
                    <span className="text-cyan-400 font-mono font-bold">{terminalA.toFixed(2)} m/s</span>
                    <span className="text-gray-600 text-xs ml-2">({(terminalA * 3.6).toFixed(0)} km/h)</span>
                  </div>
                </div>
              </div>

              {/* Case B */}
              <div className="rounded-2xl bg-rose-500/5 border border-rose-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-rose-400" />
                    <h4 className="text-rose-400 font-bold text-sm">Case B</h4>
                  </div>
                  <div className="flex gap-1">
                    {(["analytical", "numerical", "both"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setShowB(mode)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                          showB === mode
                            ? "bg-rose-500 text-white"
                            : "bg-slate-800 text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {mode === "analytical" ? "Analytical" : mode === "numerical" ? "Numerical" : "Both"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">질량 m</span>
                      <span className="text-rose-300 font-mono font-bold">{caseB.m.toFixed(1)} kg</span>
                    </div>
                    <input type="range" min={30} max={150} step={0.1} value={caseB.m}
                      onChange={(e) => setCaseB((p) => ({ ...p, m: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-rose-400 cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-0.5"><span>30</span><span>150 kg</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">항력계수 <M>{"c_{d}"}</M></span>
                      <span className="text-rose-300 font-mono font-bold">{caseB.cd.toFixed(2)} kg/m</span>
                    </div>
                    <input type="range" min={0.05} max={1.0} step={0.01} value={caseB.cd}
                      onChange={(e) => setCaseB((p) => ({ ...p, cd: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-rose-400 cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-0.5"><span>0.05</span><span>1.00</span></div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3 text-center">
                    <span className="text-xs text-gray-500">종단속도: </span>
                    <span className="text-rose-400 font-mono font-bold">{terminalB.toFixed(2)} m/s</span>
                    <span className="text-gray-600 text-xs ml-2">({(terminalB * 3.6).toFixed(0)} km/h)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Chart — t = 0..30s */}
            {(() => {
              const p4W = 700, p4H = 360, p4PAD = 55;
              const p4ScaleX = (t: number) => p4PAD + (t / p4TMax) * (p4W - p4PAD * 2);
              const p4ScaleY = (v: number) => p4H - p4PAD - (v / yMaxP4) * (p4H - p4PAD * 2);
              const tTicks = [0, 5, 10, 15, 20, 25, 30];
              const vTicks = Array.from({ length: Math.floor(yMaxP4 / 10) + 1 }, (_, i) => i * 10);
              return (
                <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
                  <svg viewBox={`0 0 ${p4W} ${p4H}`} className="w-full" style={{ maxHeight: 440 }}>
                    {/* Grid */}
                    {vTicks.map((v) => (
                      <g key={`v${v}`}>
                        <line x1={p4PAD} y1={p4ScaleY(v)} x2={p4W - p4PAD} y2={p4ScaleY(v)} stroke="#334155" strokeWidth={0.5} />
                        <text x={p4PAD - 8} y={p4ScaleY(v) + 4} textAnchor="end" fill="#64748b" fontSize={10}>{v}</text>
                      </g>
                    ))}
                    {tTicks.map((t) => (
                      <g key={`t${t}`}>
                        <line x1={p4ScaleX(t)} y1={p4PAD / 2} x2={p4ScaleX(t)} y2={p4H - p4PAD} stroke="#334155" strokeWidth={0.5} />
                        <text x={p4ScaleX(t)} y={p4H - p4PAD + 16} textAnchor="middle" fill="#64748b" fontSize={10}>{t}</text>
                      </g>
                    ))}

                    {/* Terminal velocity dashes */}
                    <line x1={p4PAD} y1={p4ScaleY(terminalA)} x2={p4W - p4PAD} y2={p4ScaleY(terminalA)} stroke="#22d3ee" strokeWidth={0.8} strokeDasharray="4 4" opacity={0.4} />
                    <line x1={p4PAD} y1={p4ScaleY(terminalB)} x2={p4W - p4PAD} y2={p4ScaleY(terminalB)} stroke="#f43f5e" strokeWidth={0.8} strokeDasharray="4 4" opacity={0.4} />

                    {/* Case A — Analytical (solid) */}
                    {(showA === "analytical" || showA === "both") && (
                      <polyline fill="none" stroke="#22d3ee" strokeWidth={2.5}
                        points={curveA_a.map((d) => `${p4ScaleX(d.t)},${p4ScaleY(d.v)}`).join(" ")} />
                    )}
                    {/* Case A — Numerical (dashed + dots) */}
                    {(showA === "numerical" || showA === "both") && (
                      <>
                        <polyline fill="none" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray={showA === "both" ? "6 3" : "0"}
                          opacity={showA === "both" ? 0.7 : 1}
                          points={curveA_n.map((d) => `${p4ScaleX(d.t)},${p4ScaleY(d.v)}`).join(" ")} />
                        {p4Dt >= 0.5 && curveA_n.map((d, i) => (
                          <circle key={`an${i}`} cx={p4ScaleX(d.t)} cy={p4ScaleY(d.v)} r={2.5} fill="#22d3ee" opacity={showA === "both" ? 0.7 : 1} />
                        ))}
                      </>
                    )}

                    {/* Case B — Analytical (solid) */}
                    {(showB === "analytical" || showB === "both") && (
                      <polyline fill="none" stroke="#f43f5e" strokeWidth={2.5}
                        points={curveB_a.map((d) => `${p4ScaleX(d.t)},${p4ScaleY(d.v)}`).join(" ")} />
                    )}
                    {/* Case B — Numerical (dashed + dots) */}
                    {(showB === "numerical" || showB === "both") && (
                      <>
                        <polyline fill="none" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray={showB === "both" ? "6 3" : "0"}
                          opacity={showB === "both" ? 0.7 : 1}
                          points={curveB_n.map((d) => `${p4ScaleX(d.t)},${p4ScaleY(d.v)}`).join(" ")} />
                        {p4Dt >= 0.5 && curveB_n.map((d, i) => (
                          <circle key={`bn${i}`} cx={p4ScaleX(d.t)} cy={p4ScaleY(d.v)} r={2.5} fill="#f43f5e" opacity={showB === "both" ? 0.7 : 1} />
                        ))}
                      </>
                    )}

                    {/* Axis labels */}
                    <text x={p4W / 2} y={p4H - 5} textAnchor="middle" fill="#94a3b8" fontSize={11}>t (s)</text>
                    <text x={14} y={p4H / 2} textAnchor="middle" fill="#94a3b8" fontSize={11} transform={`rotate(-90 14 ${p4H / 2})`}>v (m/s)</text>

                    {/* Legend */}
                    <line x1={p4PAD + 10} y1={18} x2={p4PAD + 30} y2={18} stroke="#22d3ee" strokeWidth={2.5} />
                    <text x={p4PAD + 35} y={22} fill="#22d3ee" fontSize={9}>
                      A: m={caseA.m.toFixed(1)}, c_d={caseA.cd.toFixed(2)} [{showA}]
                    </text>
                    <line x1={p4PAD + 10} y1={34} x2={p4PAD + 30} y2={34} stroke="#f43f5e" strokeWidth={2.5} />
                    <text x={p4PAD + 35} y={38} fill="#f43f5e" fontSize={9}>
                      B: m={caseB.m.toFixed(1)}, c_d={caseB.cd.toFixed(2)} [{showB}]
                    </text>
                    {(showA !== "analytical" || showB !== "analytical") && (
                      <text x={p4W - p4PAD - 5} y={22} textAnchor="end" fill="#64748b" fontSize={9}>
                        Euler Δt = {p4Dt}s
                      </text>
                    )}
                  </svg>
                </div>
              );
            })()}

            {/* Quick comparison stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "v(4s)", tVal: 4 },
                { label: "v(8s)", tVal: 8 },
                { label: "v(15s)", tVal: 15 },
                { label: "v(25s)", tVal: 25 },
                { label: "v(∞)", tVal: Infinity },
              ].map((item) => {
                const a = item.tVal === Infinity ? terminalA : analyticalVParam(item.tVal, caseA.m, caseA.cd);
                const b = item.tVal === Infinity ? terminalB : analyticalVParam(item.tVal, caseB.m, caseB.cd);
                return (
                  <div key={item.label} className="rounded-xl bg-slate-900/60 border border-slate-700 p-3 text-center">
                    <div className="text-xs text-gray-500 mb-2 font-mono">{item.label}</div>
                    <div className="flex justify-center gap-3">
                      <span className="text-cyan-400 font-mono text-sm font-bold">{a.toFixed(1)}</span>
                      <span className="text-gray-600">vs</span>
                      <span className="text-rose-400 font-mono text-sm font-bold">{b.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Physical insight */}
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6">
              <h4 className="text-purple-400 font-bold mb-3">물리적 직관</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <span className="text-white font-medium">질량(m)이 클수록:</span>
                  <p className="text-gray-400 mt-1">종단속도 ↑, 가속 초기에 더 빠르게 속도 증가. 무거운 사람이 더 빨리 떨어집니다.</p>
                </div>
                <div>
                  <span className="text-white font-medium">항력계수(<M>{"c_{d}"}</M>)가 클수록:</span>
                  <p className="text-gray-400 mt-1">종단속도 ↓, 공기저항이 커서 더 빨리 감속. 낙하산을 펼친 효과입니다.</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Numerical에서 Δt를 줄여보세요 — 수치해가 해석해에 수렴하는 과정을 두 케이스에서 동시에 확인할 수 있습니다.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
