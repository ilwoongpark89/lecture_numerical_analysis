"use client";

import React from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Fade-up animation preset                                           */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6 },
};

/* ------------------------------------------------------------------ */
/*  SVG: Bisection vs False Position comparison                        */
/* ------------------------------------------------------------------ */
function ComparisonSvg() {
  const W = 520;
  const H = 300;

  // curve: f(x) = (x-1)^3 - 0.5  on [0, 2.5]
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * 2.5;
    const y = Math.pow(x - 1, 3) - 0.5;
    const sx = 40 + (x / 2.5) * (W - 80);
    const sy = H / 2 - y * 80;
    pts.push(`${sx},${sy}`);
  }

  const toScreen = (x: number, y: number): [number, number] => [
    40 + (x / 2.5) * (W - 80),
    H / 2 - y * 80,
  ];

  // Interval [0.5, 2.2], f(0.5)<0, f(2.2)>0
  const a = 0.5, b = 2.2;
  const fa = Math.pow(a - 1, 3) - 0.5;
  const fb = Math.pow(b - 1, 3) - 0.5;
  const midpoint = (a + b) / 2;
  const falsePos = a - fa * (b - a) / (fb - fa);

  const [ax, ay] = toScreen(a, fa);
  const [bx, by] = toScreen(b, fb);
  const [mx, my] = toScreen(midpoint, 0);
  const [fx, fy] = toScreen(falsePos, 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto">
      {/* axes */}
      <line x1={40} y1={H / 2} x2={W - 40} y2={H / 2} stroke="#475569" strokeWidth={1} />
      <line x1={40} y1={20} x2={40} y2={H - 20} stroke="#475569" strokeWidth={1} />
      {/* curve */}
      <polyline points={pts.join(" ")} fill="none" stroke="#a78bfa" strokeWidth={2.5} />
      {/* secant line (false position) */}
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#f472b6" strokeWidth={1.5} strokeDasharray="6 3" />
      {/* bisection midpoint */}
      <circle cx={mx} cy={my} r={5} fill="#38bdf8" />
      <text x={mx} y={my - 12} fill="#38bdf8" fontSize={11} textAnchor="middle" fontFamily="monospace">
        Bisection
      </text>
      {/* false position point */}
      <circle cx={fx} cy={fy} r={5} fill="#f472b6" />
      <text x={fx} y={fy + 18} fill="#f472b6" fontSize={11} textAnchor="middle" fontFamily="monospace">
        False Pos
      </text>
      {/* interval markers */}
      <circle cx={ax} cy={ay} r={4} fill="#94a3b8" />
      <text x={ax - 4} y={ay + 16} fill="#94a3b8" fontSize={10} fontFamily="monospace">a</text>
      <circle cx={bx} cy={by} r={4} fill="#94a3b8" />
      <text x={bx + 4} y={by - 8} fill="#94a3b8" fontSize={10} fontFamily="monospace">b</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG: Cobweb diagram for x = cos(x)                                */
/* ------------------------------------------------------------------ */
function CobwebSvg() {
  const W = 460;
  const H = 360;
  const pad = 40;

  const toS = (x: number, y: number): [number, number] => [
    pad + (x / 1.4) * (W - 2 * pad),
    H - pad - (y / 1.4) * (H - 2 * pad),
  ];

  // y = x line
  const lineYX: string[] = [];
  for (let i = 0; i <= 50; i++) {
    const t = (i / 50) * 1.4;
    const [sx, sy] = toS(t, t);
    lineYX.push(`${sx},${sy}`);
  }

  // y = cos(x)
  const cosLine: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * 1.4;
    const [sx, sy] = toS(t, Math.cos(t));
    cosLine.push(`${sx},${sy}`);
  }

  // cobweb iterations starting from x0 = 0.2
  const cobwebPts: [number, number][] = [];
  let xn = 0.2;
  cobwebPts.push(toS(xn, 0));
  for (let i = 0; i < 8; i++) {
    const gx = Math.cos(xn);
    cobwebPts.push(toS(xn, gx));   // vertical to g(x)
    cobwebPts.push(toS(gx, gx));   // horizontal to y=x
    xn = gx;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {/* axes */}
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#475569" strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#475569" strokeWidth={1} />
      {/* y = x */}
      <polyline points={lineYX.join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" />
      <text x={W - 60} y={pad + 20} fill="#94a3b8" fontSize={11} fontFamily="monospace">y = x</text>
      {/* y = cos(x) */}
      <polyline points={cosLine.join(" ")} fill="none" stroke="#e879f9" strokeWidth={2.5} />
      <text x={W - 100} y={pad + 60} fill="#e879f9" fontSize={11} fontFamily="monospace">y = cos(x)</text>
      {/* cobweb */}
      <polyline
        points={cobwebPts.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="#f472b6"
        strokeWidth={1.2}
        opacity={0.8}
      />
      {/* fixed point label */}
      {(() => {
        const [fx, fy] = toS(0.7391, 0.7391);
        return (
          <>
            <circle cx={fx} cy={fy} r={5} fill="#f472b6" />
            <text x={fx + 10} y={fy - 6} fill="#f472b6" fontSize={11} fontFamily="monospace">
              x* ≈ 0.7391
            </text>
          </>
        );
      })()}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG: Brent's Method flowchart                                      */
/* ------------------------------------------------------------------ */
function BrentFlowchart() {
  const W = 500;
  const H = 320;

  const Box = ({ x, y, w, h, text, color }: { x: number; y: number; w: number; h: number; text: string; color: string }) => (
    <>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 4} fill={color} fontSize={11} textAnchor="middle" fontFamily="monospace">
        {text}
      </text>
    </>
  );

  const Arrow = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth={1.2} markerEnd="url(#arrow)" />
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
      </defs>
      <Box x={180} y={10} w={140} h={36} text="Start iteration" color="#a78bfa" />
      {/* diamond: can use IQI? */}
      <polygon points="250,80 330,115 250,150 170,115" fill="none" stroke="#f472b6" strokeWidth={1.5} />
      <text x={250} y={112} fill="#f472b6" fontSize={10} textAnchor="middle" fontFamily="monospace">IQI 가능?</text>
      <text x={250} y={124} fill="#f472b6" fontSize={10} textAnchor="middle" fontFamily="monospace">(3 distinct pts)</text>
      <Arrow x1={250} y1={46} x2={250} y2={80} />
      {/* Yes -> IQI */}
      <Box x={350} y={97} w={130} h={36} text="Inverse Quad Interp" color="#e879f9" />
      <Arrow x1={330} y1={115} x2={350} y2={115} />
      {/* No -> secant possible? */}
      <polygon points="90,170 160,200 90,230 20,200" fill="none" stroke="#f472b6" strokeWidth={1.5} />
      <text x={90} y={198} fill="#f472b6" fontSize={10} textAnchor="middle" fontFamily="monospace">Secant?</text>
      <Arrow x1={250} y1={150} x2={90} y2={170} />
      {/* Yes secant */}
      <Box x={170} y={182} w={110} h={36} text="Secant step" color="#38bdf8" />
      <Arrow x1={160} y1={200} x2={170} y2={200} />
      {/* No -> bisection */}
      <Box x={20} y={250} w={130} h={36} text="Bisection (안전)" color="#4ade80" />
      <Arrow x1={90} y1={230} x2={75} y2={250} />
      {/* check acceptance */}
      <Box x={300} y={250} w={170} h={36} text="결과가 구간 내? → 수락" color="#a78bfa" />
      <Arrow x1={415} y1={133} x2={415} y2={250} />
      <Arrow x1={225} y1={218} x2={300} y2={262} />
      {/* fallback */}
      <text x={400} y={308} fill="#64748b" fontSize={10} textAnchor="middle" fontFamily="monospace">
        아니면 → Bisection fallback
      </text>
    </svg>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export default function ModifiedMethods() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ── Header ─────────────────────────────────────── */}
        <motion.div {...fadeUp} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-400/10 text-pink-400 text-sm font-mono border border-pink-400/30">
            Week 5 — Advanced Root Finding
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
            개량된 근 찾기 기법
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Modified &amp; Improved Root-Finding Methods
          </p>
        </motion.div>

        {/* ── 1. False Position ──────────────────────────── */}
        <motion.div {...fadeUp} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-pink-400">
            1. False Position (Regula Falsi)
          </h3>
          <p className="text-slate-300 leading-relaxed">
            이분법(Bisection)처럼 구간을 유지하면서도, 중점 대신{" "}
            <span className="text-fuchsia-400 font-mono">secant line</span>의 x-절편을 사용합니다.
            구간의 양 끝 함수값을 이은 직선이 x축과 만나는 점을 다음 근사값으로 선택합니다.
          </p>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <p className="font-mono text-sm text-pink-400 mb-2">공식 (Formula):</p>
            <p className="font-mono text-fuchsia-300 text-center text-lg">
              c = a − f(a) · (b − a) / (f(b) − f(a))
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <p className="text-pink-400 font-semibold mb-2">장점 (Advantages)</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Bracketing method → 수렴 보장</li>
                <li>이분법보다 대체로 빠른 수렴</li>
                <li>함수값 크기를 반영한 분할</li>
              </ul>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <p className="text-fuchsia-400 font-semibold mb-2">단점 (Drawback)</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>한쪽 끝점이 고정될 수 있음 (stagnation)</li>
                <li>최악의 경우 수렴 속도가 선형</li>
                <li>Illinois / Pegasus 변형으로 개선 가능</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-xs text-center mb-2 font-mono">
              Bisection (midpoint) vs False Position (secant-based)
            </p>
            <ComparisonSvg />
          </div>
        </motion.div>

        {/* ── 2. Modified Newton for Multiple Roots ─────── */}
        <motion.div {...fadeUp} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-pink-400">
            2. 중근을 위한 Modified Newton
          </h3>
          <p className="text-slate-300 leading-relaxed">
            표준 Newton-Raphson은{" "}
            <span className="text-fuchsia-400">중근(multiple root)</span>에서 수렴 차수가
            2차(quadratic)에서 1차(linear)로 떨어집니다. 두 가지 개선 방법이 있습니다.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-pink-400 font-semibold font-mono text-sm">방법 A: 중복도 m 사용</p>
              <p className="text-slate-300 text-sm">
                근의 중복도 m을 알고 있는 경우:
              </p>
              <p className="font-mono text-fuchsia-300 text-center">
                x<sub>n+1</sub> = x<sub>n</sub> − m · f(x<sub>n</sub>) / f&apos;(x<sub>n</sub>)
              </p>
              <p className="text-slate-400 text-xs">
                → 2차 수렴 복원. 단, m을 미리 알아야 함.
              </p>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-fuchsia-400 font-semibold font-mono text-sm">방법 B: u(x) = f(x)/f&apos;(x)</p>
              <p className="text-slate-300 text-sm">
                u(x)는 원래 중근을 단근(simple root)으로 변환:
              </p>
              <p className="font-mono text-fuchsia-300 text-center">
                x<sub>n+1</sub> = x<sub>n</sub> − u(x<sub>n</sub>) / u&apos;(x<sub>n</sub>)
              </p>
              <p className="text-slate-400 text-xs">
                → m을 몰라도 2차 수렴. f&apos;&apos;(x) 필요.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <p className="text-pink-400 font-mono text-sm mb-3">% MATLAB — Modified Newton (방법 A)</p>
            <pre className="font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
{`function x = modified_newton(f, df, x0, m, tol, maxiter)
    x = x0;
    for k = 1:maxiter
        fx = f(x);  dfx = df(x);
        x_new = x - m * fx / dfx;
        if abs(x_new - x) < tol
            fprintf('Converged at iter %d: x = %.10f\\n', k, x_new);
            return;
        end
        x = x_new;
    end
end

% 예제: f(x) = (x-1)^3,  m = 3
f  = @(x) (x-1).^3;
df = @(x) 3*(x-1).^2;
x = modified_newton(f, df, 2.0, 3, 1e-12, 50);`}
            </pre>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <p className="text-fuchsia-400 font-mono text-sm mb-3">% MATLAB — u(x) = f(x)/f&apos;(x) 기법 (방법 B)</p>
            <pre className="font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
{`function x = newton_ux(f, df, d2f, x0, tol, maxiter)
    x = x0;
    for k = 1:maxiter
        fx = f(x); dfx = df(x); d2fx = d2f(x);
        % u  = f/f'
        % u' = 1 - f*f''/(f')^2
        u  = fx / dfx;
        du = 1 - fx * d2fx / dfx^2;
        x_new = x - u / du;
        if abs(x_new - x) < tol
            fprintf('Converged at iter %d: x = %.10f\\n', k, x_new);
            return;
        end
        x = x_new;
    end
end`}
            </pre>
          </div>
        </motion.div>

        {/* ── 3. Brent's Method ──────────────────────────── */}
        <motion.div {...fadeUp} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-pink-400">
            3. Brent&apos;s Method
          </h3>
          <p className="text-slate-300 leading-relaxed">
            <span className="text-fuchsia-400 font-mono">Bisection</span>,{" "}
            <span className="text-fuchsia-400 font-mono">Secant</span>,{" "}
            <span className="text-fuchsia-400 font-mono">Inverse Quadratic Interpolation(IQI)</span>을
            결합한 하이브리드 알고리즘입니다. MATLAB의{" "}
            <span className="text-pink-400 font-mono">fzero</span> 함수가 내부적으로 사용합니다.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center">
              <p className="text-pink-400 font-semibold mb-1">Bisection</p>
              <p className="text-slate-400">수렴 보장 (안전장치)</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center">
              <p className="text-fuchsia-400 font-semibold mb-1">Secant</p>
              <p className="text-slate-400">초선형 수렴 (빠른 속도)</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center">
              <p className="text-purple-400 font-semibold mb-1">IQI</p>
              <p className="text-slate-400">3점 보간 (더 빠른 수렴)</p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-xs text-center mb-2 font-mono">
              Brent&apos;s Method — Decision Flowchart
            </p>
            <BrentFlowchart />
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <p className="text-pink-400 font-mono text-sm mb-3">% MATLAB — fzero (Brent 내부 사용)</p>
            <pre className="font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
{`f = @(x) x.^3 - x - 2;

% 구간 지정
x = fzero(f, [1, 2])     % x ≈ 1.5214

% 초기 추정값 지정
x = fzero(f, 1.5)

% 옵션 설정
opts = optimset('Display','iter','TolX',1e-12);
x = fzero(f, [1, 2], opts)`}
            </pre>
          </div>
        </motion.div>

        {/* ── 4. Fixed-Point Iteration ───────────────────── */}
        <motion.div {...fadeUp} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-pink-400">
            4. Fixed-Point Iteration (고정점 반복법)
          </h3>
          <p className="text-slate-300 leading-relaxed">
            f(x) = 0 을{" "}
            <span className="text-fuchsia-400 font-mono">x = g(x)</span> 형태로 변환한 뒤,
            x<sub>n+1</sub> = g(x<sub>n</sub>)을 반복합니다.
            수렴 조건은 고정점 근처에서{" "}
            <span className="text-pink-400 font-mono">|g&apos;(x)| &lt; 1</span>입니다.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-pink-400 font-semibold font-mono text-sm">수렴 정리</p>
              <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                <li>g가 [a,b]에서 연속이고 g([a,b]) ⊂ [a,b]</li>
                <li>|g&apos;(x)| ≤ L &lt; 1 for all x in (a,b)</li>
                <li>→ 유일한 고정점 x* 존재하며 수렴</li>
                <li>수렴 속도: |x<sub>n+1</sub> − x*| ≤ L|x<sub>n</sub> − x*|</li>
              </ul>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-fuchsia-400 font-semibold font-mono text-sm">예제: x = cos(x)</p>
              <ul className="text-slate-300 text-sm space-y-1 font-mono">
                <li>x₀ = 0.2</li>
                <li>x₁ = cos(0.2) = 0.9801</li>
                <li>x₂ = cos(0.9801) = 0.5570</li>
                <li>x₃ = cos(0.5570) = 0.8486</li>
                <li className="text-slate-500">...</li>
                <li className="text-pink-400">x* ≈ 0.7391 (Dottie number)</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-xs text-center mb-2 font-mono">
              Cobweb Diagram: y = x ∩ y = cos(x)
            </p>
            <CobwebSvg />
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <p className="text-pink-400 font-mono text-sm mb-3">% MATLAB — Fixed-Point Iteration</p>
            <pre className="font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
{`function [x, iter] = fixed_point(g, x0, tol, maxiter)
    x = x0;
    for iter = 1:maxiter
        x_new = g(x);
        if abs(x_new - x) < tol
            x = x_new;
            fprintf('수렴: %d iterations, x = %.10f\\n', iter, x);
            return;
        end
        x = x_new;
    end
    warning('최대 반복 횟수 도달');
end

g = @(x) cos(x);
[x, n] = fixed_point(g, 0.5, 1e-10, 100);
% x ≈ 0.7390851332`}
            </pre>
          </div>
        </motion.div>

        {/* ── 5. Method Selection Guide ──────────────────── */}
        <motion.div {...fadeUp} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-pink-400">
            5. 기법 선택 가이드 (Method Selection Guide)
          </h3>
          <p className="text-slate-300 text-sm">
            상황에 따라 적절한 기법을 선택하세요. 아래 표는 주요 기법들의 특성을 비교합니다.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="py-3 px-3 text-pink-400">기법</th>
                  <th className="py-3 px-3 text-fuchsia-400">수렴 차수</th>
                  <th className="py-3 px-3 text-fuchsia-400">도함수 필요</th>
                  <th className="py-3 px-3 text-fuchsia-400">구간 보장</th>
                  <th className="py-3 px-3 text-fuchsia-400">적합 상황</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-100">Bisection</td>
                  <td className="py-2.5 px-3">Linear (1)</td>
                  <td className="py-2.5 px-3 text-green-400">No</td>
                  <td className="py-2.5 px-3 text-green-400">Yes</td>
                  <td className="py-2.5 px-3">안정성 최우선</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-100">False Position</td>
                  <td className="py-2.5 px-3">Superlinear</td>
                  <td className="py-2.5 px-3 text-green-400">No</td>
                  <td className="py-2.5 px-3 text-green-400">Yes</td>
                  <td className="py-2.5 px-3">Bisection보다 빠르게</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-100">Newton-Raphson</td>
                  <td className="py-2.5 px-3">Quadratic (2)</td>
                  <td className="py-2.5 px-3 text-red-400">f&apos;</td>
                  <td className="py-2.5 px-3 text-red-400">No</td>
                  <td className="py-2.5 px-3">도함수 계산 가능할 때</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-100">Mod. Newton</td>
                  <td className="py-2.5 px-3">Quadratic (2)</td>
                  <td className="py-2.5 px-3 text-red-400">f&apos;, f&apos;&apos;</td>
                  <td className="py-2.5 px-3 text-red-400">No</td>
                  <td className="py-2.5 px-3">중근 존재 시</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-100">Secant</td>
                  <td className="py-2.5 px-3">≈ 1.618</td>
                  <td className="py-2.5 px-3 text-green-400">No</td>
                  <td className="py-2.5 px-3 text-red-400">No</td>
                  <td className="py-2.5 px-3">도함수 없을 때</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-100">Brent</td>
                  <td className="py-2.5 px-3">Superlinear</td>
                  <td className="py-2.5 px-3 text-green-400">No</td>
                  <td className="py-2.5 px-3 text-green-400">Yes</td>
                  <td className="py-2.5 px-3">범용 (MATLAB fzero)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-100">Fixed-Point</td>
                  <td className="py-2.5 px-3">Linear (1)</td>
                  <td className="py-2.5 px-3 text-green-400">No</td>
                  <td className="py-2.5 px-3 text-yellow-400">조건부</td>
                  <td className="py-2.5 px-3">x = g(x) 형태 자연스러울 때</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <p className="text-pink-400 font-semibold font-mono text-sm mb-3">Decision Tree (빠른 선택)</p>
            <div className="text-slate-300 text-sm font-mono space-y-1 leading-relaxed">
              <p>구간 [a,b]를 알고 f(a)·f(b) &lt; 0 인가?</p>
              <p className="pl-4 text-fuchsia-400">├─ Yes → 도함수 계산 가능?</p>
              <p className="pl-8 text-pink-300">│  ├─ Yes → Newton + Bisection hybrid</p>
              <p className="pl-8 text-slate-400">│  └─ No  → <span className="text-green-400">Brent&apos;s method (fzero)</span></p>
              <p className="pl-4 text-fuchsia-400">└─ No  → 초기 추정값만 있는가?</p>
              <p className="pl-8 text-pink-300">   ├─ 도함수 있음 → Newton-Raphson</p>
              <p className="pl-8 text-pink-300">   ├─ 중근 의심 → Modified Newton</p>
              <p className="pl-8 text-slate-400">   └─ 도함수 없음 → Secant method</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
