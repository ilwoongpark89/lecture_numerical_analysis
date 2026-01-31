"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

export default function Week9Practice() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Practice</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Practice Problems</h2>
        </motion.div>

        {/* Problem 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-emerald-400">문제 1: 선형 회귀 및 R²</h3>
          <p className="text-slate-300 leading-relaxed">
            다음 데이터에 <M>{"y = a_0 + a_1 x"}</M>를 적합하고, <M>{"R^2"}</M>를 계산하시오.
          </p>
          <div className="overflow-x-auto">
            <table className="text-center border-collapse">
              <thead><tr className="border-b border-slate-700">
                <th className="py-2 px-4 text-teal-400"><M>{"x"}</M></th>
                <td className="py-2 px-4">0</td><td className="py-2 px-4">1</td><td className="py-2 px-4">2</td><td className="py-2 px-4">3</td><td className="py-2 px-4">4</td><td className="py-2 px-4">5</td>
              </tr></thead>
              <tbody><tr className="border-b border-slate-800">
                <th className="py-2 px-4 text-teal-400"><M>{"y"}</M></th>
                <td className="py-2 px-4">2.5</td><td className="py-2 px-4">3.5</td><td className="py-2 px-4">4.8</td><td className="py-2 px-4">5.9</td><td className="py-2 px-4">7.2</td><td className="py-2 px-4">8.3</td>
              </tr></tbody>
            </table>
          </div>

          <button onClick={() => toggle(0)} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium">
            {open === 0 ? "풀이 숨기기" : "풀이 보기"}
          </button>

          {open === 0 && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">합 계산</p>
                <MBlock>{"n=6,\\; \\sum x_i = 15,\\; \\sum x_i^2 = 55,\\; \\sum y_i = 32.2,\\; \\sum x_i y_i = 101.1"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">계수 계산</p>
                <MBlock>{"a_1 = \\frac{6(101.1) - 15(32.2)}{6(55) - 225} = \\frac{606.6 - 483}{105} = \\frac{123.6}{105} = 1.177"}</MBlock>
                <MBlock>{"a_0 = \\frac{32.2 - 1.177 \\times 15}{6} = \\frac{32.2 - 17.657}{6} = 2.424"}</MBlock>
                <p className="text-emerald-400 font-semibold"><M>{"y = 2.424 + 1.177x"}</M></p>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">R² 계산</p>
                <MBlock>{"\\bar{y} = 5.367,\\quad SS_{\\text{tot}} = 22.413"}</MBlock>
                <MBlock>{"SS_{\\text{res}} = (2.5-2.424)^2 + (3.5-3.601)^2 + \\cdots = 0.085"}</MBlock>
                <MBlock>{"R^2 = 1 - \\frac{0.085}{22.413} = 0.9962"}</MBlock>
              </div>
            </div>
          )}
        </motion.div>

        {/* Problem 2 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-teal-400">문제 2: 지수 모델 선형화</h3>
          <p className="text-slate-300 leading-relaxed">
            <M>{"y = ae^{bx}"}</M> 모델을 아래 데이터에 적합하시오. 선형화를 이용하시오.
          </p>
          <div className="overflow-x-auto">
            <table className="text-center border-collapse">
              <thead><tr className="border-b border-slate-700">
                <th className="py-2 px-4 text-teal-400"><M>{"x"}</M></th>
                <td className="py-2 px-4">1</td><td className="py-2 px-4">2</td><td className="py-2 px-4">3</td><td className="py-2 px-4">4</td><td className="py-2 px-4">5</td>
              </tr></thead>
              <tbody><tr className="border-b border-slate-800">
                <th className="py-2 px-4 text-teal-400"><M>{"y"}</M></th>
                <td className="py-2 px-4">4.0</td><td className="py-2 px-4">6.5</td><td className="py-2 px-4">10.0</td><td className="py-2 px-4">16.1</td><td className="py-2 px-4">25.0</td>
              </tr></tbody>
            </table>
          </div>

          <button onClick={() => toggle(1)} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium">
            {open === 1 ? "풀이 숨기기" : "풀이 보기"}
          </button>

          {open === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">변환: <M>{"Y = \\ln y"}</M></p>
                <div className="overflow-x-auto">
                  <table className="text-center text-sm border-collapse">
                    <thead><tr className="border-b border-slate-700">
                      <th className="py-2 px-3 text-teal-400"><M>{"x"}</M></th>
                      <td className="py-2 px-3">1</td><td className="py-2 px-3">2</td><td className="py-2 px-3">3</td><td className="py-2 px-3">4</td><td className="py-2 px-3">5</td>
                    </tr></thead>
                    <tbody><tr className="border-b border-slate-800">
                      <th className="py-2 px-3 text-teal-400"><M>{"Y = \\ln y"}</M></th>
                      <td className="py-2 px-3">1.386</td><td className="py-2 px-3">1.872</td><td className="py-2 px-3">2.303</td><td className="py-2 px-3">2.779</td><td className="py-2 px-3">3.219</td>
                    </tr></tbody>
                  </table>
                </div>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm"><M>{"Y = A_0 + A_1 x"}</M>에 대한 선형 회귀</p>
                <MBlock>{"\\sum Y_i = 11.559,\\quad \\sum x_i Y_i = 38.326"}</MBlock>
                <MBlock>{"A_1 = \\frac{5(38.326) - 15(11.559)}{50} = \\frac{191.63 - 173.385}{50} = 0.4649"}</MBlock>
                <MBlock>{"A_0 = \\frac{11.559 - 0.4649 \\times 15}{5} = 0.9168"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">매개변수 복원</p>
                <MBlock>{"a = e^{A_0} = e^{0.9168} = 2.502,\\quad b = A_1 = 0.4649"}</MBlock>
                <p className="text-emerald-400 font-semibold text-lg"><M>{"y = 2.502 \\, e^{0.465x}"}</M></p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Problem 3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-emerald-400">문제 3: 2차 다항 회귀</h3>
          <p className="text-slate-300 leading-relaxed">
            아래 데이터에 <M>{"y = a_0 + a_1 x + a_2 x^2"}</M>를 적합하고, 선형 적합과 <M>{"R^2"}</M>를 비교하시오.
          </p>
          <div className="overflow-x-auto">
            <table className="text-center border-collapse">
              <thead><tr className="border-b border-slate-700">
                <th className="py-2 px-4 text-teal-400"><M>{"x"}</M></th>
                <td className="py-2 px-4">0</td><td className="py-2 px-4">1</td><td className="py-2 px-4">2</td><td className="py-2 px-4">3</td><td className="py-2 px-4">4</td><td className="py-2 px-4">5</td>
              </tr></thead>
              <tbody><tr className="border-b border-slate-800">
                <th className="py-2 px-4 text-teal-400"><M>{"y"}</M></th>
                <td className="py-2 px-4">1.0</td><td className="py-2 px-4">2.7</td><td className="py-2 px-4">5.8</td><td className="py-2 px-4">11.2</td><td className="py-2 px-4">17.5</td><td className="py-2 px-4">26.1</td>
              </tr></tbody>
            </table>
          </div>

          <button onClick={() => toggle(2)} className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors font-medium">
            {open === 2 ? "풀이 숨기기" : "풀이 보기"}
          </button>

          {open === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">Vandermonde 행렬 구성</p>
                <MBlock>{"\\mathbf{X} = \\begin{bmatrix} 1&0&0 \\\\ 1&1&1 \\\\ 1&2&4 \\\\ 1&3&9 \\\\ 1&4&16 \\\\ 1&5&25 \\end{bmatrix}"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">정규방정식 <M>{"(\\mathbf{X}^T\\mathbf{X})\\mathbf{a} = \\mathbf{X}^T\\mathbf{y}"}</M></p>
                <MBlock>{"\\begin{bmatrix} 6&15&55 \\\\ 15&55&225 \\\\ 55&225&979 \\end{bmatrix} \\begin{bmatrix} a_0\\\\a_1\\\\a_2 \\end{bmatrix} = \\begin{bmatrix} 64.3\\\\219.0\\\\855.5 \\end{bmatrix}"}</MBlock>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">풀이 결과</p>
                <MBlock>{"a_0 \\approx 1.043,\\quad a_1 \\approx 0.929,\\quad a_2 \\approx 0.886"}</MBlock>
                <p className="text-emerald-400 font-semibold"><M>{"y = 1.043 + 0.929x + 0.886x^2"}</M></p>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
                <p className="text-teal-400 font-semibold text-sm">R² 비교</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 text-center">
                    <p className="text-sm text-slate-400">선형 (1차)</p>
                    <p className="text-xl font-bold text-yellow-400"><M>{"R^2 \\approx 0.978"}</M></p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-900 border border-emerald-500/30 text-center">
                    <p className="text-sm text-slate-400">2차 다항식</p>
                    <p className="text-xl font-bold text-emerald-400"><M>{"R^2 \\approx 0.999"}</M></p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-2">2차 다항식이 훨씬 더 좋은 적합을 보여줍니다.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
