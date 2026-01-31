"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

/* ------------------------------------------------------------------ */
/*  System: 4x1 - x2 + x3 = 7                                        */
/*          4x1 - 8x2 + x3 = -21                                      */
/*         -2x1 + x2 + 5x3 = 15                                       */
/*  Solution: (2, 4, 3)                                                */
/* ------------------------------------------------------------------ */
const A = [[4, -1, 1], [4, -8, 1], [-2, 1, 5]];
const b = [7, -21, 15];
const sol = [2, 4, 3];

function jacobiStep(xOld: number[]): { xNew: number[]; details: string[] } {
  const n = xOld.length;
  const xNew = new Array(n);
  const details: string[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    const parts: string[] = [];
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        sum += A[i][j] * xOld[j];
        parts.push(`${A[i][j] >= 0 ? "+" : ""}${A[i][j]}*${xOld[j].toFixed(4)}`);
      }
    }
    xNew[i] = (b[i] - sum) / A[i][i];
    details.push(
      `x${i + 1} = (${b[i]} - (${parts.join(" ")})) / ${A[i][i]} = ${((b[i] - sum)).toFixed(4)} / ${A[i][i]} = ${xNew[i].toFixed(6)}`
    );
  }
  return { xNew, details };
}

interface IterRow {
  k: number;
  x: number[];
  details: string[];
}

