"use client";

import React from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

/* ------------------------------------------------------------------ */
/*  SVG: Circle x^2+y^2=4 and Hyperbola xy=1 intersection            */
/* ------------------------------------------------------------------ */
const W = 460;
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

function IntersectionSvg() {
  const xMin = -2.8;
  const xMax = 2.8;
  const yMin = -2.8;
  const yMax = 2.8;

  // Circle: x^2 + y^2 = 4
  const circlePts: string[] = [];
  for (let t = 0; t <= 2 * Math.PI + 0.05; t += 0.04) {
    const cx = 2 * Math.cos(t);
    const cy = 2 * Math.sin(t);
    const [sx, sy] = toSvg(cx, cy, xMin, xMax, yMin, yMax);
    circlePts.push(`${circlePts.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  // Hyperbola: xy = 1 => y = 1/x (two branches)
  const hyperPos: string[] = [];
  for (let x = 0.36; x <= xMax; x += 0.04) {
    const y = 1 / x;
    if (y > yMax) continue;
    const [sx, sy] = toSvg(x, y, xMin, xMax, yMin, yMax);
    hyperPos.push(`${hyperPos.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }
  const hyperNeg: string[] = [];
  for (let x = -0.36; x >= xMin; x -= 0.04) {
    const y = 1 / x;
    if (y < yMin) continue;
    const [sx, sy] = toSvg(x, y, xMin, xMax, yMin, yMax);
    hyperNeg.push(`${hyperNeg.length === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  // Intersection points: x^2 + 1/x^2 = 4 => x^4 - 4x^2 + 1 = 0
  // x^2 = (4 +/- sqrt(12))/2 = 2 +/- sqrt(3)
  const x1 = Math.sqrt(2 + Math.sqrt(3)); // ~1.932
  const y1 = 1 / x1;
  const x2 = Math.sqrt(2 - Math.sqrt(3)); // ~0.518
  const y2 = 1 / x2;

  const pts = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: -x1, y: -y1 },
    { x: -x2, y: -y2 },
  ];

  const [, axisY] = toSvg(0, 0, xMin, xMax, yMin, yMax);
  const [axisX] = toSvg(0, 0, xMin, xMax, yMin, yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {/* axes */}
      <line x1={pad} y1={axisY} x2={W - pad} y2={axisY} stroke="#475569" strokeWidth={1} />
      <line x1={axisX} y1={pad} x2={axisX} y2={H - pad} stroke="#475569" strokeWidth={1} />

      {/* circle */}
      <path d={circlePts.join(" ")} fill="none" stroke="#f472b6" strokeWidth={2.2} />
      {/* hyperbola */}
      <path d={hyperPos.join(" ")} fill="none" stroke="#c084fc" strokeWidth={2.2} />
      <path d={hyperNeg.join(" ")} fill="none" stroke="#c084fc" strokeWidth={2.2} />

      {/* intersection dots */}
      {pts.map((p, i) => {
        const [sx, sy] = toSvg(p.x, p.y, xMin, xMax, yMin, yMax);
        return <circle key={i} cx={sx} cy={sy} r={5} fill="#34d399" stroke="#064e3b" strokeWidth={1} />;
      })}

      {/* labels */}
      <text x={W - pad - 10} y={axisY - 8} fill="#64748b" fontSize={11} fontFamily="monospace">x</text>
      <text x={axisX + 6} y={pad + 12} fill="#64748b" fontSize={11} fontFamily="monospace">y</text>
      <text x={W - pad - 60} y={pad + 20} fill="#f472b6" fontSize={11} fontFamily="monospace">
        x²+y²=4
      </text>
      <text x={W - pad - 45} y={pad + 36} fill="#c084fc" fontSize={11} fontFamily="monospace">
        xy=1
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function NonlinearSystems() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* ---- 1. Header ---- */}
        <motion.div {...fadeUp} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
            Week 5 &mdash; Nonlinear Systems
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            비선형 연립방정식
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            Nonlinear Systems of Equations &mdash; 다변수 비선형 방정식의 근을 찾는 방법
          </p>
        </motion.div>

        {/* ---- 2. Problem Setup ---- */}
        <motion.div
          {...fadeUp}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">
            문제 정의 &mdash; Problem Setup
          </h3>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-slate-400 text-xs uppercase tracking-wider">General form</p>
                <p className="text-lg text-pink-400">
                  Find <M>{"\\mathbf{x}"}</M> such that{" "}
                  <M>{"\\mathbf{F}(\\mathbf{x}) = \\mathbf{0}"}</M>
                </p>
                <p className="text-slate-400">
                  where <M>{"\\mathbf{F}: \\mathbb{R}^{n} \\to \\mathbb{R}^{n}"}</M>
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Example system (n=2)</p>
                <div className="space-y-1 text-base">
                  <MBlock>{"F_1(x,y) = x^{2} + y^{2} - 4 = 0"}</MBlock>
                  <MBlock>{"F_2(x,y) = x \\cdot y - 1 = 0"}</MBlock>
                </div>
                <p className="text-slate-500 text-xs">
                  원(circle)과 쌍곡선(hyperbola)의 교점을 구하는 문제
                </p>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                1차원 방정식 <M>{"f(x)=0"}</M>의 확장입니다. 변수가 n개이고 방정식도 n개인 연립방정식을 풀어야 합니다.
                해가 여러 개 존재할 수 있으며, 초기값에 따라 다른 해로 수렴합니다.
              </p>
            </div>

            <IntersectionSvg />
          </div>
        </motion.div>

        {/* ---- 3. Newton's Method for Systems ---- */}
        <motion.div
          {...fadeUp}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-fuchsia-400">
            다변수 Newton 법 &mdash; Newton&rsquo;s Method for Systems
          </h3>

          {/* Jacobian */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3 font-mono text-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider">Jacobian Matrix</p>
            <MBlock>{"J(\\mathbf{x}) = \\left[\\frac{\\partial F_i}{\\partial x_j}\\right] \\in \\mathbb{R}^{n \\times n}"}</MBlock>
            <div className="text-slate-300 bg-slate-900/80 rounded-lg p-4 space-y-1">
              <p className="text-slate-500 text-xs mb-2">Example system 의 Jacobian:</p>
              <MBlock>{"J(x,y) = \\begin{bmatrix} 2x & 2y \\\\ y & x \\end{bmatrix}"}</MBlock>
            </div>
          </div>

          {/* Iteration formula */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4 font-mono text-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider">Iteration Formula</p>
            <div className="space-y-2">
              <MBlock>{"\\mathbf{x}_{n+1} = \\mathbf{x}_{n} - J(\\mathbf{x}_{n})^{-1} \\cdot \\mathbf{F}(\\mathbf{x}_{n})"}</MBlock>
              <p className="text-slate-500">↓ In practice (역행렬을 직접 구하지 않음)</p>
              <div className="text-pink-400 text-base space-y-1">
                <MBlock>{"\\text{Step 1: Solve }\\; J(\\mathbf{x}_{n}) \\cdot \\Delta\\mathbf{x} = -\\mathbf{F}(\\mathbf{x}_{n})"}</MBlock>
                <MBlock>{"\\text{Step 2: Update }\\; \\mathbf{x}_{n+1} = \\mathbf{x}_{n} + \\Delta\\mathbf{x}"}</MBlock>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              역행렬 계산은 <M>{"O(n^{3})"}</M>으로 비용이 크므로, 실제로는 선형 시스템을 풀어 <M>{"\\Delta\\mathbf{x}"}</M>를 구합니다.
              MATLAB에서는 backslash 연산자(<span className="text-pink-400">\</span>)를 사용합니다.
            </p>
          </div>

          {/* Step-by-step iteration example */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3 font-mono text-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Step-by-step: 1st iteration with <M>{"\\mathbf{x}_0 = (1, 1)"}</M>
            </p>
            <div className="space-y-2 text-slate-300">
              <p>
                <span className="text-slate-500"><M>{"F(\\mathbf{x}_0) ="}</M></span>{" "}
                <M>{"[1^{2} + 1^{2} - 4,\\; 1 \\cdot 1 - 1] = [-2,\\; 0]"}</M>
              </p>
              <p>
                <span className="text-slate-500"><M>{"J(\\mathbf{x}_0) ="}</M></span>{" "}
                <M>{"\\begin{bmatrix} 2 & 2 \\\\ 1 & 1 \\end{bmatrix}"}</M>,{" "}
                <M>{"\\det = 2 \\cdot 1 - 2 \\cdot 1 = 0"}</M>{" "}
                <span className="text-yellow-400">(singular!)</span>
              </p>
              <p className="text-slate-400 text-xs">
                <M>{"\\mathbf{x}_0=(1,1)"}</M>은 Jacobian이 특이(singular)하므로 초기값을 바꿔야 합니다.
              </p>
              <p className="text-slate-500 mt-2">Try <M>{"\\mathbf{x}_0 = (1.5, 0.8)"}</M>:</p>
              <p>
                <span className="text-slate-500"><M>{"F ="}</M></span>{" "}
                <M>{"[1.5^{2} + 0.8^{2} - 4,\\; 1.5 \\cdot 0.8 - 1] = [-1.11,\\; 0.20]"}</M>
              </p>
              <p>
                <span className="text-slate-500"><M>{"J ="}</M></span>{" "}
                <M>{"\\begin{bmatrix} 3.0 & 1.6 \\\\ 0.8 & 1.5 \\end{bmatrix}"}</M>{" "}
                → <M>{"\\det = 3.0 \\cdot 0.8 - 1.6 \\cdot 1.5 = 0"}</M>
                <span className="text-yellow-400"> (also singular!)</span>
              </p>
              <p className="text-slate-400 text-xs">
                Try <M>{"\\mathbf{x}_0 = (2, 0.5)"}</M>:
              </p>
              <p>
                <span className="text-slate-500"><M>{"F ="}</M></span>{" "}
                <M>{"[4.25 - 4,\\; 1.0 - 1] = [0.25,\\; 0.0]"}</M>
              </p>
              <p>
                <span className="text-slate-500"><M>{"J ="}</M></span>{" "}
                <M>{"\\begin{bmatrix} 4.0 & 1.0 \\\\ 0.5 & 2.0 \\end{bmatrix}"}</M>,{" "}
                <M>{"\\det = 7.5"}</M>
              </p>
              <p>
                <span className="text-slate-500"><M>{"\\Delta\\mathbf{x} = -J \\backslash F ="}</M></span>{" "}
                <span className="text-fuchsia-400"><M>{"[-0.0667,\\; 0.0167]"}</M></span>
              </p>
              <p>
                <span className="text-slate-500"><M>{"\\mathbf{x}_1 ="}</M></span>{" "}
                <span className="text-emerald-400"><M>{"(1.9333,\\; 0.5167)"}</M></span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---- 4. MATLAB Implementation ---- */}
        <motion.div
          {...fadeUp}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-pink-400">MATLAB Implementation</h3>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`function x = newton_system(F, J, x0, tol, maxiter)
% NEWTON_SYSTEM  Newton's method for nonlinear systems F(x) = 0
%   x = newton_system(F, J, x0, tol, maxiter)
%
%   Inputs:
%     F       - function handle returning column vector F(x)
%     J       - function handle returning Jacobian matrix J(x)
%     x0      - initial guess (column vector)
%     tol     - tolerance (default 1e-10)
%     maxiter - maximum iterations (default 100)

  if nargin < 4, tol = 1e-10; end
  if nargin < 5, maxiter = 100; end

  x = x0;
  for i = 1:maxiter
      Fx = F(x);
      Jx = J(x);
      dx = -Jx \\ Fx;          % solve J * dx = -F
      x  = x + dx;
      fprintf('iter %d: x = [%g, %g], ||dx|| = %g\\n', ...
              i, x(1), x(2), norm(dx));
      if norm(dx) < tol
          fprintf('Converged in %d iterations.\\n', i);
          return;
      end
  end
  warning('Maximum iterations reached.');
end`}</pre>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <p className="text-xs text-slate-500 font-mono mb-3">% Usage: circle/hyperbola system</p>
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`F = @(x) [x(1)^2 + x(2)^2 - 4;
          x(1)*x(2) - 1];

J = @(x) [2*x(1),  2*x(2);
          x(2),    x(1)];

x0 = [2; 0.5];
x = newton_system(F, J, x0, 1e-12, 50);

% Output:
% iter 1: x = [1.93333, 0.51667], ||dx|| = 0.0691
% iter 2: x = [1.93185, 0.51764], ||dx|| = 0.00173
% iter 3: x = [1.93185, 0.51764], ||dx|| = 1.12e-06
% iter 4: x = [1.93185, 0.51764], ||dx|| = 4.73e-13
% Converged in 4 iterations.`}</pre>
          </div>
        </motion.div>

        {/* ---- 5. fsolve ---- */}
        <motion.div
          {...fadeUp}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-bold text-fuchsia-400">
            MATLAB fsolve &mdash; Built-in Solver
          </h3>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`% fsolve: Jacobian을 자동으로 근사 (finite difference)
x = fsolve(@(x) [x(1)^2 + x(2)^2 - 4; ...
                  x(1)*x(2) - 1], [1; 1]);

% Options 설정
opts = optimoptions('fsolve', ...
    'Display', 'iter', ...          % 반복 정보 출력
    'TolFun', 1e-12, ...            % 함수값 허용 오차
    'TolX', 1e-12, ...              % 변수값 허용 오차
    'MaxIterations', 200, ...       % 최대 반복 횟수
    'SpecifyObjectiveGradient', true);  % Jacobian 직접 제공

% Jacobian을 함께 제공하는 방법
function [F, J] = myfun(x)
    F = [x(1)^2 + x(2)^2 - 4;
         x(1)*x(2) - 1];
    J = [2*x(1), 2*x(2);
         x(2),   x(1)];
end

x = fsolve(@myfun, [2; 0.5], opts);`}</pre>
          </div>

          <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center">
              <p className="text-pink-400 font-bold mb-1">Algorithm</p>
              <p className="text-slate-400">trust-region-dogleg (default)</p>
              <p className="text-slate-500 mt-1">or Levenberg-Marquardt</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center">
              <p className="text-fuchsia-400 font-bold mb-1">Jacobian</p>
              <p className="text-slate-400">자동 finite-difference</p>
              <p className="text-slate-500 mt-1">또는 직접 제공 가능</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-center">
              <p className="text-pink-400 font-bold mb-1">장점</p>
              <p className="text-slate-400">robust &amp; easy to use</p>
              <p className="text-slate-500 mt-1">line search 자동 적용</p>
            </div>
          </div>
        </motion.div>

        {/* ---- 6. Challenges ---- */}
        <motion.div {...fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-pink-400 text-center">
            도전 과제 &mdash; Challenges &amp; Alternatives
          </h3>
          <p className="text-center text-slate-400 font-mono text-sm max-w-2xl mx-auto">
            Jacobian 계산은 <M>{"n^{2}"}</M>개의 편미분을 필요로 하며, 시스템이 클수록 비용이 급증합니다.
            이를 대체하는 방법들이 있습니다.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Card: Finite-difference Jacobian */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center text-pink-400 font-mono font-bold text-lg">
                <M>{"\\Delta"}</M>
              </div>
              <h4 className="font-bold text-pink-400 font-mono text-sm">
                Finite-Difference Jacobian
              </h4>
              <div className="font-mono text-xs text-slate-300 bg-slate-950 rounded-lg p-3 border border-slate-800">
                <M>{"\\frac{\\partial F_i}{\\partial x_j} \\approx \\frac{F_i(\\mathbf{x} + h \\cdot \\mathbf{e}_j) - F_i(\\mathbf{x})}{h}"}</M>
              </div>
              <p className="text-slate-400 text-xs font-mono leading-relaxed">
                해석적 도함수 대신 수치적 근사를 사용합니다.
                n개 변수에 대해 n번의 F 평가가 추가로 필요합니다.
                구현이 간단하지만 정확도가 h 선택에 의존합니다.
              </p>
            </div>

            {/* Card: Broyden's Method */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/15 flex items-center justify-center text-fuchsia-400 font-mono font-bold text-lg">
                B
              </div>
              <h4 className="font-bold text-fuchsia-400 font-mono text-sm">
                Broyden&rsquo;s Method (Quasi-Newton)
              </h4>
              <div className="font-mono text-xs text-slate-300 bg-slate-950 rounded-lg p-3 border border-slate-800">
                <M>{"B_{n+1} = B_{n} + \\frac{(\\Delta F - B_{n}\\Delta\\mathbf{x})\\Delta\\mathbf{x}^{T}}{\\|\\Delta\\mathbf{x}\\|^{2}}"}</M>
              </div>
              <p className="text-slate-400 text-xs font-mono leading-relaxed">
                Jacobian을 매 반복마다 rank-1 update로 근사합니다.
                매 반복당 F 평가 1회만 필요합니다.
                수렴 속도는 superlinear (Newton보다 느리지만 효율적).
              </p>
            </div>

            {/* Card: Convergence issues */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center text-pink-400 font-mono font-bold text-lg">
                !
              </div>
              <h4 className="font-bold text-pink-400 font-mono text-sm">
                수렴성 문제 &mdash; Convergence Issues
              </h4>
              <ul className="text-slate-400 text-xs font-mono leading-relaxed space-y-1 list-disc list-inside">
                <li>초기값 의존성이 1차원보다 심함</li>
                <li>Jacobian이 singular하면 실패</li>
                <li>여러 해 중 원하는 해 선택이 어려움</li>
                <li>대규모 시스템에서 <M>{"O(n^{3})"}</M> 비용</li>
              </ul>
              <p className="text-slate-500 text-xs font-mono">
                해결: line search, trust region, continuation methods
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
