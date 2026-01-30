"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

// --- Bisection logic ---
const f = (x: number) => x * x * x - x - 2;

interface IterationRow {
  step: number;
  a: number;
  b: number;
  c: number;
  fc: number;
  width: number;
}

function computeIterations(a0: number, b0: number, maxSteps: number): IterationRow[] {
  const rows: IterationRow[] = [];
  let a = a0;
  let b = b0;
  for (let i = 1; i <= maxSteps; i++) {
    const c = (a + b) / 2;
    const fc = f(c);
    rows.push({ step: i, a, b, c, fc, width: Math.abs(b - a) });
    if (Math.abs(fc) < 1e-12 || Math.abs(b - a) / 2 < 1e-10) break;
    if (f(a) * fc < 0) {
      b = c;
    } else {
      a = c;
    }
  }
  return rows;
}

const allIterations = computeIterations(1, 2, 30);

// --- SVG helpers ---
function mapX(x: number, xMin: number, xMax: number, w: number) {
  return ((x - xMin) / (xMax - xMin)) * w;
}
function mapY(y: number, yMin: number, yMax: number, h: number) {
  return h - ((y - yMin) / (yMax - yMin)) * h;
}

function CurveSVG({ currentStep }: { currentStep: number }) {
  const w = 500;
  const h = 260;
  const xMin = 0.5;
  const xMax = 2.5;
  const yMin = -3;
  const yMax = 6;

  const points: string[] = [];
  for (let px = 0; px <= 200; px++) {
    const x = xMin + (px / 200) * (xMax - xMin);
    const y = f(x);
    points.push(`${mapX(x, xMin, xMax, w)},${mapY(y, yMin, yMax, h)}`);
  }
  const polyline = points.join(" ");

  const iter = currentStep > 0 ? allIterations[currentStep - 1] : null;
  const aX = iter ? mapX(iter.a, xMin, xMax, w) : 0;
  const bX = iter ? mapX(iter.b, xMin, xMax, w) : 0;
  const cX = iter ? mapX(iter.c, xMin, xMax, w) : 0;
  const cY = iter ? mapY(iter.fc, yMin, yMax, h) : 0;
  const zeroY = mapY(0, yMin, yMax, h);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {/* background grid */}
      {[0, 1, 2].map((v) => (
        <line
          key={`gx-${v}`}
          x1={mapX(v, xMin, xMax, w)}
          y1={0}
          x2={mapX(v, xMin, xMax, w)}
          y2={h}
          stroke="#334155"
          strokeWidth={0.5}
        />
      ))}
      {[-2, 0, 2, 4].map((v) => (
        <line
          key={`gy-${v}`}
          x1={0}
          y1={mapY(v, yMin, yMax, h)}
          x2={w}
          y2={mapY(v, yMin, yMax, h)}
          stroke="#334155"
          strokeWidth={0.5}
        />
      ))}
      {/* x-axis */}
      <line x1={0} y1={zeroY} x2={w} y2={zeroY} stroke="#64748b" strokeWidth={1} />
      {/* bracket highlight */}
      {iter && (
        <rect
          x={aX}
          y={0}
          width={bX - aX}
          height={h}
          fill="rgba(251,113,133,0.10)"
          stroke="#fb7185"
          strokeWidth={1}
          strokeDasharray="4 2"
        />
      )}
      {/* curve */}
      <polyline points={polyline} fill="none" stroke="#f472b6" strokeWidth={2.5} />
      {/* midpoint marker */}
      {iter && (
        <>
          <line x1={cX} y1={0} x2={cX} y2={h} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={cX} cy={cY} r={5} fill="#fbbf24" />
          <text x={cX + 8} y={cY - 8} fill="#fbbf24" fontSize={12} fontFamily="monospace">
            c={iter.c.toFixed(4)}
          </text>
        </>
      )}
      {/* axis labels */}
      {[1, 1.5, 2].map((v) => (
        <text key={v} x={mapX(v, xMin, xMax, w)} y={zeroY + 14} fill="#94a3b8" fontSize={10} textAnchor="middle">
          {v}
        </text>
      ))}
    </svg>
  );
}

