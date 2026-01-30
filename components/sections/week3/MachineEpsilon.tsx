"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

        {/* ── 2. Machine Epsilon Definition ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">ε</span>
            Machine Epsilon (ε<sub>mach</sub>)
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            {/* Definition */}
            <div className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-semibold">정의:</span>{" "}
                <span className="font-mono text-orange-300">fl(1 + ε) ≠ 1</span>을 만족하는{" "}
                <span className="text-white font-semibold">가장 작은 양수 ε</span>.
                즉, 1에 더했을 때 부동소수점 연산에서 구별 가능한 최소값입니다.
              </p>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-center">
                <p className="font-mono text-lg text-white">
                  ε<sub className="text-amber-400">mach</sub> = 2<sup className="text-orange-400">−52</sup> ≈{" "}
                  <span className="text-amber-300">2.2204 × 10<sup>−16</sup></span>
                </p>
                <p className="text-slate-500 text-sm mt-2">IEEE 754 double precision (64-bit)</p>
              </div>
            </div>

            {/* Number line visualization */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-semibold">Number Line Visualization:</p>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                <div className="relative h-16">
                  {/* Line */}
                  <div className="absolute top-8 left-8 right-8 h-0.5 bg-slate-700" />
                  {/* 1.0 */}
                  <div className="absolute top-0 left-8 flex flex-col items-center">
                    <span className="font-mono text-sm text-white font-bold">1.0</span>
                    <div className="w-0.5 h-4 bg-white mt-1" />
                  </div>
                  {/* 1 + eps (not representable) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="font-mono text-xs text-red-400">← gap: numbers here are rounded to 1 →</span>
                    <div className="w-full h-3 mt-1 border-x border-dashed border-red-400/40" />
                  </div>
                  {/* 1 + eps_mach */}
                  <div className="absolute top-0 right-8 flex flex-col items-center">
                    <span className="font-mono text-sm text-amber-400 font-bold">1 + ε<sub>mach</sub></span>
                    <div className="w-0.5 h-4 bg-amber-400 mt-1" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 text-center mt-4">
                  1과 그 다음 표현 가능한 수 사이의 간격이 바로 ε<sub>mach</sub>입니다.
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

        {/* ── 3. Algorithm to find eps ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">⚙</span>
            ε<sub>mach</sub> 계산 알고리즘
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

        {/* ── 4. Roundoff Error ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">≈</span>
            반올림 오차 (Roundoff Error)
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            {/* Definitions */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3">
                <h4 className="text-orange-400 font-semibold text-sm">Absolute Error (절대 오차)</h4>
                <p className="font-mono text-xl text-white text-center py-2">
                  E<sub>abs</sub> = |x − fl(x)|
                </p>
                <p className="text-slate-400 text-sm">
                  실제 값 <span className="font-mono text-slate-300">x</span>와
                  부동소수점 표현 <span className="font-mono text-slate-300">fl(x)</span> 사이의 절대적 차이
                </p>
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3">
                <h4 className="text-orange-400 font-semibold text-sm">Relative Error (상대 오차)</h4>
                <p className="font-mono text-xl text-white text-center py-2">
                  E<sub>rel</sub> = |x − fl(x)| / |x|
                </p>
                <p className="text-slate-400 text-sm">
                  절대 오차를 실제 값의 크기로 나눈 것. 스케일에 무관한 오차 측정법
                </p>
              </div>
            </div>

            {/* Bound */}
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-5 text-center space-y-2">
              <p className="text-sm text-amber-200 font-semibold">핵심 부등식 (Fundamental Bound)</p>
              <p className="font-mono text-2xl text-white">
                E<sub>rel</sub> ≤{" "}
                <span className="text-amber-400">
                  ε<sub>mach</sub> / 2
                </span>
              </p>
              <p className="text-slate-400 text-sm">
                모든 부동소수점 변환의 상대 오차는 ε<sub>mach</sub>/2 이하로 보장됩니다.
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
                실제로는 수학적 값 1/3과 fl(1/3) 사이에 약 1.85 × 10<sup>−17</sup>의 상대 오차가 존재합니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 5. Cancellation Error ── */}
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
                <p className="text-white">  1.23456 × 10<sup>5</sup></p>
                <p className="text-white">− 1.23447 × 10<sup>5</sup></p>
                <p className="text-slate-600">─────────────────</p>
                <p className="text-amber-300">= 0.00009 × 10<sup>5</sup> = 9.0000 × 10<sup>0</sup></p>
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
                  <div className="bg-slate-950 rounded-lg p-3 font-mono text-center">
                    <p className="text-white text-sm">
                      x = (−b + √(b² − 4ac)) / 2a
                    </p>
                  </div>
                  <p className="text-slate-400 text-xs">
                    b² ≫ 4ac 일 때, √(b²−4ac) ≈ |b| 이므로
                    <span className="text-red-300"> −b + |b| ≈ 0</span> → 상쇄 오차 발생!
                  </p>
                </div>

                <div className="bg-green-950/30 rounded-xl border border-green-800/40 p-5 space-y-3">
                  <h4 className="text-green-400 font-semibold text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-green-400/10 flex items-center justify-center text-xs">✓</span>
                    대안 공식 (안정적)
                  </h4>
                  <div className="bg-slate-950 rounded-lg p-3 font-mono text-center">
                    <p className="text-white text-sm">
                      x = −2c / (b + √(b² − 4ac))
                    </p>
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
                MATLAB 비교: a=1, b=−10<sup>8</sup>, c=1
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

        {/* ── 6. Special Values & Hole at Zero ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">∞</span>
            특수값과 Hole at Zero
          </h3>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            {/* +0 / -0 */}
            <div className="space-y-3">
              <h4 className="text-orange-400 font-semibold">+0 과 −0 (Signed Zero)</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                IEEE 754에서는 <span className="font-mono text-amber-300">+0</span>과{" "}
                <span className="font-mono text-amber-300">−0</span>이 별도로 존재합니다.
                비교 시 <span className="font-mono text-slate-200">+0 == −0</span>은{" "}
                <span className="text-green-400">true</span>이지만, 부호는 다릅니다.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-sm space-y-1">
                  <p className="text-slate-500">% MATLAB</p>
                  <p className="text-amber-300">{`>> 1/Inf`}</p>
                  <p className="text-orange-300">ans = 0      <span className="text-slate-500">% +0</span></p>
                  <p className="text-amber-300">{`>> -1/Inf`}</p>
                  <p className="text-orange-300">ans = 0      <span className="text-slate-500">% −0</span></p>
                  <p className="text-amber-300">{`>> 1/0`}</p>
                  <p className="text-orange-300">ans = Inf    <span className="text-slate-500">% +0 → +Inf</span></p>
                  <p className="text-amber-300">{`>> -1/0`}</p>
                  <p className="text-orange-300">ans = -Inf   <span className="text-slate-500">% +0 → −Inf</span></p>
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-sm space-y-1">
                  <p className="text-slate-500">% 부호 구분</p>
                  <p className="text-amber-300">{`>> 1/(-0)`}</p>
                  <p className="text-orange-300">ans = -Inf   <span className="text-slate-500">% −0 → −Inf!</span></p>
                  <p className="text-amber-300">{`>> sign = @(x) 1/x > 0;`}</p>
                  <p className="text-amber-300">{`>> isequal(0, -0)`}</p>
                  <p className="text-orange-300">ans = 1      <span className="text-slate-500">% 값은 같음</span></p>
                  <p className="text-amber-300">{`>> sprintf('%+.1f', [0, -0])`}</p>
                  <p className="text-orange-300">ans = &apos;+0.0-0.0&apos;</p>
                </div>
              </div>
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3 text-sm text-amber-200">
                <span className="font-semibold">왜 −0이 필요한가?</span>{" "}
                음의 방향에서 0으로 수렴하는 극한을 올바르게 표현하고,{" "}
                <span className="font-mono">1/(-0) = −Inf</span>가 수학적으로 자연스럽기 위함입니다.
              </div>
            </div>

            {/* +Inf / -Inf / NaN */}
            <div className="space-y-3">
              <h4 className="text-orange-400 font-semibold">±Infinity 와 NaN</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-500 pb-2 pr-4">연산</th>
                      <th className="text-left text-slate-500 pb-2 pr-4">결과</th>
                      <th className="text-left text-slate-500 pb-2">설명</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-300">
                    {[
                      ["1/0", "+Inf", "양수를 0으로 나눔"],
                      ["-1/0", "-Inf", "음수를 0으로 나눔"],
                      ["Inf + Inf", "Inf", "양의 무한대 + 양의 무한대"],
                      ["Inf - Inf", "NaN", "무한대끼리 빼면 정의 불가"],
                      ["0/0", "NaN", "0을 0으로 나눔"],
                      ["Inf * 0", "NaN", "무한대 × 0"],
                      ["sqrt(-1)", "0 + 1i", "MATLAB은 복소수 반환"],
                      ["NaN == NaN", "false", "NaN은 자기 자신과도 같지 않음!"],
                    ].map(([op, result, desc], i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        <td className="py-2 pr-4 text-amber-300">{op}</td>
                        <td className={`py-2 pr-4 font-semibold ${result === "NaN" ? "text-red-400" : result?.includes("Inf") ? "text-orange-400" : "text-slate-300"}`}>{result}</td>
                        <td className="py-2 text-slate-400 font-sans text-xs">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-red-950/20 border border-red-800/30 rounded-xl p-3 text-sm text-red-200">
                <span className="font-semibold">NaN 주의:</span>{" "}
                <span className="font-mono">NaN == NaN</span>은 <span className="text-red-400">false</span>입니다.
                NaN 검사는 반드시 <span className="font-mono text-amber-300">isnan(x)</span>를 사용하세요.
              </div>
            </div>

            {/* Hole at Zero */}
            <div className="space-y-3">
              <h4 className="text-orange-400 font-semibold">Hole at Zero (0 근처의 간격)</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                정규화된 수의 최솟값은 <span className="font-mono text-amber-300">realmin ≈ 2.2 × 10<sup>-308</sup></span>입니다.
                만약 비정규화 수(denormalized/subnormal)가 없다면, 0과 realmin 사이에{" "}
                <span className="text-orange-400 font-semibold">거대한 빈 공간(hole)</span>이 생깁니다.
              </p>

              {/* Number line visualization */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
                <p className="text-xs text-slate-500 font-semibold text-center">Number Line (로그 스케일, 양수 영역)</p>

                {/* Without denormals */}
                <div className="space-y-1">
                  <p className="text-xs text-red-400 font-semibold">비정규화 수 없이 (Hole at Zero):</p>
                  <div className="relative h-10 bg-slate-900 rounded-lg overflow-hidden">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-700" />
                    {/* Zero */}
                    <div className="absolute top-1 left-4 flex flex-col items-center">
                      <span className="font-mono text-[10px] text-white">0</span>
                      <div className="w-0.5 h-2 bg-white mt-0.5" />
                    </div>
                    {/* Hole */}
                    <div className="absolute top-0 left-[8%] right-[60%] h-full flex items-center justify-center">
                      <span className="text-[10px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                        HOLE — 표현 불가!
                      </span>
                    </div>
                    {/* realmin */}
                    <div className="absolute top-1 left-[40%] flex flex-col items-center">
                      <span className="font-mono text-[10px] text-amber-400">realmin</span>
                      <div className="w-0.5 h-2 bg-amber-400 mt-0.5" />
                    </div>
                    {/* Normalized numbers */}
                    <div className="absolute top-3 left-[42%] right-4 flex items-center gap-[2px]">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-3 bg-green-400/60 rounded-full" />
                      ))}
                    </div>
                    <div className="absolute top-1 right-4 flex flex-col items-center">
                      <span className="font-mono text-[10px] text-slate-400">realmax</span>
                      <div className="w-0.5 h-2 bg-slate-400 mt-0.5" />
                    </div>
                  </div>
                </div>

                {/* With denormals */}
                <div className="space-y-1">
                  <p className="text-xs text-green-400 font-semibold">비정규화 수 포함 (Gradual Underflow):</p>
                  <div className="relative h-10 bg-slate-900 rounded-lg overflow-hidden">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-700" />
                    {/* Zero */}
                    <div className="absolute top-1 left-4 flex flex-col items-center">
                      <span className="font-mono text-[10px] text-white">0</span>
                      <div className="w-0.5 h-2 bg-white mt-0.5" />
                    </div>
                    {/* Denormalized numbers */}
                    <div className="absolute top-3 left-[5%] left-[6%] flex items-center gap-[3px]">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-3 bg-cyan-400/60 rounded-full" />
                      ))}
                    </div>
                    <div className="absolute top-7 left-[5%]">
                      <span className="text-[9px] text-cyan-400">denormalized</span>
                    </div>
                    {/* realmin */}
                    <div className="absolute top-1 left-[40%] flex flex-col items-center">
                      <span className="font-mono text-[10px] text-amber-400">realmin</span>
                      <div className="w-0.5 h-2 bg-amber-400 mt-0.5" />
                    </div>
                    {/* Normalized numbers */}
                    <div className="absolute top-3 left-[42%] right-4 flex items-center gap-[2px]">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-3 bg-green-400/60 rounded-full" />
                      ))}
                    </div>
                    <div className="absolute top-1 right-4 flex flex-col items-center">
                      <span className="font-mono text-[10px] text-slate-400">realmax</span>
                      <div className="w-0.5 h-2 bg-slate-400 mt-0.5" />
                    </div>
                  </div>
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

        {/* ── 7. Accuracy vs Precision ── */}
        <motion.div {...fade} className="space-y-6">
          <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">◎</span>
            Accuracy vs Precision
          </h3>

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

        {/* ── Summary ── */}
        <motion.div {...fade} className="bg-gradient-to-r from-amber-950/40 to-orange-950/40 rounded-2xl border border-amber-800/30 p-8 space-y-4">
          <h3 className="text-xl font-bold text-amber-400">핵심 요약</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0">•</span>
              <span>
                <span className="font-mono text-amber-300">ε_mach = 2^(-52)</span> —
                double precision에서 1에 더해 구별 가능한 최소값
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0">•</span>
              <span>
                모든 부동소수점 연산의 상대 오차는{" "}
                <span className="font-mono text-amber-300">ε_mach / 2</span> 이하로 제한됨
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
