"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function NonlinearLinearization() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Linearization</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">비선형 회귀의 선형화</h2>
          <p className="text-lg text-slate-400">Linearization of Nonlinear Models</p>
        </motion.div>

        {/* Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4">
          <h3 className="text-2xl font-bold text-emerald-400">아이디어</h3>
          <p className="text-slate-300 leading-relaxed">
            비선형 모델을 적절한 변수 변환을 통해 선형 형태로 바꾸면, 앞서 배운 선형 회귀를 그대로 적용할 수 있습니다.
            변환된 변수에 대해 회귀를 수행한 뒤 원래 매개변수를 복원합니다.
          </p>
        </motion.div>

        {/* Exponential Model */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">1. 지수 모델 (Exponential)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-sm text-slate-400 font-semibold">원래 모델</p>
              <MBlock>{"y = a \\, e^{bx}"}</MBlock>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-emerald-500/30 space-y-3">
              <p className="text-sm text-emerald-400 font-semibold">선형화</p>
              <MBlock>{"\\ln y = \\ln a + b \\, x"}</MBlock>
            </div>
          </div>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
            <p className="text-slate-300 text-sm">
              <strong className="text-teal-400">회귀 변수:</strong> <M>{"Y = \\ln y"}</M>, <M>{"X = x"}</M>로 놓고 <M>{"Y = A_0 + A_1 X"}</M>에 적합
            </p>
            <p className="text-slate-300 text-sm">
              <strong className="text-teal-400">매개변수 복원:</strong> <M>{"a = e^{A_0}"}</M>, <M>{"b = A_1"}</M>
            </p>
          </div>
        </motion.div>

        {/* Power Model */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">2. 거듭제곱 모델 (Power)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-sm text-slate-400 font-semibold">원래 모델</p>
              <MBlock>{"y = a \\, x^b"}</MBlock>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-emerald-500/30 space-y-3">
              <p className="text-sm text-emerald-400 font-semibold">선형화</p>
              <MBlock>{"\\ln y = \\ln a + b \\, \\ln x"}</MBlock>
            </div>
          </div>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
            <p className="text-slate-300 text-sm">
              <strong className="text-emerald-400">회귀 변수:</strong> <M>{"Y = \\ln y"}</M>, <M>{"X = \\ln x"}</M>로 놓고 <M>{"Y = A_0 + A_1 X"}</M>에 적합
            </p>
            <p className="text-slate-300 text-sm">
              <strong className="text-emerald-400">매개변수 복원:</strong> <M>{"a = e^{A_0}"}</M>, <M>{"b = A_1"}</M>
            </p>
          </div>
        </motion.div>

        {/* Saturation Model */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">3. 포화 모델 (Saturation / Michaelis-Menten)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
              <p className="text-sm text-slate-400 font-semibold">원래 모델</p>
              <MBlock>{"y = \\frac{a \\, x}{b + x}"}</MBlock>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-emerald-500/30 space-y-3">
              <p className="text-sm text-emerald-400 font-semibold">선형화 (역수 변환)</p>
              <MBlock>{"\\frac{1}{y} = \\frac{1}{a} + \\frac{b}{a} \\cdot \\frac{1}{x}"}</MBlock>
            </div>
          </div>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
            <p className="text-slate-300 text-sm">
              <strong className="text-teal-400">회귀 변수:</strong> <M>{"Y = 1/y"}</M>, <M>{"X = 1/x"}</M>로 놓고 <M>{"Y = A_0 + A_1 X"}</M>에 적합
            </p>
            <p className="text-slate-300 text-sm">
              <strong className="text-teal-400">매개변수 복원:</strong> <M>{"a = 1/A_0"}</M>, <M>{"b = A_1 / A_0 = A_1 \\cdot a"}</M>
            </p>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">비교 요약</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-4 text-teal-400">모델</th>
                  <th className="py-3 px-4 text-teal-400">원래 형태</th>
                  <th className="py-3 px-4 text-teal-400">변환</th>
                  <th className="py-3 px-4 text-teal-400">선형화 형태</th>
                  <th className="py-3 px-4 text-teal-400">복원</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 font-medium">지수</td>
                  <td className="py-3 px-4"><M>{"y = ae^{bx}"}</M></td>
                  <td className="py-3 px-4"><M>{"Y = \\ln y"}</M></td>
                  <td className="py-3 px-4"><M>{"Y = \\ln a + bx"}</M></td>
                  <td className="py-3 px-4"><M>{"a = e^{A_0}"}</M></td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 font-medium">거듭제곱</td>
                  <td className="py-3 px-4"><M>{"y = ax^b"}</M></td>
                  <td className="py-3 px-4"><M>{"Y = \\ln y,\\; X = \\ln x"}</M></td>
                  <td className="py-3 px-4"><M>{"Y = \\ln a + bX"}</M></td>
                  <td className="py-3 px-4"><M>{"a = e^{A_0}"}</M></td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 font-medium">포화</td>
                  <td className="py-3 px-4"><M>{"y = \\frac{ax}{b+x}"}</M></td>
                  <td className="py-3 px-4"><M>{"Y = 1/y,\\; X = 1/x"}</M></td>
                  <td className="py-3 px-4"><M>{"Y = \\frac{1}{a} + \\frac{b}{a}X"}</M></td>
                  <td className="py-3 px-4"><M>{"a = 1/A_0"}</M></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
