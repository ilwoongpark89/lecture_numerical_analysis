"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function TrapezoidalRule() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            사다리꼴 공식 (Trapezoidal Rule)
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            함수를 1차 다항식(직선)으로 근사하여 적분을 계산합니다.
          </p>
        </motion.div>

        {/* Derivation */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">유도 과정</h3>
          <p className="text-slate-300">
            구간 <M>{"[a, b]"}</M> 에서 <M>{"f(x)"}</M>를 두 끝점을 지나는 <strong>1차 보간 다항식</strong>(직선)으로 근사합니다:
          </p>
          <MBlock>{"P_1(x) = f(a) + \\frac{f(b) - f(a)}{b - a}(x - a)"}</MBlock>
          <p className="text-slate-300">
            이 직선 아래의 면적을 적분하면:
          </p>
          <MBlock>{"\\int_a^b P_1(x)\\,dx = \\int_a^b \\left[ f(a) + \\frac{f(b)-f(a)}{b-a}(x-a) \\right] dx"}</MBlock>
          <MBlock>{"= f(a)(b-a) + \\frac{f(b)-f(a)}{b-a} \\cdot \\frac{(b-a)^2}{2}"}</MBlock>
          <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-5">
            <p className="text-fuchsia-400 font-semibold text-sm mb-2">사다리꼴 공식</p>
            <MBlock>{"I \\approx \\frac{b-a}{2}\\left[f(a) + f(b)\\right]"}</MBlock>
          </div>
        </motion.div>

        {/* SVG Diagram */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">기하학적 의미</h3>
          <div className="flex justify-center">
            <svg viewBox="0 0 400 260" className="w-full max-w-md">
              {/* Axes */}
              <line x1="50" y1="220" x2="370" y2="220" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="50" y1="220" x2="50" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Curve f(x) */}
              <path
                d="M 80 180 Q 160 40 320 100"
                fill="none"
                stroke="#e879f9"
                strokeWidth="2.5"
              />
              {/* Trapezoid fill */}
              <polygon
                points="80,220 80,180 320,100 320,220"
                fill="rgba(232,121,249,0.15)"
                stroke="#f0abfc"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
              {/* Straight line (linear interpolation) */}
              <line x1="80" y1="180" x2="320" y2="100" stroke="#f0abfc" strokeWidth="2" strokeDasharray="6 3" />
              {/* Vertical lines */}
              <line x1="80" y1="220" x2="80" y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="320" y1="220" x2="320" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
              {/* Labels */}
              <text x="75" y="240" fill="#94a3b8" fontSize="14" textAnchor="middle">a</text>
              <text x="320" y="240" fill="#94a3b8" fontSize="14" textAnchor="middle">b</text>
              <text x="60" y="178" fill="#e879f9" fontSize="13" textAnchor="end">f(a)</text>
              <text x="335" y="95" fill="#e879f9" fontSize="13">f(b)</text>
              <text x="340" y="50" fill="#e879f9" fontSize="14">f(x)</text>
              <text x="200" y="190" fill="#f0abfc" fontSize="13" textAnchor="middle">사다리꼴</text>
              {/* Dots */}
              <circle cx="80" cy="180" r="4" fill="#e879f9" />
              <circle cx="320" cy="100" r="4" fill="#e879f9" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm text-center">
            곡선 <M>{"f(x)"}</M> 아래 면적을 사다리꼴로 근사합니다. 직선과 곡선 사이의 차이가 오차입니다.
          </p>
        </motion.div>

        {/* Error */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">오차 분석</h3>
          <p className="text-slate-300">
            <M>{"f(x)"}</M>가 구간 <M>{"[a,b]"}</M>에서 두 번 미분 가능할 때, 오차는:
          </p>
          <MBlock>{"E = -\\frac{(b-a)^3}{12}f''(\\xi), \\quad \\xi \\in (a,b)"}</MBlock>
          <p className="text-slate-400 text-sm">
            오차가 <M>{"f''(\\xi)"}</M>에 비례하므로, <M>{"f(x)"}</M>가 <strong>1차 이하의 다항식</strong>이면 사다리꼴 공식은 정확합니다.
          </p>
        </motion.div>

        {/* Example */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-fuchsia-400">예제</h3>
          <p className="text-slate-300">
            <M>{"\\displaystyle\\int_0^1 x^2\\,dx"}</M> 를 사다리꼴 공식으로 계산하시오.
          </p>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
            <p className="text-pink-400 font-semibold text-sm">풀이:</p>
            <p className="text-slate-300 text-sm">
              <M>{"a = 0,\\; b = 1,\\; f(x) = x^2"}</M>
            </p>
            <MBlock>{"I \\approx \\frac{1-0}{2}\\left[f(0) + f(1)\\right] = \\frac{1}{2}(0 + 1) = 0.5"}</MBlock>
            <p className="text-slate-300 text-sm">
              정확한 값: <M>{"\\displaystyle\\int_0^1 x^2\\,dx = \\frac{x^3}{3}\\bigg|_0^1 = \\frac{1}{3} \\approx 0.3333"}</M>
            </p>
            <p className="text-slate-300 text-sm">
              오차: <M>{"0.5 - 0.3333 = 0.1667"}</M>
            </p>
            <p className="text-slate-400 text-sm">
              오차 공식으로 확인: <M>{"E = -\\frac{1}{12}\\cdot f''(\\xi) = -\\frac{1}{12}\\cdot 2 = -\\frac{1}{6} \\approx -0.1667"}</M> ✓
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
