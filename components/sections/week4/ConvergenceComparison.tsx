"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ───────── Data ───────── */

const ROOT = 1.521379707;

// Bisection on [1,2] for f(x)=x³-x-2
const bisectionData = (() => {
  const rows: { n: number; a: number; b: number; mid: number; error: number }[] = [];
  let a = 1, b = 2;
  const f = (x: number) => x * x * x - x - 2;
  for (let i = 1; i <= 20; i++) {
    const mid = (a + b) / 2;
    rows.push({ n: i, a, b, mid, error: Math.abs(mid - ROOT) });
    if (f(mid) * f(a) < 0) b = mid; else a = mid;
  }
  return rows;
})();

// Newton starting x0=1.5 for f(x)=x³-x-2, f'(x)=3x²-1
const newtonData = (() => {
  const rows: { n: number; x: number; error: number }[] = [];
  let x = 1.5;
  const f = (v: number) => v * v * v - v - 2;
  const fp = (v: number) => 3 * v * v - 1;
  for (let i = 0; i <= 6; i++) {
    rows.push({ n: i, x, error: Math.abs(x - ROOT) });
    x = x - f(x) / fp(x);
  }
  return rows;
})();

const comparisonRows = [
  { feature: "수렴 차수", bisection: "1차 (선형)", newton: "2차 (이차)" },
  { feature: "초기 조건", bisection: "구간 [a, b]", newton: "초기 추측 x₀" },
  { feature: "f' 필요", bisection: "아니오", newton: "예" },
  { feature: "수렴 보장", bisection: "항상 (IVT)", newton: "조건부" },
  { feature: "반복 횟수 (10⁻⁶)", bisection: "~20", newton: "~5" },
  { feature: "적용", bisection: "안전한 초기 탐색", newton: "빠른 정밀 수렴" },
];

const hybridCode = `% Hybrid: Bisection → Newton-Raphson
f  = @(x) x.^3 - x - 2;
fp = @(x) 3*x.^2 - 1;

% Phase 1: Bisection (안전한 초기 근사)
a = 1; b = 2; tol_switch = 0.1;
while (b - a) > tol_switch
    c = (a + b) / 2;
    if f(a)*f(c) < 0
        b = c;
    else
        a = c;
    end
end
x0 = (a + b) / 2;
fprintf('Bisection 결과: x0 = %.6f\\n', x0);

% Phase 2: Newton-Raphson (빠른 수렴)
x = x0; tol = 1e-12;
for k = 1:20
    dx = f(x) / fp(x);
    x  = x - dx;
    fprintf('Newton k=%d: x=%.12f\\n', k, x);
    if abs(dx) < tol, break; end
end
fprintf('최종 근: x = %.15f\\n', x);`;

/* ───────── Helpers ───────── */

const anim = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, delay: d },
});

function fmtErr(e: number) {
  if (e === 0) return "0";
  if (e < 1e-15) return "< 10⁻¹⁵";
  return e.toExponential(2);
}

/* ───────── Component ───────── */

