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

export default function CubicSpline() {
  const [showExample, setShowExample] = useState(false);

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Cubic Spline 보간
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            구간별 3차 다항식을 매끄럽게 연결하여 안정적인 보간을 수행합니다.
          </p>
        </motion.div>

        {/* Concept */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">기본 개념</h3>
          <p className="text-slate-300">
            각 구간 <M>{"[x_i, x_{i+1}]"}</M> 에서 별도의 3차 다항식 <M>{"S_i(x)"}</M>를 정의합니다:
          </p>
          <MBlock>{"S_i(x) = a_i + b_i(x - x_i) + c_i(x - x_i)^2 + d_i(x - x_i)^3"}</MBlock>
          <p className="text-slate-400 text-sm">
            <M>{"n"}</M>개의 구간이 있으면 <M>{"4n"}</M>개의 미지수가 있으므로, <M>{"4n"}</M>개의 조건이 필요합니다.
          </p>
        </motion.div>

        {/* Conditions */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">연속성 조건</h3>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
              <p className="text-purple-400 font-semibold text-sm">1. 보간 조건 (<M>{"n+1"}</M> 개 + <M>{"n-1"}</M> 개)</p>
              <MBlock>{"S_i(x_i) = y_i, \\quad S_i(x_{i+1}) = y_{i+1}"}</MBlock>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
              <p className="text-purple-400 font-semibold text-sm">2. 1차 도함수 연속 (<M>{"n-1"}</M> 개)</p>
              <MBlock>{"S_i'(x_{i+1}) = S_{i+1}'(x_{i+1}), \\quad i = 0, \\ldots, n-2"}</MBlock>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
              <p className="text-purple-400 font-semibold text-sm">3. 2차 도함수 연속 (<M>{"n-1"}</M> 개)</p>
              <MBlock>{"S_i''(x_{i+1}) = S_{i+1}''(x_{i+1}), \\quad i = 0, \\ldots, n-2"}</MBlock>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
              <p className="text-purple-400 font-semibold text-sm">4. 경계 조건 (2개) -- Natural Spline</p>
              <MBlock>{"S''(x_0) = 0, \\quad S''(x_n) = 0"}</MBlock>
            </div>
          </div>
        </motion.div>

        {/* Tridiagonal system */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">삼중대각 시스템</h3>
          <p className="text-slate-300 text-sm">
            <M>{"M_i = S''(x_i)"}</M> 로 놓으면, 내부 매듭점에서 다음 삼중대각(tridiagonal) 시스템을 얻습니다:
          </p>
          <MBlock>{"h_{i-1} M_{i-1} + 2(h_{i-1} + h_i) M_i + h_i M_{i+1} = 6\\left(\\frac{y_{i+1} - y_i}{h_i} - \\frac{y_i - y_{i-1}}{h_{i-1}}\\right)"}</MBlock>
          <p className="text-slate-400 text-sm">
            여기서 <M>{"h_i = x_{i+1} - x_i"}</M> 이고, natural spline의 경우 <M>{"M_0 = M_n = 0"}</M> 입니다.
          </p>
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
            <p className="text-violet-300 text-sm">
              삼중대각 시스템은 <M>{"O(n)"}</M> 연산으로 효율적으로 풀 수 있습니다 (Thomas algorithm).
            </p>
          </div>
        </motion.div>

        {/* Step-by-step example */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-violet-400">예제: 4개 점의 Natural Cubic Spline</h3>
            <button
              onClick={() => setShowExample(!showExample)}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
            >
              {showExample ? "접기" : "풀이 보기"}
            </button>
          </div>
          <p className="text-slate-400 text-sm">
            데이터 점: <M>{"(0, 0),\\;(1, 1),\\;(2, 0),\\;(3, 1)"}</M>
          </p>

          {showExample && (
            <div className="space-y-6">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-purple-400 font-semibold text-sm">Step 1: 간격 및 기울기 계산</p>
                <MBlock>{"h_0 = h_1 = h_2 = 1"}</MBlock>
                <MBlock>{"\\frac{y_1 - y_0}{h_0} = 1, \\quad \\frac{y_2 - y_1}{h_1} = -1, \\quad \\frac{y_3 - y_2}{h_2} = 1"}</MBlock>
              </div>

              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-purple-400 font-semibold text-sm">Step 2: 삼중대각 시스템 구성</p>
                <p className="text-slate-400 text-sm">Natural spline: <M>{"M_0 = 0,\\; M_3 = 0"}</M></p>
                <p className="text-slate-300 text-sm"><M>{"i = 1"}</M>:</p>
                <MBlock>{"1 \\cdot M_0 + 2(1+1) M_1 + 1 \\cdot M_2 = 6(-1 - 1) = -12"}</MBlock>
                <MBlock>{"4M_1 + M_2 = -12"}</MBlock>
                <p className="text-slate-300 text-sm"><M>{"i = 2"}</M>:</p>
                <MBlock>{"1 \\cdot M_1 + 2(1+1) M_2 + 1 \\cdot M_3 = 6(1 - (-1)) = 12"}</MBlock>
                <MBlock>{"M_1 + 4M_2 = 12"}</MBlock>
              </div>

              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-purple-400 font-semibold text-sm">Step 3: 연립방정식 풀기</p>
                <MBlock>{"\\begin{cases} 4M_1 + M_2 = -12 \\\\ M_1 + 4M_2 = 12 \\end{cases}"}</MBlock>
                <MBlock>{"M_1 = -\\frac{60}{15} = -4, \\quad M_2 = \\frac{60}{15} = 4"}</MBlock>
              </div>

              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-purple-400 font-semibold text-sm">Step 4: 각 구간의 spline 계수 결정</p>
                <p className="text-slate-400 text-sm">
                  <M>{"M_0 = 0,\\; M_1 = -4,\\; M_2 = 4,\\; M_3 = 0"}</M> 을 사용하여 각 <M>{"S_i(x)"}</M>의 계수 <M>{"a_i, b_i, c_i, d_i"}</M>를 계산합니다.
                </p>
                <MBlock>{"c_i = \\frac{M_i}{2}, \\quad d_i = \\frac{M_{i+1} - M_i}{6h_i}"}</MBlock>
                <MBlock>{"b_i = \\frac{y_{i+1} - y_i}{h_i} - \\frac{h_i}{6}(2M_i + M_{i+1})"}</MBlock>
              </div>
            </div>
          )}
        </motion.div>

        {/* Advantages */}
        <motion.div {...anim} className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Runge 현상 없음", desc: "저차 다항식을 사용하므로 끝점 진동이 발생하지 않습니다.", color: "violet" },
            { title: "지역적 제어", desc: "한 구간의 데이터 변경이 인접 구간에만 영향을 미칩니다.", color: "purple" },
            { title: "매끄러운 곡선", desc: "2차 도함수까지 연속이므로 시각적으로 매우 부드럽습니다.", color: "violet" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h4 className={`text-lg font-semibold text-${item.color}-400`}>{item.title}</h4>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
