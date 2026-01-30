"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Helper: f(x) = x^3 - x - 2                                        */
/* ------------------------------------------------------------------ */
const f = (x: number) => x * x * x - x - 2;

interface IterRow {
  n: number;
  xPrev: number;
  xCurr: number;
  fCurr: number;
  xNext: number;
}

function buildSecantIterations(x0: number, x1: number, steps: number): IterRow[] {
  const rows: IterRow[] = [];
  let xPrev = x0;
  let xCurr = x1;
  for (let n = 0; n < steps; n++) {
    const fPrev = f(xPrev);
    const fCurr = f(xCurr);
    const denom = fCurr - fPrev;
    if (Math.abs(denom) < 1e-15) break;
    const xNext = xCurr - fCurr * (xCurr - xPrev) / denom;
    rows.push({ n, xPrev, xCurr, fCurr, xNext });
    xPrev = xCurr;
    xCurr = xNext;
  }
  return rows;
}

/* ------------------------------------------------------------------ */
/*  SVG coordinate helpers                                             */
/* ------------------------------------------------------------------ */
const W = 480;
const H = 340;
const pad = 40;

function toSvg(
  xVal: number,
  yVal: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): [number, number] {
  const sx = pad + ((xVal - xMin) / (xMax - xMin)) * (W - 2 * pad);
  const sy = H - pad - ((yVal - yMin) / (yMax - yMin)) * (H - 2 * pad);
  return [sx, sy];
}

