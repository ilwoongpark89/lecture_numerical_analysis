"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

/* ── Helper: code block with line numbers ── */
function CodeBlock({ code, output }: { code: string; output?: string }) {
  const lines = code.trim().split("\n");
  return (
    <div className="rounded-xl overflow-hidden text-sm font-mono">
      <div className="bg-slate-950 border border-slate-800 p-4 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="select-none text-slate-600 w-8 shrink-0 text-right mr-4">
              {i + 1}
            </span>
            <span className="text-amber-300">{line}</span>
          </div>
        ))}
      </div>
      {output && (
        <div className="bg-slate-900 border border-t-0 border-slate-800 p-4">
          <p className="text-xs text-slate-500 mb-1">Output:</p>
          <pre className="text-orange-300 whitespace-pre-wrap text-xs">{output}</pre>
        </div>
      )}
    </div>
  );
}

/* ── Fade animation preset ── */
const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

/* ── Iteration table data ── */
const epsIterations = [
  { step: 1, e: "1", onePlusE: "2", gt1: true },
  { step: 2, e: "0.5", onePlusE: "1.5", gt1: true },
  { step: 3, e: "0.25", onePlusE: "1.25", gt1: true },
  { step: "...", e: "...", onePlusE: "...", gt1: true },
  { step: 50, e: "2^(-49) ≈ 1.78e-15", onePlusE: "1 + 1.78e-15", gt1: true },
  { step: 51, e: "2^(-50) ≈ 8.88e-16", onePlusE: "1 + 8.88e-16", gt1: true },
  { step: 52, e: "2^(-51) ≈ 4.44e-16", onePlusE: "1 + 4.44e-16", gt1: true },
  { step: 53, e: "2^(-52) ≈ 2.22e-16", onePlusE: "1 + 2.22e-16", gt1: true },
  { step: 54, e: "2^(-53) ≈ 1.11e-16", onePlusE: "1.0 (= 1)", gt1: false },
];

