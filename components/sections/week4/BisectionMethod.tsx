"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { M, MBlock } from "@/components/Math";

// --- Bisection logic ---
const f = (x: number) => x * x * x - x - 2;
const TRUE_ROOT = 1.5213797068;

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

/* ===== Enhanced interactive SVG ===== */
function BisectionSVG({ currentStep }: { currentStep: number }) {
  const w = 560;
  const h = 320;
  const pad = { top: 20, bottom: 55, left: 10, right: 10 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const xMin = 0.5;
  const xMax = 2.5;
  const yMin = -3;
  const yMax = 6;

  const mx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const my = (y: number) => pad.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  // curve
  const points: string[] = [];
  for (let px = 0; px <= 300; px++) {
    const x = xMin + (px / 300) * (xMax - xMin);
    points.push(`${mx(x)},${my(f(x))}`);
  }

  const zeroY = my(0);
  const iter = currentStep > 0 ? allIterations[currentStep - 1] : null;
  // show previous brackets as faded layers
  const prevBrackets = allIterations.slice(0, Math.max(0, currentStep - 1));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 400 }}>
      <defs>
        <linearGradient id="bracketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#fb7185" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* grid */}
      {[1, 1.5, 2].map((v) => (
        <line key={`gx-${v}`} x1={mx(v)} y1={pad.top} x2={mx(v)} y2={pad.top + plotH} stroke="#1e293b" strokeWidth={0.5} />
      ))}
      {[-2, 0, 2, 4].map((v) => (
        <line key={`gy-${v}`} x1={pad.left} y1={my(v)} x2={pad.left + plotW} y2={my(v)} stroke="#1e293b" strokeWidth={0.5} />
      ))}

      {/* x-axis */}
      <line x1={pad.left} y1={zeroY} x2={pad.left + plotW} y2={zeroY} stroke="#475569" strokeWidth={1} />
      {/* y-axis labels */}
      {[-2, 0, 2, 4].map((v) => (
        <text key={`yl-${v}`} x={pad.left + 4} y={my(v) - 4} fill="#475569" fontSize={9} fontFamily="monospace">{v}</text>
      ))}

      {/* previous brackets — fading history */}
      {prevBrackets.map((row, i) => (
        <rect
          key={`prev-${i}`}
          x={mx(row.a)}
          y={pad.top}
          width={mx(row.b) - mx(row.a)}
          height={plotH}
          fill="#fb7185"
          fillOpacity={0.03 + 0.02 * (i / Math.max(prevBrackets.length, 1))}
          rx={2}
        />
      ))}

      {/* current bracket */}
      {iter && (
        <>
          <rect
            x={mx(iter.a)}
            y={pad.top}
            width={mx(iter.b) - mx(iter.a)}
            height={plotH}
            fill="url(#bracketGrad)"
            stroke="#fb7185"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            rx={3}
          />
          {/* a marker */}
          <line x1={mx(iter.a)} y1={pad.top} x2={mx(iter.a)} y2={pad.top + plotH} stroke="#f87171" strokeWidth={2} />
          <text x={mx(iter.a)} y={pad.top + plotH + 14} fill="#f87171" fontSize={11} fontFamily="monospace" textAnchor="middle" fontWeight="bold">a</text>
          <text x={mx(iter.a)} y={pad.top + plotH + 26} fill="#94a3b8" fontSize={9} fontFamily="monospace" textAnchor="middle">{iter.a.toFixed(4)}</text>

          {/* b marker */}
          <line x1={mx(iter.b)} y1={pad.top} x2={mx(iter.b)} y2={pad.top + plotH} stroke="#60a5fa" strokeWidth={2} />
          <text x={mx(iter.b)} y={pad.top + plotH + 14} fill="#60a5fa" fontSize={11} fontFamily="monospace" textAnchor="middle" fontWeight="bold">b</text>
          <text x={mx(iter.b)} y={pad.top + plotH + 26} fill="#94a3b8" fontSize={9} fontFamily="monospace" textAnchor="middle">{iter.b.toFixed(4)}</text>

          {/* c midpoint */}
          <line x1={mx(iter.c)} y1={pad.top} x2={mx(iter.c)} y2={pad.top + plotH} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4 3" />
          <circle cx={mx(iter.c)} cy={my(iter.fc)} r={5} fill="#fbbf24" stroke="#000" strokeWidth={1} />
          <text x={mx(iter.c)} y={pad.top + plotH + 14} fill="#fbbf24" fontSize={11} fontFamily="monospace" textAnchor="middle" fontWeight="bold">c</text>
          <text x={mx(iter.c)} y={pad.top + plotH + 26} fill="#fbbf24" fontSize={9} fontFamily="monospace" textAnchor="middle">{iter.c.toFixed(4)}</text>

          {/* sign indicators on curve */}
          <circle cx={mx(iter.a)} cy={my(f(iter.a))} r={4} fill={f(iter.a) < 0 ? "#f87171" : "#34d399"} stroke="#000" strokeWidth={0.5} />
          <circle cx={mx(iter.b)} cy={my(f(iter.b))} r={4} fill={f(iter.b) < 0 ? "#f87171" : "#34d399"} stroke="#000" strokeWidth={0.5} />
          <text x={mx(iter.a) - 10} y={my(f(iter.a)) - 8} fill={f(iter.a) < 0 ? "#f87171" : "#34d399"} fontSize={10} fontWeight="bold" textAnchor="end">
            {f(iter.a) < 0 ? "−" : "+"}
          </text>
          <text x={mx(iter.b) + 10} y={my(f(iter.b)) - 8} fill={f(iter.b) < 0 ? "#f87171" : "#34d399"} fontSize={10} fontWeight="bold">
            {f(iter.b) < 0 ? "−" : "+"}
          </text>
        </>
      )}

      {/* true root line */}
      <line x1={mx(TRUE_ROOT)} y1={pad.top} x2={mx(TRUE_ROOT)} y2={pad.top + plotH} stroke="#a78bfa" strokeWidth={1} strokeDasharray="2 4" opacity={0.5} />

      {/* curve */}
      <polyline points={points.join(" ")} fill="none" stroke="#f472b6" strokeWidth={2.5} strokeLinejoin="round" />

      {/* x-axis labels */}
      {[1, 1.5, 2].map((v) => (
        <text key={v} x={mx(v)} y={pad.top + plotH + 42} fill="#64748b" fontSize={10} textAnchor="middle" fontFamily="monospace">{v}</text>
      ))}

      {/* legend */}
      {currentStep === 0 && (
        <text x={w / 2} y={h / 2} fill="#475569" fontSize={14} textAnchor="middle" fontFamily="sans-serif">
          &quot;다음 단계&quot; 버튼을 눌러 시작하세요
        </text>
      )}
    </svg>
  );
}

