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
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm">
          {number}
        </span>
        <div className="space-y-3 flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="text-slate-300 text-sm space-y-2">{statement}</div>
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
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

export default function Week10Practice() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Practice Problems
          </h2>
          <p className="text-slate-400 text-lg">보간법 연습 문제</p>
        </motion.div>

        <motion.div {...anim} className="space-y-6">
          <Problem
            number={1}
            title="Lagrange 보간"
            statement={
              <>
                <p>
                  데이터 점 <M>{"(0, 1),\\;(1, 3),\\;(2, 7)"}</M> 이 주어졌을 때, Lagrange 보간 다항식 <M>{"P_2(x)"}</M>를 구하고
                  <M>{"\\;x = 1.5"}</M> 에서의 값을 계산하시오.
                </p>
              </>
            }
            solution={
              <>
                <p className="text-purple-400 font-semibold text-sm">기저 다항식 계산:</p>
                <MBlock>{"L_0(x) = \\frac{(x-1)(x-2)}{(0-1)(0-2)} = \\frac{(x-1)(x-2)}{2}"}</MBlock>
                <MBlock>{"L_1(x) = \\frac{(x-0)(x-2)}{(1-0)(1-2)} = \\frac{x(x-2)}{-1} = -x(x-2)"}</MBlock>
                <MBlock>{"L_2(x) = \\frac{(x-0)(x-1)}{(2-0)(2-1)} = \\frac{x(x-1)}{2}"}</MBlock>
                <p className="text-purple-400 font-semibold text-sm">보간 다항식:</p>
                <MBlock>{"P_2(x) = 1 \\cdot \\frac{(x-1)(x-2)}{2} + 3 \\cdot (-x(x-2)) + 7 \\cdot \\frac{x(x-1)}{2}"}</MBlock>
                <MBlock>{"= \\frac{(x-1)(x-2)}{2} - 3x(x-2) + \\frac{7x(x-1)}{2}"}</MBlock>
                <p className="text-slate-400 text-sm">정리하면:</p>
                <MBlock>{"P_2(x) = x^2 + x + 1"}</MBlock>
                <p className="text-purple-400 font-semibold text-sm">
                  <M>{"x = 1.5"}</M> 대입:
                </p>
                <MBlock>{"P_2(1.5) = (1.5)^2 + 1.5 + 1 = 2.25 + 1.5 + 1 = 4.75"}</MBlock>
              </>
            }
          />

          <Problem
            number={2}
            title="분할 차분 테이블"
            statement={
              <>
                <p>
                  데이터 점 <M>{"(0, 1),\\;(1, 2),\\;(3, 10),\\;(4, 17)"}</M> 에 대해
                  분할 차분 테이블을 작성하고, Newton 보간 다항식을 구하시오.
                </p>
              </>
            }
            solution={
              <>
                <p className="text-purple-400 font-semibold text-sm">1차 분할 차분:</p>
                <MBlock>{"f[x_0, x_1] = \\frac{2-1}{1-0} = 1"}</MBlock>
                <MBlock>{"f[x_1, x_2] = \\frac{10-2}{3-1} = 4"}</MBlock>
                <MBlock>{"f[x_2, x_3] = \\frac{17-10}{4-3} = 7"}</MBlock>
                <p className="text-purple-400 font-semibold text-sm">2차 분할 차분:</p>
                <MBlock>{"f[x_0, x_1, x_2] = \\frac{4-1}{3-0} = 1"}</MBlock>
                <MBlock>{"f[x_1, x_2, x_3] = \\frac{7-4}{4-1} = 1"}</MBlock>
                <p className="text-purple-400 font-semibold text-sm">3차 분할 차분:</p>
                <MBlock>{"f[x_0, x_1, x_2, x_3] = \\frac{1-1}{4-0} = 0"}</MBlock>
                <p className="text-purple-400 font-semibold text-sm">Newton 보간 다항식:</p>
                <MBlock>{"P_3(x) = 1 + 1(x-0) + 1(x-0)(x-1) + 0 \\cdot (x-0)(x-1)(x-3)"}</MBlock>
                <MBlock>{"= 1 + x + x(x-1) = 1 + x + x^2 - x = x^2 + 1"}</MBlock>
              </>
            }
          />

          <Problem
            number={3}
            title="고차 보간의 한계"
            statement={
              <>
                <p>
                  보간 다항식의 차수를 높이면 항상 더 좋은 근사를 얻을 수 있을까요?
                  아닌 경우, 그 이유와 해결책을 설명하시오.
                </p>
              </>
            }
            solution={
              <>
                <p className="text-slate-300 text-sm">
                  <strong className="text-white">아니오.</strong> 등간격 노드에서 고차 다항식 보간을 사용하면 <strong>Runge 현상</strong>이 발생할 수 있습니다.
                </p>
                <p className="text-purple-400 font-semibold text-sm mt-3">이유:</p>
                <p className="text-slate-400 text-sm">
                  보간 오차는 다음과 같이 표현됩니다:
                </p>
                <MBlock>{"f(x) - P_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!} \\prod_{i=0}^{n}(x - x_i)"}</MBlock>
                <p className="text-slate-400 text-sm">
                  등간격 노드의 경우, 구간 양 끝에서 <M>{`\\prod(x - x_i)`}</M> 항이 매우 커지며,
                  <M>{"f^{(n+1)}"}</M>의 증가 속도가 <M>{"(n+1)!"}</M>보다 빠르면 오차가 발산합니다.
                </p>
                <p className="text-purple-400 font-semibold text-sm mt-3">해결책:</p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>1. <strong className="text-violet-400">Chebyshev 노드</strong> 사용: <M>{`\\prod |x - x_i|`}</M>를 최소화</li>
                  <li>2. <strong className="text-violet-400">Cubic Spline</strong> 사용: 저차 다항식의 구간별 보간</li>
                  <li>3. <strong className="text-violet-400">최소제곱 근사</strong>: 모든 점을 지나지 않고 전체 오차를 최소화</li>
                </ul>
              </>
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