export default function ConvergenceComparison() {
  const [showAllBisection, setShowAllBisection] = useState(false);
  const visibleBisection = showAllBisection ? bisectionData : bisectionData.slice(0, 8);

  /* SVG error plot */
  const svgW = 600, svgH = 320, pad = 60;
  const plotW = svgW - pad * 2, plotH = svgH - pad * 2;
  const maxIter = 20;
  const logMin = -16, logMax = 0;

  const toSvg = (iter: number, logErr: number) => ({
    x: pad + (iter / maxIter) * plotW,
    y: pad + ((logMax - logErr) / (logMax - logMin)) * plotH,
  });

  const bisectionPath = bisectionData
    .map((r) => {
      const le = r.error > 0 ? Math.log10(r.error) : logMin;
      const p = toSvg(r.n, le);
      return `${r.n === 1 ? "M" : "L"}${p.x},${p.y}`;
    })
    .join(" ");

  const newtonPath = newtonData
    .filter((r) => r.error > 0)
    .map((r, i) => {
      const le = Math.log10(r.error);
      const p = toSvg(r.n, le);
      return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* ── 1. Header ── */}
        <motion.div {...anim()} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-400 text-sm font-mono border border-rose-500/25">
            Convergence Analysis
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
            수렴 속도 비교
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Bisection과 Newton-Raphson의 수렴 속도를 직접 비교하여 각 방법의 효율성을 분석합니다.
          </p>
        </motion.div>

        {/* ── 2. Side-by-side iteration tables ── */}
        <motion.div {...anim(0.1)}>
          <h3 className="text-xl font-bold text-rose-400 mb-2 font-mono">
            f(x) = x³ − x − 2, &nbsp;root ≈ 1.52138
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bisection table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
              <h4 className="text-pink-400 font-mono font-semibold mb-3">
                Bisection &nbsp;[1, 2] — 20 iterations
              </h4>
              <table className="w-full text-xs font-mono text-slate-300">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-1 text-left">n</th>
                    <th className="py-1 text-left">a</th>
                    <th className="py-1 text-left">b</th>
                    <th className="py-1 text-left">mid</th>
                    <th className="py-1 text-left">|error|</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleBisection.map((r) => (
                    <tr key={r.n} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-0.5">{r.n}</td>
                      <td className="py-0.5">{r.a.toFixed(5)}</td>
                      <td className="py-0.5">{r.b.toFixed(5)}</td>
                      <td className="py-0.5">{r.mid.toFixed(6)}</td>
                      <td className="py-0.5 text-rose-400">{fmtErr(r.error)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!showAllBisection && (
                <button
                  onClick={() => setShowAllBisection(true)}
                  className="mt-2 text-xs text-pink-400 hover:underline font-mono"
                >
                  ▾ 전체 20 iterations 보기
                </button>
              )}
            </div>

            {/* Newton table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
              <h4 className="text-pink-400 font-mono font-semibold mb-3">
                Newton-Raphson &nbsp;x₀ = 1.5 — 수렴 완료
              </h4>
              <table className="w-full text-xs font-mono text-slate-300">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-1 text-left">n</th>
                    <th className="py-1 text-left">xₙ</th>
                    <th className="py-1 text-left">|error|</th>
                    <th className="py-1 text-left">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {newtonData.map((r) => (
                    <tr key={r.n} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-0.5">{r.n}</td>
                      <td className="py-0.5">{r.x.toFixed(12)}</td>
                      <td className="py-0.5 text-rose-400">{fmtErr(r.error)}</td>
                      <td className="py-0.5 text-slate-500">
                        {r.n === 0 ? "초기값" : "ε² 수렴"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-slate-500">
                오차가 매 단계마다 <span className="text-pink-400">제곱</span>으로 줄어듦 — 이차 수렴의 위력
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 3. Convergence order cards ── */}
        <motion.div {...anim(0.15)} className="space-y-4">
          <h3 className="text-2xl font-bold text-white">수렴 차수 (Order of Convergence)</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "Linear (p = 1)",
                method: "Bisection",
                formula: "|εₙ₊₁| ≈ C · |εₙ|",
                detail: "C = 0.5 — 매 반복마다 오차가 절반으로 줄어듦",
                accent: "rose",
              },
              {
                title: "Quadratic (p = 2)",
                method: "Newton-Raphson",
                formula: "|εₙ₊₁| ≈ C · |εₙ|²",
                detail: "오차의 유효숫자가 매 반복마다 약 2배 증가",
                accent: "pink",
              },
              {
                title: "Superlinear (p ≈ 1.618)",
                method: "Secant Method",
                formula: "|εₙ₊₁| ≈ C · |εₙ|^φ",
                detail: "φ = (1+√5)/2 — Week 5에서 다룰 예정",
                accent: "rose",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                {...anim(0.1 + i * 0.08)}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3"
              >
                <span className="text-xs font-mono text-slate-500 uppercase">{c.method}</span>
                <h4 className="text-lg font-bold text-rose-400">{c.title}</h4>
                <p className="font-mono text-pink-400 text-sm bg-slate-800/50 rounded-lg px-3 py-2">
                  {c.formula}
                </p>
                <p className="text-sm text-slate-400">{c.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 4. SVG error vs iteration plot ── */}
        <motion.div {...anim(0.1)} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-white font-mono">
            log₁₀(error) vs Iteration
          </h3>
          <div className="overflow-x-auto flex justify-center">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full max-w-[640px]"
              style={{ fontFamily: "monospace" }}
            >
              {/* grid lines */}
              {Array.from({ length: 5 }, (_, i) => {
                const val = logMin + ((logMax - logMin) * i) / 4;
                const y = pad + ((logMax - val) / (logMax - logMin)) * plotH;
                return (
                  <g key={i}>
                    <line x1={pad} x2={pad + plotW} y1={y} y2={y} stroke="#334155" strokeWidth={0.5} />
                    <text x={pad - 6} y={y + 4} fill="#64748b" fontSize={10} textAnchor="end">
                      {val.toFixed(0)}
                    </text>
                  </g>
                );
              })}
              {/* x-axis ticks */}
              {[0, 5, 10, 15, 20].map((v) => {
                const x = pad + (v / maxIter) * plotW;
                return (
                  <text key={v} x={x} y={svgH - 14} fill="#64748b" fontSize={10} textAnchor="middle">
                    {v}
                  </text>
                );
              })}
              {/* axis labels */}
              <text x={svgW / 2} y={svgH - 0} fill="#94a3b8" fontSize={11} textAnchor="middle">
                Iteration
              </text>
              <text x={14} y={svgH / 2} fill="#94a3b8" fontSize={11} textAnchor="middle" transform={`rotate(-90,14,${svgH / 2})`}>
                log₁₀|error|
              </text>

              {/* Bisection path */}
              <path d={bisectionPath} fill="none" stroke="#fb7185" strokeWidth={2} strokeLinecap="round" />
              {/* Newton path */}
              <path d={newtonPath} fill="none" stroke="#f472b6" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6 3" />

              {/* Bisection dots */}
              {bisectionData.map((r) => {
                const le = r.error > 0 ? Math.log10(r.error) : logMin;
                const p = toSvg(r.n, le);
                return <circle key={`b${r.n}`} cx={p.x} cy={p.y} r={2.5} fill="#fb7185" />;
              })}
              {/* Newton dots */}
              {newtonData.filter((r) => r.error > 0).map((r) => {
                const le = Math.log10(r.error);
                const p = toSvg(r.n, le);
                return <circle key={`n${r.n}`} cx={p.x} cy={p.y} r={3.5} fill="#f472b6" />;
              })}

              {/* Legend */}
              <rect x={pad + plotW - 170} y={pad + 8} width={160} height={50} rx={8} fill="#0f172a" fillOpacity={0.85} stroke="#334155" />
              <line x1={pad + plotW - 155} x2={pad + plotW - 130} y1={pad + 26} y2={pad + 26} stroke="#fb7185" strokeWidth={2} />
              <text x={pad + plotW - 124} y={pad + 30} fill="#fb7185" fontSize={10}>Bisection (linear)</text>
              <line x1={pad + plotW - 155} x2={pad + plotW - 130} y1={pad + 44} y2={pad + 44} stroke="#f472b6" strokeWidth={2.5} strokeDasharray="6 3" />
              <text x={pad + plotW - 124} y={pad + 48} fill="#f472b6" fontSize={10}>Newton (quadratic)</text>
            </svg>
          </div>
          <p className="text-sm text-slate-400 text-center">
            Newton-Raphson은 단 5회 반복으로 machine precision에 도달 — Bisection은 20회에도 10⁻⁶ 수준
          </p>
        </motion.div>

        {/* ── 5. Comprehensive comparison table ── */}
        <motion.div {...anim(0.1)} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
          <h3 className="text-xl font-bold text-white mb-4">종합 비교표</h3>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="py-2 text-left">Feature</th>
                <th className="py-2 text-left text-rose-400">Bisection</th>
                <th className="py-2 text-left text-pink-400">Newton-Raphson</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {comparisonRows.map((r) => (
                <tr key={r.feature} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-2 text-slate-400">{r.feature}</td>
                  <td className="py-2">{r.bisection}</td>
                  <td className="py-2">{r.newton}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* ── 6. Hybrid strategy ── */}
        <motion.div {...anim(0.1)} className="space-y-5">
          <h3 className="text-2xl font-bold text-white">
            Hybrid Strategy — 최적의 실전 전략
          </h3>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              실무에서는 두 방법을 <span className="text-rose-400 font-semibold">조합</span>하여 사용합니다.
              먼저 Bisection으로 안전하게 근의 대략적 위치를 잡은 다음, Newton-Raphson으로 전환하여 빠르게 고정밀 근을 구합니다.
              이렇게 하면 수렴 보장과 빠른 수렴 속도를 모두 얻을 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Phase 1: Bisection → 안전한 초기 근사
              </span>
              <span className="text-slate-600">→</span>
              <span className="px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Phase 2: Newton → 빠른 정밀 수렴
              </span>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto">
              <pre className="text-xs text-slate-300 leading-relaxed whitespace-pre font-mono">
                {hybridCode}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* ── 7. Summary / Decision flowchart ── */}
        <motion.div {...anim(0.15)} className="space-y-5">
          <h3 className="text-2xl font-bold text-white">언제 어떤 방법을 사용할까?</h3>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Flowchart-style decision */}
            <div className="flex flex-col items-center gap-4 text-sm font-mono">
              <div className="px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 text-center">
                f&apos;(x)를 구할 수 있는가?
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-emerald-400 text-xs">예 (Yes)</span>
                  <div className="px-4 py-2 rounded-2xl bg-slate-800 border border-pink-500/30 text-pink-400 text-center">
                    초기 추측이 근 근처인가?
                  </div>
                  <div className="flex gap-6 mt-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-emerald-400 text-xs">예</span>
                      <div className="px-3 py-1.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/25 text-xs">
                        Newton-Raphson
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-red-400 text-xs">아니오</span>
                      <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25 text-xs">
                        Hybrid 전략
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-red-400 text-xs">아니오 (No)</span>
                  <div className="px-4 py-2 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/25 text-center">
                    Bisection 사용
                  </div>
                </div>
              </div>
            </div>

            {/* Key takeaways */}
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-2">
                <h4 className="text-rose-400 font-semibold text-sm">Bisection을 선택하는 경우</h4>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>도함수를 구하기 어렵거나 비용이 클 때</li>
                  <li>수렴이 반드시 보장되어야 할 때</li>
                  <li>근의 대략적 위치만 필요할 때</li>
                  <li>함수가 불연속이거나 노이즈가 있을 때</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-pink-400 font-semibold text-sm">Newton을 선택하는 경우</h4>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>f&apos;(x)를 쉽게 계산할 수 있을 때</li>
                  <li>높은 정밀도가 필요할 때</li>
                  <li>좋은 초기 추측값이 있을 때</li>
                  <li>계산 속도가 중요할 때</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center pt-2">
              다음 주 (Week 5): Secant Method — 도함수 없이 Newton급 수렴을 달성하는 방법
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