export default function JacobiMethod() {
  const [iterations, setIterations] = useState<IterRow[]>([{ k: 0, x: [0, 0, 0], details: ["초기값: x = (0, 0, 0)"] }]);
  const [showDetail, setShowDetail] = useState<number | null>(null);

  const advance = useCallback(() => {
    setIterations((prev) => {
      const last = prev[prev.length - 1];
      const { xNew, details } = jacobiStep(last.x);
      return [...prev, { k: last.k + 1, x: xNew, details }];
    });
  }, []);

  const reset = useCallback(() => {
    setIterations([{ k: 0, x: [0, 0, 0], details: ["초기값: x = (0, 0, 0)"] }]);
    setShowDetail(null);
  }, []);

  const error = (x: number[]) => Math.max(...x.map((v, i) => Math.abs(v - sol[i])));

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
            Week 7 &mdash; Iterative Methods
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Jacobi Method</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            가장 단순한 반복법 &mdash; 이전 반복의 모든 값을 사용
          </p>
        </motion.div>

        {/* ===== Concept: A = D + L + U ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">행렬 분해: A = D + L + U</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="leading-relaxed">
                행렬 <M>{"A"}</M>를 세 부분으로 분해합니다:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs font-bold">D</span>
                  <span className="text-xs text-slate-400">대각 행렬 (diagonal)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">L</span>
                  <span className="text-xs text-slate-400">엄격한 하삼각 행렬 (strict lower)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">U</span>
                  <span className="text-xs text-slate-400">엄격한 상삼각 행렬 (strict upper)</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <p className="text-slate-500 text-xs uppercase tracking-wider">예시 행렬의 분해</p>
              <MBlock>{"A = \\underbrace{\\begin{bmatrix} \\color{#38bdf8}4 & 0 & 0 \\\\ 0 & \\color{#38bdf8}{-8} & 0 \\\\ 0 & 0 & \\color{#38bdf8}5 \\end{bmatrix}}_{D} + \\underbrace{\\begin{bmatrix} 0 & 0 & 0 \\\\ \\color{#60a5fa}4 & 0 & 0 \\\\ \\color{#60a5fa}{-2} & \\color{#60a5fa}1 & 0 \\end{bmatrix}}_{L} + \\underbrace{\\begin{bmatrix} 0 & \\color{#a78bfa}{-1} & \\color{#a78bfa}1 \\\\ 0 & 0 & \\color{#a78bfa}1 \\\\ 0 & 0 & 0 \\end{bmatrix}}_{U}"}</MBlock>
            </div>
          </div>
        </motion.div>

        {/* ===== Formula derivation step by step ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">Jacobi 공식 유도</h3>
          <div className="space-y-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-sky-500/20 flex-shrink-0 flex items-center justify-center text-sky-400 text-xs font-bold">1</span>
                <div className="font-mono text-xs text-slate-300 space-y-1">
                  <p><M>{"A\\mathbf{x} = \\mathbf{b}"}</M> 에서 <M>{"A = D + (L + U)"}</M>를 대입</p>
                  <MBlock>{"(D + L + U)\\mathbf{x} = \\mathbf{b}"}</MBlock>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-sky-500/20 flex-shrink-0 flex items-center justify-center text-sky-400 text-xs font-bold">2</span>
                <div className="font-mono text-xs text-slate-300 space-y-1">
                  <p><M>{"D"}</M>를 좌변에, 나머지를 우변으로:</p>
                  <MBlock>{"D\\mathbf{x} = \\mathbf{b} - (L + U)\\mathbf{x}"}</MBlock>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-sky-500/20 flex-shrink-0 flex items-center justify-center text-sky-400 text-xs font-bold">3</span>
                <div className="font-mono text-xs text-slate-300 space-y-1">
                  <p>반복 형태로 변환 (우변에 이전 반복값 <M>{"\\mathbf{x}^{(k)}"}</M> 사용):</p>
                  <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
                    <MBlock>{"\\mathbf{x}^{(k+1)} = D^{-1}\\left(\\mathbf{b} - (L+U)\\mathbf{x}^{(k)}\\right)"}</MBlock>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-sky-500/20 flex-shrink-0 flex items-center justify-center text-sky-400 text-xs font-bold">4</span>
                <div className="font-mono text-xs text-slate-300 space-y-1">
                  <p>성분별(component-wise)로 쓰면:</p>
                  <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
                    <MBlock>{"x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{\\substack{j=1 \\\\ j \\neq i}}^{n} a_{ij}\\, \\color{#f87171}{x_j^{(k)}} \\right)"}</MBlock>
                  </div>
                  <p className="text-slate-400 mt-2">핵심: 모든 <M>{"x_j"}</M>에 <span className="text-rose-400">이전 반복값</span> <M>{"x_j^{(k)}"}</M>를 사용합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== Concrete formula for this system ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">예제 시스템의 Jacobi 공식</h3>
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-400 mb-2">
            <MBlock>{"\\begin{cases} 4x_1 - x_2 + x_3 = 7 \\\\ 4x_1 - 8x_2 + x_3 = -21 \\\\ -2x_1 + x_2 + 5x_3 = 15 \\end{cases}"}</MBlock>
          </div>
          <p className="font-mono text-xs text-slate-400">각 방정식에서 대각 원소의 미지수를 좌변에 놓고, 나머지를 우변으로 넘깁니다:</p>

          {/* x1 갱신 - 자세한 유도 */}
          <div className="bg-slate-950 rounded-xl p-5 border border-sky-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-sm font-bold">1</span>
              <p className="text-sky-400 font-mono font-bold text-sm">첫 번째 방정식에서 x₁ 구하기</p>
            </div>
            <div className="ml-10 space-y-2 font-mono text-xs text-slate-300">
              <p className="text-slate-500">원래 방정식:</p>
              <MBlock>{"4x_1 - x_2 + x_3 = 7"}</MBlock>
              <p className="text-slate-500">x₁을 좌변에 남기고 나머지를 우변으로:</p>
              <MBlock>{"4x_1 = 7 + x_2 - x_3"}</MBlock>
              <p className="text-slate-500">양변을 4로 나누면:</p>
              <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
                <MBlock>{"x_1^{\\text{new}} = \\frac{7 + \\color{#f87171}{x_2^{\\text{old}}} - \\color{#f87171}{x_3^{\\text{old}}}}{4}"}</MBlock>
              </div>
            </div>
          </div>

          {/* x2 갱신 - 자세한 유도 */}
          <div className="bg-slate-950 rounded-xl p-5 border border-blue-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">2</span>
              <p className="text-blue-400 font-mono font-bold text-sm">두 번째 방정식에서 x₂ 구하기</p>
            </div>
            <div className="ml-10 space-y-2 font-mono text-xs text-slate-300">
              <p className="text-slate-500">원래 방정식:</p>
              <MBlock>{"4x_1 - 8x_2 + x_3 = -21"}</MBlock>
              <p className="text-slate-500">x₂를 좌변에 남기고 나머지를 우변으로:</p>
              <MBlock>{"-8x_2 = -21 - 4x_1 - x_3"}</MBlock>
              <p className="text-slate-500">양변을 -8로 나누면:</p>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <MBlock>{"x_2^{\\text{new}} = \\frac{21 + 4\\color{#f87171}{x_1^{\\text{old}}} + \\color{#f87171}{x_3^{\\text{old}}}}{8}"}</MBlock>
              </div>
            </div>
          </div>

          {/* x3 갱신 - 자세한 유도 */}
          <div className="bg-slate-950 rounded-xl p-5 border border-violet-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm font-bold">3</span>
              <p className="text-violet-400 font-mono font-bold text-sm">세 번째 방정식에서 x₃ 구하기</p>
            </div>
            <div className="ml-10 space-y-2 font-mono text-xs text-slate-300">
              <p className="text-slate-500">원래 방정식:</p>
              <MBlock>{"-2x_1 + x_2 + 5x_3 = 15"}</MBlock>
              <p className="text-slate-500">x₃을 좌변에 남기고 나머지를 우변으로:</p>
              <MBlock>{"5x_3 = 15 + 2x_1 - x_2"}</MBlock>
              <p className="text-slate-500">양변을 5로 나누면:</p>
              <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <MBlock>{"x_3^{\\text{new}} = \\frac{15 + 2\\color{#f87171}{x_1^{\\text{old}}} - \\color{#f87171}{x_2^{\\text{old}}}}{5}"}</MBlock>
              </div>
            </div>
          </div>

          {/* 1회 반복 수치 예제 */}
          <div className="bg-slate-950 rounded-xl p-5 border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-mono font-bold text-sm">실제 숫자 대입해보기</span>
              <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">초기값 (0, 0, 0) → 1회 반복</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="space-y-1 text-slate-300">
                <p className="text-sky-400 font-bold">x₁ 계산:</p>
                <MBlock>{"x_1 = \\frac{7 + \\color{#f87171}{0} - \\color{#f87171}{0}}{4} = \\frac{7}{4} = 1.75"}</MBlock>
              </div>
              <div className="space-y-1 text-slate-300">
                <p className="text-blue-400 font-bold">x₂ 계산:</p>
                <MBlock>{"x_2 = \\frac{21 + 4 \\cdot \\color{#f87171}{0} + \\color{#f87171}{0}}{8} = \\frac{21}{8} = 2.625"}</MBlock>
              </div>
              <div className="space-y-1 text-slate-300">
                <p className="text-violet-400 font-bold">x₃ 계산:</p>
                <MBlock>{"x_3 = \\frac{15 + 2 \\cdot \\color{#f87171}{0} - \\color{#f87171}{0}}{5} = \\frac{15}{5} = 3.0"}</MBlock>
              </div>
            </div>
            <div className="text-center font-mono text-xs text-slate-400 pt-2 border-t border-slate-800">
              1회 반복 결과: <span className="text-emerald-400">(1.75, 2.625, 3.0)</span> &nbsp;→&nbsp; 정답 (2, 4, 3)에 가까워지고 있습니다!
            </div>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 font-mono text-xs text-rose-300 flex items-start gap-2">
            <span className="text-rose-400 text-lg leading-none">!</span>
            <span>핵심 포인트: x₁을 새로 구했더라도, x₂를 계산할 때는 <span className="text-rose-400 font-bold">새 x₁이 아닌 이전 값(old)</span>을 사용합니다. 세 변수 모두 <span className="text-rose-400 font-bold">동시에 갱신</span>되는 것이 Jacobi의 특징입니다.</span>
          </div>
        </motion.div>

        {/* ===== Interactive Demo ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">Interactive Demo &mdash; 반복 과정</h3>
          <p className="font-mono text-xs text-slate-400">
            초기값 <M>{"\\mathbf{x}^{(0)} = (0, 0, 0)^T"}</M> &nbsp;|&nbsp; 정확한 해 <M>{"(2, 4, 3)"}</M> &nbsp;|&nbsp; 행을 클릭하면 상세 계산 과정을 볼 수 있습니다
          </p>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-800">
                  <th className="py-2 px-3 text-left">k</th>
                  <th className="py-2 px-3 text-right"><M>{"x_1"}</M></th>
                  <th className="py-2 px-3 text-right"><M>{"x_2"}</M></th>
                  <th className="py-2 px-3 text-right"><M>{"x_3"}</M></th>
                  <th className="py-2 px-3 text-right">max error</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map((row) => (
                  <React.Fragment key={row.k}>
                    <tr
                      className={`border-b border-slate-800/50 text-slate-300 cursor-pointer transition-colors ${showDetail === row.k ? "bg-sky-500/5" : "hover:bg-slate-800/50"}`}
                      onClick={() => setShowDetail(showDetail === row.k ? null : row.k)}
                    >
                      <td className="py-2 px-3 text-sky-400">{row.k}</td>
                      <td className="py-2 px-3 text-right">{row.x[0].toFixed(6)}</td>
                      <td className="py-2 px-3 text-right">{row.x[1].toFixed(6)}</td>
                      <td className="py-2 px-3 text-right">{row.x[2].toFixed(6)}</td>
                      <td className="py-2 px-3 text-right text-amber-400">{error(row.x).toExponential(2)}</td>
                    </tr>
                    {showDetail === row.k && (
                      <tr>
                        <td colSpan={5} className="px-3 pb-3">
                          <div className="bg-slate-950 rounded-lg p-3 border border-sky-500/20 space-y-1">
                            <p className="text-[10px] text-sky-400 font-bold mb-1">k={row.k} 상세 계산</p>
                            {row.details.map((d, i) => (
                              <p key={i} className="text-[11px] text-slate-400 font-mono">{d}</p>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={advance} disabled={iterations.length > 20} className="px-5 py-2 rounded-xl font-mono text-sm bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30 transition disabled:opacity-30">
              Next Iteration &rarr;
            </button>
            <button onClick={reset} className="px-5 py-2 rounded-xl font-mono text-sm bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition">
              Reset
            </button>
          </div>

          {iterations.length > 5 && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              수렴 중! error가 점점 작아지고 있습니다. (2, 4, 3)에 접근합니다.
            </div>
          )}
        </motion.div>

        {/* ===== MATLAB ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">MATLAB Implementation</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`function [x, iter] = jacobi(A, b, x0, tol, maxiter)
% JACOBI  Jacobi iterative method for Ax = b

  if nargin < 4, tol = 1e-8; end
  if nargin < 5, maxiter = 1000; end

  n = length(b);
  x = x0(:);
  D = diag(diag(A));
  R = A - D;   % L + U

  for iter = 1:maxiter
      x_new = D \\ (b(:) - R * x);  % 핵심: 모든 x에 이전값 사용

      if norm(x_new - x, inf) < tol
          x = x_new;
          fprintf('Converged in %d iterations.\\n', iter);
          return;
      end
      x = x_new;
  end
  warning('Maximum iterations reached.');
end`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
