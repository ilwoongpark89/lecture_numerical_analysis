"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

function Problem({ title, question, children }: { title: string; question: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-5 space-y-3">
        <p className="text-sky-400 font-bold font-mono text-sm">{title}</p>
        <div className="text-slate-300 font-mono text-xs leading-relaxed">{question}</div>
      </div>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-2.5 text-xs font-mono bg-slate-900 border-t border-slate-800 text-slate-400 hover:text-sky-400 transition">
        {open ? "풀이 숨기기 ▲" : "풀이 보기 ▼"}
      </button>
      {open && <div className="px-5 pb-5 pt-3 border-t border-slate-800 space-y-3 font-mono text-xs text-slate-300">{children}</div>}
    </div>
  );
}

export default function Week7Practice() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">Practice</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">연습 문제</h2>
        </motion.div>

        <div className="space-y-6">
          <Problem
            title="문제 1: 대각 우세 판별"
            question={
              <div>
                <p>다음 행렬이 대각 우세인지 판별하시오.</p>
                <MBlock>{"A = \\begin{bmatrix} 5 & -2 & 1 \\\\ 1 & 6 & -2 \\\\ 3 & -1 & 7 \\end{bmatrix}"}</MBlock>
              </div>
            }
          >
            <p className="text-slate-400">각 행에 대해 검사:</p>
            <p>Row 1: |5| = 5 &gt; |-2| + |1| = 3 ✓</p>
            <p>Row 2: |6| = 6 &gt; |1| + |-2| = 3 ✓</p>
            <p>Row 3: |7| = 7 &gt; |3| + |-1| = 4 ✓</p>
            <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              모든 행이 조건을 만족하므로 <strong>엄격한 대각 우세</strong>입니다. Jacobi, Gauss-Seidel 모두 수렴 보장!
            </div>
          </Problem>

          <Problem
            title="문제 2: Jacobi 3회 반복"
            question={
              <div>
                <p>초기값 <M>{"\\mathbf{x}^{(0)} = (0, 0, 0)^T"}</M>로 Jacobi 법 3회 반복을 수행하시오.</p>
                <MBlock>{"\\begin{cases} 3x_1 - x_2 = 5 \\\\ -x_1 + 4x_2 = 7 \\end{cases}"}</MBlock>
              </div>
            }
          >
            <p className="text-slate-400">공식: <M>{"x_1^{(k+1)} = (5 + x_2^{(k)})/3, \\; x_2^{(k+1)} = (7 + x_1^{(k)})/4"}</M></p>
            <p>k=0: <M>{"x^{(0)} = (0, 0)"}</M></p>
            <p>k=1: <M>{"x_1 = (5+0)/3 = 1.667, \\; x_2 = (7+0)/4 = 1.750"}</M></p>
            <p>k=2: <M>{"x_1 = (5+1.750)/3 = 2.250, \\; x_2 = (7+1.667)/4 = 2.167"}</M></p>
            <p>k=3: <M>{"x_1 = (5+2.167)/3 = 2.389, \\; x_2 = (7+2.250)/4 = 2.313"}</M></p>
            <div className="mt-2 p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              정확한 해 <M>{"(27/11, 26/11) \\approx (2.455, 2.364)"}</M>에 수렴 중
            </div>
          </Problem>

          <Problem
            title="문제 3: Jacobi vs Gauss-Seidel"
            question={
              <div>
                <p>위와 동일한 시스템에서 Gauss-Seidel 3회 반복을 수행하고 Jacobi와 비교하시오.</p>
              </div>
            }
          >
            <p className="text-slate-400">Gauss-Seidel: 갱신된 값을 즉시 사용</p>
            <p>k=1: <M>{"x_1 = (5+0)/3 = 1.667, \\; x_2 = (7+1.667)/4 = 2.167"}</M> (x₁의 새 값 사용!)</p>
            <p>k=2: <M>{"x_1 = (5+2.167)/3 = 2.389, \\; x_2 = (7+2.389)/4 = 2.347"}</M></p>
            <p>k=3: <M>{"x_1 = (5+2.347)/3 = 2.449, \\; x_2 = (7+2.449)/4 = 2.362"}</M></p>
            <div className="mt-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              3회 반복 후 Gauss-Seidel (2.449, 2.362)이 Jacobi (2.389, 2.313)보다 정확한 해 (2.455, 2.364)에 더 가깝습니다!
            </div>
          </Problem>
        </div>
      </div>
    </section>
  );
}
