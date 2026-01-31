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

function Problem({
  number,
  title,
  statement,
  solution,
}: {
  number: number;
  title: string;
  statement: React.ReactNode;
  solution: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold text-sm">
          {number}
        </span>
        <div className="space-y-3 flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="text-slate-300 text-sm space-y-2">{statement}</div>
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white text-sm hover:bg-fuchsia-500 transition-colors"
          >
            {open ? "풀이 숨기기" : "풀이 보기"}
          </button>
          {open && (
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4 mt-2">
              {solution}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Week11Practice() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Practice Problems
          </h2>
          <p className="text-slate-400 text-lg">수치 적분 연습 문제</p>
        </motion.div>

        <motion.div {...anim} className="space-y-6">
          {/* Problem 1 */}
          <Problem
            number={1}
            title="복합 사다리꼴 공식"
            statement={
              <p>
                복합 사다리꼴 공식으로 <M>{"n=4"}</M>를 사용하여 <M>{"\\displaystyle\\int_0^2 x^3\\,dx"}</M>를 계산하시오.
                정확한 값과 비교하시오.
              </p>
            }
            solution={
              <>
                <p className="text-pink-400 font-semibold text-sm">구간 설정:</p>
                <p className="text-slate-300 text-sm">
                  <M>{"h = \\frac{2-0}{4} = 0.5"}</M>, 절점: <M>{"x_0=0,\\; x_1=0.5,\\; x_2=1,\\; x_3=1.5,\\; x_4=2"}</M>
                </p>
                <p className="text-pink-400 font-semibold text-sm">함수값:</p>
                <p className="text-slate-300 text-sm">
                  <M>{"f(0)=0,\\; f(0.5)=0.125,\\; f(1)=1,\\; f(1.5)=3.375,\\; f(2)=8"}</M>
                </p>
                <p className="text-pink-400 font-semibold text-sm">복합 사다리꼴 적용:</p>
                <MBlock>{"I \\approx \\frac{0.5}{2}\\left[0 + 2(0.125 + 1 + 3.375) + 8\\right]"}</MBlock>
                <MBlock>{"= 0.25\\left[0 + 2(4.5) + 8\\right] = 0.25 \\times 17 = 4.25"}</MBlock>
                <p className="text-pink-400 font-semibold text-sm">정확한 값:</p>
                <MBlock>{"\\int_0^2 x^3\\,dx = \\frac{x^4}{4}\\bigg|_0^2 = 4"}</MBlock>
                <p className="text-slate-300 text-sm">
                  오차: <M>{"4.25 - 4 = 0.25"}</M>
                </p>
              </>
            }
          />

          {/* Problem 2 */}
          <Problem
            number={2}
            title="Simpson 1/3 공식"
            statement={
              <p>
                Simpson 1/3 공식으로 <M>{"\\displaystyle\\int_0^{\\pi} \\sin(x)\\,dx"}</M>를 계산하시오.
              </p>
            }
            solution={
              <>
                <p className="text-pink-400 font-semibold text-sm">설정:</p>
                <p className="text-slate-300 text-sm">
                  <M>{"a=0,\\; b=\\pi,\\; m=\\frac{\\pi}{2},\\; h=\\frac{\\pi}{2}"}</M>
                </p>
                <p className="text-pink-400 font-semibold text-sm">함수값:</p>
                <p className="text-slate-300 text-sm">
                  <M>{"f(0)=0,\\; f(\\pi/2)=1,\\; f(\\pi)=0"}</M>
                </p>
                <p className="text-pink-400 font-semibold text-sm">Simpson 1/3 적용:</p>
                <MBlock>{"I \\approx \\frac{\\pi/2}{3}\\left[0 + 4(1) + 0\\right] = \\frac{\\pi/2}{3}\\times 4 = \\frac{2\\pi}{3} \\approx 2.0944"}</MBlock>
                <p className="text-pink-400 font-semibold text-sm">정확한 값:</p>
                <MBlock>{"\\int_0^{\\pi} \\sin(x)\\,dx = [-\\cos(x)]_0^{\\pi} = 2"}</MBlock>
                <p className="text-slate-300 text-sm">
                  오차: <M>{"2.0944 - 2 = 0.0944"}</M> (약 4.7%)
                </p>
              </>
            }
          />

          {/* Problem 3 */}
          <Problem
            number={3}
            title="2-점 Gauss 구적법"
            statement={
              <p>
                2-점 Gauss 구적법으로 <M>{"\\displaystyle\\int_1^3 (x^2+1)\\,dx"}</M>를 계산하시오.
              </p>
            }
            solution={
              <>
                <p className="text-pink-400 font-semibold text-sm">변수 변환:</p>
                <p className="text-slate-300 text-sm">
                  <M>{"a=1,\\; b=3"}</M>이므로 <M>{"x = \\frac{3-1}{2}t + \\frac{1+3}{2} = t + 2"}</M>
                </p>
                <MBlock>{"\\int_1^3 (x^2+1)\\,dx = \\int_{-1}^{1} ((t+2)^2+1)\\cdot 1\\,dt"}</MBlock>
                <p className="text-pink-400 font-semibold text-sm">2-점 Gauss 적용:</p>
                <p className="text-slate-300 text-sm">
                  <M>{"t_1 = -1/\\sqrt{3},\\; t_2 = 1/\\sqrt{3},\\; w_1 = w_2 = 1"}</M>
                </p>
                <MBlock>{"g(t) = (t+2)^2 + 1"}</MBlock>
                <MBlock>{"g(-1/\\sqrt{3}) = (-1/\\sqrt{3}+2)^2 + 1 = (2 - 0.5774)^2 + 1 = (1.4226)^2 + 1 \\approx 3.0238"}</MBlock>
                <MBlock>{"g(1/\\sqrt{3}) = (1/\\sqrt{3}+2)^2 + 1 = (2.5774)^2 + 1 \\approx 7.6429"}</MBlock>
                <MBlock>{"I \\approx 1 \\times 3.0238 + 1 \\times 7.6429 = 10.6667"}</MBlock>
                <p className="text-pink-400 font-semibold text-sm">정확한 값:</p>
                <MBlock>{"\\int_1^3 (x^2+1)\\,dx = \\left[\\frac{x^3}{3}+x\\right]_1^3 = (9+3) - (\\tfrac{1}{3}+1) = 12 - \\tfrac{4}{3} = \\frac{32}{3} \\approx 10.6667"}</MBlock>
                <p className="text-pink-400 text-sm font-semibold">
                  2-점 Gauss는 3차 이하 다항식에 대해 정확하므로, <M>{"x^2+1"}</M>에 대해 오차가 0입니다!
                </p>
              </>
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
