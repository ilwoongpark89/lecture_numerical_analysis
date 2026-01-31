"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function LUDecomposition() {
  const [showDecomp, setShowDecomp] = useState(false);

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">LU Decomposition</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            <M>{"A = LU"}</M> &mdash; 한 번 분해하면 여러 우변 벡터에 대해 효율적으로 풀 수 있습니다
          </p>
        </motion.div>

        {/* Concept */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">LU 분해 개념</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="leading-relaxed">
                행렬 <M>{"A"}</M>를 하삼각 행렬 <M>{"L"}</M>과 상삼각 행렬 <M>{"U"}</M>의 곱으로 분해합니다.
              </p>
              <MBlock>{"A = LU"}</MBlock>
              <p className="text-slate-400 text-xs leading-relaxed">
                <M>{"A\\mathbf{x} = \\mathbf{b}"}</M>를 풀 때:
              </p>
              <ol className="space-y-2 text-slate-400 text-xs list-decimal list-inside">
                <li><M>{"L\\mathbf{y} = \\mathbf{b}"}</M> 풀기 (전진 대입, <M>{"O(n^2/2)"}</M>)</li>
                <li><M>{"U\\mathbf{x} = \\mathbf{y}"}</M> 풀기 (후진 대입, <M>{"O(n^2/2)"}</M>)</li>
              </ol>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400">
                여러 <M>{"\\mathbf{b}"}</M>에 대해 풀어야 할 때, 분해는 한 번만 수행하면 됩니다!
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Structure</p>
              <MBlock>{"L = \\begin{bmatrix} 1 & 0 & 0 \\\\ l_{21} & 1 & 0 \\\\ l_{31} & l_{32} & 1 \\end{bmatrix}"}</MBlock>
              <MBlock>{"U = \\begin{bmatrix} u_{11} & u_{12} & u_{13} \\\\ 0 & u_{22} & u_{23} \\\\ 0 & 0 & u_{33} \\end{bmatrix}"}</MBlock>
              <p className="text-slate-400 text-xs">
                <M>{"L"}</M>의 대각원소는 1, <M>{"U"}</M>는 Gauss 소거의 결과 행렬
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-violet-400">분해 예제</h3>
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs">
            <MBlock>{"A = \\begin{bmatrix} 2 & 1 & -1 \\\\ -3 & -1 & 2 \\\\ -2 & 1 & 2 \\end{bmatrix}"}</MBlock>
          </div>
          <button
            onClick={() => setShowDecomp(!showDecomp)}
            className="px-5 py-2 rounded-xl font-mono text-sm bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition"
          >
            {showDecomp ? "숨기기" : "LU 분해 결과 보기"}
          </button>
          {showDecomp && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
                <p className="text-indigo-400 font-bold">L (Lower triangular)</p>
                <MBlock>{"L = \\begin{bmatrix} 1 & 0 & 0 \\\\ -1.5 & 1 & 0 \\\\ -1 & 4 & 1 \\end{bmatrix}"}</MBlock>
                <p className="text-slate-400 text-xs">
                  <M>{"l_{ij}"}</M>는 Gauss 소거의 배수(factor)입니다
                </p>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
                <p className="text-violet-400 font-bold">U (Upper triangular)</p>
                <MBlock>{"U = \\begin{bmatrix} 2 & 1 & -1 \\\\ 0 & 0.5 & 0.5 \\\\ 0 & 0 & 1 \\end{bmatrix}"}</MBlock>
                <p className="text-slate-400 text-xs">
                  Gauss 소거 완료 후의 상삼각 행렬
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Condition Number */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">조건수 (Condition Number)</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <MBlock>{"\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\|"}</MBlock>
              <p className="text-slate-400 text-xs leading-relaxed">
                조건수가 크면 (<M>{"\\kappa \\gg 1"}</M>) 입력의 작은 변화가 해에 큰 변화를 야기합니다.
                이를 <span className="text-rose-400">ill-conditioned</span> 시스템이라 합니다.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { range: "κ ≈ 1", status: "Well-conditioned", color: "emerald" },
                { range: "κ ~ 10²-10⁴", status: "Moderate", color: "amber" },
                { range: "κ > 10⁶", status: "Ill-conditioned", color: "rose" },
              ].map((c) => (
                <div key={c.range} className={`rounded-xl p-3 border font-mono text-xs bg-${c.color}-500/10 border-${c.color}-500/30`}>
                  <span className={`text-${c.color}-400 font-bold`}>{c.range}</span>
                  <span className="text-slate-400 ml-3">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* MATLAB */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-violet-400">MATLAB LU Decomposition</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`A = [2 1 -1; -3 -1 2; -2 1 2];
b = [8; -11; -3];

% Built-in LU decomposition with pivoting
[L, U, P] = lu(A);

% Solve: PAx = Pb => LUx = Pb
y = L \\ (P * b);    % Forward substitution
x = U \\ y;          % Back substitution

fprintf('Solution: x = [%g, %g, %g]\\n', x);
fprintf('Condition number: %.2f\\n', cond(A));

% For multiple right-hand sides:
b2 = [1; 0; 0];
y2 = L \\ (P * b2);
x2 = U \\ y2;   % No need to re-factor!`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
