"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function RSquared() {
  const [showCalc, setShowCalc] = useState(false);

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Goodness of Fit</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">결정계수 R²</h2>
          <p className="text-lg text-slate-400">Coefficient of Determination</p>
        </motion.div>

        {/* Definition */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">정의</h3>
          <div className="bg-slate-950 rounded-xl p-6 border border-emerald-500/30">
            <MBlock>{"R^2 = 1 - \\frac{SS_{\\text{res}}}{SS_{\\text{tot}}}"}</MBlock>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
              <p className="text-teal-400 font-semibold text-sm">총 변동 (Total Sum of Squares)</p>
              <MBlock>{"SS_{\\text{tot}} = \\sum_{i=1}^{n} (y_i - \\bar{y})^2"}</MBlock>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
              <p className="text-teal-400 font-semibold text-sm">잔차 변동 (Residual Sum of Squares)</p>
              <MBlock>{"SS_{\\text{res}} = \\sum_{i=1}^{n} (y_i - f(x_i))^2"}</MBlock>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            참고: <M>{"SS_{\\text{tot}} = SS_{\\text{reg}} + SS_{\\text{res}}"}</M>, 여기서 <M>{"SS_{\\text{reg}} = \\sum (f(x_i) - \\bar{y})^2"}</M>는 회귀 변동입니다.
          </p>
        </motion.div>

        {/* Interpretation */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">해석</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 rounded-xl p-5 border border-emerald-500/30 text-center space-y-2">
              <p className="text-3xl font-bold text-emerald-400"><M>{"R^2 = 1"}</M></p>
              <p className="text-slate-300 text-sm">완벽한 적합</p>
              <p className="text-slate-500 text-xs">모든 점이 곡선 위에 존재</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-yellow-500/30 text-center space-y-2">
              <p className="text-3xl font-bold text-yellow-400"><M>{"0 < R^2 < 1"}</M></p>
              <p className="text-slate-300 text-sm">부분적 설명</p>
              <p className="text-slate-500 text-xs">변동의 일부를 모델이 설명</p>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-red-500/30 text-center space-y-2">
              <p className="text-3xl font-bold text-red-400"><M>{"R^2 = 0"}</M></p>
              <p className="text-slate-300 text-sm">설명력 없음</p>
              <p className="text-slate-500 text-xs">평균값만큼의 예측력</p>
            </div>
          </div>
        </motion.div>

        {/* Visual Decomposition */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">시각적 분해</h3>
          <p className="text-slate-300 text-sm mb-4">총 변동 <M>{"SS_{\\text{tot}}"}</M>이 회귀 변동과 잔차 변동으로 분해되는 과정:</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 w-24 shrink-0"><M>{"SS_{\\text{tot}}"}</M></span>
                <div className="flex-1 h-8 bg-slate-700 rounded-lg overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-500/80 rounded-lg" />
                </div>
                <span className="text-sm text-slate-400 w-16 text-right">100%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm justify-center">= 분해</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 w-24 shrink-0"><M>{"SS_{\\text{reg}}"}</M></span>
                <div className="flex-1 h-8 bg-slate-700 rounded-lg overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-lg" style={{ width: "85%" }} />
                </div>
                <span className="text-sm text-teal-400 w-16 text-right">R² %</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 w-24 shrink-0"><M>{"SS_{\\text{res}}"}</M></span>
                <div className="flex-1 h-8 bg-slate-700 rounded-lg overflow-hidden">
                  <div className="h-full bg-red-500/70 rounded-lg" style={{ width: "15%" }} />
                </div>
                <span className="text-sm text-red-400 w-16 text-right">(1-R²) %</span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm"><M>{"R^2"}</M>가 클수록 모델이 데이터 변동의 많은 부분을 설명합니다.</p>
        </motion.div>

        {/* Adjusted R² */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">수정된 결정계수 (Adjusted R²)</h3>
          <p className="text-slate-300 leading-relaxed">
            변수를 추가하면 <M>{"R^2"}</M>는 항상 증가합니다. 과적합을 방지하기 위해 자유도를 고려한 수정 지표를 사용합니다.
          </p>
          <div className="bg-slate-950 rounded-xl p-6 border border-teal-500/30">
            <MBlock>{"R^2_{\\text{adj}} = 1 - \\frac{(1 - R^2)(n - 1)}{n - p - 1}"}</MBlock>
          </div>
          <p className="text-slate-400 text-sm">
            여기서 <M>{"n"}</M>은 데이터 수, <M>{"p"}</M>는 독립변수의 수(다항 회귀에서 차수)입니다.
            불필요한 변수가 추가되면 <M>{"R^2_{\\text{adj}}"}</M>는 오히려 감소할 수 있습니다.
          </p>
        </motion.div>

        {/* Calculation Example */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">계산 예제</h3>
          <p className="text-slate-300 leading-relaxed">
            데이터 <M>{"\\{(1,2.1),(2,3.9),(3,6.2),(4,7.8),(5,10.1)\\}"}</M>, 회귀식 <M>{"y = 0.29 + 1.91x"}</M>에 대해 <M>{"R^2"}</M>를 구합니다.
          </p>

          <button onClick={() => setShowCalc(!showCalc)} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium">
            {showCalc ? "풀이 숨기기" : "풀이 보기"}
          </button>

          {showCalc && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">평균 계산</p>
                <MBlock>{"\\bar{y} = \\frac{2.1 + 3.9 + 6.2 + 7.8 + 10.1}{5} = 6.02"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">예측값 및 잔차</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-sm">
                    <thead><tr className="border-b border-slate-700">
                      <th className="py-2 px-3 text-teal-400"><M>{"x_i"}</M></th>
                      <th className="py-2 px-3 text-teal-400"><M>{"y_i"}</M></th>
                      <th className="py-2 px-3 text-teal-400"><M>{"f(x_i)"}</M></th>
                      <th className="py-2 px-3 text-teal-400"><M>{"(y_i - f)^2"}</M></th>
                      <th className="py-2 px-3 text-teal-400"><M>{"(y_i - \\bar{y})^2"}</M></th>
                    </tr></thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-800"><td className="py-2 px-3">1</td><td className="py-2 px-3">2.1</td><td className="py-2 px-3">2.20</td><td className="py-2 px-3">0.0100</td><td className="py-2 px-3">15.3664</td></tr>
                      <tr className="border-b border-slate-800"><td className="py-2 px-3">2</td><td className="py-2 px-3">3.9</td><td className="py-2 px-3">4.11</td><td className="py-2 px-3">0.0441</td><td className="py-2 px-3">4.4944</td></tr>
                      <tr className="border-b border-slate-800"><td className="py-2 px-3">3</td><td className="py-2 px-3">6.2</td><td className="py-2 px-3">6.02</td><td className="py-2 px-3">0.0324</td><td className="py-2 px-3">0.0324</td></tr>
                      <tr className="border-b border-slate-800"><td className="py-2 px-3">4</td><td className="py-2 px-3">7.8</td><td className="py-2 px-3">7.93</td><td className="py-2 px-3">0.0169</td><td className="py-2 px-3">3.1684</td></tr>
                      <tr className="border-b border-slate-800"><td className="py-2 px-3">5</td><td className="py-2 px-3">10.1</td><td className="py-2 px-3">9.84</td><td className="py-2 px-3">0.0676</td><td className="py-2 px-3">16.6464</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">결과</p>
                <MBlock>{"SS_{\\text{res}} = 0.0100 + 0.0441 + 0.0324 + 0.0169 + 0.0676 = 0.1710"}</MBlock>
                <MBlock>{"SS_{\\text{tot}} = 15.3664 + 4.4944 + 0.0324 + 3.1684 + 16.6464 = 39.708"}</MBlock>
                <MBlock>{"R^2 = 1 - \\frac{0.1710}{39.708} = 1 - 0.00431 = 0.9957"}</MBlock>
                <p className="text-emerald-400 font-bold text-lg mt-2">
                  <M>{"R^2 \\approx 0.996"}</M> -- 매우 좋은 적합!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
