"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const xs = [1, 2, 3];
const ys = [1, 4, 9];

// Divided differences
const dd01 = (ys[1] - ys[0]) / (xs[1] - xs[0]); // 3
const dd12 = (ys[2] - ys[1]) / (xs[2] - xs[1]); // 5
const dd012 = (dd12 - dd01) / (xs[2] - xs[0]); // 1

export default function NewtonInterpolation() {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Newton 차분 보간 (Divided Differences)
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            분할 차분(divided differences)을 이용하여 점진적으로 보간 다항식을 구성합니다.
          </p>
        </motion.div>

        {/* Divided difference concept */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">분할 차분의 정의</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-slate-300">0차 분할 차분:</p>
              <MBlock>{"f[x_i] = f(x_i) = y_i"}</MBlock>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300">1차 분할 차분:</p>
              <MBlock>{"f[x_i, x_{i+1}] = \\frac{f[x_{i+1}] - f[x_i]}{x_{i+1} - x_i}"}</MBlock>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300">일반 <M>{"k"}</M>차 분할 차분 (재귀적 정의):</p>
              <MBlock>{"f[x_i, \\ldots, x_{i+k}] = \\frac{f[x_{i+1}, \\ldots, x_{i+k}] - f[x_i, \\ldots, x_{i+k-1}]}{x_{i+k} - x_i}"}</MBlock>
            </div>
          </div>
        </motion.div>

        {/* Newton form */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">Newton 보간 공식</h3>
          <MBlock>{"P(x) = f[x_0] + f[x_0, x_1](x - x_0) + f[x_0, x_1, x_2](x - x_0)(x - x_1) + \\cdots"}</MBlock>
          <MBlock>{"= \\sum_{k=0}^{n} f[x_0, \\ldots, x_k] \\prod_{j=0}^{k-1}(x - x_j)"}</MBlock>
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
            <p className="text-violet-300 text-sm">
              <strong>핵심 장점:</strong> 새로운 점 <M>{"x_{n+1}"}</M>을 추가할 때, 기존 항은 그대로 두고 한 개의 항만 추가하면 됩니다.
            </p>
          </div>
        </motion.div>

        {/* Divided difference table */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-violet-400">분할 차분 테이블 예제</h3>
            <button
              onClick={() => setShowTable(!showTable)}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
            >
              {showTable ? "테이블 숨기기" : "테이블 보기"}
            </button>
          </div>
          <p className="text-slate-400 text-sm">
            데이터 점: <M>{"(1,1),\\;(2,4),\\;(3,9)"}</M>
          </p>

          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-slate-400 text-sm"><M>{"x_i"}</M></th>
                    <th className="py-3 px-4 text-violet-400 text-sm"><M>{"f[x_i]"}</M></th>
                    <th className="py-3 px-4 text-purple-400 text-sm"><M>{"f[x_i, x_{i+1}]"}</M></th>
                    <th className="py-3 px-4 text-pink-400 text-sm"><M>{"f[x_i, x_{i+1}, x_{i+2}]"}</M></th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 text-slate-300">1</td>
                    <td className="py-3 px-4 text-violet-300 bg-violet-500/5">1</td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 text-slate-300">2</td>
                    <td className="py-3 px-4 text-violet-300 bg-violet-500/5">4</td>
                    <td className="py-3 px-4 text-purple-300 bg-purple-500/5">{dd01}</td>
                    <td className="py-3 px-4"></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-300">3</td>
                    <td className="py-3 px-4 text-violet-300 bg-violet-500/5">9</td>
                    <td className="py-3 px-4 text-purple-300 bg-purple-500/5">{dd12}</td>
                    <td className="py-3 px-4 text-pink-300 bg-pink-500/5">{dd012}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {showTable && (
            <div className="space-y-3 bg-slate-950 rounded-xl p-5 border border-slate-800">
              <p className="text-slate-300 text-sm font-semibold">계산 과정:</p>
              <div className="space-y-2 text-sm text-slate-400">
                <p><M>{`f[x_0, x_1] = \\frac{4 - 1}{2 - 1} = 3`}</M></p>
                <p><M>{`f[x_1, x_2] = \\frac{9 - 4}{3 - 2} = 5`}</M></p>
                <p><M>{`f[x_0, x_1, x_2] = \\frac{5 - 3}{3 - 1} = 1`}</M></p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Result */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">최종 보간 다항식</h3>
          <p className="text-slate-300">테이블의 대각선 원소 (첫 번째 행의 각 열)를 사용합니다:</p>
          <MBlock>{"P(x) = \\underbrace{1}_{f[x_0]} + \\underbrace{3}_{f[x_0,x_1]}(x-1) + \\underbrace{1}_{f[x_0,x_1,x_2]}(x-1)(x-2)"}</MBlock>
          <MBlock>{"= 1 + 3(x-1) + (x-1)(x-2)"}</MBlock>
          <MBlock>{"= 1 + 3x - 3 + x^2 - 3x + 2 = x^2"}</MBlock>
        </motion.div>

        {/* Adding a new point */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-purple-400">새로운 점 추가의 용이성</h3>
          <p className="text-slate-300">
            만약 새로운 점 <M>{"(4, 16)"}</M>을 추가한다면:
          </p>
          <MBlock>{"P_3(x) = P_2(x) + f[x_0, x_1, x_2, x_3](x-1)(x-2)(x-3)"}</MBlock>
          <p className="text-slate-400 text-sm">
            기존의 <M>{"P_2(x)"}</M>를 전혀 수정하지 않고, 새로운 분할 차분 <M>{"f[x_0, x_1, x_2, x_3]"}</M>만 계산하여 한 항을 추가하면 됩니다.
            이것이 Lagrange 방법 대비 Newton 방법의 가장 큰 장점입니다.
          </p>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <p className="text-purple-300 text-sm">
              이 경우 <M>{`f[x_0,x_1,x_2,x_3] = 0`}</M> 이므로 (원래 함수가 2차이기 때문에) 추가되는 항은 0이 됩니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
