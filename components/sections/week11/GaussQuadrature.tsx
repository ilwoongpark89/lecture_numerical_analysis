"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function GaussQuadrature() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Gauss 구적법 (Gauss Quadrature)
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            절점과 가중치를 모두 최적으로 선택하여 최대 정확도를 달성합니다.
          </p>
        </motion.div>

        {/* Idea */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">핵심 아이디어</h3>
          <p className="text-slate-300">
            Newton-Cotes 공식은 <strong>등간격 절점</strong>을 사용하고 가중치만 최적화합니다. Gauss 구적법은 <strong>절점의 위치</strong>까지 자유 변수로 활용합니다.
          </p>
          <MBlock>{"\\int_{-1}^{1} f(x)\\,dx \\approx \\sum_{i=1}^{n} w_i\\, f(x_i)"}</MBlock>
          <p className="text-slate-300">
            <M>{"n"}</M>개의 절점과 <M>{"n"}</M>개의 가중치, 총 <M>{"2n"}</M>개의 자유도가 있으므로
            <strong> 최대 <M>{"2n-1"}</M>차 다항식</strong>까지 정확하게 적분할 수 있습니다.
          </p>
        </motion.div>

        {/* 1-point */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">1-점 Gauss 구적법</h3>
          <MBlock>{"\\int_{-1}^{1} f(x)\\,dx \\approx 2\\,f(0)"}</MBlock>
          <p className="text-slate-300">
            절점: <M>{"x_1 = 0"}</M>, 가중치: <M>{"w_1 = 2"}</M>
          </p>
          <p className="text-slate-400 text-sm">
            1차 이하 다항식에 대해 정확 (<M>{"2 \\times 1 - 1 = 1"}</M>차).
          </p>
        </motion.div>

        {/* 2-point */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">2-점 Gauss 구적법</h3>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-5">
            <MBlock>{"\\int_{-1}^{1} f(x)\\,dx \\approx f\\!\\left(-\\frac{1}{\\sqrt{3}}\\right) + f\\!\\left(\\frac{1}{\\sqrt{3}}\\right)"}</MBlock>
          </div>
          <p className="text-slate-300">
            절점: <M>{"x_{1,2} = \\pm\\frac{1}{\\sqrt{3}} \\approx \\pm 0.5774"}</M>, 가중치: <M>{"w_1 = w_2 = 1"}</M>
          </p>
          <p className="text-slate-400 text-sm">
            3차 이하 다항식에 대해 정확 (<M>{"2 \\times 2 - 1 = 3"}</M>차).
          </p>
        </motion.div>

        {/* 3-point */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">3-점 Gauss 구적법</h3>
          <MBlock>{"\\int_{-1}^{1} f(x)\\,dx \\approx \\frac{5}{9}f\\!\\left(-\\sqrt{\\frac{3}{5}}\\right) + \\frac{8}{9}f(0) + \\frac{5}{9}f\\!\\left(\\sqrt{\\frac{3}{5}}\\right)"}</MBlock>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left mt-4">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-2 px-4 text-fuchsia-400">절점 <M>{"x_i"}</M></th>
                  <th className="py-2 px-4 text-fuchsia-400">가중치 <M>{"w_i"}</M></th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-2 px-4"><M>{"-\\sqrt{3/5} \\approx -0.7746"}</M></td>
                  <td className="py-2 px-4"><M>{"5/9 \\approx 0.5556"}</M></td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 px-4"><M>{"0"}</M></td>
                  <td className="py-2 px-4"><M>{"8/9 \\approx 0.8889"}</M></td>
                </tr>
                <tr>
                  <td className="py-2 px-4"><M>{"\\sqrt{3/5} \\approx 0.7746"}</M></td>
                  <td className="py-2 px-4"><M>{"5/9 \\approx 0.5556"}</M></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-slate-400 text-sm">
            5차 이하 다항식에 대해 정확 (<M>{"2 \\times 3 - 1 = 5"}</M>차).
          </p>
        </motion.div>

        {/* Change of Variables */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">일반 구간 [a, b]로의 변환</h3>
          <p className="text-slate-300">
            변수 변환 <M>{"x = \\frac{b-a}{2}t + \\frac{a+b}{2}"}</M> 를 사용하면 <M>{"t \\in [-1, 1]"}</M>로 변환됩니다:
          </p>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-5">
            <MBlock>{"\\int_a^b f(x)\\,dx = \\frac{b-a}{2}\\int_{-1}^{1} f\\!\\left(\\frac{b-a}{2}t + \\frac{a+b}{2}\\right)dt"}</MBlock>
          </div>
          <p className="text-slate-400 text-sm">
            변환 후 표준 Gauss 구적법을 적용합니다.
          </p>
        </motion.div>

        {/* Summary */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">Newton-Cotes vs Gauss 비교</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-4 text-fuchsia-400">특성</th>
                  <th className="py-3 px-4 text-fuchsia-400">Newton-Cotes (n점)</th>
                  <th className="py-3 px-4 text-fuchsia-400">Gauss (n점)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">절점</td>
                  <td className="py-3 px-4">등간격 (고정)</td>
                  <td className="py-3 px-4">최적 선택</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">다항식 정확도</td>
                  <td className="py-3 px-4"><M>{"n-1"}</M> 또는 <M>{"n"}</M>차</td>
                  <td className="py-3 px-4"><M>{"2n-1"}</M>차</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">장점</td>
                  <td className="py-3 px-4">직관적, 구현 간단</td>
                  <td className="py-3 px-4">같은 점 수로 최고 정확도</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
