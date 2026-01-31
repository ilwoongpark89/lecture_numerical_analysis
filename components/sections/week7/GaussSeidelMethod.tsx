"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const A = [[4, -1, 1], [4, -8, 1], [-2, 1, 5]];
const b = [7, -21, 15];
const sol = [2, 4, 3];

function jacobiStep(xOld: number[]): { xNew: number[]; details: string[] } {
  const n = xOld.length;
  const xNew = new Array(n);
  const details: string[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      if (j !== i) sum += A[i][j] * xOld[j];
    }
    xNew[i] = (b[i] - sum) / A[i][i];
    details.push(`x${i+1} = (${b[i]} - Σ) / ${A[i][i]} = ${xNew[i].toFixed(6)}  [모두 이전 값 사용]`);
  }
  return { xNew, details };
}

function gaussSeidelStep(xOld: number[]): { xNew: number[]; details: string[] } {
  const n = xOld.length;
  const xNew = [...xOld];
  const details: string[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    const parts: string[] = [];
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        sum += A[i][j] * xNew[j];
        const isUpdated = j < i;
        parts.push(`${A[i][j]}*${xNew[j].toFixed(4)}${isUpdated ? "←NEW" : "←old"}`);
      }
    }
    const oldVal = xNew[i];
    xNew[i] = (b[i] - sum) / A[i][i];
    details.push(`x${i+1} = (${b[i]} - (${parts.join(", ")})) / ${A[i][i]} = ${xNew[i].toFixed(6)}`);
  }
  return { xNew, details };
}

interface IterRow {
  k: number;
  jx: number[];
  gsx: number[];
  jDetails: string[];
  gsDetails: string[];
}

