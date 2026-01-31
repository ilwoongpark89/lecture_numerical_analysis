"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

/* ------------------------------------------------------------------ */
/*  Step data types                                                    */
/* ------------------------------------------------------------------ */
type CellStyle = "normal" | "pivot" | "eliminated" | "changed" | "zero" | "result";

interface StepData {
  phase: "init" | "forward" | "back";
  title: string;
  matrix: number[][];
  styles: CellStyle[][];         // per-cell highlight
  explanation: React.ReactNode;  // right-side detailed description
  formula?: React.ReactNode;     // formula card
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function _REMOVED(): StepData[] {
  // dead code marker
  const norm = (): CellStyle[][] => Array.from({ length: 3 }, () => Array(4).fill("normal"));

  // ---- Step 0: original ----
  steps.push({
    phase: "init",
    title: "Step 0 — 증대 행렬 구성",
    matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]],
    styles: norm(),
    explanation: (
      <div className="space-y-3 text-xs text-slate-300 font-mono">
        <p>연립방정식을 <span className="text-indigo-400">증대 행렬(augmented matrix)</span> <M>{"[A|\\mathbf{b}]"}</M>로 표현합니다.</p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
          <MBlock>{"\\begin{cases} 2x_1 + x_2 - x_3 = 8 \\\\ -3x_1 - x_2 + 2x_3 = -11 \\\\ -2x_1 + x_2 + 2x_3 = -3 \\end{cases}"}</MBlock>
        </div>
        <p>왼쪽 3열은 계수 행렬 <M>{"A"}</M>, 오른쪽 1열은 우변 벡터 <M>{"\\mathbf{b}"}</M>입니다.</p>
        <p>목표: <span className="text-indigo-400">전진 소거</span>로 아래 삼각 부분을 모두 0으로 만듭니다.</p>
      </div>
    ),
  });

  // ---- Step 1: identify pivot (0,0) ----
  const s1 = norm();
  s1[0][0] = "pivot";
  s1[1][0] = "eliminated";
  s1[2][0] = "eliminated";
  steps.push({
    phase: "forward",
    title: "Step 1 — 1열 피벗 선택",
    matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]],
    styles: s1,
    explanation: (
      <div className="space-y-3 text-xs text-slate-300 font-mono">
        <p><span className="text-amber-400">피벗(pivot)</span>: <M>{"a_{11} = 2"}</M> (1행 1열)</p>
        <p>피벗 아래의 원소들을 0으로 만들어야 합니다:</p>
        <ul className="space-y-1 text-slate-400">
          <li><span className="text-rose-400">&#x25CF;</span> <M>{"a_{21} = -3"}</M> &rarr; 0으로</li>
          <li><span className="text-rose-400">&#x25CF;</span> <M>{"a_{31} = -2"}</M> &rarr; 0으로</li>
        </ul>
        <p>각 행에 대해 <span className="text-indigo-400">배수(factor)</span>를 계산하여 피벗 행을 빼줍니다.</p>
      </div>
    ),
    formula: (
      <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 text-xs">
        <p className="text-slate-500 uppercase tracking-wider mb-2">소거 원리</p>
        <MBlock>{"\\text{factor} = \\frac{a_{i1}}{a_{11}} \\quad \\Rightarrow \\quad R_i \\leftarrow R_i - \\text{factor} \\times R_1"}</MBlock>
      </div>
    ),
  });

  // ---- Step 2: eliminate R2 ----
  const m2 = [[2,1,-1,8],[0,0.5,0.5,-1],[-2,1,2,-3]];
  const s2 = norm();
  s2[0][0] = "pivot";
  s2[1] = ["zero","changed","changed","changed"];
  steps.push({
    phase: "forward",
    title: "Step 2 — R2 소거",
    matrix: m2,
    styles: s2,
    explanation: (
      <div className="space-y-3 text-xs text-slate-300 font-mono">
        <p><span className="text-indigo-400">factor</span> = <M>{"\\frac{a_{21}}{a_{11}} = \\frac{-3}{2} = -1.5"}</M></p>
        <p>행 연산: <span className="text-sky-400">R2 &larr; R2 &minus; (&minus;1.5) &times; R1</span></p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1">
          <p className="text-slate-400">R2 = [&minus;3, &minus;1, 2, &minus;11] &minus; (&minus;1.5) &times; [2, 1, &minus;1, 8]</p>
          <p className="text-slate-400">R2 = [&minus;3, &minus;1, 2, &minus;11] + [3, 1.5, &minus;1.5, 12]</p>
          <p className="text-emerald-400">R2 = [<strong>0</strong>, 0.5, 0.5, &minus;1] (변경됨)</p>
        </div>
        <p><M>{"a_{21}"}</M>이 <span className="text-emerald-400">0</span>이 되었습니다!</p>
      </div>
    ),
    formula: (
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 text-xs font-mono">
        <MBlock>{"R_2 \\leftarrow R_2 - \\left(\\frac{-3}{2}\\right) R_1 = R_2 + 1.5\\, R_1"}</MBlock>
      </div>
    ),
  });

  // ---- Step 3: eliminate R3 ----
  const m3 = [[2,1,-1,8],[0,0.5,0.5,-1],[0,2,1,5]];
  const s3 = norm();
  s3[0][0] = "pivot";
  s3[1][0] = "zero";
  s3[2] = ["zero","changed","changed","changed"];
  steps.push({
    phase: "forward",
    title: "Step 3 — R3 소거 (1열 완료)",
    matrix: m3,
    styles: s3,
    explanation: (
      <div className="space-y-3 text-xs text-slate-300 font-mono">
        <p><span className="text-indigo-400">factor</span> = <M>{"\\frac{a_{31}}{a_{11}} = \\frac{-2}{2} = -1"}</M></p>
        <p>행 연산: <span className="text-sky-400">R3 &larr; R3 &minus; (&minus;1) &times; R1</span></p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1">
          <p className="text-slate-400">R3 = [&minus;2, 1, 2, &minus;3] &minus; (&minus;1) &times; [2, 1, &minus;1, 8]</p>
          <p className="text-slate-400">R3 = [&minus;2, 1, 2, &minus;3] + [2, 1, &minus;1, 8]</p>
          <p className="text-emerald-400">R3 = [<strong>0</strong>, 2, 1, 5] (변경됨)</p>
        </div>
        <p>1열 소거 완료! 이제 2열로 진행합니다.</p>
      </div>
    ),
    formula: (
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 text-xs font-mono">
        <MBlock>{"R_3 \\leftarrow R_3 - \\left(\\frac{-2}{2}\\right) R_1 = R_3 + 1\\, R_1"}</MBlock>
      </div>
    ),
  });

  // ---- Step 4: identify pivot (1,1) ----
  const s4 = norm();
  s4[0][0] = "zero"; // conceptually done
  s4[1][0] = "zero";
  s4[2][0] = "zero";
  s4[1][1] = "pivot";
  s4[2][1] = "eliminated";
  steps.push({
    phase: "forward",
    title: "Step 4 — 2열 피벗 선택",
    matrix: m3,
    styles: s4,
    explanation: (
      <div className="space-y-3 text-xs text-slate-300 font-mono">
        <p>다음 <span className="text-amber-400">피벗</span>: <M>{"a_{22} = 0.5"}</M> (2행 2열)</p>
        <p>피벗 아래에 소거할 원소:</p>
        <ul className="space-y-1 text-slate-400">
          <li><span className="text-rose-400">&#x25CF;</span> <M>{"a_{32} = 2"}</M> &rarr; 0으로</li>
        </ul>
        <p>3&times;3 행렬이므로 이것이 마지막 소거 단계입니다.</p>
      </div>
    ),
    formula: (
      <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 text-xs">
        <MBlock>{"\\text{factor} = \\frac{a_{32}}{a_{22}} = \\frac{2}{0.5} = 4"}</MBlock>
      </div>
    ),
  });

  // ---- Step 5: eliminate R3 col 2 ----
  const m5 = [[2,1,-1,8],[0,0.5,0.5,-1],[0,0,-1,9]];
  const s5 = norm();
  s5[1][0] = "zero";
  s5[2][0] = "zero";
  s5[1][1] = "pivot";
  s5[2] = ["zero","zero","changed","changed"];
  steps.push({
    phase: "forward",
    title: "Step 5 — R3 소거 (상삼각 완성!)",
    matrix: m5,
    styles: s5,
    explanation: (
      <div className="space-y-3 text-xs text-slate-300 font-mono">
        <p><span className="text-indigo-400">factor</span> = <M>{"\\frac{2}{0.5} = 4"}</M></p>
        <p>행 연산: <span className="text-sky-400">R3 &larr; R3 &minus; 4 &times; R2</span></p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1">
          <p className="text-slate-400">R3 = [0, 2, 1, 5] &minus; 4 &times; [0, 0.5, 0.5, &minus;1]</p>
          <p className="text-slate-400">R3 = [0, 2, 1, 5] &minus; [0, 2, 2, &minus;4]</p>
          <p className="text-emerald-400">R3 = [0, <strong>0</strong>, &minus;1, 9] (변경됨)</p>
        </div>
        <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          전진 소거 완료! 상삼각 행렬(Upper Triangular)이 되었습니다.
        </div>
      </div>
    ),
    formula: (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs font-mono">
        <MBlock>{"R_3 \\leftarrow R_3 - 4\\, R_2"}</MBlock>
      </div>
    ),
  });

  // ---- Step 6: back sub x3 ----
  const s6 = norm();
  s6[1][0] = "zero"; s6[2][0] = "zero"; s6[2][1] = "zero";
  s6[2][2] = "pivot"; s6[2][3] = "pivot";
  steps.push({
    phase: "back",
    title: "Step 6 — 후진 대입: x₃ 계산",
    matrix: m5,
    styles: s6,
    explanation: (
      <div className="space-y-3 text-xs text-slate-300 font-mono">
        <p>상삼각 행렬의 <span className="text-violet-400">마지막 행</span>부터 역순으로 미지수를 구합니다.</p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2">
          <p className="text-slate-500">3행: <M>{"-1 \\cdot x_3 = 9"}</M></p>
          <MBlock>{"x_3 = \\frac{9}{-1} = -9"}</MBlock>
        </div>
        <p className="text-slate-400">아... 잠깐, 위 행렬에서 실제로 다시 계산해보면:</p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
          <MBlock>{"x_3 = \\frac{9}{-1} = -9"}</MBlock>
        </div>
        <p>계산 확인: 실제 원래 시스템에서 <M>{"x = (2, 3, -1)"}</M>이 답입니다. 행렬 값을 다시 확인합시다.</p>
      </div>
    ),
  });

  // Let me recalculate properly...
  // Actually let me redo the elimination properly.
  // Original: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]]
  // R2 = R2 - (-3/2)R1 = [-3,-1,2,-11] - (-1.5)[2,1,-1,8] = [-3,-1,2,-11]+[3,1.5,-1.5,12] = [0,0.5,0.5,1]
  // R3 = R3 - (-1)R1 = [-2,1,2,-3] - (-1)[2,1,-1,8] = [-2,1,2,-3]+[2,1,-1,8] = [0,2,1,5]
  // R3 = R3 - (2/0.5)R2 = [0,2,1,5] - 4[0,0.5,0.5,1] = [0,2,1,5]-[0,2,2,4] = [0,0,-1,1]
  // Back sub: x3 = 1/(-1) = -1. x2 = (1 - 0.5*(-1))/0.5 = 1.5/0.5 = 3. x1 = (8 - 1*3 -(-1)(-1))/2 = (8-3-1)/2 = 2.
  // So the b column for R2 step should be 1, not -1!

  // I need to redo this properly. Let me just rewrite with correct values.
  return []; // placeholder
}

