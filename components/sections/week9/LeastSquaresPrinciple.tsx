"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function LeastSquaresPrinciple() {
  const [showExample, setShowExample] = useState(false);

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Curve Fitting</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">최소자승법 원리</h2>
          <p className="text-lg text-slate-400">Least Squares Principle</p>
        </motion.div>

        {/* Core Idea */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">핵심 아이디어</h3>
          <p className="text-slate-300 leading-relaxed">
            데이터 점 <M>{"(x_i, y_i)"}</M>가 <M>{"n"}</M>개 주어졌을 때, 이를 가장 잘 근사하는 함수 <M>{"f(x)"}</M>를 찾고자 합니다.
            &ldquo;가장 잘&rdquo;이란 <strong className="text-emerald-400">잔차 제곱합(Sum of Squared Residuals)</strong>을 최소화한다는 의미입니다.
          </p>
          <MBlock>{"S = \\sum_{i=1}^{n} \\left[ y_i - f(x_i) \\right]^2 \\quad \\rightarrow \\quad \\min"}</MBlock>
        </motion.div>

        {/* Geometric Meaning */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">기하학적 의미</h3>
          <p className="text-slate-300 leading-relaxed">
            각 데이터 점 <M>{"(x_i, y_i)"}</M>에서 근사 곡선 <M>{"f(x)"}</M>까지의 <strong className="text-teal-400">수직 거리</strong>(residual)를 <M>{"e_i = y_i - f(x_i)"}</M>라 합니다.
          </p>
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">잔차 (Residual)</p>
                <MBlock>{"e_i = y_i - f(x_i)"}</MBlock>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">잔차 제곱합</p>
                <MBlock>{"S = \\sum_{i=1}^{n} e_i^2"}</MBlock>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">최소화 조건</p>
                <MBlock>{"\\frac{\\partial S}{\\partial a_k} = 0"}</MBlock>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            왜 절대값이 아닌 제곱을 사용할까요? 제곱은 미분 가능하므로 최적화 문제를 해석적으로 풀 수 있습니다. 또한 큰 오차에 더 큰 패널티를 부여합니다.
          </p>
        </motion.div>

        {/* Normal Equations Derivation */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">정규방정식 유도 (Linear Case)</h3>
          <p className="text-slate-300 leading-relaxed">
            직선 <M>{"f(x) = a_0 + a_1 x"}</M>로 근사할 때, 잔차 제곱합은:
          </p>
          <MBlock>{"S(a_0, a_1) = \\sum_{i=1}^{n} \\left( y_i - a_0 - a_1 x_i \\right)^2"}</MBlock>

          <p className="text-slate-300 leading-relaxed">최소 조건: 각 매개변수에 대한 편미분이 0</p>

          <div className="space-y-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
              <p className="text-sm text-teal-400 mb-3 font-semibold">Step 1: <M>{"\\partial S / \\partial a_0 = 0"}</M></p>
              <MBlock>{"\\frac{\\partial S}{\\partial a_0} = -2 \\sum_{i=1}^{n} \\left( y_i - a_0 - a_1 x_i \\right) = 0"}</MBlock>
              <MBlock>{"\\Rightarrow \\quad n \\, a_0 + \\left( \\sum x_i \\right) a_1 = \\sum y_i"}</MBlock>
            </div>

            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
              <p className="text-sm text-teal-400 mb-3 font-semibold">Step 2: <M>{"\\partial S / \\partial a_1 = 0"}</M></p>
              <MBlock>{"\\frac{\\partial S}{\\partial a_1} = -2 \\sum_{i=1}^{n} x_i \\left( y_i - a_0 - a_1 x_i \\right) = 0"}</MBlock>
              <MBlock>{"\\Rightarrow \\quad \\left( \\sum x_i \\right) a_0 + \\left( \\sum x_i^2 \\right) a_1 = \\sum x_i y_i"}</MBlock>
            </div>
          </div>
        </motion.div>

        {/* Matrix Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">행렬 형태 (Matrix Form)</h3>
          <p className="text-slate-300 leading-relaxed">
            위 두 식을 행렬로 정리하면:
          </p>
          <MBlock>{"\\begin{bmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\ \\sum x_i y_i \\end{bmatrix}"}</MBlock>
          <p className="text-slate-400 text-sm">
            이것이 바로 <strong className="text-emerald-400">정규방정식 (Normal Equations)</strong>입니다. 2x2 선형 시스템을 풀면 최적의 <M>{"a_0, a_1"}</M>을 구할 수 있습니다.
          </p>
        </motion.div>

        {/* Concrete Example */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">계산 예제</h3>
          <p className="text-slate-300 leading-relaxed">
            다음 5개 데이터 점에 직선 <M>{"y = a_0 + a_1 x"}</M>를 적합하시오.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-4 text-emerald-400"><M>{"x_i"}</M></th>
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4">5</td>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <th className="py-3 px-4 text-emerald-400"><M>{"y_i"}</M></th>
                  <td className="py-3 px-4">2.1</td>
                  <td className="py-3 px-4">3.9</td>
                  <td className="py-3 px-4">6.2</td>
                  <td className="py-3 px-4">7.8</td>
                  <td className="py-3 px-4">10.1</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button onClick={() => setShowExample(!showExample)} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium">
            {showExample ? "풀이 숨기기" : "풀이 보기"}
          </button>

          {showExample && (
            <div className="space-y-4 mt-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-sm text-teal-400 font-semibold">필요한 합 계산</p>
                <MBlock>{"n = 5, \\quad \\sum x_i = 15, \\quad \\sum x_i^2 = 55"}</MBlock>
                <MBlock>{"\\sum y_i = 30.1, \\quad \\sum x_i y_i = 109.4"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-sm text-teal-400 font-semibold">정규방정식 대입</p>
                <MBlock>{"\\begin{bmatrix} 5 & 15 \\\\ 15 & 55 \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} 30.1 \\\\ 109.4 \\end{bmatrix}"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-sm text-teal-400 font-semibold">풀기</p>
                <MBlock>{"a_1 = \\frac{n \\sum x_i y_i - \\sum x_i \\sum y_i}{n \\sum x_i^2 - (\\sum x_i)^2} = \\frac{5(109.4) - 15(30.1)}{5(55) - 15^2} = \\frac{547 - 451.5}{275 - 225} = \\frac{95.5}{50} = 1.91"}</MBlock>
                <MBlock>{"a_0 = \\frac{\\sum y_i - a_1 \\sum x_i}{n} = \\frac{30.1 - 1.91 \\times 15}{5} = \\frac{30.1 - 28.65}{5} = 0.29"}</MBlock>
                <p className="text-emerald-400 font-semibold text-lg mt-2">
                  결과: <M>{"y = 0.29 + 1.91x"}</M>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