export default function GaussSeidelMethod() {
  const [iters, setIters] = useState<IterRow[]>([{
    k: 0, jx: [0,0,0], gsx: [0,0,0],
    jDetails: ["초기값"], gsDetails: ["초기값"],
  }]);
  const [showDetail, setShowDetail] = useState<number | null>(null);

  const advance = useCallback(() => {
    setIters((prev) => {
      const last = prev[prev.length - 1];
      const j = jacobiStep(last.jx);
      const gs = gaussSeidelStep(last.gsx);
      return [...prev, { k: last.k + 1, jx: j.xNew, gsx: gs.xNew, jDetails: j.details, gsDetails: gs.details }];
    });
  }, []);

  const reset = useCallback(() => {
    setIters([{ k: 0, jx: [0,0,0], gsx: [0,0,0], jDetails: ["초기값"], gsDetails: ["초기값"] }]);
    setShowDetail(null);
  }, []);

  const error = (x: number[]) => Math.max(...x.map((v, i) => Math.abs(v - sol[i])));

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Gauss-Seidel Method</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            갱신된 값을 즉시 사용하여 더 빠른 수렴을 달성
          </p>
        </motion.div>

        {/* ===== Key Idea: side-by-side formula ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">핵심 차이: 값 갱신 시점</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-sky-500/30 font-mono text-sm space-y-3">
              <p className="text-sky-400 font-bold">Jacobi</p>
              <MBlock>{"x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j \\neq i} a_{ij}\\, \\color{#f87171}{x_j^{(k)}} \\right)"}</MBlock>
              <p className="text-xs text-slate-400">모든 <M>{"x_j"}</M>에 <span className="text-rose-400">이전 반복값</span> 사용</p>
              <div className="bg-slate-900 rounded-lg p-2 text-[11px] text-slate-500">
                x₁, x₂, x₃ 계산이 서로 독립 &rarr; 병렬화 가능
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-blue-500/30 font-mono text-sm space-y-3">
              <p className="text-blue-400 font-bold">Gauss-Seidel</p>
              <MBlock>{"x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j<i} a_{ij}\\, \\color{#38bdf8}{x_j^{(k+1)}} - \\sum_{j>i} a_{ij}\\, \\color{#f87171}{x_j^{(k)}} \\right)"}</MBlock>
              <p className="text-xs text-slate-400">이미 갱신된 <span className="text-sky-400">새 값</span>을 즉시 사용!</p>
              <div className="bg-slate-900 rounded-lg p-2 text-[11px] text-slate-500">
                x₁ 계산 후 바로 x₂에 반영 &rarr; 순차적 의존
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== Concrete formulas for this system ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">Gauss-Seidel: 대입 순서</h3>
          <p className="font-mono text-xs text-slate-400">같은 시스템에서 Gauss-Seidel이 어떻게 다른지 봅시다:</p>
          <div className="space-y-4">
            <div className="bg-slate-950 rounded-xl p-4 border border-sky-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs font-bold">1</span>
                <span className="text-sky-400 font-mono font-bold text-sm">먼저 x₁ 계산</span>
              </div>
              <MBlock>{"x_1^{(k+1)} = \\frac{7 + \\color{#f87171}{x_2^{(k)}} - \\color{#f87171}{x_3^{(k)}}}{4}"}</MBlock>
              <p className="text-[11px] text-slate-500 font-mono mt-1">x₂, x₃는 아직 갱신 전 &rarr; 이전 값 사용</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">2</span>
                <span className="text-blue-400 font-mono font-bold text-sm">다음 x₂ 계산 (x₁ 새 값 사용!)</span>
              </div>
              <MBlock>{"x_2^{(k+1)} = \\frac{21 + 4\\color{#38bdf8}{x_1^{(k+1)}} + \\color{#f87171}{x_3^{(k)}}}{8}"}</MBlock>
              <p className="text-[11px] text-slate-500 font-mono mt-1"><span className="text-sky-400">x₁은 방금 계산한 새 값!</span> x₃는 아직 이전 값</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 border border-violet-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">3</span>
                <span className="text-violet-400 font-mono font-bold text-sm">마지막 x₃ 계산 (x₁, x₂ 모두 새 값!)</span>
              </div>
              <MBlock>{"x_3^{(k+1)} = \\frac{15 + 2\\color{#38bdf8}{x_1^{(k+1)}} - \\color{#38bdf8}{x_2^{(k+1)}}}{5}"}</MBlock>
              <p className="text-[11px] text-slate-500 font-mono mt-1"><span className="text-sky-400">x₁, x₂ 모두 이번 반복에서 갱신된 새 값 사용!</span></p>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 font-mono text-xs text-emerald-400">
            최신 정보를 즉시 반영하므로 보통 Jacobi보다 2배 정도 빠르게 수렴합니다.
          </div>
        </motion.div>

        {/* ===== Side-by-side comparison demo ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">Jacobi vs Gauss-Seidel 실시간 비교</h3>
          <p className="font-mono text-xs text-slate-400">행을 클릭하면 해당 반복의 상세 계산 과정을 볼 수 있습니다.</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-mono text-sky-400 font-bold mb-2">Jacobi (이전 값만 사용)</p>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead><tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-1 px-2 text-left">k</th>
                    <th className="py-1 px-2 text-right"><M>{"x_1"}</M></th>
                    <th className="py-1 px-2 text-right"><M>{"x_2"}</M></th>
                    <th className="py-1 px-2 text-right"><M>{"x_3"}</M></th>
                    <th className="py-1 px-2 text-right">err</th>
                  </tr></thead>
                  <tbody>
                    {iters.map((row) => (
                      <tr key={row.k} className="border-b border-slate-800/50 text-slate-300 cursor-pointer hover:bg-slate-800/50" onClick={() => setShowDetail(showDetail === row.k ? null : row.k)}>
                        <td className="py-1 px-2 text-sky-400">{row.k}</td>
                        <td className="py-1 px-2 text-right">{row.jx[0].toFixed(4)}</td>
                        <td className="py-1 px-2 text-right">{row.jx[1].toFixed(4)}</td>
                        <td className="py-1 px-2 text-right">{row.jx[2].toFixed(4)}</td>
                        <td className="py-1 px-2 text-right text-rose-400">{error(row.jx).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="text-sm font-mono text-blue-400 font-bold mb-2">Gauss-Seidel (새 값 즉시 사용)</p>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead><tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-1 px-2 text-left">k</th>
                    <th className="py-1 px-2 text-right"><M>{"x_1"}</M></th>
                    <th className="py-1 px-2 text-right"><M>{"x_2"}</M></th>
                    <th className="py-1 px-2 text-right"><M>{"x_3"}</M></th>
                    <th className="py-1 px-2 text-right">err</th>
                  </tr></thead>
                  <tbody>
                    {iters.map((row) => (
                      <tr key={row.k} className="border-b border-slate-800/50 text-slate-300 cursor-pointer hover:bg-slate-800/50" onClick={() => setShowDetail(showDetail === row.k ? null : row.k)}>
                        <td className="py-1 px-2 text-blue-400">{row.k}</td>
                        <td className="py-1 px-2 text-right">{row.gsx[0].toFixed(4)}</td>
                        <td className="py-1 px-2 text-right">{row.gsx[1].toFixed(4)}</td>
                        <td className="py-1 px-2 text-right">{row.gsx[2].toFixed(4)}</td>
                        <td className="py-1 px-2 text-right text-emerald-400">{error(row.gsx).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detail panel */}
          {showDetail !== null && showDetail > 0 && showDetail < iters.length && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded-lg p-3 border border-sky-500/20">
                <p className="text-[10px] text-sky-400 font-bold mb-2">Jacobi k={showDetail} 상세</p>
                {iters[showDetail].jDetails.map((d, i) => (
                  <p key={i} className="text-[11px] text-slate-400 font-mono">{d}</p>
                ))}
              </div>
              <div className="bg-slate-950 rounded-lg p-3 border border-blue-500/20">
                <p className="text-[10px] text-blue-400 font-bold mb-2">Gauss-Seidel k={showDetail} 상세</p>
                {iters[showDetail].gsDetails.map((d, i) => (
                  <p key={i} className="text-[11px] text-slate-400 font-mono">{d}</p>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={advance} disabled={iters.length > 15} className="px-5 py-2 rounded-xl font-mono text-sm bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30 transition disabled:opacity-30">
              Next Iteration &rarr;
            </button>
            <button onClick={reset} className="px-5 py-2 rounded-xl font-mono text-sm bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition">
              Reset
            </button>
          </div>
        </motion.div>

        {/* ===== MATLAB ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">MATLAB Implementation</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`function [x, iter] = gauss_seidel(A, b, x0, tol, maxiter)
% GAUSS_SEIDEL  Gauss-Seidel iterative method
%   핵심: x(i)를 갱신하면 즉시 다음 계산에 반영

  if nargin < 4, tol = 1e-8; end
  if nargin < 5, maxiter = 1000; end

  n = length(b);
  x = x0(:);

  for iter = 1:maxiter
      x_old = x;
      for i = 1:n
          % j < i: 이미 갱신된 새 값 사용 (x(1:i-1)은 이미 새 값!)
          % j > i: 아직 이전 반복 값 사용
          sigma = A(i, [1:i-1, i+1:n]) * x([1:i-1, i+1:n]);
          x(i) = (b(i) - sigma) / A(i, i);
      end

      if norm(x - x_old, inf) < tol
          fprintf('Converged in %d iterations.\\n', iter);
          return;
      end
  end
  warning('Maximum iterations reached.');
end`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
