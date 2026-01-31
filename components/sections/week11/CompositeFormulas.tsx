"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function compositeTrapezoidal(n: number): number {
  // ∫₀¹ eˣ dx
  const h = 1 / n;
  let sum = Math.exp(0) + Math.exp(1);
  for (let i = 1; i < n; i++) {
    sum += 2 * Math.exp(i * h);
  }
  return (h / 2) * sum;
}

function compositeSimpson(n: number): number {
  // n must be even; ∫₀¹ eˣ dx
  const m = n % 2 === 0 ? n : n + 1;
  const h = 1 / m;
  let sum = Math.exp(0) + Math.exp(1);
  for (let i = 1; i < m; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * Math.exp(i * h);
  }
  return (h / 3) * sum;
}

const EXACT = Math.E - 1; // e¹ - e⁰

export default function CompositeFormulas() {
  const [n, setN] = useState(4);

  const trap = compositeTrapezoidal(n);
  const simp = compositeSimpson(n);

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            복합 공식 (Composite Formulas)
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            구간을 여러 개로 나누어 기본 공식을 반복 적용하면 정확도가 크게 향상됩니다.
          </p>
        </motion.div>

        {/* Idea */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">기본 아이디어</h3>
          <p className="text-slate-300">
            구간 <M>{"[a, b]"}</M>를 <M>{"n"}</M>개의 소구간으로 나누고, 각 소구간에 기본 적분 공식을 적용합니다.
          </p>
          <MBlock>{"h = \\frac{b-a}{n}, \\quad x_i = a + ih \\quad (i = 0, 1, \\ldots, n)"}</MBlock>
        </motion.div>

        {/* Composite Trapezoidal */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">복합 사다리꼴 공식</h3>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-5">
            <MBlock>{"I \\approx \\frac{h}{2}\\left[f(x_0) + 2\\sum_{i=1}^{n-1} f(x_i) + f(x_n)\\right]"}</MBlock>
          </div>
          <p className="text-slate-300">전체 오차:</p>
          <MBlock>{"E = -\\frac{(b-a)}{12}h^2 f''(\\xi) = O(h^2)"}</MBlock>
          <p className="text-slate-400 text-sm">
            <M>{"n"}</M>을 2배로 늘리면 오차가 약 <M>{"\\frac{1}{4}"}</M>로 줄어듭니다.
          </p>
        </motion.div>

        {/* Composite Simpson */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">복합 Simpson 1/3 공식</h3>
          <p className="text-slate-300">
            <M>{"n"}</M>은 <strong>짝수</strong>여야 합니다 (각 소구간에 Simpson 1/3를 적용하려면 2개씩 묶어야 하므로).
          </p>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-5">
            <MBlock>{"I \\approx \\frac{h}{3}\\left[f(x_0) + 4\\sum_{i=1,3,5,\\ldots}^{n-1} f(x_i) + 2\\sum_{i=2,4,6,\\ldots}^{n-2} f(x_i) + f(x_n)\\right]"}</MBlock>
          </div>
          <p className="text-slate-300">전체 오차:</p>
          <MBlock>{"E = -\\frac{(b-a)}{180}h^4 f^{(4)}(\\xi) = O(h^4)"}</MBlock>
          <p className="text-slate-400 text-sm">
            <M>{"n"}</M>을 2배로 늘리면 오차가 약 <M>{"\\frac{1}{16}"}</M>로 줄어듭니다.
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">
            인터랙티브 데모: <M>{"\\displaystyle\\int_0^1 e^x\\,dx"}</M>
          </h3>
          <p className="text-slate-400 text-sm">
            정확한 값: <M>{"e - 1 \\approx 1.718282"}</M>
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-slate-300 font-medium">소구간 수 n =</label>
              <input
                type="range"
                min={1}
                max={32}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                className="flex-1 accent-fuchsia-400"
              />
              <span className="text-fuchsia-400 font-bold text-lg w-10 text-right">{n}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <p className="text-pink-400 font-semibold text-sm">복합 사다리꼴</p>
                <p className="text-2xl font-bold text-white">{trap.toFixed(8)}</p>
                <p className="text-slate-400 text-sm">
                  오차: {Math.abs(trap - EXACT).toExponential(4)}
                </p>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
                <p className="text-pink-400 font-semibold text-sm">복합 Simpson</p>
                <p className="text-2xl font-bold text-white">{simp.toFixed(8)}</p>
                <p className="text-slate-400 text-sm">
                  오차: {Math.abs(simp - EXACT).toExponential(4)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
