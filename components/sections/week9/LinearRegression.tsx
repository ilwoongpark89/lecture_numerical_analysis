"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function LinearRegression() {
  const [step, setStep] = useState(0);

  const data = [
    { x: 1, y: 2.1 },
    { x: 2, y: 3.9 },
    { x: 3, y: 6.2 },
    { x: 4, y: 7.8 },
    { x: 5, y: 10.1 },
  ];

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Regression</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">선형 회귀</h2>
          <p className="text-lg text-slate-400">Linear Regression</p>
        </motion.div>

        {/* Linear Regression */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">직선 회귀 (Straight Line)</h3>
          <p className="text-slate-300 leading-relaxed">
            가장 단순한 회귀 모델은 직선 <M>{"y = a_0 + a_1 x"}</M>입니다. 데이터 행렬 <M>{"\\mathbf{X}"}</M>와 관측 벡터 <M>{"\\mathbf{y}"}</M>를 구성합니다.
          </p>
          <MBlock>{"\\mathbf{X} = \\begin{bmatrix} 1 & x_1 \\\\ 1 & x_2 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{bmatrix}, \\quad \\mathbf{y} = \\begin{bmatrix} y_1 \\\\ y_2 \\\\ \\vdots \\\\ y_n \\end{bmatrix}, \\quad \\mathbf{a} = \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix}"}</MBlock>
        </motion.div>

        {/* Polynomial Regression */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">다항 회귀 (Polynomial Regression)</h3>
          <p className="text-slate-300 leading-relaxed">
            <M>{"m"}</M>차 다항식 <M>{"y = a_0 + a_1 x + a_2 x^2 + \\cdots + a_m x^m"}</M>으로 확장하면, <strong className="text-teal-400">Vandermonde 행렬</strong>을 사용합니다:
          </p>
          <MBlock>{"\\mathbf{X} = \\begin{bmatrix} 1 & x_1 & x_1^2 & \\cdots & x_1^m \\\\ 1 & x_2 & x_2^2 & \\cdots & x_2^m \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 1 & x_n & x_n^2 & \\cdots & x_n^m \\end{bmatrix}"}</MBlock>
        </motion.div>

        {/* Normal Equation */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">정규방정식 (Normal Equation)</h3>
          <p className="text-slate-300 leading-relaxed">
            직선이든 다항식이든, 최소자승 해는 동일한 형태의 정규방정식으로 주어집니다:
          </p>
          <div className="bg-slate-950 rounded-xl p-6 border border-emerald-500/30">
            <MBlock>{"\\left( \\mathbf{X}^T \\mathbf{X} \\right) \\mathbf{a} = \\mathbf{X}^T \\mathbf{y}"}</MBlock>
          </div>
          <p className="text-slate-400 text-sm">
            <M>{"\\mathbf{X}^T \\mathbf{X}"}</M>가 정칙(invertible)이면 <M>{"\\mathbf{a} = (\\mathbf{X}^T \\mathbf{X})^{-1} \\mathbf{X}^T \\mathbf{y}"}</M>로 직접 계산할 수 있습니다.
          </p>
        </motion.div>

        {/* Interactive Step-by-Step */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">단계별 계산 예제</h3>
          <p className="text-slate-300">
            데이터: <M>{"\\{(1, 2.1),\\; (2, 3.9),\\; (3, 6.2),\\; (4, 7.8),\\; (5, 10.1)\\}"}</M>에 <M>{"y = a_0 + a_1 x"}</M>를 적합합니다.
          </p>

          <div className="flex flex-wrap gap-2">
            {["데이터 확인", "X 행렬 구성", "X^T X 계산", "X^T y 계산", "연립방정식 풀기"].map((label, i) => (
              <button key={i} onClick={() => setStep(i)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step === i ? "bg-emerald-500/30 text-emerald-400 border border-emerald-500/40" : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"}`}>
                Step {i + 1}: {label}
              </button>
            ))}
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4 min-h-[200px]">
            {step === 0 && (
              <div className="space-y-3">
                <p className="text-emerald-400 font-semibold">Step 1: 데이터 확인</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-center">
                    <thead><tr className="border-b border-slate-700">
                      <th className="py-2 px-4 text-teal-400">i</th>
                      <th className="py-2 px-4 text-teal-400"><M>{"x_i"}</M></th>
                      <th className="py-2 px-4 text-teal-400"><M>{"y_i"}</M></th>
                    </tr></thead>
                    <tbody>
                      {data.map((d, i) => (
                        <tr key={i} className="border-b border-slate-800">
                          <td className="py-2 px-4">{i + 1}</td>
                          <td className="py-2 px-4">{d.x}</td>
                          <td className="py-2 px-4">{d.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-emerald-400 font-semibold">Step 2: X 행렬 구성</p>
                <p className="text-slate-300 text-sm">첫 번째 열은 1 (절편), 두 번째 열은 <M>{"x_i"}</M></p>
                <MBlock>{"\\mathbf{X} = \\begin{bmatrix} 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\\\ 1 & 4 \\\\ 1 & 5 \\end{bmatrix}, \\quad \\mathbf{y} = \\begin{bmatrix} 2.1 \\\\ 3.9 \\\\ 6.2 \\\\ 7.8 \\\\ 10.1 \\end{bmatrix}"}</MBlock>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <p className="text-emerald-400 font-semibold">Step 3: <M>{"\\mathbf{X}^T \\mathbf{X}"}</M> 계산</p>
                <MBlock>{"\\mathbf{X}^T \\mathbf{X} = \\begin{bmatrix} 1&1&1&1&1 \\\\ 1&2&3&4&5 \\end{bmatrix} \\begin{bmatrix} 1&1 \\\\ 1&2 \\\\ 1&3 \\\\ 1&4 \\\\ 1&5 \\end{bmatrix} = \\begin{bmatrix} 5 & 15 \\\\ 15 & 55 \\end{bmatrix}"}</MBlock>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <p className="text-emerald-400 font-semibold">Step 4: <M>{"\\mathbf{X}^T \\mathbf{y}"}</M> 계산</p>
                <MBlock>{"\\mathbf{X}^T \\mathbf{y} = \\begin{bmatrix} 1&1&1&1&1 \\\\ 1&2&3&4&5 \\end{bmatrix} \\begin{bmatrix} 2.1 \\\\ 3.9 \\\\ 6.2 \\\\ 7.8 \\\\ 10.1 \\end{bmatrix} = \\begin{bmatrix} 30.1 \\\\ 109.4 \\end{bmatrix}"}</MBlock>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <p className="text-emerald-400 font-semibold">Step 5: 연립방정식 풀기</p>
                <MBlock>{"\\begin{bmatrix} 5 & 15 \\\\ 15 & 55 \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} 30.1 \\\\ 109.4 \\end{bmatrix}"}</MBlock>
                <MBlock>{"a_1 = \\frac{5 \\times 109.4 - 15 \\times 30.1}{5 \\times 55 - 15^2} = \\frac{95.5}{50} = 1.91"}</MBlock>
                <MBlock>{"a_0 = \\frac{30.1 - 1.91 \\times 15}{5} = 0.29"}</MBlock>
                <p className="text-emerald-400 font-bold text-lg mt-3">
                  결과: <M>{"y = 0.29 + 1.91x"}</M>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
