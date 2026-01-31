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

const points = [
  { x: 1, y: 1 },
  { x: 2, y: 4 },
  { x: 3, y: 9 },
];

export default function LagrangeInterpolation() {
  const [step, setStep] = useState(0);

  const L0_expr = `L_0(x) = \\frac{(x - x_1)(x - x_2)}{(x_0 - x_1)(x_0 - x_2)} = \\frac{(x-2)(x-3)}{(1-2)(1-3)} = \\frac{(x-2)(x-3)}{2}`;
  const L1_expr = `L_1(x) = \\frac{(x - x_0)(x - x_2)}{(x_1 - x_0)(x_1 - x_2)} = \\frac{(x-1)(x-3)}{(2-1)(2-3)} = \\frac{(x-1)(x-3)}{-1}`;
  const L2_expr = `L_2(x) = \\frac{(x - x_0)(x - x_1)}{(x_2 - x_0)(x_2 - x_1)} = \\frac{(x-1)(x-2)}{(3-1)(3-2)} = \\frac{(x-1)(x-2)}{2}`;

  const evalX = 2.5;
  const L0_val = ((evalX - 2) * (evalX - 3)) / 2;
  const L1_val = ((evalX - 1) * (evalX - 3)) / -1;
  const L2_val = ((evalX - 1) * (evalX - 2)) / 2;
  const P_val = 1 * L0_val + 4 * L1_val + 9 * L2_val;

  const steps = [
    {
      title: "Step 1: 데이터 점 확인",
      content: (
        <div className="space-y-3">
          <p className="text-slate-300">주어진 데이터 점:</p>
          <div className="flex gap-6 justify-center">
            {points.map((p, i) => (
              <div key={i} className="bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2 text-center">
                <M>{`(x_${i}, y_${i}) = (${p.x}, ${p.y})`}</M>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: 기저 다항식 L₀(x) 계산",
      content: (
        <div className="space-y-3">
          <MBlock>{L0_expr}</MBlock>
          <p className="text-slate-400 text-sm">
            <M>{`L_0(x_0)=1,\\; L_0(x_1)=0,\\; L_0(x_2)=0`}</M> 을 만족합니다.
          </p>
        </div>
      ),
    },
    {
      title: "Step 3: 기저 다항식 L₁(x) 계산",
      content: (
        <div className="space-y-3">
          <MBlock>{L1_expr}</MBlock>
          <p className="text-slate-400 text-sm">
            <M>{`L_1(x_0)=0,\\; L_1(x_1)=1,\\; L_1(x_2)=0`}</M> 을 만족합니다.
          </p>
        </div>
      ),
    },
    {
      title: "Step 4: 기저 다항식 L₂(x) 계산",
      content: (
        <div className="space-y-3">
          <MBlock>{L2_expr}</MBlock>
          <p className="text-slate-400 text-sm">
            <M>{`L_2(x_0)=0,\\; L_2(x_1)=0,\\; L_2(x_2)=1`}</M> 을 만족합니다.
          </p>
        </div>
      ),
    },
    {
      title: "Step 5: 보간 다항식 합성",
      content: (
        <div className="space-y-3">
          <MBlock>{"P(x) = y_0 L_0(x) + y_1 L_1(x) + y_2 L_2(x)"}</MBlock>
          <MBlock>{"= 1 \\cdot \\frac{(x-2)(x-3)}{2} + 4 \\cdot \\frac{(x-1)(x-3)}{-1} + 9 \\cdot \\frac{(x-1)(x-2)}{2}"}</MBlock>
          <MBlock>{"= x^2"}</MBlock>
          <p className="text-slate-400 text-sm">정리하면 <M>{"P(x) = x^2"}</M> 으로, 원래 함수를 정확히 복원합니다.</p>
        </div>
      ),
    },
    {
      title: `Step 6: x = ${evalX} 에서 평가`,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-violet-400 text-sm mb-1"><M>{"L_0(2.5)"}</M></p>
              <p className="text-white font-mono">{L0_val.toFixed(4)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-violet-400 text-sm mb-1"><M>{"L_1(2.5)"}</M></p>
              <p className="text-white font-mono">{L1_val.toFixed(4)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-violet-400 text-sm mb-1"><M>{"L_2(2.5)"}</M></p>
              <p className="text-white font-mono">{L2_val.toFixed(4)}</p>
            </div>
          </div>
          <MBlock>{"P(2.5) = 1(${L0_val.toFixed(2)}) + 4(${L1_val.toFixed(2)}) + 9(${L2_val.toFixed(2)}) = ${P_val.toFixed(2)}"}</MBlock>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Lagrange 보간 다항식
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            주어진 <M>{"n+1"}</M> 개의 데이터 점을 정확히 지나는 최대 <M>{"n"}</M> 차 다항식을 구성합니다.
          </p>
        </motion.div>

        {/* General Formula */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">일반 공식</h3>
          <MBlock>{"P(x) = \\sum_{i=0}^{n} y_i \\, L_i(x)"}</MBlock>
          <p className="text-slate-300">여기서 Lagrange 기저 다항식 <M>{"L_i(x)"}</M>는:</p>
          <MBlock>{"L_i(x) = \\prod_{\\substack{j=0 \\\\ j \\neq i}}^{n} \\frac{x - x_j}{x_i - x_j}"}</MBlock>
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
            <p className="text-violet-300 text-sm">
              <strong>핵심 성질:</strong> <M>{`L_i(x_j) = \\delta_{ij}`}</M> (크로네커 델타). 즉, <M>{"L_i"}</M>는 <M>{"x_i"}</M>에서 1이고 다른 모든 데이터 점에서 0입니다.
            </p>
          </div>
        </motion.div>

        {/* Interactive Step-by-step */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">단계별 예제</h3>
          <p className="text-slate-400 text-sm">
            데이터 점 <M>{"(1,1),\\;(2,4),\\;(3,9)"}</M> 를 사용한 Lagrange 보간
          </p>

          {/* Step navigation */}
          <div className="flex flex-wrap gap-2">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  step === i
                    ? "bg-violet-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Current step */}
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 min-h-[160px]">
            <h4 className="text-purple-400 font-semibold mb-4">{steps[step].title}</h4>
            {steps[step].content}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            <button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        </motion.div>

        {/* Properties */}
        <motion.div {...anim} className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
            <h3 className="text-lg font-semibold text-green-400">장점</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">+</span> 공식이 명시적이고 직관적</li>
              <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">+</span> 존재성과 유일성이 보장됨</li>
              <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">+</span> 이론적 분석에 유용</li>
            </ul>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
            <h3 className="text-lg font-semibold text-red-400">단점</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> 점을 추가하면 전체를 다시 계산해야 함</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> 수치적으로 불안정할 수 있음</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">-</span> <M>{"O(n^2)"}</M> 연산 필요</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