/* ══════════════════════════════════════════════════════════ */
export default function MachineEpsilon() {
  const [showAllSteps, setShowAllSteps] = useState(false);

  return (
    <section className="bg-slate-950 py-24 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ── 1. Header ── */}
        <motion.div {...fade} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-400 text-sm font-semibold tracking-wide border border-amber-400/20">
            Week 3 — Errors
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            머신 엡실론과 반올림 오차
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            컴퓨터의 유한한 표현 능력이 수치 계산에 미치는 영향을 이해합니다.
            Machine Epsilon, Roundoff Error, Cancellation Error를 학습합니다.
          </p>
        </motion.div>

        {/* ── 2. Accuracy vs Precision ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">◎</span>
            Accuracy vs Precision — 왜 구분해야 하는가
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 text-sm text-slate-400 leading-relaxed space-y-3">
            <p>
              수치해석에서는 두 종류의 오차가 동시에 발생합니다:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 space-y-1">
                <p className="text-rose-400 font-bold">Truncation Error (절단 오차)</p>
                <p className="text-slate-400 text-xs">무한 급수를 유한 항에서 자를 때 생기는 오차</p>
                <p className="text-slate-400 text-xs">→ <span className="text-white font-semibold">알고리즘의 한계</span> = Accuracy 문제</p>
                <p className="text-slate-400 text-xs">→ 해결: 더 많은 항, 더 나은 알고리즘</p>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-1">
                <p className="text-blue-400 font-bold">Roundoff Error (반올림 오차)</p>
                <p className="text-slate-400 text-xs">유한 비트로 실수를 저장할 때 생기는 오차</p>
                <p className="text-slate-400 text-xs">→ <span className="text-white font-semibold">컴퓨터의 한계</span> = Precision 문제</p>
                <p className="text-slate-400 text-xs">→ 해결: 더 높은 비트 수 (double → quad)</p>
              </div>
            </div>
            <p>
              이 둘은 <span className="text-amber-300 font-bold">원인도 다르고, 해결법도 다릅니다</span>.
              정밀도를 높이면(double → quad) roundoff error는 줄지만 truncation error는 그대로입니다.
              반대로, 알고리즘을 개선하면 truncation error는 줄지만 roundoff error는 그대로입니다.
              따라서 두 개념을 구분하지 못하면 <span className="text-rose-400">엉뚱한 방향으로 노력을 낭비</span>하게 됩니다.
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 text-sm space-y-2">
            <p className="text-slate-500">
              <span className="text-slate-400 font-semibold">교과서 참고:</span>{" "}
              Chapra &amp; Canale, <span className="italic">Numerical Methods for Engineers</span> Ch.3 (§3.2 Accuracy and Precision)에서는
              오차를 다루기 <span className="text-white">전에</span> 이 두 개념을 먼저 정의합니다.
            </p>
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 text-xs text-slate-400 italic">
              &quot;The concept of significant figures has direct relevance to the notion of accuracy and precision.
              Accuracy refers to how closely a computed or measured value agrees with the true value.
              Precision refers to how closely individual computed or measured values agree with each other.&quot;
              <span className="not-italic text-slate-600"> — Chapra &amp; Canale, §3.2</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Accuracy card */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h4 className="text-orange-400 font-bold text-lg">Accuracy (정확도)</h4>
              <p className="text-slate-400 text-sm">
                측정값이 <span className="text-white font-semibold">참값(true value)</span>에
                얼마나 가까운지를 나타냅니다.
              </p>
              {/* Dart board — accurate but not precise */}
              <div className="flex justify-center">
                <div className="relative w-36 h-36 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full border border-slate-700/60" />
                  <div className="absolute w-12 h-12 rounded-full border border-slate-700/60" />
                  <div className="absolute w-2 h-2 rounded-full bg-amber-400" />
                  {/* Scattered near center */}
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "42%", left: "55%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "52%", left: "40%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "45%", left: "48%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "55%", left: "53%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "48%", left: "58%" }} />
                </div>
              </div>
              <p className="text-center text-xs text-slate-500">
                High Accuracy, Low Precision — 중심 근처이지만 분산됨
              </p>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 text-sm font-mono text-slate-300">
                <p>참값 = 3.14159265...</p>
                <p className="text-orange-300">결과: 3.14, 3.15, 3.13, 3.14</p>
                <p className="text-amber-400 text-xs mt-1">→ 평균이 참값에 가까움</p>
              </div>
            </div>

            {/* Precision card */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h4 className="text-orange-400 font-bold text-lg">Precision (정밀도)</h4>
              <p className="text-slate-400 text-sm">
                반복 측정의 결과가 서로 얼마나
                <span className="text-white font-semibold"> 일관(reproducible)</span>되는지를 나타냅니다.
              </p>
              {/* Dart board — precise but not accurate */}
              <div className="flex justify-center">
                <div className="relative w-36 h-36 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full border border-slate-700/60" />
                  <div className="absolute w-12 h-12 rounded-full border border-slate-700/60" />
                  <div className="absolute w-2 h-2 rounded-full bg-amber-400" />
                  {/* Clustered but off-center */}
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "22%", left: "72%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "25%", left: "75%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "20%", left: "74%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "24%", left: "70%" }} />
                  <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: "23%", left: "73%" }} />
                </div>
              </div>
              <p className="text-center text-xs text-slate-500">
                Low Accuracy, High Precision — 모여 있지만 중심에서 벗어남
              </p>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 text-sm font-mono text-slate-300">
                <p>참값 = 3.14159265...</p>
                <p className="text-orange-300">결과: 3.52, 3.52, 3.53, 3.52</p>
                <p className="text-amber-400 text-xs mt-1">→ 일관적이지만 참값과 다름</p>
              </div>
            </div>
          </div>

          {/* Summary comparison */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-500 pb-3 pr-6">구분</th>
                    <th className="text-left text-slate-500 pb-3 pr-6">Accuracy (정확도)</th>
                    <th className="text-left text-slate-500 pb-3">Precision (정밀도)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800/50">
                    <td className="py-3 pr-6 text-amber-400 font-semibold">의미</td>
                    <td className="py-3 pr-6">참값에 대한 근접도</td>
                    <td className="py-3">결과의 재현성</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-3 pr-6 text-amber-400 font-semibold">관련 오차</td>
                    <td className="py-3 pr-6">Systematic error (계통 오차)</td>
                    <td className="py-3">Random error (우연 오차)</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-3 pr-6 text-amber-400 font-semibold">수치해석</td>
                    <td className="py-3 pr-6">Truncation + Roundoff error</td>
                    <td className="py-3">Significant digits 수</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 text-amber-400 font-semibold">개선 방법</td>
                    <td className="py-3 pr-6">더 나은 알고리즘, 보정</td>
                    <td className="py-3">더 높은 비트 수 (double → quad)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Four cases */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { acc: true, prec: true, label: "High Acc\nHigh Prec", color: "green" },
              { acc: true, prec: false, label: "High Acc\nLow Prec", color: "amber" },
              { acc: false, prec: true, label: "Low Acc\nHigh Prec", color: "orange" },
              { acc: false, prec: false, label: "Low Acc\nLow Prec", color: "red" },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 text-center space-y-2 ${
                  item.color === "green"
                    ? "bg-green-950/20 border-green-800/40"
                    : item.color === "amber"
                    ? "bg-amber-950/20 border-amber-800/40"
                    : item.color === "orange"
                    ? "bg-orange-950/20 border-orange-800/40"
                    : "bg-red-950/20 border-red-800/40"
                }`}
              >
                {/* Mini dartboard */}
                <div className="flex justify-center">
                  <div className="relative w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center">
                    <div className="absolute w-8 h-8 rounded-full border border-slate-700/50" />
                    <div className="absolute w-1 h-1 rounded-full bg-slate-500" />
                    {item.acc && item.prec && (
                      <>
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-green-400" style={{ top: "46%", left: "48%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-green-400" style={{ top: "48%", left: "52%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-green-400" style={{ top: "50%", left: "50%" }} />
                      </>
                    )}
                    {item.acc && !item.prec && (
                      <>
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400" style={{ top: "30%", left: "50%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400" style={{ top: "55%", left: "35%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400" style={{ top: "50%", left: "65%" }} />
                      </>
                    )}
                    {!item.acc && item.prec && (
                      <>
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-orange-400" style={{ top: "20%", left: "70%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-orange-400" style={{ top: "22%", left: "72%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-orange-400" style={{ top: "18%", left: "74%" }} />
                      </>
                    )}
                    {!item.acc && !item.prec && (
                      <>
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-red-400" style={{ top: "15%", left: "20%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-red-400" style={{ top: "70%", left: "75%" }} />
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-red-400" style={{ top: "25%", left: "80%" }} />
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-line font-semibold">{item.label}</p>
                <p className="text-xs text-slate-500">
                  {item.acc && item.prec && "이상적 결과"}
                  {item.acc && !item.prec && "평균은 정확"}
                  {!item.acc && item.prec && "편향 존재"}
                  {!item.acc && !item.prec && "최악의 경우"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>


        {/* ── 3. Machine Epsilon Definition ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base"><M>{"\\varepsilon"}</M></span>
            Machine Epsilon (<M>{"\\varepsilon_{\\text{mach}}"}</M>)
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            {/* Definition */}
            <div className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-semibold">정의:</span>{" "}
                <M>{"\\text{fl}(1 + \\varepsilon) \\neq 1"}</M>을 만족하는{" "}
                <span className="text-white font-semibold">가장 작은 양수 <M>{"\\varepsilon"}</M></span>.
                즉, 1에 더했을 때 부동소수점 연산에서 구별 가능한 최소값입니다.
              </p>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-center">
                <div className="text-center">
                  <MBlock>{"\\varepsilon_{\\text{mach}} = 2^{-52} \\approx 2.2204 \\times 10^{-16}"}</MBlock>
                </div>
                <p className="text-slate-500 text-sm mt-2">IEEE 754 double precision (64-bit)</p>
              </div>
            </div>

            {/* Number line visualization */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-semibold">Number Line Visualization:</p>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-x-auto">
                <svg viewBox="0 0 700 140" className="w-full min-w-[500px]" xmlns="http://www.w3.org/2000/svg">
                  {/* Main axis */}
                  <line x1="60" y1="70" x2="640" y2="70" stroke="#475569" strokeWidth="2" />

                  {/* 1.0 tick */}
                  <line x1="100" y1="50" x2="100" y2="90" stroke="#ffffff" strokeWidth="2" />
                  <text x="100" y="38" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="monospace">1.0</text>

                  {/* Gap region */}
                  <rect x="110" y="55" width="420" height="30" rx="4" fill="rgba(244,63,94,0.08)" stroke="rgba(244,63,94,0.25)" strokeWidth="1" strokeDasharray="4,4" />
                  <text x="320" y="74" textAnchor="middle" fill="#f87171" fontSize="11" fontFamily="monospace">이 구간의 수들은 1.0으로 반올림됨 (표현 불가)</text>

                  {/* 1 + eps tick */}
                  <line x1="540" y1="50" x2="540" y2="90" stroke="#f59e0b" strokeWidth="2" />
                  <text x="540" y="30" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace">1 + ε_mach</text>
                  <text x="540" y="110" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">= 1 + 2⁻⁵²</text>
                  <text x="540" y="125" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">≈ 1.00000000000000022</text>

                  {/* Epsilon bracket */}
                  <line x1="100" y1="95" x2="100" y2="105" stroke="#f59e0b" strokeWidth="1" />
                  <line x1="100" y1="105" x2="540" y2="105" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="540" y1="95" x2="540" y2="105" stroke="#f59e0b" strokeWidth="1" />
                  <text x="320" y="120" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace">ε_mach = 2⁻⁵² ≈ 2.22 × 10⁻¹⁶</text>

                  {/* Next representable number */}
                  <line x1="600" y1="60" x2="600" y2="80" stroke="#475569" strokeWidth="1" />
                  <text x="600" y="52" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">1 + 2ε</text>
                  <text x="640" y="52" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">…</text>

                  {/* Dots representing representable numbers */}
                  <circle cx="100" cy="70" r="4" fill="#ffffff" />
                  <circle cx="540" cy="70" r="4" fill="#f59e0b" />
                  <circle cx="600" cy="70" r="3" fill="#64748b" />
                </svg>
                <p className="text-xs text-slate-500 text-center mt-2">
                  1과 그 다음 표현 가능한 수 사이의 간격이 바로 ε_mach 입니다. 이 간격보다 작은 차이는 부동소수점에서 구별할 수 없습니다.
                </p>
              </div>
            </div>

            {/* MATLAB command */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-semibold">MATLAB에서 확인:</p>
              <CodeBlock
                code={`>> eps\n\nans =\n   2.2204e-16\n\n>> 2^(-52)\n\nans =\n   2.2204e-16`}
                output="eps와 2^(-52)는 동일한 값입니다."
              />
            </div>
          </div>
        </motion.div>

        {/* ── 4. Algorithm to find eps ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">⚙</span>
            <M>{"\\varepsilon_{\\text{mach}}"}</M> 계산 알고리즘
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Code */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <p className="text-sm text-slate-400 font-semibold">MATLAB Code — Iterative Halving:</p>
              <CodeBlock
                code={`e = 1;\nwhile (1 + e) > 1\n    e = e / 2;\nend\ne = e * 2;  % 마지막으로 구별된 값\nfprintf('eps = %.16e\\n', e);`}
                output="eps = 2.2204460492503131e-16"
              />
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-sm text-slate-400 space-y-1">
                <p><span className="text-amber-400">원리:</span> e를 절반씩 줄이면서</p>
                <p className="font-mono text-xs text-slate-300 ml-4">1 + e == 1</p>
                <p>이 되는 순간을 찾습니다. 루프가 끝나면 e는 너무 작아진 상태이므로,</p>
                <p>마지막에 <span className="font-mono text-orange-300">e * 2</span>로 복원합니다.</p>
              </div>
            </div>

            {/* Iteration table */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <p className="text-sm text-slate-400 font-semibold">반복 과정 (Step-by-step):</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-500 pb-2 pr-3">Step</th>
                      <th className="text-left text-slate-500 pb-2 pr-3">e</th>
                      <th className="text-left text-slate-500 pb-2 pr-3">1+e</th>
                      <th className="text-left text-slate-500 pb-2">{">"}1?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllSteps ? epsIterations : epsIterations.slice(0, 5).concat(epsIterations.slice(-2))).map(
                      (row, i) => (
                        <tr key={i} className="border-b border-slate-800/50">
                          <td className="py-1.5 pr-3 font-mono text-slate-400">{row.step}</td>
                          <td className="py-1.5 pr-3 font-mono text-amber-300 text-xs">{row.e}</td>
                          <td className="py-1.5 pr-3 font-mono text-slate-300 text-xs">{row.onePlusE}</td>
                          <td className="py-1.5">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                row.gt1
                                  ? "bg-green-400/10 text-green-400"
                                  : "bg-red-400/10 text-red-400"
                              }`}
                            >
                              {row.gt1 ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setShowAllSteps(!showAllSteps)}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                {showAllSteps ? "간략히 보기" : "전체 과정 보기"}
              </button>
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3 text-sm text-amber-200">
                Step 54에서 <span className="font-mono">1 + e == 1</span>이 되어 루프 종료.
                결과: <span className="font-mono text-amber-400">e = 2^(-52)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 5. Roundoff Error ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">≈</span>
            반올림 오차 (Roundoff Error)
          </h3>

          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 text-sm text-slate-400 leading-relaxed">
            앞에서 <M>{"\\varepsilon_{\\text{mach}}"}</M>이 1과 다음 표현 가능한 수의 간격이라고 배웠습니다.
            이 간격 때문에 <span className="text-white font-semibold">모든 실수를 정확하게 저장할 수 없고</span>,
            저장할 때마다 가장 가까운 표현 가능한 수로 반올림됩니다.
            이때 발생하는 오차가 바로 <span className="text-amber-300 font-bold">반올림 오차(Roundoff Error)</span>이며,
            그 크기는 <M>{"\\varepsilon_{\\text{mach}}"}</M>에 의해 결정됩니다.
          </div>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            {/* Definitions */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3">
                <h4 className="text-orange-400 font-semibold text-sm">Absolute Error (절대 오차)</h4>
                <div className="text-center py-2">
                  <MBlock>{"E_{\\text{abs}} = |x - \\text{fl}(x)|"}</MBlock>
                </div>
                <p className="text-slate-400 text-sm">
                  실제 값 <span className="font-mono text-slate-300">x</span>와
                  부동소수점 표현 <span className="font-mono text-slate-300">fl(x)</span> 사이의 절대적 차이
                </p>
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3">
                <h4 className="text-orange-400 font-semibold text-sm">Relative Error (상대 오차)</h4>
                <div className="text-center py-2">
                  <MBlock>{"E_{\\text{rel}} = \\frac{|x - \\text{fl}(x)|}{|x|}"}</MBlock>
                </div>
                <p className="text-slate-400 text-sm">
                  절대 오차를 실제 값의 크기로 나눈 것. 스케일에 무관한 오차 측정법
                </p>
              </div>
            </div>

            {/* Bound */}
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-5 text-center space-y-2">
              <p className="text-sm text-amber-200 font-semibold">핵심 부등식 (Fundamental Bound)</p>
              <div className="text-center">
                <MBlock>{"E_{\\text{rel}} \\leq \\frac{\\varepsilon_{\\text{mach}}}{2}"}</MBlock>
              </div>
              <p className="text-slate-400 text-sm">
                모든 부동소수점 변환의 상대 오차는 <M>{"\\varepsilon_{\\text{mach}}/2"}</M> 이하로 보장됩니다.
              </p>
            </div>

            {/* Example */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-semibold">예제 — MATLAB 계산:</p>
              <CodeBlock
                code={`x_true = 1/3;\nfprintf('fl(1/3) = %.20f\\n', x_true);\nfprintf('실제값   = 0.33333333333333333333...\\n');\n\n% 절대 오차\nabs_err = abs(1/3 - x_true);\nfprintf('절대 오차 = %e\\n', abs_err);\n\n% 상대 오차\nrel_err = abs_err / abs(1/3);\nfprintf('상대 오차 = %e\\n', rel_err);\nfprintf('eps/2    = %e\\n', eps/2);`}
                output={`fl(1/3) = 0.33333333333333331483\n실제값   = 0.33333333333333333333...\n절대 오차 = 0.000000e+00  (같은 변수이므로)\n상대 오차 = 0.000000e+00\neps/2    = 1.110223e-16`}
              />
              <p className="text-xs text-slate-500">
                * 같은 변수를 비교하면 오차가 0입니다.
                실제로는 수학적 값 1/3과 fl(1/3) 사이에 약 <M>{"1.85 \\times 10^{-17}"}</M>의 상대 오차가 존재합니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 6. Cancellation Error ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">⚠</span>
            상쇄 오차 (Cancellation Error)
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            {/* Explanation */}
            <div className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-semibold">현상:</span>{" "}
                거의 같은 크기의 두 수를 빼면 유효 자릿수가 급격히 줄어듭니다.
                이를 <span className="text-orange-400 font-semibold">catastrophic cancellation</span>이라 합니다.
              </p>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-sm space-y-1">
                <p className="text-slate-400">예: 유효숫자 5자리 산술</p>
                <p className="text-white">  <M>{"1.23456 \\times 10^{5}"}</M></p>
                <p className="text-white"><M>{"-\\, 1.23447 \\times 10^{5}"}</M></p>
                <p className="text-slate-600">─────────────────</p>
                <p className="text-amber-300"><M>{"= 0.00009 \\times 10^{5} = 9.0000 \\times 10^{0}"}</M></p>
                <p className="text-red-400 text-xs mt-2">→ 유효숫자 5자리 → 1자리로 감소!</p>
              </div>
            </div>

            {/* Quadratic formula */}
            <div className="space-y-4">
              <p className="text-sm text-slate-400 font-semibold">
                대표적 사례: Quadratic Formula (이차방정식의 근의 공식)
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-950/30 rounded-xl border border-red-800/40 p-5 space-y-3">
                  <h4 className="text-red-400 font-semibold text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-red-400/10 flex items-center justify-center text-xs">✗</span>
                    표준 공식 (문제 발생)
                  </h4>
                  <div className="bg-slate-950 rounded-lg p-3 text-center">
                    <MBlock>{"x = \\frac{-b + \\sqrt{b^{2} - 4ac}}{2a}"}</MBlock>
                  </div>
                  <p className="text-slate-400 text-xs">
                    <M>{"b^{2} \\gg 4ac"}</M> 일 때, <M>{"\\sqrt{b^{2}-4ac} \\approx |b|"}</M> 이므로
                    <span className="text-red-300"> <M>{"-b + |b| \\approx 0"}</M></span> → 상쇄 오차 발생!
                  </p>
                </div>

                <div className="bg-green-950/30 rounded-xl border border-green-800/40 p-5 space-y-3">
                  <h4 className="text-green-400 font-semibold text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-green-400/10 flex items-center justify-center text-xs">✓</span>
                    대안 공식 (안정적)
                  </h4>
                  <div className="bg-slate-950 rounded-lg p-3 text-center">
                    <MBlock>{"x = \\frac{-2c}{b + \\sqrt{b^{2} - 4ac}}"}</MBlock>
                  </div>
                  <p className="text-slate-400 text-xs">
                    분모가 <span className="text-green-300">b + |b|</span>로 커지므로
                    상쇄가 일어나지 않습니다. 유도: 분자분모에 conjugate 곱하기.
                  </p>
                </div>
              </div>
            </div>

            {/* MATLAB comparison */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-semibold">
                MATLAB 비교: <M>{"a=1,\\, b=-10^{8},\\, c=1"}</M>
              </p>
              <CodeBlock
                code={`a = 1; b = -1e8; c = 1;\n\n% 표준 공식 (상쇄 오차 발생)\ndisc = sqrt(b^2 - 4*a*c);\nx_standard = (-b - disc) / (2*a);\nfprintf('표준 공식: x = %.15e\\n', x_standard);\n\n% 대안 공식 (안정적)\nx_stable = (-2*c) / (b - disc);\n% (b<0이므로 b - disc = b - |b| 대신 부호 고려)\n% 더 큰 근: (-b + disc)/(2a)\nx1 = (-b + disc) / (2*a);\n% 작은 근 via: x2 = c / (a * x1)\nx2 = c / (a * x1);\n\nfprintf('안정 공식: x = %.15e\\n', x2);\n\n% 참값 (Symbolic)\nfprintf('참값:      x = 1.00000000000000e-08\\n');`}
                output={`표준 공식: x = 1.110223024625157e-08\n안정 공식: x = 1.000000000000000e-08\n참값:      x = 1.00000000000000e-08`}
              />
              <div className="bg-red-950/20 border border-red-800/30 rounded-xl p-4 text-sm space-y-1">
                <p className="text-red-300 font-semibold">분석:</p>
                <p className="text-slate-400">
                  표준 공식: 상대 오차 ≈ <span className="font-mono text-red-400">11%</span> — 완전히 잘못된 결과!
                </p>
                <p className="text-slate-400">
                  안정 공식: 상대 오차 ≈ <span className="font-mono text-green-400">0%</span> — 정확한 결과
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 7. Hole at Zero & Hole at Zero ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">∞</span>
            Hole at Zero — 0 근처의 간격
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="space-y-3">
              <h4 className="text-orange-400 font-semibold">비정규화 수가 없다면?</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                정규화된 수의 최솟값은 <M>{"\\text{realmin} \\approx 2.2 \\times 10^{-308}"}</M>입니다.
                만약 비정규화 수(denormalized/subnormal)가 없다면, 0과 realmin 사이에{" "}
                <span className="text-orange-400 font-semibold">거대한 빈 공간(hole)</span>이 생깁니다.
              </p>

              {/* Number line visualization */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-5">
                <p className="text-xs text-slate-500 font-semibold text-center">Number Line (로그 스케일, 양수 영역)</p>

                {/* Without denormals */}
                <div className="space-y-2">
                  <p className="text-xs text-red-400 font-semibold">비정규화 수 없이 (Hole at Zero):</p>
                  <svg viewBox="0 0 600 60" className="w-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Axis */}
                    <line x1="30" y1="30" x2="570" y2="30" stroke="#475569" strokeWidth="1.5" />
                    {/* 0 tick */}
                    <line x1="50" y1="18" x2="50" y2="42" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="50" y="14" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">0</text>
                    {/* HOLE region */}
                    <rect x="60" y="20" width="180" height="20" rx="3" fill="rgba(244,63,94,0.1)" stroke="rgba(244,63,94,0.3)" strokeWidth="1" strokeDasharray="4,3" />
                    <text x="150" y="34" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">HOLE — 표현 불가!</text>
                    {/* realmin tick */}
                    <line x1="250" y1="18" x2="250" y2="42" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="250" y="55" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">realmin</text>
                    {/* Normalized dots */}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <circle key={i} cx={270 + i * 18} cy={30} r={2} fill="rgba(74,222,128,0.7)" />
                    ))}
                    {/* realmax tick */}
                    <line x1="550" y1="18" x2="550" y2="42" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="550" y="55" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">realmax</text>
                  </svg>
                </div>

                {/* With denormals */}
                <div className="space-y-2">
                  <p className="text-xs text-green-400 font-semibold">비정규화 수 포함 (Gradual Underflow):</p>
                  <svg viewBox="0 0 600 60" className="w-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Axis */}
                    <line x1="30" y1="30" x2="570" y2="30" stroke="#475569" strokeWidth="1.5" />
                    {/* 0 tick */}
                    <line x1="50" y1="18" x2="50" y2="42" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="50" y="14" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">0</text>
                    {/* Denormalized region */}
                    <rect x="60" y="20" width="180" height="20" rx="3" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
                    {/* Denormalized dots */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <circle key={i} cx={70 + i * 17} cy={30} r={2} fill="rgba(34,211,238,0.8)" />
                    ))}
                    <text x="150" y="55" textAnchor="middle" fill="#22d3ee" fontSize="8">denormalized</text>
                    {/* realmin tick */}
                    <line x1="250" y1="18" x2="250" y2="42" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="250" y="55" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">realmin</text>
                    {/* Normalized dots */}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <circle key={i} cx={270 + i * 18} cy={30} r={2} fill="rgba(74,222,128,0.7)" />
                    ))}
                    {/* realmax tick */}
                    <line x1="550" y1="18" x2="550" y2="42" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="550" y="55" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">realmax</text>
                  </svg>
                </div>

                <p className="text-xs text-slate-400 text-center">
                  비정규화 수 덕분에 0과 realmin 사이의 &quot;hole&quot;이 채워져,{" "}
                  <span className="text-cyan-400">0으로의 점진적 언더플로(gradual underflow)</span>가 가능합니다.
                </p>
              </div>

              {/* MATLAB demo */}
              <CodeBlock
                code={`% Hole at Zero 실험\nformat long e\nrealmin          % 정규화 최솟값\nrealmin / 2      % 비정규화 수 (denormalized)\nrealmin / 2^52   % 가장 작은 양수 (약 5e-324)\nrealmin / 2^53   % underflow → 0\n\n% eps at different scales\neps(1)           % 2.22e-16\neps(1e-300)      % 1.99e-316 (realmin 근처에서 eps도 작아짐)\neps(0)           % 4.94e-324 (가장 작은 양수 = denorm min)`}
                output={`realmin = 2.225073858507201e-308\nrealmin/2 = 1.112536929253601e-308  (denormalized!)\nrealmin/2^52 = 4.940656458412465e-324  (smallest positive)\nrealmin/2^53 = 0  (underflow!)\n\neps(1) = 2.220446049250313e-16\neps(1e-300) = 1.988462483865892e-316\neps(0) = 4.940656458412465e-324`}
              />

              <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-xl p-4 text-sm space-y-2">
                <p className="text-cyan-300 font-semibold">Gradual Underflow의 의미</p>
                <p className="text-slate-400">
                  비정규화 수가 없다면 <span className="font-mono text-slate-300">x - y</span>에서
                  두 수가 매우 가까울 때 갑자기 0이 되는 문제가 발생합니다.
                  비정규화 수 덕분에 <span className="font-mono text-cyan-300">x ≠ y</span>이면
                  항상 <span className="font-mono text-cyan-300">x - y ≠ 0</span>이 보장됩니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Summary ── */}
        <motion.div {...fade} className="bg-gradient-to-r from-amber-950/40 to-orange-950/40 rounded-2xl border border-amber-800/30 p-8 space-y-4">
          <h3 className="text-xl font-bold text-amber-400">핵심 요약</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0">•</span>
              <span>
                <M>{"\\varepsilon_{\\text{mach}} = 2^{-52}"}</M> —
                double precision에서 1에 더해 구별 가능한 최소값
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0">•</span>
              <span>
                모든 부동소수점 연산의 상대 오차는{" "}
                <M>{"\\varepsilon_{\\text{mach}} / 2"}</M> 이하로 제한됨
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0">•</span>
              <span>
                <span className="text-orange-400 font-semibold">Cancellation error</span>는
                비슷한 크기의 수를 뺄 때 발생 — 알고리즘 재구성으로 회피 가능
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0">•</span>
              <span>
                <span className="text-orange-400 font-semibold">Accuracy ≠ Precision</span> —
                수치해석에서 두 개념을 구분하는 것이 중요
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
