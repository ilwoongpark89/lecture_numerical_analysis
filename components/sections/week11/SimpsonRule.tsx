"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function SimpsonRule() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Simpson 공식 (Simpson&apos;s Rules)
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            더 높은 차수의 다항식으로 근사하여 정확도를 높입니다.
          </p>
        </motion.div>

        {/* Simpson 1/3 */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">Simpson 1/3 공식</h3>
          <p className="text-slate-300">
            구간 <M>{"[a, b]"}</M>를 반으로 나누어 세 점 <M>{"a,\\; m = \\frac{a+b}{2},\\; b"}</M>를 통과하는
            <strong> 2차 보간 다항식</strong>을 적분합니다.
          </p>
          <p className="text-slate-300">
            <M>{"h = \\frac{b-a}{2}"}</M>로 놓으면:
          </p>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-5">
            <p className="text-fuchsia-400 font-semibold text-sm mb-2">Simpson 1/3 공식</p>
            <MBlock>{"I \\approx \\frac{h}{3}\\left[f(a) + 4f(m) + f(b)\\right], \\quad h = \\frac{b-a}{2}"}</MBlock>
          </div>
          <p className="text-slate-300">오차:</p>
          <MBlock>{"E = -\\frac{h^5}{90}f^{(4)}(\\xi) = -\\frac{(b-a)^5}{2880}f^{(4)}(\\xi)"}</MBlock>
          <p className="text-slate-400 text-sm">
            오차에 <M>{"f^{(4)}"}</M>가 포함되므로, <strong>3차 이하의 다항식</strong>에 대해 정확합니다 (예상보다 한 차수 높음!).
          </p>
        </motion.div>

        {/* Simpson 3/8 */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">Simpson 3/8 공식</h3>
          <p className="text-slate-300">
            구간을 3등분하여 4개의 점을 통과하는 <strong>3차 보간 다항식</strong>을 적분합니다.
          </p>
          <p className="text-slate-300">
            <M>{"h = \\frac{b-a}{3}"}</M>로 놓으면:
          </p>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-5">
            <p className="text-fuchsia-400 font-semibold text-sm mb-2">Simpson 3/8 공식</p>
            <MBlock>{"I \\approx \\frac{3h}{8}\\left[f(x_0) + 3f(x_1) + 3f(x_2) + f(x_3)\\right]"}</MBlock>
          </div>
          <p className="text-slate-300">오차:</p>
          <MBlock>{"E = -\\frac{3h^5}{80}f^{(4)}(\\xi)"}</MBlock>
        </motion.div>

        {/* Comparison Table */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">비교표</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-4 text-fuchsia-400">공식</th>
                  <th className="py-3 px-4 text-fuchsia-400">점 개수</th>
                  <th className="py-3 px-4 text-fuchsia-400">다항식 정확도</th>
                  <th className="py-3 px-4 text-fuchsia-400">오차 차수</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">Trapezoidal</td>
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4"><M>{"\\leq 1"}</M>차</td>
                  <td className="py-3 px-4"><M>{"O(h^3)"}</M></td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">Simpson 1/3</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4"><M>{"\\leq 3"}</M>차</td>
                  <td className="py-3 px-4"><M>{"O(h^5)"}</M></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Simpson 3/8</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4"><M>{"\\leq 3"}</M>차</td>
                  <td className="py-3 px-4"><M>{"O(h^5)"}</M></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Example */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">예제</h3>
          <p className="text-slate-300">
            <M>{"\\displaystyle\\int_0^1 x^2\\,dx"}</M> 를 Simpson 1/3 공식으로 계산하시오.
          </p>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
            <p className="text-pink-400 font-semibold text-sm">풀이:</p>
            <p className="text-slate-300 text-sm">
              <M>{"a=0,\\; b=1,\\; m=0.5,\\; h = 0.5"}</M>
            </p>
            <MBlock>{"I \\approx \\frac{0.5}{3}\\left[f(0) + 4f(0.5) + f(1)\\right]"}</MBlock>
            <MBlock>{"= \\frac{0.5}{3}\\left[0 + 4(0.25) + 1\\right] = \\frac{0.5}{3}\\cdot 2 = \\frac{1}{3}"}</MBlock>
            <p className="text-slate-300 text-sm">
              정확한 값: <M>{"\\frac{1}{3}"}</M>
            </p>
            <p className="text-pink-400 text-sm font-semibold">
              Simpson 1/3는 3차 이하 다항식에 대해 정확하므로, <M>{"x^2"}</M>에 대해 오차가 0입니다!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
