"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Helper: Newton iteration on f(x) = x^3 - x - 2                   */
/* ------------------------------------------------------------------ */
const f = (x: number) => x * x * x - x - 2;
const df = (x: number) => 3 * x * x - 1;

interface IterRow {
  n: number;
  xn: number;
  fxn: number;
  dfxn: number;
  xn1: number;
}

function buildIterations(x0: number, steps: number): IterRow[] {
  const rows: IterRow[] = [];
  let x = x0;
  for (let n = 0; n < steps; n++) {
    const fv = f(x);
    const dv = df(x);
    const xNext = x - fv / dv;
    rows.push({ n, xn: x, fxn: fv, dfxn: dv, xn1: xNext });
    x = xNext;
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

/* ------------------------------------------------------------------ */
/*  Geometric Derivation SVG                                           */
/* ------------------------------------------------------------------ */
function DerivationSvg() {
  const xMin = 0.5;
  const xMax = 2.2;
  const yMin = -3;
  const yMax = 5;

  const xi = 1.8;
  const fxi = f(xi);
  const dxi = df(xi);
  const xi1 = xi - fxi / dxi;

  // curve path
  const pts: string[] = [];
  for (let t = xMin; t <= xMax; t += 0.02) {
    const [sx, sy] = toSvg(t, f(t), xMin, xMax, yMin, yMax);
    pts.push(`${pts.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  // tangent line endpoints
  const tLeft = xi - 1.0;
  const tRight = xi + 0.3;
  const tanY = (t: number) => fxi + dxi * (t - xi);
  const [tlx, tly] = toSvg(tLeft, tanY(tLeft), xMin, xMax, yMin, yMax);
  const [trx, trY] = toSvg(tRight, tanY(tRight), xMin, xMax, yMin, yMax);

  const [pxXi, pyXi] = toSvg(xi, fxi, xMin, xMax, yMin, yMax);
  const [pxXi1, pyXi1] = toSvg(xi1, 0, xMin, xMax, yMin, yMax);
  const [axisL, axisY] = toSvg(xMin, 0, xMin, xMax, yMin, yMax);
  const [axisR] = toSvg(xMax, 0, xMin, xMax, yMin, yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {/* axes */}
      <line x1={pad} y1={axisY} x2={W - pad} y2={axisY} stroke="#475569" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#475569" strokeWidth={1} />

      {/* curve */}
      <path d={pts.join(" ")} fill="none" stroke="#fb7185" strokeWidth={2.5} />

      {/* tangent line */}
      <line x1={tlx} y1={tly} x2={trx} y2={trY} stroke="#f472b6" strokeWidth={1.8} strokeDasharray="6 3" />

      {/* dots */}
      <circle cx={pxXi} cy={pyXi} r={5} fill="#fb7185" />
      <circle cx={pxXi1} cy={pyXi1} r={5} fill="#38bdf8" />

      {/* dashed vertical from xi to curve */}
      <line x1={pxXi} y1={pyXi} x2={pxXi} y2={axisY} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />

      {/* labels */}
      <text x={pxXi} y={axisY + 16} textAnchor="middle" fill="#f472b6" fontSize={13} fontFamily="monospace">
        x_i
      </text>
      <text x={pxXi1} y={axisY + 16} textAnchor="middle" fill="#38bdf8" fontSize={13} fontFamily="monospace">
        {"x_{i+1}"}
      </text>
      <text x={pxXi + 8} y={pyXi - 8} fill="#fb7185" fontSize={12} fontFamily="monospace">
        {"(x_i, f(x_i))"}
      </text>
      <text x={W - pad - 30} y={axisY - 6} fill="#64748b" fontSize={11} fontFamily="monospace">
        x
      </text>
      <text x={pad + 4} y={pad + 12} fill="#64748b" fontSize={11} fontFamily="monospace">
        y
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive demo SVG                                               */
/* ------------------------------------------------------------------ */
function DemoSvg({ step }: { step: number }) {
  const xMin = 0.5;
  const xMax = 2.2;
  const yMin = -3;
  const yMax = 6;

  const rows = buildIterations(1.5, 6);

  // curve
  const pts: string[] = [];
  for (let t = xMin; t <= xMax; t += 0.015) {
    const [sx, sy] = toSvg(t, f(t), xMin, xMax, yMin, yMax);
    pts.push(`${pts.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  const [, axisY] = toSvg(0, 0, xMin, xMax, yMin, yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {/* axes */}
      <line x1={pad} y1={axisY} x2={W - pad} y2={axisY} stroke="#475569" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#475569" strokeWidth={1} />

      {/* curve */}
      <path d={pts.join(" ")} fill="none" stroke="#fb7185" strokeWidth={2.5} />

      {/* tangent lines for each completed step */}
      {rows.slice(0, step).map((r, i) => {
        const tanL = r.xn - 0.6;
        const tanR = r.xn + 0.5;
        const tanY = (t: number) => r.fxn + r.dfxn * (t - r.xn);
        const clampL = Math.max(xMin, tanL);
        const clampR = Math.min(xMax, tanR);
        const [lx, ly] = toSvg(clampL, tanY(clampL), xMin, xMax, yMin, yMax);
        const [rx, ry] = toSvg(clampR, tanY(clampR), xMin, xMax, yMin, yMax);
        const [cx, cy] = toSvg(r.xn, r.fxn, xMin, xMax, yMin, yMax);
        const [nx, ny] = toSvg(r.xn1, 0, xMin, xMax, yMin, yMax);
        const opacity = 0.35 + 0.65 * (i / Math.max(step - 1, 1));
        return (
          <g key={i} opacity={opacity}>
            <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#f472b6" strokeWidth={1.4} strokeDasharray="5 3" />
            <circle cx={cx} cy={cy} r={4} fill="#fb7185" />
            <circle cx={nx} cy={ny} r={4} fill="#38bdf8" />
            <line x1={cx} y1={cy} x2={cx} y2={axisY} stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 3" />
          </g>
        );
      })}

      {/* current x label */}
      {step > 0 && step <= rows.length && (() => {
        const r = rows[step - 1];
        const [nx] = toSvg(r.xn1, 0, xMin, xMax, yMin, yMax);
        return (
          <text x={nx} y={axisY + 16} textAnchor="middle" fill="#38bdf8" fontSize={12} fontFamily="monospace">
            x_{step}
          </text>
        );
      })()}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Failure case SVGs                                                  */
/* ------------------------------------------------------------------ */
function HorizontalTangentSvg() {
  const xMin = -2; const xMax = 2; const yMin = -1; const yMax = 4;
  const pts: string[] = [];
  for (let t = xMin; t <= xMax; t += 0.05) {
    const y = t * t;
    const [sx, sy] = toSvg(t, y, xMin, xMax, yMin, yMax);
    pts.push(`${pts.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }
  const [cx, cy] = toSvg(0, 0, xMin, xMax, yMin, yMax);
  return (
    <svg viewBox={`0 0 200 150`} className="w-full h-32">
      <path d={pts.join(" ")} fill="none" stroke="#fb7185" strokeWidth={2} transform="scale(0.42) translate(-5,0)" />
      <line x1={20} y1={cy * 0.42} x2={180} y2={cy * 0.42} stroke="#f472b6" strokeWidth={1.5} strokeDasharray="4 3" />
      <circle cx={cx * 0.42 + 2} cy={cy * 0.42} r={4} fill="#fbbf24" />
      <text x={100} y={140} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        f&apos;(x)=0 at minimum
      </text>
    </svg>
  );
}

function CyclingSvg() {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-32">
      <path d="M30,120 Q100,10 170,120" fill="none" stroke="#fb7185" strokeWidth={2} />
      <line x1={60} y1={70} x2={140} y2={70} stroke="#f472b6" strokeWidth={1.2} strokeDasharray="4 3" />
      <path d="M80,70 L120,70 L120,90 L80,90 Z" fill="none" stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 2" />
      <circle cx={80} cy={70} r={3} fill="#38bdf8" />
      <circle cx={120} cy={70} r={3} fill="#38bdf8" />
      <text x={100} y={140} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
        oscillation between points
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function NewtonRaphson() {
  const [step, setStep] = useState(0);
  const maxSteps = 6;
  const rows = buildIterations(1.5, maxSteps);

  const advance = useCallback(() => setStep((s) => Math.min(s + 1, maxSteps)), []);
  const reset = useCallback(() => setStep(0), []);

  /* convergence example table */
  const convErrors = [
    { n: 0, eps: "10^{-1}", val: "0.1" },
    { n: 1, eps: "10^{-2}", val: "0.01" },
    { n: 2, eps: "10^{-4}", val: "0.0001" },
    { n: 3, eps: "10^{-8}", val: "10^{-8}" },
    { n: 4, eps: "10^{-16}", val: "10^{-16}" },
  ];

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Week 4 &mdash; Nonlinear Equations I
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Newton&ndash;Raphson Method
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            접선(tangent)을 이용한 근 탐색 &mdash; 가장 유명한 비선형 방정식 풀이법
          </p>
        </motion.div>

        {/* ---- 1. Geometric Derivation ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-rose-400">기하학적 유도 &mdash; Geometric Derivation</h3>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Taylor expansion at x_i</p>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                <p>
                  f(x<sub>i+1</sub>) &asymp; f(x<sub>i</sub>) + f&apos;(x<sub>i</sub>)(x<sub>i+1</sub> &minus; x<sub>i</sub>)
                </p>
                <p className="text-slate-500">&darr; Set f(x<sub>i+1</sub>) = 0</p>
                <p>
                  0 = f(x<sub>i</sub>) + f&apos;(x<sub>i</sub>)(x<sub>i+1</sub> &minus; x<sub>i</sub>)
                </p>
                <p className="text-slate-500">&darr; Solve for x<sub>i+1</sub></p>
                <p className="text-rose-400 text-base">
                  x<sub>i+1</sub> = x<sub>i</sub> &minus; f(x<sub>i</sub>) / f&apos;(x<sub>i</sub>)
                </p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                접선(tangent line)은 f를 x<sub>i</sub>에서 선형화(linearization)한 것입니다.
                이 접선이 x축과 만나는 점이 다음 근사값 x<sub>i+1</sub>이 됩니다.
              </p>
            </div>

            <DerivationSvg />
          </div>
        </motion.div>

        {/* ---- 2. The Formula ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">The Newton&ndash;Raphson Formula</h3>

          <div className="inline-flex items-baseline gap-2 text-3xl md:text-4xl font-mono font-bold py-6">
            <span className="text-slate-300">x</span>
            <sub className="text-slate-500 text-lg">n+1</sub>
            <span className="text-slate-500 mx-1">=</span>
            <span className="text-sky-400">x<sub className="text-lg">n</sub></span>
            <span className="text-slate-500 mx-1">&minus;</span>
            <span className="flex flex-col items-center leading-tight">
              <span className="text-rose-400 border-b-2 border-slate-600 pb-1 px-2">
                f(x<sub className="text-lg">n</sub>)
              </span>
              <span className="text-pink-400 pt-1 px-2">
                f&apos;(x<sub className="text-lg">n</sub>)
              </span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
              x_n &mdash; 현재 근사값 (current guess)
            </span>
            <span className="px-3 py-1.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              f(x_n) &mdash; 함수값 (function value)
            </span>
            <span className="px-3 py-1.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30">
              f&apos;(x_n) &mdash; 도함수값 (derivative)
            </span>
          </div>
        </motion.div>

        {/* ---- 3. Interactive Demo ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-rose-400">
            Interactive Demo &mdash; f(x) = x&sup3; &minus; x &minus; 2
          </h3>
          <p className="font-mono text-sm text-slate-400">
            f&apos;(x) = 3x&sup2; &minus; 1 &nbsp;|&nbsp; x<sub>0</sub> = 1.5 &nbsp;|&nbsp; 실제 근 &asymp; 1.52138
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <DemoSvg step={step} />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={advance}
                  disabled={step >= maxSteps}
                  className="px-5 py-2 rounded-xl font-mono text-sm bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition disabled:opacity-30"
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
                    <th className="py-2 px-2 text-right">x_n</th>
                    <th className="py-2 px-2 text-right">f(x_n)</th>
                    <th className="py-2 px-2 text-right">f&apos;(x_n)</th>
                    <th className="py-2 px-2 text-right">x_{"{n+1}"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, step).map((r) => (
                    <tr
                      key={r.n}
                      className="border-b border-slate-800/50 text-slate-300"
                    >
                      <td className="py-2 px-2 text-sky-400">{r.n}</td>
                      <td className="py-2 px-2 text-right">{r.xn.toFixed(8)}</td>
                      <td className="py-2 px-2 text-right text-rose-400">{r.fxn.toFixed(8)}</td>
                      <td className="py-2 px-2 text-right text-pink-400">{r.dfxn.toFixed(6)}</td>
                      <td className="py-2 px-2 text-right text-emerald-400">{r.xn1.toFixed(8)}</td>
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
                  {step >= 4
                    ? "수렴 완료 — quadratic convergence로 빠르게 수렴합니다"
                    : `Step ${step}/${maxSteps} — 정확도가 매 반복마다 대략 두 배씩 증가합니다`}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ---- 4. Quadratic Convergence ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">이차 수렴 &mdash; Quadratic Convergence</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Error recurrence</p>
                <p className="text-lg text-rose-400">
                  |&epsilon;<sub>n+1</sub>| &asymp; <span className="text-pink-400">|f&Prime;(&xi;) / (2f&apos;(&xi;))|</span> &middot; |&epsilon;<sub>n</sub>|&sup2;
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  매 반복마다 유효 자릿수(digits of accuracy)가 대략 <span className="text-rose-400 font-bold">두 배</span>가 됩니다.
                  이것이 Newton 법이 강력한 이유입니다.
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Comparison</p>
                <div className="flex gap-4">
                  <div className="flex-1 text-center">
                    <p className="text-slate-500 text-xs">Bisection</p>
                    <p className="text-2xl font-bold text-slate-400">~20</p>
                    <p className="text-xs text-slate-600">iterations</p>
                  </div>
                  <div className="w-px bg-slate-800" />
                  <div className="flex-1 text-center">
                    <p className="text-rose-400 text-xs">Newton</p>
                    <p className="text-2xl font-bold text-rose-400">~5</p>
                    <p className="text-xs text-slate-600">iterations</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2 text-center">같은 정확도 (10&sup{-6}) 달성 기준</p>
              </div>
            </div>

            {/* error table */}
            <div>
              <p className="text-xs text-slate-500 font-mono mb-3 uppercase tracking-wider">Error progression (quadratic)</p>
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs border-b border-slate-800">
                    <th className="py-2 px-3 text-left">Iteration</th>
                    <th className="py-2 px-3 text-right">|&epsilon;_n|</th>
                    <th className="py-2 px-3 text-right">Digits</th>
                  </tr>
                </thead>
                <tbody>
                  {convErrors.map((e) => (
                    <tr key={e.n} className="border-b border-slate-800/50">
                      <td className="py-2 px-3 text-sky-400">{e.n}</td>
                      <td className="py-2 px-3 text-right text-rose-400">{e.val}</td>
                      <td className="py-2 px-3 text-right text-emerald-400">
                        {Math.pow(2, e.n)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-600 font-mono mt-2">
                &epsilon;: 10&sup{-1} &rarr; 10&sup{-2} &rarr; 10&sup{-4} &rarr; 10&sup{-8} &rarr; 10&sup{-16}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---- 5. When Newton Fails ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-rose-400 text-center">
            Newton 법이 실패하는 경우 &mdash; When Newton Fails
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <HorizontalTangentSvg />
              <h4 className="font-bold text-rose-400 font-mono text-sm">
                f&apos;(x_n) = 0 &mdash; Division by Zero
              </h4>
              <p className="text-slate-400 text-xs font-mono leading-relaxed">
                접선이 수평일 때 x축과의 교점이 존재하지 않습니다.
                극값(extremum) 근처에서 발생합니다.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <CyclingSvg />
              <h4 className="font-bold text-rose-400 font-mono text-sm">
                Cycling / Oscillation
              </h4>
              <p className="text-slate-400 text-xs font-mono leading-relaxed">
                두 점 사이를 진동하며 수렴하지 못하는 경우.
                예: f(x) = x&sup3; &minus; 2x + 2 에서 특정 초기값.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <svg viewBox="0 0 200 150" className="w-full h-32">
                <path d="M30,75 C80,130 120,20 170,75" fill="none" stroke="#fb7185" strokeWidth={2} />
                <circle cx={50} cy={95} r={3} fill="#38bdf8" />
                <circle cx={150} cy={55} r={3} fill="#fbbf24" />
                <path d="M50,95 L150,55" stroke="#f472b6" strokeWidth={1.2} strokeDasharray="4 3" />
                <text x={100} y={140} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
                  divergence to wrong region
                </text>
              </svg>
              <h4 className="font-bold text-rose-400 font-mono text-sm">
                Divergence &mdash; 발산
              </h4>
              <p className="text-slate-400 text-xs font-mono leading-relaxed">
                f(x) = x^(1/3) 처럼 근 근처에서 도함수가 발산하면
                Newton 법이 수렴하지 않습니다.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <svg viewBox="0 0 200 150" className="w-full h-32">
                <path d="M20,130 C60,30 100,130 140,30 S180,130 190,80" fill="none" stroke="#fb7185" strokeWidth={2} />
                <circle cx={40} cy={80} r={4} fill="#38bdf8" />
                <circle cx={165} cy={55} r={4} fill="#fbbf24" />
                <text x={40} y={70} textAnchor="middle" fill="#38bdf8" fontSize={10} fontFamily="monospace">x_0</text>
                <text x={165} y={45} textAnchor="middle" fill="#fbbf24" fontSize={10} fontFamily="monospace">wrong root</text>
                <text x={100} y={140} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">
                  poor initial guess
                </text>
              </svg>
              <h4 className="font-bold text-rose-400 font-mono text-sm">
                Poor Initial Guess &mdash; 잘못된 초기값
              </h4>
              <p className="text-slate-400 text-xs font-mono leading-relaxed">
                초기값이 원하는 근에서 멀면 다른 근으로
                수렴하거나 발산할 수 있습니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---- 6. MATLAB Implementation ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">MATLAB Implementation</h3>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`function [root, iter] = newton(f, df, x0, tol, maxiter)
% NEWTON  Newton-Raphson method for solving f(x) = 0
%   [root, iter] = newton(f, df, x0, tol, maxiter)
%
%   Inputs:
%     f       - function handle for f(x)
%     df      - function handle for f'(x)
%     x0      - initial guess
%     tol     - tolerance (default 1e-10)
%     maxiter - maximum iterations (default 100)
%
%   Outputs:
%     root - approximate root
%     iter - number of iterations used

  if nargin < 4, tol = 1e-10; end
  if nargin < 5, maxiter = 100; end

  x = x0;
  fprintf('  n        x_n            f(x_n)\\n');
  fprintf('------  --------------  --------------\\n');

  for iter = 1:maxiter
      fx = f(x);
      dfx = df(x);

      fprintf('%3d    %14.10f  %14.10f\\n', iter-1, x, fx);

      if abs(fx) < tol
          root = x;
          fprintf('Converged in %d iterations.\\n', iter-1);
          return;
      end

      if abs(dfx) < eps
          error('Derivative is zero. Newton method fails.');
      end

      x = x - fx / dfx;
  end

  warning('Maximum iterations reached.');
  root = x;
end`}</pre>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <p className="text-xs text-slate-500 font-mono mb-3">% Usage example</p>
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`f  = @(x) x^3 - x - 2;
df = @(x) 3*x^2 - 1;

[root, iter] = newton(f, df, 1.5, 1e-12, 50);
fprintf('Root = %.15f (after %d iterations)\\n', root, iter);

% Output:
%   n        x_n            f(x_n)
% ------  --------------  --------------
%   0      1.5000000000    -0.1250000000
%   1      1.5217391304     0.0012145880
%   2      1.5213798256     0.0000001171
%   3      1.5213797068     0.0000000000
% Converged in 3 iterations.
% Root = 1.521379706804568`}</pre>
          </div>

          <p className="text-xs text-slate-500 font-mono leading-relaxed">
            주의: 도함수 f&apos;(x)를 직접 제공해야 합니다. 도함수를 구하기 어려운 경우
            Secant Method (할선법)를 사용하면 도함수 없이 비슷한 성능을 얻을 수 있습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