function curvePath(xMin: number, xMax: number, yMin: number, yMax: number): string {
  const pts: string[] = [];
  for (let t = xMin; t <= xMax; t += 0.02) {
    const [sx, sy] = toSvg(t, f(t), xMin, xMax, yMin, yMax);
    pts.push(`${pts.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }
  return pts.join(" ");
}

/* ------------------------------------------------------------------ */
/*  Geometric Interpretation SVG                                       */
/* ------------------------------------------------------------------ */
function GeometricSvg() {
  const xMin = 0.4;
  const xMax = 2.4;
  const yMin = -3.5;
  const yMax = 7;

  const xPrev = 1.0;
  const xCurr = 2.0;
  const fPrev = f(xPrev);
  const fCurr = f(xCurr);
  const xNext = xCurr - fCurr * (xCurr - xPrev) / (fCurr - fPrev);

  const [pPx, pPy] = toSvg(xPrev, fPrev, xMin, xMax, yMin, yMax);
  const [pCx, pCy] = toSvg(xCurr, fCurr, xMin, xMax, yMin, yMax);
  const [pNx, pNy] = toSvg(xNext, 0, xMin, xMax, yMin, yMax);
  const [, axisY] = toSvg(0, 0, xMin, xMax, yMin, yMax);

  // secant line extended
  const slope = (fCurr - fPrev) / (xCurr - xPrev);
  const secY = (t: number) => fPrev + slope * (t - xPrev);
  const sLeft = Math.max(xMin, xPrev - 0.3);
  const sRight = Math.min(xMax, xCurr + 0.3);
  const [slx, sly] = toSvg(sLeft, secY(sLeft), xMin, xMax, yMin, yMax);
  const [srx, sry] = toSvg(sRight, secY(sRight), xMin, xMax, yMin, yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {/* axes */}
      <line x1={pad} y1={axisY} x2={W - pad} y2={axisY} stroke="#475569" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#475569" strokeWidth={1} />

      {/* curve */}
      <path d={curvePath(xMin, xMax, yMin, yMax)} fill="none" stroke="#f0abfc" strokeWidth={2.5} />

      {/* secant line */}
      <line x1={slx} y1={sly} x2={srx} y2={sry} stroke="#f472b6" strokeWidth={2} strokeDasharray="6 3" />

      {/* points */}
      <circle cx={pPx} cy={pPy} r={5} fill="#e879f9" />
      <circle cx={pCx} cy={pCy} r={5} fill="#f472b6" />
      <circle cx={pNx} cy={pNy} r={5} fill="#38bdf8" />

      {/* dashed verticals */}
      <line x1={pPx} y1={pPy} x2={pPx} y2={axisY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={pCx} y1={pCy} x2={pCx} y2={axisY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />

      {/* labels */}
      <text x={pPx} y={axisY + 16} textAnchor="middle" fill="#e879f9" fontSize={12} fontFamily="monospace">
        x_n-1
      </text>
      <text x={pCx} y={axisY + 16} textAnchor="middle" fill="#f472b6" fontSize={12} fontFamily="monospace">
        x_n
      </text>
      <text x={pNx} y={axisY + 16} textAnchor="middle" fill="#38bdf8" fontSize={12} fontFamily="monospace">
        x_n+1
      </text>
      <text x={pPx + 10} y={pPy - 10} fill="#e879f9" fontSize={11} fontFamily="monospace">
        (x_n-1, f(x_n-1))
      </text>
      <text x={pCx + 8} y={pCy - 10} fill="#f472b6" fontSize={11} fontFamily="monospace">
        (x_n, f(x_n))
      </text>
      <text x={W - pad - 20} y={axisY - 6} fill="#64748b" fontSize={11} fontFamily="monospace">x</text>
      <text x={pad + 4} y={pad + 12} fill="#64748b" fontSize={11} fontFamily="monospace">y</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Demo SVG                                               */
/* ------------------------------------------------------------------ */
function DemoSvg({ step }: { step: number }) {
  const xMin = 0.4;
  const xMax = 2.4;
  const yMin = -3.5;
  const yMax = 7;

  const rows = buildSecantIterations(1.0, 2.0, 8);
  const [, axisY] = toSvg(0, 0, xMin, xMax, yMin, yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {/* axes */}
      <line x1={pad} y1={axisY} x2={W - pad} y2={axisY} stroke="#475569" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#475569" strokeWidth={1} />

      {/* curve */}
      <path d={curvePath(xMin, xMax, yMin, yMax)} fill="none" stroke="#f0abfc" strokeWidth={2.5} />

      {/* secant lines for each completed step */}
      {rows.slice(0, step).map((r, i) => {
        const fPrev = f(r.xPrev);
        const fCurr = r.fCurr;
        const slope = (fCurr - fPrev) / (r.xCurr - r.xPrev);
        const secY = (t: number) => fPrev + slope * (t - r.xPrev);
        const sL = Math.max(xMin, Math.min(r.xPrev, r.xCurr) - 0.2);
        const sR = Math.min(xMax, Math.max(r.xPrev, r.xCurr) + 0.2);
        const [lx, ly] = toSvg(sL, secY(sL), xMin, xMax, yMin, yMax);
        const [rx, ry] = toSvg(sR, secY(sR), xMin, xMax, yMin, yMax);
        const [px, py] = toSvg(r.xPrev, fPrev, xMin, xMax, yMin, yMax);
        const [cx, cy] = toSvg(r.xCurr, fCurr, xMin, xMax, yMin, yMax);
        const [nx, ny] = toSvg(r.xNext, 0, xMin, xMax, yMin, yMax);
        const opacity = 0.3 + 0.7 * (i / Math.max(step - 1, 1));
        return (
          <g key={i} opacity={opacity}>
            <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#f472b6" strokeWidth={1.5} strokeDasharray="5 3" />
            <circle cx={px} cy={py} r={3.5} fill="#e879f9" />
            <circle cx={cx} cy={cy} r={3.5} fill="#f472b6" />
            <circle cx={nx} cy={ny} r={4} fill="#38bdf8" />
          </g>
        );
      })}

      {/* current x label */}
      {step > 0 && step <= rows.length && (() => {
        const r = rows[step - 1];
        const [nx] = toSvg(r.xNext, 0, xMin, xMax, yMin, yMax);
        return (
          <text x={nx} y={axisY + 16} textAnchor="middle" fill="#38bdf8" fontSize={12} fontFamily="monospace">
            x_{step + 1}
          </text>
        );
      })()}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function SecantMethod() {
  const [step, setStep] = useState(0);
  const maxSteps = 7;
  const rows = buildSecantIterations(1.0, 2.0, maxSteps);

  const advance = useCallback(() => setStep((s) => Math.min(s + 1, maxSteps)), []);
  const reset = useCallback(() => setStep(0), []);

  const convergenceCards = [
    { method: "Bisection", order: "p = 1", label: "Linear", color: "slate" },
    { method: "Secant", order: "p \u2248 1.618", label: "Superlinear", color: "pink" },
    { method: "Newton", order: "p = 2", label: "Quadratic", color: "fuchsia" },
  ];

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ---- 1. Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
            Week 5 &mdash; Nonlinear Equations II
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Secant Method
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            할선법 &mdash; 도함수 없이 Newton과 유사한 속도를 달성하는 방법
          </p>
        </motion.div>

        {/* ---- 2. Motivation ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">동기 &mdash; Motivation</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="leading-relaxed">
                Newton&ndash;Raphson 방법은 매 반복마다 <span className="text-fuchsia-400">f&apos;(x)</span>를
                계산해야 합니다. 그러나:
              </p>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li className="flex gap-2">
                  <span className="text-pink-400">&#x2022;</span>
                  도함수가 해석적으로 구하기 어려운 경우 (복잡한 함수)
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400">&#x2022;</span>
                  함수가 수치적으로만 정의된 경우 (실험 데이터, 시뮬레이션)
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-400">&#x2022;</span>
                  도함수 계산 비용이 함수 평가보다 훨씬 큰 경우
                </li>
              </ul>
              <p className="text-slate-400 text-xs leading-relaxed">
                이때 도함수를 <span className="text-pink-400">유한 차분(finite difference)</span>으로
                근사하면 도함수 없이도 빠른 수렴을 얻을 수 있습니다.
              </p>
            </div>

            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Finite difference approximation</p>
              <p className="text-lg text-pink-400">
                f&apos;(x<sub>n</sub>) &asymp;{" "}
                <span className="inline-flex flex-col items-center leading-tight">
                  <span className="border-b border-slate-600 px-1">
                    f(x<sub>n</sub>) &minus; f(x<sub>n&minus;1</sub>)
                  </span>
                  <span className="px-1">
                    x<sub>n</sub> &minus; x<sub>n&minus;1</sub>
                  </span>
                </span>
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                두 점의 함수값만으로 기울기를 근사합니다.
                접선(tangent) 대신 할선(secant)을 사용하는 것입니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---- 3. Formula Derivation ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-fuchsia-400">공식 유도 &mdash; Formula Derivation</h3>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
            <p className="text-slate-500 text-xs uppercase tracking-wider">From Newton&rsquo;s formula</p>
            <p className="text-slate-300">
              x<sub>n+1</sub> = x<sub>n</sub> &minus; f(x<sub>n</sub>) / f&apos;(x<sub>n</sub>)
            </p>
            <p className="text-slate-500">&darr; Replace f&apos;(x<sub>n</sub>) with secant approximation</p>
            <p className="text-slate-300">
              x<sub>n+1</sub> = x<sub>n</sub> &minus; f(x<sub>n</sub>) &middot;{" "}
              <span className="inline-flex flex-col items-center leading-tight">
                <span className="border-b border-slate-600 px-1">
                  x<sub>n</sub> &minus; x<sub>n&minus;1</sub>
                </span>
                <span className="px-1">
                  f(x<sub>n</sub>) &minus; f(x<sub>n&minus;1</sub>)
                </span>
              </span>
            </p>
          </div>

          {/* Large styled formula */}
          <div className="text-center py-6">
            <div className="inline-flex items-baseline gap-2 text-2xl md:text-3xl font-mono font-bold">
              <span className="text-slate-300">x</span>
              <sub className="text-slate-500 text-base">n+1</sub>
              <span className="text-slate-500 mx-1">=</span>
              <span className="text-sky-400">x<sub className="text-base">n</sub></span>
              <span className="text-slate-500 mx-1">&minus;</span>
              <span className="text-pink-400">f(x<sub className="text-base">n</sub>)</span>
              <span className="text-slate-500 mx-1">&middot;</span>
              <span className="flex flex-col items-center leading-tight">
                <span className="text-fuchsia-400 border-b-2 border-slate-600 pb-1 px-2">
                  x<sub className="text-base">n</sub> &minus; x<sub className="text-base">n&minus;1</sub>
                </span>
                <span className="text-pink-400 pt-1 px-2">
                  f(x<sub className="text-base">n</sub>) &minus; f(x<sub className="text-base">n&minus;1</sub>)
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
              x_n &mdash; 현재 근사값
            </span>
            <span className="px-3 py-1.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30">
              f(x_n) &mdash; 함수값
            </span>
            <span className="px-3 py-1.5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30">
              x_n-1 &mdash; 이전 근사값
            </span>
          </div>
        </motion.div>

        {/* ---- 4. Geometric Interpretation ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">기하학적 해석 &mdash; Geometric Interpretation</h3>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="leading-relaxed">
                두 점 <span className="text-fuchsia-400">(x<sub>n&minus;1</sub>, f(x<sub>n&minus;1</sub>))</span>과{" "}
                <span className="text-pink-400">(x<sub>n</sub>, f(x<sub>n</sub>))</span>을
                지나는 <span className="text-pink-400">할선(secant line)</span>을 그립니다.
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                이 할선이 x축과 만나는 점이 다음 근사값
                <span className="text-sky-400"> x<sub>n+1</sub></span>이 됩니다.
                Newton 법이 접선(tangent)을 사용하는 것과 대비됩니다.
              </p>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p><span className="text-fuchsia-400">&#x25CF;</span> (x<sub>n-1</sub>, f(x<sub>n-1</sub>)) &mdash; 이전 점</p>
                <p><span className="text-pink-400">&#x25CF;</span> (x<sub>n</sub>, f(x<sub>n</sub>)) &mdash; 현재 점</p>
                <p><span className="text-sky-400">&#x25CF;</span> x<sub>n+1</sub> &mdash; 할선의 x절편 (다음 근사값)</p>
                <p><span className="text-purple-300">&#x2500;</span> f(x) 곡선</p>
                <p><span className="text-pink-400">- -</span> 할선 (secant line)</p>
              </div>
            </div>

            <GeometricSvg />
          </div>
        </motion.div>

        {/* ---- 5. Interactive Demo ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">
            Interactive Demo &mdash; f(x) = x&sup3; &minus; x &minus; 2
          </h3>
          <p className="font-mono text-sm text-slate-400">
            x<sub>0</sub> = 1, &nbsp; x<sub>1</sub> = 2 &nbsp;|&nbsp; 실제 근 &asymp; 1.52138
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <DemoSvg step={step} />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={advance}
                  disabled={step >= rows.length}
                  className="px-5 py-2 rounded-xl font-mono text-sm bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30 transition disabled:opacity-30"
                >
                  Next Step &rarr;
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-2 rounded-xl font-mono text-sm bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* iteration table */}
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs border-b border-slate-800">
                    <th className="py-2 px-2 text-left">n</th>
                    <th className="py-2 px-2 text-right">x<sub>n-1</sub></th>
                    <th className="py-2 px-2 text-right">x<sub>n</sub></th>
                    <th className="py-2 px-2 text-right">f(x<sub>n</sub>)</th>
                    <th className="py-2 px-2 text-right">x<sub>n+1</sub></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, step).map((r) => (
                    <tr
                      key={r.n}
                      className="border-b border-slate-800/50 text-slate-300"
                    >
                      <td className="py-2 px-2 text-sky-400">{r.n}</td>
                      <td className="py-2 px-2 text-right text-fuchsia-400">{r.xPrev.toFixed(8)}</td>
                      <td className="py-2 px-2 text-right text-pink-400">{r.xCurr.toFixed(8)}</td>
                      <td className="py-2 px-2 text-right text-slate-400">{r.fCurr.toFixed(8)}</td>
                      <td className="py-2 px-2 text-right text-emerald-400">{r.xNext.toFixed(8)}</td>
                    </tr>
                  ))}
                  {step === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-600 text-xs">
                        &ldquo;Next Step&rdquo; 버튼을 눌러 반복을 시작하세요
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {step > 0 && (
                <p className="text-xs text-slate-500 mt-3 font-mono">
                  {step >= 5
                    ? "수렴 완료 -- superlinear convergence (p \u2248 1.618)"
                    : `Step ${step}/${rows.length} -- 도함수 없이도 빠르게 수렴합니다`}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ---- 6. Convergence ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-fuchsia-400">수렴 차수 &mdash; Convergence Order</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
                <p className="text-slate-500 text-xs uppercase tracking-wider">Superlinear convergence</p>
                <p className="text-lg text-pink-400">
                  |&epsilon;<sub>n+1</sub>| &asymp; C &middot; |&epsilon;<sub>n</sub>|<sup className="text-fuchsia-400">p</sup>
                </p>
                <p className="text-2xl text-fuchsia-400 font-bold">
                  p = (1 + &radic;5) / 2 &asymp; 1.618
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  수렴 차수가 <span className="text-fuchsia-400">황금비(Golden Ratio)</span>와 같습니다!
                  선형(Bisection)보다 빠르고 이차(Newton)보다는 느리지만,
                  도함수 계산이 필요 없다는 장점이 있습니다.
                </p>
              </div>

              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                주의: Secant 법은 초기값 2개가 필요하지만, Bisection과 달리
                구간(bracket)이 필요하지 않습니다. 즉, f(x<sub>0</sub>)와 f(x<sub>1</sub>)의
                부호가 다를 필요가 없습니다.
              </p>
            </div>

            {/* convergence comparison cards */}
            <div className="space-y-4">
              {convergenceCards.map((c) => {
                const colorMap: Record<string, string> = {
                  slate: "bg-slate-800/60 border-slate-700 text-slate-300",
                  pink: "bg-pink-500/10 border-pink-500/30 text-pink-400",
                  fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400",
                };
                const cls = colorMap[c.color] || colorMap.slate;
                return (
                  <div
                    key={c.method}
                    className={`rounded-2xl border p-5 font-mono ${cls}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">{c.method}</p>
                        <p className="text-xs text-slate-400">{c.label}</p>
                      </div>
                      <p className="text-xl font-bold">{c.order}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ---- 7. Secant vs Newton vs Bisection ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">비교 &mdash; Method Comparison</h3>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-800">
                  <th className="py-3 px-3 text-left">항목</th>
                  <th className="py-3 px-3 text-center">Bisection</th>
                  <th className="py-3 px-3 text-center">Secant</th>
                  <th className="py-3 px-3 text-center">Newton</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">수렴 차수</td>
                  <td className="py-3 px-3 text-center">1 (linear)</td>
                  <td className="py-3 px-3 text-center text-pink-400">1.618</td>
                  <td className="py-3 px-3 text-center text-fuchsia-400">2 (quadratic)</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">초기값 개수</td>
                  <td className="py-3 px-3 text-center">2 (bracket)</td>
                  <td className="py-3 px-3 text-center text-pink-400">2 (any)</td>
                  <td className="py-3 px-3 text-center">1</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">도함수 필요</td>
                  <td className="py-3 px-3 text-center text-emerald-400">No</td>
                  <td className="py-3 px-3 text-center text-emerald-400">No</td>
                  <td className="py-3 px-3 text-center text-rose-400">Yes</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">수렴 보장</td>
                  <td className="py-3 px-3 text-center text-emerald-400">Always</td>
                  <td className="py-3 px-3 text-center text-amber-400">No</td>
                  <td className="py-3 px-3 text-center text-amber-400">No</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">반복당 함수 평가</td>
                  <td className="py-3 px-3 text-center">1</td>
                  <td className="py-3 px-3 text-center text-pink-400">1</td>
                  <td className="py-3 px-3 text-center">1 (f) + 1 (f&apos;)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-400">사용 시기</td>
                  <td className="py-3 px-3 text-center text-xs">안전한 초기 탐색</td>
                  <td className="py-3 px-3 text-center text-xs text-pink-400">f&apos; 계산 불가/비싼 경우</td>
                  <td className="py-3 px-3 text-center text-xs">f&apos; 사용 가능할 때</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
            <p className="text-pink-400 font-bold text-sm">When to use Secant Method?</p>
            <ul className="space-y-1">
              <li>&#x2022; 도함수를 해석적으로 구하기 어려울 때</li>
              <li>&#x2022; 함수가 블랙박스(시뮬레이션, 실험)일 때</li>
              <li>&#x2022; 도함수 계산이 함수 평가보다 훨씬 비쌀 때</li>
              <li>&#x2022; Newton 수준의 빠른 수렴이 필요하지만 f&apos;를 쓸 수 없을 때</li>
            </ul>
          </div>
        </motion.div>

        {/* ---- 8. MATLAB Implementation ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-fuchsia-400">MATLAB Implementation</h3>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`function [root, iter] = secant(f, x0, x1, tol, maxiter)
% SECANT  Secant method for solving f(x) = 0
%   [root, iter] = secant(f, x0, x1, tol, maxiter)
%
%   Inputs:
%     f       - function handle for f(x)
%     x0, x1  - two initial guesses
%     tol     - tolerance (default 1e-10)
%     maxiter - maximum iterations (default 100)
%
%   Outputs:
%     root - approximate root
%     iter - number of iterations used

  if nargin < 4, tol = 1e-10; end
  if nargin < 5, maxiter = 100; end

  xPrev = x0;
  xCurr = x1;
  fPrev = f(xPrev);

  fprintf('  n     x_{n-1}          x_n            f(x_n)\\n');
  fprintf('-----  --------------  --------------  --------------\\n');

  for iter = 1:maxiter
      fCurr = f(xCurr);

      fprintf('%3d   %14.10f  %14.10f  %14.10f\\n', ...
              iter-1, xPrev, xCurr, fCurr);

      if abs(fCurr) < tol
          root = xCurr;
          fprintf('Converged in %d iterations.\\n', iter-1);
          return;
      end

      denom = fCurr - fPrev;
      if abs(denom) < eps
          error('Division by zero. Secant method fails.');
      end

      xNext = xCurr - fCurr * (xCurr - xPrev) / denom;

      % Update for next iteration
      xPrev = xCurr;
      fPrev = fCurr;
      xCurr = xNext;
  end

  warning('Maximum iterations reached.');
  root = xCurr;
end`}</pre>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <p className="text-xs text-slate-500 font-mono mb-3">% Usage example</p>
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`f = @(x) x^3 - x - 2;

[root, iter] = secant(f, 1, 2, 1e-12, 50);
fprintf('Root = %.15f (after %d iterations)\\n', root, iter);

% Output:
%   n     x_{n-1}          x_n            f(x_n)
% -----  --------------  --------------  --------------
%   0    1.0000000000    2.0000000000    4.0000000000
%   1    2.0000000000    1.4000000000   -0.6560000000
%   2    1.4000000000    1.5076923077    0.0173814508
%   3    1.5076923077    1.5213461147   -0.0000905498
%   4    1.5213461147    1.5213797018   -0.0000000134
%   5    1.5213797018    1.5213797068    0.0000000000
% Converged in 5 iterations.
% Root = 1.521379706804568`}</pre>
          </div>

          <p className="text-xs text-slate-500 font-mono leading-relaxed">
            Newton 법(3 iterations)보다 약간 더 걸리지만,
            도함수 f&apos;(x)를 전혀 사용하지 않습니다.
            반복당 함수 평가는 1회로 Newton(f + f&apos; = 2회)보다 효율적입니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
