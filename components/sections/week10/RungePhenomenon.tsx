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

// Compute max interpolation error for equally spaced nodes
function rungeError(n: number): number {
  // Sample the Runge function at equally spaced points and compute max deviation
  const nodes: number[] = [];
  for (let i = 0; i <= n; i++) nodes.push(-1 + (2 * i) / n);
  // Evaluate at fine grid
  let maxErr = 0;
  for (let k = 0; k <= 200; k++) {
    const x = -1 + (2 * k) / 200;
    const trueVal = 1 / (1 + 25 * x * x);
    // Lagrange interpolation
    let p = 0;
    for (let i = 0; i <= n; i++) {
      let li = 1;
      for (let j = 0; j <= n; j++) {
        if (j !== i) li *= (x - nodes[j]) / (nodes[i] - nodes[j]);
      }
      p += (1 / (1 + 25 * nodes[i] * nodes[i])) * li;
    }
    maxErr = Math.max(maxErr, Math.abs(trueVal - p));
  }
  return maxErr;
}

function chebyshevError(n: number): number {
  const nodes: number[] = [];
  for (let k = 0; k <= n; k++) nodes.push(Math.cos(((2 * k + 1) * Math.PI) / (2 * (n + 1))));
  let maxErr = 0;
  for (let k = 0; k <= 200; k++) {
    const x = -1 + (2 * k) / 200;
    const trueVal = 1 / (1 + 25 * x * x);
    let p = 0;
    for (let i = 0; i <= n; i++) {
      let li = 1;
      for (let j = 0; j <= n; j++) {
        if (j !== i) li *= (x - nodes[j]) / (nodes[i] - nodes[j]);
      }
      p += (1 / (1 + 25 * nodes[i] * nodes[i])) * li;
    }
    maxErr = Math.max(maxErr, Math.abs(trueVal - p));
  }
  return maxErr;
}

const errorData = [4, 6, 8, 10, 14, 20].map((n) => ({
  n,
  equalErr: rungeError(n),
  chebyErr: chebyshevError(n),
}));

export default function RungePhenomenon() {
  const [selectedN, setSelectedN] = useState(10);
  const selected = errorData.find((d) => d.n === selectedN) || errorData[3];

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Runge 현상 (Runge&apos;s Phenomenon)
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            등간격 노드에서 고차 다항식 보간이 왜 위험한지 알아봅니다.
          </p>
        </motion.div>

        {/* What is Runge phenomenon */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">문제의 핵심</h3>
          <p className="text-slate-300">
            등간격(equally spaced) 노드에서 보간 다항식의 차수를 높이면, 구간 양 끝에서 극심한 진동(oscillation)이 발생합니다.
            직관적으로 &quot;더 많은 점 = 더 좋은 근사&quot;가 아닙니다!
          </p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 text-sm">
              <strong>대표적 예시:</strong> <M>{`f(x) = \\frac{1}{1+25x^2}`}</M> 를 <M>{"[-1, 1]"}</M> 에서 등간격 노드로 보간하면,
              <M>{"n \\to \\infty"}</M> 일 때 양 끝에서 오차가 <strong>발산</strong>합니다.
            </p>
          </div>
          <MBlock>{"\\max_{x \\in [-1,1]} |f(x) - P_n(x)| \\to \\infty \\quad \\text{as } n \\to \\infty"}</MBlock>
        </motion.div>

        {/* Interactive error comparison */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">등간격 vs Chebyshev 노드 비교</h3>
          <p className="text-slate-400 text-sm">
            노드 수 <M>{"n"}</M>을 선택하여 최대 보간 오차를 비교하세요.
          </p>

          <div className="flex flex-wrap gap-2">
            {errorData.map((d) => (
              <button
                key={d.n}
                onClick={() => setSelectedN(d.n)}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
                  selectedN === d.n
                    ? "bg-violet-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                n = {d.n}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 text-center space-y-3">
              <p className="text-red-400 font-semibold">등간격 노드</p>
              <p className="text-3xl font-mono text-white">{selected.equalErr.toExponential(2)}</p>
              <p className="text-slate-500 text-xs">최대 오차</p>
              {/* Error bar */}
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, selected.equalErr * 100)}%` }}
                />
              </div>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 text-center space-y-3">
              <p className="text-green-400 font-semibold">Chebyshev 노드</p>
              <p className="text-3xl font-mono text-white">{selected.chebyErr.toExponential(2)}</p>
              <p className="text-slate-500 text-xs">최대 오차</p>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, selected.chebyErr * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-2 px-3"><M>{"n"}</M></th>
                  <th className="py-2 px-3">등간격 최대 오차</th>
                  <th className="py-2 px-3">Chebyshev 최대 오차</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {errorData.map((d) => (
                  <tr
                    key={d.n}
                    className={`border-b border-slate-800 ${d.n === selectedN ? "bg-violet-500/10" : ""}`}
                  >
                    <td className="py-2 px-3 text-slate-300">{d.n}</td>
                    <td className="py-2 px-3 text-red-300">{d.equalErr.toExponential(2)}</td>
                    <td className="py-2 px-3 text-green-300">{d.chebyErr.toExponential(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Solutions */}
        <motion.div {...anim} className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-violet-400">해결 방법</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
              <h4 className="text-lg font-semibold text-purple-400">해결 1: Chebyshev 노드</h4>
              <p className="text-slate-300 text-sm">
                등간격 대신 Chebyshev 노드를 사용하면 양 끝에 노드가 밀집되어 진동을 억제합니다.
              </p>
              <MBlock>{"x_k = \\cos\\!\\left(\\frac{(2k+1)\\pi}{2(n+1)}\\right), \\quad k = 0, 1, \\ldots, n"}</MBlock>
              <p className="text-slate-400 text-sm">
                Chebyshev 노드는 <M>{`\\prod |x - x_i|`}</M>를 최소화하는 최적의 노드 배치입니다.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
              <h4 className="text-lg font-semibold text-purple-400">해결 2: 구간별 보간 (Splines)</h4>
              <p className="text-slate-300 text-sm">
                하나의 고차 다항식 대신, 각 구간에서 저차(보통 3차) 다항식을 사용하는 spline 보간을 사용합니다.
              </p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>- 각 구간에서 3차 다항식 사용</li>
                <li>- 매듭점에서 연속성, 미분 연속성 보장</li>
                <li>- Runge 현상 완전 회피</li>
                <li>- 실용적으로 가장 널리 사용됨</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Interpolation error bound */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-violet-400">보간 오차 공식</h3>
          <MBlock>{"f(x) - P_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!} \\prod_{i=0}^{n}(x - x_i)"}</MBlock>
          <p className="text-slate-300 text-sm">
            여기서 <M>{"\\xi"}</M>는 <M>{"x"}</M>와 모든 <M>{"x_i"}</M>를 포함하는 구간 내의 어떤 점입니다.
            Runge 함수의 경우 <M>{"f^{(n+1)}"}</M>이 매우 빠르게 증가하여, 등간격 노드에서는 <M>{"\\prod(x - x_i)"}</M> 항과 결합하여 발산합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
