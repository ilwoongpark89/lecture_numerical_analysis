"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function ConvergenceConditions() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Convergence Conditions</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            반복법이 수렴하는 조건과 수렴 속도
          </p>
        </motion.div>

        {/* Diagonal Dominance */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">대각 우세 (Diagonal Dominance)</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
                <p className="text-slate-500 text-xs uppercase tracking-wider">Strictly diagonally dominant</p>
                <MBlock>{"|a_{ii}| > \\sum_{\\substack{j=1 \\\\ j \\neq i}}^{n} |a_{ij}|, \\quad \\forall\\, i"}</MBlock>
                <p className="text-slate-400 text-xs leading-relaxed">
                  각 행에서 대각 원소의 절댓값이 나머지 원소 절댓값의 합보다 크면,
                  Jacobi와 Gauss-Seidel 모두 <span className="text-emerald-400">수렴이 보장</span>됩니다.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 font-mono text-xs text-emerald-400">
                대각 우세는 <strong>충분 조건</strong>입니다. 대각 우세가 아니어도 수렴할 수 있습니다.
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
                <p className="text-sky-400 font-bold text-xs">예: 대각 우세 행렬</p>
                <MBlock>{"\\begin{bmatrix} \\mathbf{4} & -1 & 1 \\\\ 4 & \\mathbf{-8} & 1 \\\\ -2 & 1 & \\mathbf{5} \\end{bmatrix}"}</MBlock>
                <p className="text-slate-400 text-xs">
                  Row 1: |4| = 4 &gt; |-1| + |1| = 2 ✓<br />
                  Row 2: |-8| = 8 &gt; |4| + |1| = 5 ✓<br />
                  Row 3: |5| = 5 &gt; |-2| + |1| = 3 ✓
                </p>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
                <p className="text-rose-400 font-bold text-xs">예: 대각 우세 아님</p>
                <MBlock>{"\\begin{bmatrix} \\mathbf{1} & 2 & 3 \\\\ 4 & \\mathbf{5} & 6 \\\\ 7 & 8 & \\mathbf{9} \\end{bmatrix}"}</MBlock>
                <p className="text-slate-400 text-xs">
                  Row 1: |1| = 1 &lt; |2| + |3| = 5 ✗
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Spectral Radius */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">스펙트럴 반경 (Spectral Radius)</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm space-y-3">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Necessary and sufficient condition</p>
              <MBlock>{"\\rho(T) < 1"}</MBlock>
              <p className="text-slate-400 text-xs leading-relaxed">
                반복 행렬 <M>{"T"}</M>의 스펙트럴 반경(가장 큰 고유값의 절댓값)이 1보다 작으면
                수렴합니다. <M>{"\\rho"}</M>가 작을수록 빠르게 수렴합니다.
              </p>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs">
                <p className="text-sky-400 font-bold">Jacobi iteration matrix</p>
                <MBlock>{"T_J = -D^{-1}(L + U)"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs">
                <p className="text-blue-400 font-bold">Gauss-Seidel iteration matrix</p>
                <MBlock>{"T_{GS} = -(D + L)^{-1} U"}</MBlock>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">방법 비교</h3>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-800">
                  <th className="py-3 px-3 text-left">항목</th>
                  <th className="py-3 px-3 text-center">Jacobi</th>
                  <th className="py-3 px-3 text-center">Gauss-Seidel</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">값 갱신</td>
                  <td className="py-3 px-3 text-center text-sky-400">모두 이전 값</td>
                  <td className="py-3 px-3 text-center text-blue-400">최신 값 즉시 사용</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">수렴 속도</td>
                  <td className="py-3 px-3 text-center">느림</td>
                  <td className="py-3 px-3 text-center text-blue-400">보통 2배 빠름</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">병렬화</td>
                  <td className="py-3 px-3 text-center text-emerald-400">쉬움</td>
                  <td className="py-3 px-3 text-center text-amber-400">어려움 (순차 의존)</td>
                </tr>
                <tr className="border-b border-slate-800/50">
                  <td className="py-3 px-3 text-slate-400">메모리</td>
                  <td className="py-3 px-3 text-center text-amber-400">2n (old + new)</td>
                  <td className="py-3 px-3 text-center text-emerald-400">n (in-place)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-400">수렴 조건</td>
                  <td className="py-3 px-3 text-center" colSpan={2}>대각 우세 시 둘 다 수렴</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
