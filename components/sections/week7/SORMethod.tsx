"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const A = [[4, -1, 1], [4, -8, 1], [-2, 1, 5]];
const b = [7, -21, 15];
const sol = [2, 4, 3];

function sorStep(xOld: number[], omega: number): number[] {
  const n = xOld.length;
  const x = [...xOld];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      if (j !== i) sum += A[i][j] * x[j];
    }
    const gsVal = (b[i] - sum) / A[i][i];
    x[i] = (1 - omega) * xOld[i] + omega * gsVal;
  }
  return x;
}

function runSOR(omega: number, maxIter: number): number[][] {
  const results: number[][] = [[0, 0, 0]];
  for (let k = 0; k < maxIter; k++) {
    results.push(sorStep(results[results.length - 1], omega));
    const err = Math.max(...results[results.length - 1].map((v, i) => Math.abs(v - sol[i])));
    if (err < 1e-8) break;
  }
  return results;
}

export default function SORMethod() {
  const [omega, setOmega] = useState(1.2);
  const results = runSOR(omega, 30);
  const errors = results.map((x) => Math.max(...x.map((v, i) => Math.abs(v - sol[i]))));

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">SOR Method</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            Successive Over-Relaxation &mdash; 완화 계수로 수렴 가속
          </p>
        </motion.div>

        {/* Formula */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">SOR 공식</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <MBlock>{"x_i^{(k+1)} = (1-\\omega)\\, x_i^{(k)} + \\omega \\cdot \\underbrace{\\frac{1}{a_{ii}}\\left(b_i - \\sum_{j \\neq i} a_{ij} x_j^{*}\\right)}_{\\text{Gauss-Seidel update}}"}</MBlock>
              <p className="text-slate-400 text-xs leading-relaxed">
                <M>{"\\omega"}</M>: 완화 계수 (relaxation factor)
              </p>
            </div>
            <div className="space-y-3">
              {[
                { range: "0 < ω < 1", name: "Under-relaxation", desc: "수렴이 불안정할 때 안정화", color: "amber" },
                { range: "ω = 1", name: "Gauss-Seidel", desc: "SOR의 특수 경우", color: "sky" },
                { range: "1 < ω < 2", name: "Over-relaxation", desc: "수렴 가속 (주 목적)", color: "blue" },
              ].map((c) => (
                <div key={c.range} className={`rounded-xl p-3 border font-mono text-xs bg-${c.color}-500/10 border-${c.color}-500/30`}>
                  <span className={`text-${c.color}-400 font-bold`}>{c.range}</span>
                  <span className="text-slate-300 ml-2">{c.name}</span>
                  <p className="text-slate-500 mt-1">{c.desc}</p>
                </div>
              ))}
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 font-mono text-xs text-rose-400">
                <M>{"\\omega \\geq 2"}</M> 또는 <M>{"\\omega \\leq 0"}</M>이면 발산합니다.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive omega slider */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">Interactive Demo &mdash; <M>{"\\omega"}</M> 조절</h3>
          <div className="flex items-center gap-4 font-mono text-sm">
            <span className="text-slate-400">ω =</span>
            <input
              type="range"
              min={0.2}
              max={1.9}
              step={0.1}
              value={omega}
              onChange={(e) => setOmega(parseFloat(e.target.value))}
              className="flex-1 accent-sky-400"
            />
            <span className="text-sky-400 font-bold w-12 text-right">{omega.toFixed(1)}</span>
          </div>
          <p className="text-xs font-mono text-slate-500">
            수렴까지 <span className="text-sky-400 font-bold">{results.length - 1}</span>회 반복 (max error &lt; 10⁻⁸)
            {omega === 1.0 && " — Gauss-Seidel과 동일"}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="py-1 px-2 text-left">k</th>
                  <th className="py-1 px-2 text-right"><M>{"x_1"}</M></th>
                  <th className="py-1 px-2 text-right"><M>{"x_2"}</M></th>
                  <th className="py-1 px-2 text-right"><M>{"x_3"}</M></th>
                  <th className="py-1 px-2 text-right">max error</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 12).map((x, k) => (
                  <tr key={k} className="border-b border-slate-800/50 text-slate-300">
                    <td className="py-1 px-2 text-sky-400">{k}</td>
                    <td className="py-1 px-2 text-right">{x[0].toFixed(6)}</td>
                    <td className="py-1 px-2 text-right">{x[1].toFixed(6)}</td>
                    <td className="py-1 px-2 text-right">{x[2].toFixed(6)}</td>
                    <td className="py-1 px-2 text-right text-amber-400">{errors[k].toExponential(2)}</td>
                  </tr>
                ))}
                {results.length > 12 && (
                  <tr><td colSpan={5} className="py-1 px-2 text-center text-slate-600">... {results.length - 12}행 더</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Applications */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">응용 분야</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "유한요소법 (FEM)", desc: "대규모 구조 해석의 강성 행렬은 희소 + 대각 우세" },
              { title: "전산유체역학 (CFD)", desc: "이산화된 Navier-Stokes의 압력 Poisson 방정식" },
              { title: "열전달 시뮬레이션", desc: "유한차분 격자의 온도 분포 계산" },
            ].map((app) => (
              <div key={app.title} className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs">
                <p className="text-sky-400 font-bold text-sm">{app.title}</p>
                <p className="text-slate-400 mt-2">{app.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
