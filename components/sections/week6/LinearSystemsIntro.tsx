"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function LinearSystemsIntro() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Week 6 &mdash; Gauss Elimination
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Linear Systems</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            연립일차방정식 &mdash; 공학의 가장 기본적인 수치 문제
          </p>
        </motion.div>

        {/* Why Linear Systems Matter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">왜 연립방정식인가?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="leading-relaxed">
                공학의 거의 모든 수치 문제는 결국 연립일차방정식 <M>{"A\\mathbf{x} = \\mathbf{b}"}</M>를 푸는 것으로 귀결됩니다.
              </p>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li className="flex gap-2"><span className="text-indigo-400">&#x2022;</span>구조 해석 (FEM): 강성 행렬 방정식</li>
                <li className="flex gap-2"><span className="text-indigo-400">&#x2022;</span>전기 회로: Kirchhoff 법칙</li>
                <li className="flex gap-2"><span className="text-indigo-400">&#x2022;</span>유체 역학 (CFD): 이산화된 Navier-Stokes</li>
                <li className="flex gap-2"><span className="text-indigo-400">&#x2022;</span>열전달: 유한차분 온도 분포</li>
                <li className="flex gap-2"><span className="text-indigo-400">&#x2022;</span>최소자승법: 정규방정식</li>
              </ul>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Matrix form</p>
              <MBlock>{"A\\mathbf{x} = \\mathbf{b}"}</MBlock>
              <MBlock>{"\\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{n1} & a_{n2} & \\cdots & a_{nn} \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\\\ \\vdots \\\\ x_n \\end{bmatrix} = \\begin{bmatrix} b_1 \\\\ b_2 \\\\ \\vdots \\\\ b_n \\end{bmatrix}"}</MBlock>
              <p className="text-slate-400 text-xs">
                <M>{"A"}</M>: 계수 행렬 (<M>{"n \\times n"}</M>), <M>{"\\mathbf{x}"}</M>: 미지수 벡터, <M>{"\\mathbf{b}"}</M>: 우변 벡터
              </p>
            </div>
          </div>
        </motion.div>

        {/* Types of Solutions */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-violet-400">해의 종류</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "유일한 해", desc: "det(A) ≠ 0", detail: "정칙 행렬 — 유일한 해가 존재", color: "emerald" },
              { title: "해 없음", desc: "비일관계 (inconsistent)", detail: "모순된 방정식이 존재", color: "rose" },
              { title: "무한개의 해", desc: "det(A) = 0 (일관)", detail: "자유 변수가 존재", color: "amber" },
            ].map((s) => (
              <div key={s.title} className={`rounded-2xl border p-5 font-mono bg-${s.color}-500/5 border-${s.color}-500/20`}>
                <p className={`text-lg font-bold text-${s.color}-400`}>{s.title}</p>
                <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
                <p className="text-xs text-slate-500 mt-2">{s.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2x2 Visual Example */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">2x2 예제</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <MBlock>{"\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}"}</MBlock>
              <MBlock>{"\\begin{bmatrix} 2 & 1 \\\\ 1 & -1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 1 \\end{bmatrix}"}</MBlock>
              <p className="text-slate-400 text-xs">해: <M>{"x = 2, \\; y = 1"}</M></p>
            </div>
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <p className="leading-relaxed">
                기하학적 의미: 두 직선의 <span className="text-indigo-400">교점</span>이 해입니다.
              </p>
              <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
                <line x1="30" y1="150" x2="270" y2="150" stroke="#475569" strokeWidth={1} />
                <line x1="150" y1="30" x2="150" y2="270" stroke="#475569" strokeWidth={1} />
                {/* 2x + y = 5: y = 5 - 2x => at x=0,y=5; x=2.5,y=0 */}
                <line x1="70" y1="30" x2="230" y2="270" stroke="#818cf8" strokeWidth={2} />
                {/* x - y = 1: y = x - 1 => at x=0,y=-1; x=3,y=2 */}
                <line x1="70" y1="210" x2="270" y2="30" stroke="#a78bfa" strokeWidth={2} />
                <circle cx="190" cy="110" r={5} fill="#38bdf8" />
                <text x="200" y="105" fill="#38bdf8" fontSize={12} fontFamily="monospace">(2, 1)</text>
                <text x="230" y="260" fill="#818cf8" fontSize={10} fontFamily="monospace">2x+y=5</text>
                <text x="220" y="50" fill="#a78bfa" fontSize={10} fontFamily="monospace">x-y=1</text>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Direct vs Iterative */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-violet-400">풀이 방법 분류</h3>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-800">
                  <th className="py-3 px-3 text-left">항목</th>
                  <th className="py-3 px-3 text-center">직접법 (Direct)</th>
                  <th className="py-3 px-3 text-center">반복법 (Iterative)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">대표 알고리즘</td>
                  <td className="py-3 px-3 text-center text-indigo-400">Gauss, LU</td>
                  <td className="py-3 px-3 text-center text-sky-400">Jacobi, Gauss-Seidel</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">계산량</td>
                  <td className="py-3 px-3 text-center"><M>{"O(n^3)"}</M></td>
                  <td className="py-3 px-3 text-center"><M>{"O(kn^2)"}</M> (k: 반복 횟수)</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">적합한 크기</td>
                  <td className="py-3 px-3 text-center">소~중규모</td>
                  <td className="py-3 px-3 text-center">대규모 희소행렬</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-400">이번 주</td>
                  <td className="py-3 px-3 text-center text-indigo-400">Week 6</td>
                  <td className="py-3 px-3 text-center text-sky-400">Week 7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