/* ------------------------------------------------------------------ */
/*  Correct step builder                                               */
/* ------------------------------------------------------------------ */

const cellColors: Record<CellStyle, string> = {
  normal: "bg-slate-800/50 text-slate-300",
  pivot: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40",
  eliminated: "bg-rose-500/15 text-rose-400",
  changed: "bg-sky-500/15 text-sky-300",
  zero: "bg-emerald-500/10 text-emerald-400",
  result: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/40",
};

function MatrixGrid({ matrix, styles, labels }: { matrix: number[][]; styles: CellStyle[][]; labels?: string[] }) {
  return (
    <div className="inline-block">
      {/* Column labels */}
      <div className="flex mb-1 ml-10">
        {(labels || ["x₁", "x₂", "x₃", "b"]).map((l, j) => (
          <div key={j} className={`w-16 text-center text-[10px] font-mono ${j === 3 ? "text-slate-600 ml-2" : "text-slate-600"}`}>{l}</div>
        ))}
      </div>
      {matrix.map((row, i) => (
        <div key={i} className="flex items-center gap-0 mb-1">
          <span className="w-10 text-[10px] text-slate-600 font-mono text-right pr-2">R{i + 1}</span>
          {row.map((v, j) => (
            <React.Fragment key={j}>
              {j === 3 && <div className="w-[2px] h-8 bg-slate-700 mx-1" />}
              <div className={`w-16 h-8 flex items-center justify-center rounded font-mono text-xs transition-all duration-300 ${cellColors[styles[i][j]]}`}>
                {Number.isInteger(v) ? v : v.toFixed(2)}
              </div>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Properly computed steps                                            */
/* ------------------------------------------------------------------ */
function getAllSteps(): StepData[] {
  const n = (): CellStyle[][] => Array.from({ length: 3 }, () => Array(4).fill("normal") as CellStyle[]);

  const steps: StepData[] = [];

  // ===== STEP 0: Original =====
  steps.push({
    phase: "init",
    title: "Step 0 — 증대 행렬 [A|b] 구성",
    matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]],
    styles: n(),
    explanation: (
      <div className="space-y-3">
        <p>연립방정식을 <span className="text-indigo-400 font-bold">증대 행렬</span>로 표현합니다.</p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
          <MBlock>{"\\left[\\begin{array}{ccc|c} 2 & 1 & -1 & 8 \\\\ -3 & -1 & 2 & -11 \\\\ -2 & 1 & 2 & -3 \\end{array}\\right]"}</MBlock>
        </div>
        <p>세로 선 왼쪽 = 계수 행렬 <M>{"A"}</M>, 오른쪽 = 우변 <M>{"\\mathbf{b}"}</M></p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 rounded bg-slate-800 text-[10px]">목표: 아래 삼각 부분을 모두 0으로!</span>
        </div>
      </div>
    ),
  });

  // ===== STEP 1: Identify pivot col 1 =====
  const s1 = n();
  s1[0][0] = "pivot";
  s1[1][0] = "eliminated";
  s1[2][0] = "eliminated";
  steps.push({
    phase: "forward",
    title: "Step 1 — 피벗 선택 & 목표 확인",
    matrix: [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]],
    styles: s1,
    explanation: (
      <div className="space-y-3">
        <div className="flex gap-3 flex-wrap">
          <span className={`px-2 py-1 rounded text-[10px] ${cellColors.pivot}`}>피벗 = a₁₁ = 2</span>
          <span className={`px-2 py-1 rounded text-[10px] ${cellColors.eliminated}`}>소거 대상</span>
        </div>
        <p>피벗 <M>{"a_{11} = 2"}</M>를 기준으로, 그 아래 원소를 0으로 만듭니다.</p>
        <p>소거할 원소: <M>{"a_{21} = -3"}</M>, <M>{"a_{31} = -2"}</M></p>
        <p>방법: 각 행에서 &ldquo;피벗 행 &times; 적절한 배수&rdquo;를 빼줍니다.</p>
      </div>
    ),
    formula: (
      <MBlock>{"\\text{factor}_{i1} = \\frac{a_{i1}}{a_{11}}, \\quad R_i \\leftarrow R_i - \\text{factor}_{i1} \\times R_1"}</MBlock>
    ),
  });

  // ===== STEP 2: Eliminate R2, col 1 =====
  // f = -3/2 = -1.5
  // R2_new = [-3,-1,2,-11] - (-1.5)*[2,1,-1,8] = [-3+3, -1+1.5, 2-(-1.5), -11+12] = [0, 0.5, 0.5, 1]
  // Wait: -(-1.5)*(-1) = -1.5, so 2 + (-1.5) = 0.5. And -(-1.5)*8 = 12, -11+12 = 1.
  const s2 = n();
  s2[0][0] = "pivot";
  s2[1] = ["zero","changed","changed","changed"];
  steps.push({
    phase: "forward",
    title: "Step 2 — R2 소거 (1열)",
    matrix: [[2,1,-1,8],[0,0.5,0.5,1],[-2,1,2,-3]],
    styles: s2,
    explanation: (
      <div className="space-y-3">
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
          <MBlock>{"\\text{factor}_{21} = \\frac{-3}{2} = -1.5"}</MBlock>
        </div>
        <p><span className="text-sky-400 font-bold">R2 &larr; R2 &minus; (&minus;1.5) &times; R1</span></p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1 text-[11px]">
          <p className="text-slate-500">원래 R2: [&minus;3, &minus;1, 2, &minus;11]</p>
          <p className="text-slate-500">&minus;(&minus;1.5) &times; R1: +[3, 1.5, &minus;1.5, 12]</p>
          <p className="text-sky-400 font-bold">새 R2: [0, 0.5, 0.5, 1]</p>
        </div>
        <p><M>{"a_{21} = -3"}</M> &rarr; <span className="text-emerald-400 font-bold">0</span> 소거 성공!</p>
      </div>
    ),
    formula: (
      <MBlock>{"R_2 \\leftarrow R_2 + 1.5\\, R_1"}</MBlock>
    ),
  });

  // ===== STEP 3: Eliminate R3, col 1 =====
  // f = -2/2 = -1
  // R3_new = [-2,1,2,-3] - (-1)*[2,1,-1,8] = [-2+2, 1+1, 2+(-1), -3+8] = [0,2,1,5]
  // Wait: -(-1)*(-1) = -1, so 2 + (-1) = 1. And -(-1)*8=8, -3+8=5. Correct!
  const s3 = n();
  s3[0][0] = "pivot";
  s3[1][0] = "zero";
  s3[2] = ["zero","changed","changed","changed"];
  steps.push({
    phase: "forward",
    title: "Step 3 — R3 소거 (1열 완료!)",
    matrix: [[2,1,-1,8],[0,0.5,0.5,1],[0,2,1,5]],
    styles: s3,
    explanation: (
      <div className="space-y-3">
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
          <MBlock>{"\\text{factor}_{31} = \\frac{-2}{2} = -1"}</MBlock>
        </div>
        <p><span className="text-sky-400 font-bold">R3 &larr; R3 &minus; (&minus;1) &times; R1</span></p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1 text-[11px]">
          <p className="text-slate-500">원래 R3: [&minus;2, 1, 2, &minus;3]</p>
          <p className="text-slate-500">&minus;(&minus;1) &times; R1: +[2, 1, &minus;1, 8]</p>
          <p className="text-sky-400 font-bold">새 R3: [0, 2, 1, 5]</p>
        </div>
        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px]">
          1열 소거 완료! 다음은 2열입니다.
        </div>
      </div>
    ),
    formula: (
      <MBlock>{"R_3 \\leftarrow R_3 + 1\\, R_1"}</MBlock>
    ),
  });

  // ===== STEP 4: Pivot col 2 =====
  const s4 = n();
  s4[1][0] = "zero"; s4[2][0] = "zero";
  s4[1][1] = "pivot";
  s4[2][1] = "eliminated";
  steps.push({
    phase: "forward",
    title: "Step 4 — 2열 피벗 선택",
    matrix: [[2,1,-1,8],[0,0.5,0.5,1],[0,2,1,5]],
    styles: s4,
    explanation: (
      <div className="space-y-3">
        <div className="flex gap-3 flex-wrap">
          <span className={`px-2 py-1 rounded text-[10px] ${cellColors.pivot}`}>피벗 = a₂₂ = 0.5</span>
          <span className={`px-2 py-1 rounded text-[10px] ${cellColors.eliminated}`}>소거 대상</span>
        </div>
        <p>새 피벗: <M>{"a_{22} = 0.5"}</M></p>
        <p>소거 대상: <M>{"a_{32} = 2"}</M></p>
        <p>3&times;3 행렬이므로 이것이 <span className="text-indigo-400 font-bold">마지막 소거 단계</span>입니다.</p>
      </div>
    ),
    formula: (
      <MBlock>{"\\text{factor}_{32} = \\frac{a_{32}}{a_{22}} = \\frac{2}{0.5} = 4"}</MBlock>
    ),
  });

  // ===== STEP 5: Eliminate R3, col 2 =====
  // R3 = [0,2,1,5] - 4*[0,0.5,0.5,1] = [0, 2-2, 1-2, 5-4] = [0, 0, -1, 1]
  const s5 = n();
  s5[1][0] = "zero"; s5[2][0] = "zero";
  s5[1][1] = "pivot";
  s5[2] = ["zero","zero","changed","changed"];
  steps.push({
    phase: "forward",
    title: "Step 5 — R3 소거 (상삼각 행렬 완성!)",
    matrix: [[2,1,-1,8],[0,0.5,0.5,1],[0,0,-1,1]],
    styles: s5,
    explanation: (
      <div className="space-y-3">
        <p><span className="text-sky-400 font-bold">R3 &larr; R3 &minus; 4 &times; R2</span></p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1 text-[11px]">
          <p className="text-slate-500">원래 R3: [0, 2, 1, 5]</p>
          <p className="text-slate-500">4 &times; R2: [0, 2, 2, 4]</p>
          <p className="text-sky-400 font-bold">새 R3: [0, 0, &minus;1, 1]</p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <p className="font-bold">전진 소거 완료!</p>
          <p className="text-[11px] mt-1">행렬이 상삼각 형태가 되었습니다. 이제 후진 대입으로 해를 구합니다.</p>
        </div>
      </div>
    ),
    formula: (
      <MBlock>{"R_3 \\leftarrow R_3 - 4\\, R_2"}</MBlock>
    ),
  });

  // ===== STEP 6: Back sub x3 =====
  const s6 = n();
  s6[1][0] = "zero"; s6[2][0] = "zero"; s6[2][1] = "zero";
  s6[2][2] = "result"; s6[2][3] = "result";
  steps.push({
    phase: "back",
    title: "Step 6 — 후진 대입: x₃ 구하기",
    matrix: [[2,1,-1,8],[0,0.5,0.5,1],[0,0,-1,1]],
    styles: s6,
    explanation: (
      <div className="space-y-3">
        <p><span className="text-violet-400 font-bold">마지막 행</span>에서 시작합니다.</p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2">
          <p className="text-slate-500 text-[11px]">3행: <M>{"-1 \\cdot x_3 = 1"}</M></p>
          <MBlock>{"x_3 = \\frac{1}{-1} = \\boxed{-1}"}</MBlock>
        </div>
        <p>미지수가 <M>{"x_3"}</M> 하나뿐이므로 바로 구할 수 있습니다.</p>
      </div>
    ),
    formula: (
      <MBlock>{"x_n = \\frac{b_n}{a_{nn}}"}</MBlock>
    ),
  });

  // ===== STEP 7: Back sub x2 =====
  const s7 = n();
  s7[1][0] = "zero"; s7[2][0] = "zero"; s7[2][1] = "zero";
  s7[1][1] = "result"; s7[1][2] = "result"; s7[1][3] = "result";
  steps.push({
    phase: "back",
    title: "Step 7 — 후진 대입: x₂ 구하기",
    matrix: [[2,1,-1,8],[0,0.5,0.5,1],[0,0,-1,1]],
    styles: s7,
    explanation: (
      <div className="space-y-3">
        <p><span className="text-violet-400 font-bold">2행</span>에 이미 구한 <M>{"x_3 = -1"}</M>을 대입합니다.</p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2">
          <p className="text-slate-500 text-[11px]">2행: <M>{"0.5\\, x_2 + 0.5\\, x_3 = 1"}</M></p>
          <p className="text-slate-400 text-[11px]"><M>{"0.5\\, x_2 + 0.5 \\times (-1) = 1"}</M></p>
          <p className="text-slate-400 text-[11px]"><M>{"0.5\\, x_2 = 1 + 0.5 = 1.5"}</M></p>
          <MBlock>{"x_2 = \\frac{1.5}{0.5} = \\boxed{3}"}</MBlock>
        </div>
      </div>
    ),
    formula: (
      <MBlock>{"x_i = \\frac{b_i - \\sum_{j=i+1}^{n} a_{ij}\\, x_j}{a_{ii}}"}</MBlock>
    ),
  });

  // ===== STEP 8: Back sub x1 =====
  const s8 = n();
  s8[1][0] = "zero"; s8[2][0] = "zero"; s8[2][1] = "zero";
  s8[0] = ["result","result","result","result"];
  steps.push({
    phase: "back",
    title: "Step 8 — 후진 대입: x₁ 구하기",
    matrix: [[2,1,-1,8],[0,0.5,0.5,1],[0,0,-1,1]],
    styles: s8,
    explanation: (
      <div className="space-y-3">
        <p><span className="text-violet-400 font-bold">1행</span>에 <M>{"x_2 = 3,\\; x_3 = -1"}</M>을 대입합니다.</p>
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2">
          <p className="text-slate-500 text-[11px]">1행: <M>{"2x_1 + x_2 - x_3 = 8"}</M></p>
          <p className="text-slate-400 text-[11px]"><M>{"2x_1 + 3 - (-1) = 8"}</M></p>
          <p className="text-slate-400 text-[11px]"><M>{"2x_1 = 8 - 3 - 1 = 4"}</M></p>
          <MBlock>{"x_1 = \\frac{4}{2} = \\boxed{2}"}</MBlock>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <p className="font-bold text-sm">풀이 완료!</p>
          <MBlock>{"\\mathbf{x} = \\begin{pmatrix} 2 \\\\ 3 \\\\ -1 \\end{pmatrix}"}</MBlock>
        </div>
      </div>
    ),
  });

  return steps;
}

const allSteps = getAllSteps();

/* ------------------------------------------------------------------ */
/*  Phase badge                                                        */
/* ------------------------------------------------------------------ */
function PhaseBadge({ phase }: { phase: StepData["phase"] }) {
  const map = {
    init: { label: "준비", color: "bg-slate-700 text-slate-300" },
    forward: { label: "전진 소거", color: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" },
    back: { label: "후진 대입", color: "bg-violet-500/20 text-violet-400 border border-violet-500/30" },
  };
  const { label, color } = map[phase];
  return <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold ${color}`}>{label}</span>;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function GaussElimination() {
  const [step, setStep] = useState(0);
  const current = allSteps[step];

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Gauss Elimination</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            전진 소거(Forward Elimination) + 후진 대입(Back Substitution)
          </p>
        </motion.div>

        {/* Algorithm Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">알고리즘 두 단계</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">1</span>
                <p className="text-indigo-400 font-bold">전진 소거 (Forward Elimination)</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                피벗 아래의 원소를 0으로 만들어 <span className="text-indigo-400">상삼각 행렬</span>로 변환
              </p>
              <MBlock>{"\\text{factor} = \\frac{a_{ik}}{a_{kk}}, \\quad R_i \\leftarrow R_i - \\text{factor} \\times R_k"}</MBlock>
              <p className="text-slate-500 text-[10px]">계산량: <M>{"O(n^3/3)"}</M></p>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">2</span>
                <p className="text-violet-400 font-bold">후진 대입 (Back Substitution)</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                마지막 행부터 역순으로 <span className="text-violet-400">미지수를 하나씩</span> 구함
              </p>
              <MBlock>{"x_i = \\frac{b_i - \\sum_{j=i+1}^{n} a_{ij}\\, x_j}{a_{ii}}"}</MBlock>
              <p className="text-slate-500 text-[10px]">계산량: <M>{"O(n^2/2)"}</M></p>
            </div>
          </div>
        </motion.div>

        {/* ===== Interactive Step-by-Step Demo ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-2xl font-bold text-indigo-400">Step-by-Step Demo</h3>
            <PhaseBadge phase={current.phase} />
          </div>

          {/* Title bar */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
            <p className="font-mono text-sm text-white font-bold">{current.title}</p>
            <span className="font-mono text-xs text-slate-500">{step + 1} / {allSteps.length}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Matrix */}
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 flex justify-center overflow-x-auto">
                <MatrixGrid matrix={current.matrix} styles={current.styles} />
              </div>

              {/* Formula */}
              {current.formula && (
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300">
                  {current.formula}
                </div>
              )}

              {/* Legend */}
              <div className="flex flex-wrap gap-2">
                {[
                  { style: "pivot" as CellStyle, label: "피벗" },
                  { style: "eliminated" as CellStyle, label: "소거 대상" },
                  { style: "changed" as CellStyle, label: "변경됨" },
                  { style: "zero" as CellStyle, label: "0 완료" },
                  { style: "result" as CellStyle, label: "후진 대입 사용" },
                ].map(({ style, label }) => (
                  <span key={style} className={`px-2 py-0.5 rounded text-[10px] font-mono ${cellColors[style]}`}>{label}</span>
                ))}
              </div>
            </div>

            {/* Right: Explanation */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[400px]">
              {current.explanation}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setStep(0)}
              disabled={step === 0}
              className="px-3 py-2 rounded-xl font-mono text-xs bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition disabled:opacity-30"
            >
              ⟸ 처음
            </button>
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-4 py-2 rounded-xl font-mono text-sm bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition disabled:opacity-30"
            >
              &larr; Prev
            </button>

            {/* Step dots */}
            <div className="flex gap-1">
              {allSteps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === step
                      ? s.phase === "back" ? "bg-violet-400 scale-125" : "bg-indigo-400 scale-125"
                      : i < step ? "bg-slate-600" : "bg-slate-800"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setStep((s) => Math.min(allSteps.length - 1, s + 1))}
              disabled={step === allSteps.length - 1}
              className="px-4 py-2 rounded-xl font-mono text-sm bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition disabled:opacity-30"
            >
              Next &rarr;
            </button>
            <button
              onClick={() => setStep(allSteps.length - 1)}
              disabled={step === allSteps.length - 1}
              className="px-3 py-2 rounded-xl font-mono text-xs bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition disabled:opacity-30"
            >
              끝 ⟹
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${current.phase === "back" ? "bg-violet-500" : "bg-indigo-500"}`}
              style={{ width: `${((step + 1) / allSteps.length) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* MATLAB */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-violet-400">MATLAB Implementation</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`function x = naive_gauss(A, b)
% NAIVE_GAUSS  Gauss elimination without pivoting
%   x = naive_gauss(A, b)

  n = length(b);
  Aug = [A, b(:)];   % augmented matrix [A|b]

  % Phase 1: Forward Elimination
  for k = 1:n-1           % pivot column
      for i = k+1:n       % rows below pivot
          factor = Aug(i,k) / Aug(k,k);
          Aug(i, k:n+1) = Aug(i, k:n+1) - factor * Aug(k, k:n+1);
      end
  end

  % Phase 2: Back Substitution
  x = zeros(n, 1);
  x(n) = Aug(n, n+1) / Aug(n, n);
  for i = n-1:-1:1
      x(i) = (Aug(i, n+1) - Aug(i, i+1:n) * x(i+1:n)) / Aug(i, i);
  end
end`}</pre>
          </div>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <p className="text-xs text-slate-500 font-mono mb-3">% Usage</p>
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`A = [2 1 -1; -3 -1 2; -2 1 2];
b = [8; -11; -3];
x = naive_gauss(A, b)
% x = [2; 3; -1]

% Or simply:  x = A \\ b;`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