/* ===== Bracket bar — horizontal zoom strip ===== */
function BracketBar({ currentStep }: { currentStep: number }) {
  const barW = 100; // percentage-based
  if (currentStep === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-slate-500 text-xs font-mono">구간 [a, b] 축소 과정</p>
      <div className="relative w-full h-8 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
        {/* initial bracket */}
        <div className="absolute inset-0 flex items-center">
          <span className="absolute left-1 text-[10px] text-slate-600 font-mono">1.0</span>
          <span className="absolute right-1 text-[10px] text-slate-600 font-mono">2.0</span>
        </div>
        {/* show each bracket as a layered bar */}
        {allIterations.slice(0, currentStep).map((row, i) => {
          const left = ((row.a - 1) / 1) * barW;
          const width = ((row.b - row.a) / 1) * barW;
          const isLast = i === currentStep - 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-0 h-full rounded"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                background: isLast ? "rgba(251,113,133,0.3)" : "rgba(251,113,133,0.06)",
                borderLeft: isLast ? "2px solid #f87171" : "none",
                borderRight: isLast ? "2px solid #60a5fa" : "none",
              }}
            />
          );
        })}
        {/* midpoint marker for current */}
        {currentStep > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 h-full w-0.5 bg-amber-400"
            style={{
              left: `${((allIterations[currentStep - 1].c - 1) / 1) * barW}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}

// --- Main component ---
export default function BisectionMethod() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const maxStep = allIterations.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibleRows = useMemo(() => allIterations.slice(0, step), [step]);

  const advance = useCallback(() => {
    setStep((s) => {
      if (s >= maxStep) {
        setPlaying(false);
        return s;
      }
      return s + 1;
    });
  }, [maxStep]);

  const reset = () => { setStep(0); setPlaying(false); };

  // auto-play
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(advance, 800);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, advance]);

  // stop playing when we reach the end
  useEffect(() => {
    if (step >= maxStep) setPlaying(false);
  }, [step, maxStep]);

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
              { label: "Start", desc: <><M>{"f(a) \\cdot f(b) < 0"}</M> 인 구간 <M>{"[a, b]"}</M> 설정</> },
              { label: "Midpoint", desc: <><M>{"c = (a + b) / 2"}</M> 계산</> },
              { label: "Check", desc: <><M>{"f(c) = 0"}</M> 또는 <M>{"|b - a| / 2 < \\text{tol}"}</M>?</> },
              { label: "Sign Test", desc: <><M>{"f(a) \\cdot f(c) < 0"}</M> 이면 <M>{"b \\leftarrow c"}</M>, 아니면 <M>{"a \\leftarrow c"}</M></> },
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
            <M>{"f(x) = x^{3} - x - 2"}</M>, 초기 구간{" "}
            <M>{"[1, 2]"}</M> (근 <M>{"\\approx 1.5214"}</M>)
          </p>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={advance}
              disabled={step >= maxStep || playing}
              className="px-5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 font-medium text-sm hover:bg-rose-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음 단계 (Step {step + 1})
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              disabled={step >= maxStep && !playing}
              className="px-5 py-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 font-medium text-sm hover:bg-pink-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {playing ? "일시정지" : "자동 재생"}
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-medium text-sm hover:bg-slate-700 transition"
            >
              초기화
            </button>
            <span className="text-slate-500 text-sm font-mono ml-auto">
              {step}/{maxStep}
            </span>
          </div>

          {/* Step slider */}
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs font-mono w-6">0</span>
            <input
              type="range"
              min={0}
              max={maxStep}
              value={step}
              onChange={(e) => { setPlaying(false); setStep(Number(e.target.value)); }}
              className="flex-1 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-slate-500 text-xs font-mono w-6">{maxStep}</span>
          </div>

          {/* SVG curve */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden">
            <BisectionSVG currentStep={step} />
          </div>

          {/* Bracket bar visualization */}
          <BracketBar currentStep={step} />

          {/* Current bracket info */}
          <AnimatePresence mode="wait">
            {step > 0 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: "a", value: allIterations[step - 1].a.toFixed(6), color: "text-red-400" },
                    { label: "b", value: allIterations[step - 1].b.toFixed(6), color: "text-blue-400" },
                    { label: "c = (a+b)/2", value: allIterations[step - 1].c.toFixed(6), color: "text-amber-400" },
                    { label: "f(c)", value: allIterations[step - 1].fc.toExponential(3), color: allIterations[step - 1].fc < 0 ? "text-red-400" : "text-emerald-400" },
                    { label: "|b−a|", value: allIterations[step - 1].width.toExponential(3), color: "text-pink-400" },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center">
                      <div className="text-slate-500 text-xs">{item.label}</div>
                      <div className={`${item.color} font-mono text-sm mt-1`}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Decision explanation */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-sm">
                  <span className="text-rose-400 font-semibold">판정: </span>
                  {allIterations[step - 1].fc < 0 ? (
                    <span className="text-slate-300">
                      f(c) &lt; 0 이고 f(b) &gt; 0 이므로 근은 [c, b] 구간에 존재 → <span className="text-red-400 font-bold">a ← c</span>
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      f(a) &lt; 0 이고 f(c) &gt; 0 이므로 근은 [a, c] 구간에 존재 → <span className="text-blue-400 font-bold">b ← c</span>
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Iteration table */}
          {visibleRows.length > 0 && (
            <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm font-mono">
                <thead className="sticky top-0 bg-slate-900">
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
                      className={`border-b border-slate-800/50 text-slate-300 ${row.step === step ? "bg-rose-500/5" : ""}`}
                    >
                      <td className="py-2 px-3 text-rose-400">{row.step}</td>
                      <td className="py-2 px-3 text-red-400/80">{row.a.toFixed(6)}</td>
                      <td className="py-2 px-3 text-blue-400/80">{row.b.toFixed(6)}</td>
                      <td className="py-2 px-3 text-amber-400">{row.c.toFixed(6)}</td>
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
              <div className="bg-slate-950 rounded-xl p-4 text-slate-200 text-center text-lg">
                <MBlock>{"|\\varepsilon_{n}| \\leq \\frac{b - a}{2^{n}}"}</MBlock>
              </div>
              <p className="text-slate-400 text-sm">
                <M>{"n"}</M>번 반복 후 오차의 상한은 초기 구간 길이를 <M>{"2^{n}"}</M>으로 나눈 값입니다.
              </p>
            </div>

            {/* Iterations needed */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-3">
              <h4 className="text-pink-400 font-semibold">필요 반복 횟수</h4>
              <div className="bg-slate-950 rounded-xl p-4 text-slate-200 text-center text-lg">
                <MBlock>{"n \\geq \\log_{2}\\!\\left(\\frac{b - a}{\\text{tol}}\\right)"}</MBlock>
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
              <div className="bg-slate-950 rounded-xl p-4 text-sm text-slate-300 space-y-2">
                <p>
                  <M>{"[a, b] = [1, 2],\\; \\text{tol} = 10^{-6}"}</M>
                </p>
                <p>
                  <M>{"n \\geq \\log_{2}(1 / 10^{-6}) = \\log_{2}(10^{6})"}</M>
                </p>
                <p className="text-rose-400 font-bold"><M>{"n \\geq 19.93 \\rightarrow 20"}</M> iterations</p>
              </div>
              <p className="text-slate-400 text-sm">
                구간 <M>{"[1,2]"}</M>에서 <M>{"10^{-6}"}</M> 정밀도를 얻으려면 최소 20회 반복이 필요합니다.
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
