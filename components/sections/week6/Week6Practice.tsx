"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

function Problem({ title, question, children }: { title: string; question: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-5 space-y-3">
        <p className="text-indigo-400 font-bold font-mono text-sm">{title}</p>
        <div className="text-slate-300 font-mono text-xs leading-relaxed">{question}</div>
      </div>
      <button onClick={() => setOpen(!open)} className="w-full px-5 py-2.5 text-xs font-mono bg-slate-900 border-t border-slate-800 text-slate-400 hover:text-indigo-400 transition">
        {open ? "풀이 숨기기 ▲" : "풀이 보기 ▼"}
      </button>
      {open && <div className="px-5 pb-5 pt-3 border-t border-slate-800 space-y-3 font-mono text-xs text-slate-300">{children}</div>}
    </div>
  );
}

export default function Week6Practice() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Practice</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">연습 문제</h2>
        </motion.div>

        <div className="space-y-6">
          <Problem
            title="문제 1: Gauss Elimination"
            question={
              <div>
                <p>다음 연립방정식을 가우스 소거법으로 푸시오.</p>
                <MBlock>{"\\begin{cases} x + y + z = 6 \\\\ 2x + 3y + z = 14 \\\\ x + y + 3z = 12 \\end{cases}"}</MBlock>
              </div>
            }
          >
            <p className="text-slate-400">증대 행렬:</p>
            <MBlock>{"\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 2 & 3 & 1 & 14 \\\\ 1 & 1 & 3 & 12 \\end{array}\\right]"}</MBlock>
            <p className="text-slate-400">R2 ← R2 - 2R1, R3 ← R3 - R1:</p>
            <MBlock>{"\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & 1 & -1 & 2 \\\\ 0 & 0 & 2 & 6 \\end{array}\\right]"}</MBlock>
            <p className="text-slate-400">후진 대입:</p>
            <p><M>{"z = 3,\\; y = 2 + z = 5 \\to y = 5"}</M>... 아, <M>{"y = 2 + (-1)(3)/1"}</M>를 다시 계산하면:</p>
            <p><M>{"z = 3,\\; y = 2 + z = 2 + 3 = 5"}</M>... 잠깐, <M>{"y - z = 2"}</M>이므로 <M>{"y = 5"}</M></p>
            <p><M>{"x = 6 - y - z = 6 - 5 - 3 = -2"}</M></p>
            <p>검산: <M>{"2(-2) + 3(5) + 3 = -4 + 15 + 3 = 14"}</M> ✓</p>
            <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <M>{"\\mathbf{x} = (-2,\\; 5,\\; 3)^T"}</M>
            </div>
          </Problem>

          <Problem
            title="문제 2: 피벗팅 필요 판별"
            question={
              <div>
                <p>다음 행렬에서 Naive Gauss Elimination이 실패하는 이유를 설명하고, 부분 피벗팅을 적용하시오.</p>
                <MBlock>{"A = \\begin{bmatrix} 0 & 2 & 1 \\\\ 3 & 1 & 1 \\\\ 1 & 1 & 3 \\end{bmatrix}"}</MBlock>
              </div>
            }
          >
            <p className="text-slate-400"><M>{"a_{11} = 0"}</M>이므로 첫 번째 피벗이 0 → 나눗셈 불가!</p>
            <p className="text-slate-400">부분 피벗팅: 1열에서 절댓값 최대인 행 2 (<M>{"|a_{21}| = 3"}</M>)와 행 1을 교환</p>
            <MBlock>{"\\begin{bmatrix} 3 & 1 & 1 \\\\ 0 & 2 & 1 \\\\ 1 & 1 & 3 \\end{bmatrix}"}</MBlock>
            <p className="text-slate-400">이제 피벗 = 3으로 안전하게 소거를 진행할 수 있습니다.</p>
          </Problem>

          <Problem
            title="문제 3: LU 분해"
            question={
              <div>
                <p>다음 행렬의 LU 분해를 수행하시오.</p>
                <MBlock>{"A = \\begin{bmatrix} 4 & 3 \\\\ 6 & 3 \\end{bmatrix}"}</MBlock>
              </div>
            }
          >
            <p className="text-slate-400">Gauss 소거: <M>{"f_{21} = 6/4 = 1.5"}</M></p>
            <p className="text-slate-400">R2 ← R2 - 1.5·R1: <M>{"[6,3] - 1.5[4,3] = [0, -1.5]"}</M></p>
            <MBlock>{"L = \\begin{bmatrix} 1 & 0 \\\\ 1.5 & 1 \\end{bmatrix}, \\quad U = \\begin{bmatrix} 4 & 3 \\\\ 0 & -1.5 \\end{bmatrix}"}</MBlock>
            <p className="text-slate-400">검산: <M>{"LU = \\begin{bmatrix} 4 & 3 \\\\ 6 & 3 \\end{bmatrix} = A"}</M> ✓</p>
          </Problem>
        </div>
      </div>
    </section>
  );
}