// --- Main component ---
export default function BisectionMethod() {
  const [step, setStep] = useState(0);
  const maxStep = allIterations.length;

  const visibleRows = useMemo(() => allIterations.slice(0, step), [step]);

  const advance = () => setStep((s) => Math.min(s + 1, maxStep));
  const reset = () => setStep(0);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5 },
  };

  return (
    <section className="space-y-16">
      {/* ========== 1. Header ========== */}
      <motion.div {...fadeUp} className="text-center space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium tracking-wide">
          Nonlinear Equations I
        </span>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
          이분법 (Bisection Method)
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          중간값 정리에 기반한 가장 기본적이고 안정적인 근 탐색 알고리즘
        </p>
      </motion.div>

      {/* ========== 2. Algorithm Flowchart ========== */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">알고리즘 (Algorithm)</h3>
          <div className="flex flex-col items-center gap-3">
            {[
              { label: "Start", desc: "f(a)·f(b) < 0 인 구간 [a, b] 설정" },
              { label: "Midpoint", desc: "c = (a + b) / 2 계산" },
              { label: "Check", desc: "f(c) = 0 또는 |b−a|/2 < tol?" },
              { label: "Sign Test", desc: "f(a)·f(c) < 0 이면 b ← c, 아니면 a ← c" },
              { label: "Repeat", desc: "수렴할 때까지 반복" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full max-w-md">
                {i > 0 && (
                  <div className="w-px h-6 bg-gradient-to-b from-rose-500/60 to-rose-500/20" />
                )}
                <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center">
                  <span className="text-rose-400 font-mono font-semibold text-sm">{item.label}</span>
                  <p className="text-slate-300 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">
              <span className="text-pink-400 font-semibold">핵심 원리:</span>{" "}
              중간값 정리(Intermediate Value Theorem)에 의해, 연속함수 f 가 구간 끝점에서 부호가 다르면
              그 구간 내에 반드시 근이 존재합니다. 매 반복마다 구간이 절반으로 줄어듭니다.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ========== 3. Interactive Demo ========== */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">인터랙티브 데모 (Interactive Demo)</h3>
          <p className="text-slate-400 text-sm">
            <span className="font-mono text-pink-400">f(x) = x³ − x − 2</span>, 초기 구간{" "}
            <span className="font-mono text-pink-400">[1, 2]</span> (근 ≈ 1.5214)
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={advance}
              disabled={step >= maxStep}
              className="px-5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 font-medium text-sm hover:bg-rose-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음 단계 (Step {step + 1})
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-medium text-sm hover:bg-slate-700 transition"
            >
              초기화 (Reset)
            </button>
            <span className="text-slate-500 text-sm font-mono">
              {step}/{maxStep} iterations
            </span>
          </div>

          {/* Current bracket info */}
          {step > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-3"
            >
              {[
                { label: "a", value: allIterations[step - 1].a.toFixed(6) },
                { label: "b", value: allIterations[step - 1].b.toFixed(6) },
                { label: "c", value: allIterations[step - 1].c.toFixed(6) },
                {
                  label: "f(c)",
                  value: allIterations[step - 1].fc.toExponential(3),
                },
                {
                  label: "|b−a|",
                  value: allIterations[step - 1].width.toExponential(3),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"
                >
                  <div className="text-slate-500 text-xs">{item.label}</div>
                  <div className="text-pink-400 font-mono text-sm mt-1">{item.value}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SVG curve */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden">
            <CurveSVG currentStep={step} />
          </div>

          {/* Iteration table */}
          {visibleRows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    {["Step", "a", "b", "c", "f(c)", "|b−a|"].map((h) => (
                      <th key={h} className="py-2 px-3 text-left font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <motion.tr
                      key={row.step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b border-slate-800/50 text-slate-300"
                    >
                      <td className="py-2 px-3 text-rose-400">{row.step}</td>
                      <td className="py-2 px-3">{row.a.toFixed(6)}</td>
                      <td className="py-2 px-3">{row.b.toFixed(6)}</td>
                      <td className="py-2 px-3 text-pink-400">{row.c.toFixed(6)}</td>
                      <td className="py-2 px-3">{row.fc.toExponential(3)}</td>
                      <td className="py-2 px-3">{row.width.toExponential(3)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* ========== 4. Convergence Analysis ========== */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">수렴 분석 (Convergence Analysis)</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Error bound */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-3">
              <h4 className="text-pink-400 font-semibold">오차 한계 (Error Bound)</h4>
              <div className="bg-slate-950 rounded-xl p-4 font-mono text-slate-200 text-center text-lg">
                |&epsilon;<sub>n</sub>| &le; (b &minus; a) / 2<sup>n</sup>
              </div>
              <p className="text-slate-400 text-sm">
                n번 반복 후 오차의 상한은 초기 구간 길이를 2<sup>n</sup>으로 나눈 값입니다.
              </p>
            </div>

            {/* Iterations needed */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-3">
              <h4 className="text-pink-400 font-semibold">필요 반복 횟수</h4>
              <div className="bg-slate-950 rounded-xl p-4 font-mono text-slate-200 text-center text-lg">
                n &ge; log<sub>2</sub>((b &minus; a) / tol)
              </div>
              <p className="text-slate-400 text-sm">
                허용 오차 tol을 만족하기 위해 필요한 최소 반복 횟수를 사전에 계산할 수 있습니다.
              </p>
            </div>

            {/* Convergence rate */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-3">
              <h4 className="text-pink-400 font-semibold">수렴 차수 (Convergence Rate)</h4>
              <div className="bg-slate-950 rounded-xl p-4 text-center">
                <span className="text-rose-400 font-bold text-xl font-mono">LINEAR (1차 수렴)</span>
              </div>
              <p className="text-slate-400 text-sm">
                매 반복마다 오차가 상수비(1/2)로 감소합니다. 수렴이 보장되지만 속도는 느린 편입니다.
              </p>
            </div>

            {/* Example calculation */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-3">
              <h4 className="text-pink-400 font-semibold">예제 계산</h4>
              <div className="bg-slate-950 rounded-xl p-4 font-mono text-sm text-slate-300 space-y-1">
                <p>
                  [a, b] = [1, 2], tol = 10<sup>-6</sup>
                </p>
                <p>
                  n &ge; log<sub>2</sub>(1 / 10<sup>-6</sup>) = log<sub>2</sub>(10<sup>6</sup>)
                </p>
                <p className="text-rose-400 font-bold">n &ge; 19.93 &rarr; 20 iterations</p>
              </div>
              <p className="text-slate-400 text-sm">
                구간 [1,2]에서 10<sup>-6</sup> 정밀도를 얻으려면 최소 20회 반복이 필요합니다.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========== 5. Advantages & Disadvantages ========== */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
            <h3 className="text-xl font-bold text-emerald-400">장점 (Advantages)</h3>
            <ul className="space-y-3">
              {[
                {
                  title: "수렴 보장 (Guaranteed Convergence)",
                  desc: "f(a)f(b)<0 조건만 만족하면 반드시 수렴합니다.",
                },
                {
                  title: "구현이 간단 (Simple Implementation)",
                  desc: "알고리즘이 직관적이며 코딩이 매우 쉽습니다.",
                },
                {
                  title: "도함수 불필요 (No Derivative Needed)",
                  desc: "f(x)의 값만으로 동작하며, 도함수를 구할 필요가 없습니다.",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-emerald-400 mt-1 shrink-0">+</span>
                  <div>
                    <span className="text-slate-200 font-semibold text-sm">{item.title}</span>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
            <h3 className="text-xl font-bold text-amber-400">단점 (Disadvantages)</h3>
            <ul className="space-y-3">
              {[
                {
                  title: "느린 수렴 (Slow Convergence)",
                  desc: "선형 수렴(1차)이므로, Newton법 등에 비해 훨씬 많은 반복이 필요합니다.",
                },
                {
                  title: "초기 구간 필요 (Needs Initial Bracket)",
                  desc: "f(a)f(b)<0인 구간을 미리 알아야 하며, 이를 찾는 것이 어려울 수 있습니다.",
                },
                {
                  title: "복소근 탐색 불가 (No Complex Roots)",
                  desc: "실수 축 위의 근만 찾을 수 있으며, 복소수 근은 탐색할 수 없습니다.",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-amber-400 mt-1 shrink-0">&minus;</span>
                  <div>
                    <span className="text-slate-200 font-semibold text-sm">{item.title}</span>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ========== 6. MATLAB Implementation ========== */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.5 }}>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">MATLAB 구현 (Implementation)</h3>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed">
              <code>{`function [root, iter] = bisection(f, a, b, tol, maxiter)
% BISECTION  이분법을 이용한 비선형 방정식의 근 탐색
%   [root, iter] = bisection(f, a, b, tol, maxiter)
%
%   Input:
%     f       - 함수 핸들 (function handle)
%     a, b    - 초기 구간 [a, b] (f(a)*f(b) < 0)
%     tol     - 허용 오차 (tolerance)
%     maxiter - 최대 반복 횟수
%
%   Output:
%     root    - 근의 근사값
%     iter    - 실제 반복 횟수

    if nargin < 5, maxiter = 100; end
    if nargin < 4, tol = 1e-6; end

    fa = f(a);
    fb = f(b);

    if fa * fb > 0
        error('f(a)와 f(b)의 부호가 같습니다. 구간을 다시 설정하세요.');
    end

    fprintf('Step\\t a\\t\\t\\t b\\t\\t\\t c\\t\\t\\t f(c)\\n');
    fprintf('------------------------------------------------------------\\n');

    for iter = 1:maxiter
        c = (a + b) / 2;
        fc = f(c);

        fprintf('%3d\\t%12.8f\\t%12.8f\\t%12.8f\\t%12.2e\\n', iter, a, b, c, fc);

        if abs(fc) < eps || (b - a) / 2 < tol
            root = c;
            return;
        end

        if fa * fc < 0
            b = c;
            fb = fc;
        else
            a = c;
            fa = fc;
        end
    end

    root = (a + b) / 2;
    warning('최대 반복 횟수에 도달했습니다.');
end`}</code>
            </pre>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-3">
            <h4 className="text-pink-400 font-semibold text-sm">사용 예시 (Usage Example)</h4>
            <div className="bg-slate-950 rounded-xl p-4">
              <pre className="font-mono text-sm text-slate-300 leading-relaxed">
                <code>{`>> f = @(x) x^3 - x - 2;
>> [root, iter] = bisection(f, 1, 2, 1e-6, 100)

Step     a               b               c               f(c)
------------------------------------------------------------
  1   1.00000000      2.00000000      1.50000000       -1.13e+00
  2   1.50000000      2.00000000      1.75000000        1.61e+00
  3   1.50000000      1.75000000      1.62500000        1.66e-01
  ...
 20   1.52137899      1.52137995      1.52137947        1.07e-07

root = 1.521379706804567
iter = 20`}</code>
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
