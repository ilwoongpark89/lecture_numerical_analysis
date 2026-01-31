"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function PartialPivoting() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Partial Pivoting</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            수치 안정성을 위한 행 교환 전략
          </p>
        </motion.div>

        {/* Why Pivoting */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">왜 피벗팅이 필요한가?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="leading-relaxed">Naive Gauss elimination의 두 가지 문제:</p>
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2 text-xs">
                <p className="text-rose-400 font-bold">Problem 1: 0 피벗</p>
                <p className="text-slate-400"><M>{"a_{kk}^{(k)} = 0"}</M>이면 나눗셈 불가 (division by zero)</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2 text-xs">
                <p className="text-amber-400 font-bold">Problem 2: 작은 피벗</p>
                <p className="text-slate-400"><M>{"a_{kk}^{(k)} \\approx 0"}</M>이면 큰 배수가 생겨 반올림 오차가 증폭됩니다</p>
              </div>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Example: small pivot problem</p>
              <MBlock>{"\\begin{bmatrix} 0.0001 & 1 \\\\ 1 & 1 \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}"}</MBlock>
              <p className="text-slate-400 text-xs leading-relaxed">
                피벗 없이 풀면: <M>{"x_1 = 0,\\; x_2 = 1"}</M> (부정확)<br />
                피벗 후: <M>{"x_1 = 1.0001,\\; x_2 = 0.9999"}</M> (정확)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Algorithm */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-violet-400">부분 피벗팅 알고리즘</h3>
          <div className="space-y-4 font-mono text-sm text-slate-300">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-indigo-400 font-bold">Partial Pivoting Strategy</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                각 소거 단계 <M>{"k"}</M>에서, <M>{"k"}</M>열의 피벗 아래 원소 중
                <span className="text-indigo-400"> 절댓값이 가장 큰 행</span>을 피벗 행으로 선택하여 교환합니다.
              </p>
              <MBlock>{"p = \\arg\\max_{i \\geq k} |a_{ik}^{(k)}|"}</MBlock>
              <p className="text-slate-400 text-xs">행 <M>{"k"}</M>와 행 <M>{"p"}</M>를 교환 후 소거 진행</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { type: "No Pivoting", desc: "행 교환 없음. 0 피벗 시 실패", risk: "높음" },
                { type: "Partial Pivoting", desc: "열에서 최대 절댓값 행과 교환", risk: "매우 낮음" },
                { type: "Scaled Partial", desc: "행의 스케일을 고려한 피벗팅", risk: "최소" },
              ].map((p) => (
                <div key={p.type} className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs">
                  <p className="text-indigo-400 font-bold text-sm">{p.type}</p>
                  <p className="text-slate-400 mt-1">{p.desc}</p>
                  <p className="text-slate-500 mt-2">오차 위험: {p.risk}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* MATLAB */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">MATLAB with Partial Pivoting</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`function x = gauss_pivot(A, b)
% GAUSS_PIVOT  Gauss elimination with partial pivoting

  n = length(b);
  Aug = [A, b(:)];

  for k = 1:n-1
      % Partial pivoting: find max in column k
      [~, p] = max(abs(Aug(k:n, k)));
      p = p + k - 1;

      % Swap rows k and p
      if p ~= k
          Aug([k p], :) = Aug([p k], :);
      end

      % Elimination
      for i = k+1:n
          factor = Aug(i,k) / Aug(k,k);
          Aug(i, k:n+1) = Aug(i, k:n+1) - factor * Aug(k, k:n+1);
      end
  end

  % Back substitution
  x = zeros(n, 1);
  x(n) = Aug(n, n+1) / Aug(n, n);
  for i = n-1:-1:1
      x(i) = (Aug(i, n+1) - Aug(i, i+1:n) * x(i+1:n)) / Aug(i, i);
  end
end`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
