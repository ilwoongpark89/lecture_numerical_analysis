"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

/* ── Bit layout data ── */
const exampleBits = {
  sign: ["0"],
  exponent: ["0","1","1","1","1","1","1","1","0","1","1"],
  mantissa: [
    "1","0","0","1","1","0","0","1","1","0","0","1","1","0","0","1",
    "1","0","0","1","1","0","0","1","1","0","0","1","1","0","0","1",
    "1","0","0","1","1","0","0","1","1","0","0","1","1","0","0","1",
    "1","0","1","0",
  ],
};

/* ── Component ── */
export default function FloatingPoint() {
  const [showBinary, setShowBinary] = useState(false);

  return (
    <section className="relative bg-slate-950 py-24 px-4 sm:px-6 overflow-hidden">
      {/* subtle bg glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-20">
        {/* ──────── 1. Header ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1 text-sm font-semibold text-amber-400 tracking-wide">
            IEEE 754
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            부동소수점 표현
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            컴퓨터는 유한한 비트로 실수를 표현하기 때문에, 모든 실수를 정확하게 저장할 수 없습니다.
            IEEE 754 표준은 부동소수점(floating-point) 수의 저장 방식을 정의하며,
            수치해석에서 발생하는 <span className="text-amber-400 font-medium">반올림 오차(round-off error)</span>의 근본 원인입니다.
          </p>
        </motion.div>

        {/* ──────── 2. Scientific Notation Analogy ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            부동소수점이란?&nbsp;
            <span className="text-amber-400">— Scientific Notation</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            과학적 표기법 <M>{"\\pm M \\times \\beta^{E}"}</M>와 동일한 원리입니다.
            컴퓨터는 <M>{"\\beta = 2"}</M>(이진수)를 사용하여 부호(sign), 지수(exponent), 가수(mantissa)를 각각 저장합니다.
          </p>

          {/* formula card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center">
            <div className="text-center">
              <MBlock>{"(-1)^{s} \\times 1.f \\times 2^{(e - 1023)}"}</MBlock>
            </div>
            <p className="mt-3 text-sm text-slate-500">Double precision (64-bit) 정규화 표현</p>
          </div>

          {/* 3 small cards: sign / exponent / mantissa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "부호 (Sign)", bits: "1 bit", color: "rose", desc: "양수(0) 또는 음수(1)" },
              { label: "지수 (Exponent)", bits: "11 bits", color: "amber", desc: "2의 거듭제곱, bias = 1023" },
              { label: "가수 (Mantissa)", bits: "52 bits", color: "blue", desc: "유효숫자, hidden bit 포함 53bit" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 * i }}
                className={`rounded-2xl bg-slate-900/60 border border-${item.color}-500/30 p-5 space-y-2`}
              >
                <p className={`text-${item.color}-400 font-semibold`}>{item.label}</p>
                <p className={`font-mono text-2xl text-${item.color}-300`}>{item.bits}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ──────── 2.5. 8-bit Mini Float ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            8비트로 이해하는 부동소수점
            <span className="text-amber-400"> — Mini Float</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            64비트는 너무 길어서 감이 안 잡힙니다. 먼저 <span className="text-amber-400 font-bold">8비트 미니 부동소수점</span>으로 원리를 이해해 봅시다.
            구조: <span className="text-rose-400 font-mono">부호 1bit</span> + <span className="text-amber-400 font-mono">지수 4bit</span> + <span className="text-blue-400 font-mono">가수 3bit</span>, bias = 7
          </p>

          {/* 8-bit structure diagram */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">구조</span>
            </div>
            <div className="flex gap-1 justify-center">
              <div className="w-14 h-12 flex flex-col items-center justify-center rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs">
                <span className="font-bold">S</span>
                <span className="text-[10px] text-rose-400/60">1bit</span>
              </div>
              {["E₃","E₂","E₁","E₀"].map((label, i) => (
                <div key={i} className="w-14 h-12 flex flex-col items-center justify-center rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs">
                  <span className="font-bold">{label}</span>
                  <span className="text-[10px] text-amber-400/60">지수</span>
                </div>
              ))}
              {["M₂","M₁","M₀"].map((label, i) => (
                <div key={i} className="w-14 h-12 flex flex-col items-center justify-center rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono text-xs">
                  <span className="font-bold">{label}</span>
                  <span className="text-[10px] text-blue-400/60">가수</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <MBlock>{"\\text{값} = (-1)^S \\times 1.M_2M_1M_0 \\times 2^{(E - 7)}"}</MBlock>
            </div>
          </div>

          {/* Example 1: 5.5 */}
          <div className="rounded-2xl bg-slate-900/60 border border-amber-500/20 p-6 space-y-4">
            <p className="text-amber-400 font-bold">예제 1: 십진수 5.5를 8비트로 표현하기</p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">1</span>
                <div className="text-slate-300 space-y-2">
                  <p>5.5를 이진수로 변환:</p>
                  <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1">
                    <p className="text-orange-300">정수 부분: 5 = 4 + 1 = <span className="text-white font-bold">101</span>₂</p>
                    <p className="text-orange-300">소수 부분: 0.5 = <span className="text-white font-bold">1</span>/2 = 0.<span className="text-white font-bold">1</span>₂</p>
                    <p className="text-orange-300">합치면: <span className="text-white font-bold">101.1₂</span></p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">2</span>
                <div className="text-slate-300 space-y-1">
                  <p>정규화 (소수점을 1.xxx 형태로):</p>
                  <p className="text-orange-300">101.1₂ = <span className="text-white font-bold">1.011</span> × 2<sup className="text-amber-400">2</sup></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">3</span>
                <div className="text-slate-300 space-y-1">
                  <p>각 필드 결정:</p>
                  <p>부호: <span className="text-rose-400">양수 → S = 0</span></p>
                  <p>지수: <span className="text-amber-300">E = 2 + 7(bias) = 9 = 1001₂</span></p>
                  <p>가수: <span className="text-blue-300">1.<u>011</u> → hidden bit 제거 → 011</span></p>
                </div>
              </div>
            </div>
            {/* Result bits */}
            <div className="flex gap-1 justify-center pt-2">
              {[
                { v: "0", c: "rose" },
                { v: "1", c: "amber" }, { v: "0", c: "amber" }, { v: "0", c: "amber" }, { v: "1", c: "amber" },
                { v: "0", c: "blue" }, { v: "1", c: "blue" }, { v: "1", c: "blue" },
              ].map((bit, i) => (
                <div key={i} className={`w-10 h-10 flex items-center justify-center rounded bg-${bit.c}-500/20 border border-${bit.c}-500/40 text-${bit.c}-300 font-mono text-sm font-bold`}>
                  {bit.v}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-400">
              검산: <M>{"(-1)^0 \\times 1.011_2 \\times 2^{9-7} = 1.375 \\times 4 = 5.5"}</M> ✓
            </p>
          </div>

          {/* Example 2: -0.375 */}
          <div className="rounded-2xl bg-slate-900/60 border border-amber-500/20 p-6 space-y-4">
            <p className="text-amber-400 font-bold">예제 2: 십진수 -0.375를 8비트로 표현하기</p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">1</span>
                <div className="text-slate-300 space-y-2">
                  <p>0.375를 이진수로 변환 — 분수로 생각하면 쉽습니다:</p>
                  <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-1">
                    <p className="text-slate-400 text-xs mb-2">이진 소수점 자릿값: 0.<span className="text-amber-300">1</span> = 1/2, 0.0<span className="text-amber-300">1</span> = 1/4, 0.00<span className="text-amber-300">1</span> = 1/8, …</p>
                    <p className="text-orange-300">0.375 = 3/8 = <span className="text-slate-500">0/2</span> + <span className="text-white font-bold">1/4</span> + <span className="text-white font-bold">1/8</span></p>
                    <p className="text-orange-300">→ 0.<span className="text-slate-500">0</span><span className="text-white font-bold">1</span><span className="text-white font-bold">1</span>₂ = <span className="text-white font-bold">0.011₂</span></p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">2</span>
                <div className="text-slate-300 space-y-1">
                  <p>정규화:</p>
                  <p className="text-orange-300">0.011₂ = <span className="text-white font-bold">1.1</span> × 2<sup className="text-amber-400">-2</sup></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">3</span>
                <div className="text-slate-300 space-y-1">
                  <p>각 필드:</p>
                  <p>부호: <span className="text-rose-400">음수 → S = 1</span></p>
                  <p>지수: <span className="text-amber-300">E = -2 + 7(bias) = 5 = 0101₂</span></p>
                  <p>가수: <span className="text-blue-300">1.<u>100</u> → hidden bit 제거 → 100</span></p>
                </div>
              </div>
            </div>
            <div className="flex gap-1 justify-center pt-2">
              {[
                { v: "1", c: "rose" },
                { v: "0", c: "amber" }, { v: "1", c: "amber" }, { v: "0", c: "amber" }, { v: "1", c: "amber" },
                { v: "1", c: "blue" }, { v: "0", c: "blue" }, { v: "0", c: "blue" },
              ].map((bit, i) => (
                <div key={i} className={`w-10 h-10 flex items-center justify-center rounded bg-${bit.c}-500/20 border border-${bit.c}-500/40 text-${bit.c}-300 font-mono text-sm font-bold`}>
                  {bit.v}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-400">
              검산: <M>{"(-1)^1 \\times 1.1_2 \\times 2^{5-7} = -1.5 \\times 0.25 = -0.375"}</M> ✓
            </p>
          </div>

          {/* Example 3: 0.1 - shows precision loss */}
          <div className="rounded-2xl bg-rose-500/5 border border-rose-500/20 p-6 space-y-4">
            <p className="text-rose-400 font-bold">예제 3: 십진수 0.1은 8비트로 정확히 표현할 수 없다!</p>
            <div className="space-y-3 font-mono text-sm">
              <div className="text-slate-300 space-y-1">
                <p>0.1₁₀ = 0.0<span className="text-rose-400">0011</span><span className="text-rose-400">0011</span>…₂ (무한 반복)</p>
                <p>정규화: 1.<span className="text-rose-400">100110011…</span> × 2<sup className="text-amber-400">-4</sup></p>
                <p>가수 3비트만 저장 가능 → 1.<span className="text-blue-400 font-bold">100</span><span className="text-rose-400/40 line-through">110011…</span> (나머지 버림!)</p>
              </div>
              <div className="flex gap-1 justify-center pt-2">
                {[
                  { v: "0", c: "rose" },
                  { v: "0", c: "amber" }, { v: "0", c: "amber" }, { v: "1", c: "amber" }, { v: "1", c: "amber" },
                  { v: "1", c: "blue" }, { v: "0", c: "blue" }, { v: "0", c: "blue" },
                ].map((bit, i) => (
                  <div key={i} className={`w-10 h-10 flex items-center justify-center rounded bg-${bit.c}-500/20 border border-${bit.c}-500/40 text-${bit.c}-300 font-mono text-sm font-bold`}>
                    {bit.v}
                  </div>
                ))}
              </div>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-1 text-xs">
                <p className="text-slate-400">저장된 값: <M>{"1.100_2 \\times 2^{-4} = 1.5 \\times 0.0625 = 0.09375"}</M></p>
                <p className="text-slate-400">원래 값: <span className="text-white">0.1</span></p>
                <p className="text-rose-400 font-bold">오차: 0.1 - 0.09375 = 0.00625 (6.25% 오차!)</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                64비트에서는 가수가 52비트이므로 오차가 <M>{"\\sim 10^{-17}"}</M> 수준으로 매우 작지만, <span className="text-rose-400">오차가 0은 아닙니다.</span> 이것이 부동소수점 오차의 본질입니다.
              </p>
            </div>
          </div>

          {/* 8-bit special values & range */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
            <p className="text-amber-400 font-bold text-lg">8비트 부동소수점의 특수값과 표현 범위</p>

            {/* Special values table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="text-slate-500 text-xs border-b border-slate-700">
                    <th className="py-2 px-3 text-left">비트 패턴</th>
                    <th className="py-2 px-3 text-left">의미</th>
                    <th className="py-2 px-3 text-right">십진수 값</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {/* +0 */}
                  <tr className="border-b border-slate-800/50 bg-slate-800/20">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">0000</span> <span className="text-blue-400">000</span></td>
                    <td className="py-2 px-3 text-emerald-400">+0 (양의 영)</td>
                    <td className="py-2 px-3 text-right text-white font-bold">0</td>
                  </tr>
                  {/* -0 */}
                  <tr className="border-b border-slate-800/50 bg-slate-800/20">
                    <td className="py-2 px-3"><span className="text-rose-400">1</span> <span className="text-amber-400">0000</span> <span className="text-blue-400">000</span></td>
                    <td className="py-2 px-3 text-emerald-400">-0 (음의 영)</td>
                    <td className="py-2 px-3 text-right text-white font-bold">-0</td>
                  </tr>
                  {/* smallest denorm */}
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">0000</span> <span className="text-blue-400">001</span></td>
                    <td className="py-2 px-3 text-purple-400">최소 비정규화수 <span className="text-slate-500 text-xs">(0.001₂ × 2⁻⁶)</span></td>
                    <td className="py-2 px-3 text-right text-white font-bold">0.0078125</td>
                  </tr>
                  {/* largest denorm */}
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">0000</span> <span className="text-blue-400">111</span></td>
                    <td className="py-2 px-3 text-purple-400">최대 비정규화수 <span className="text-slate-500 text-xs">(0.111₂ × 2⁻⁶)</span></td>
                    <td className="py-2 px-3 text-right text-white font-bold">0.0546875</td>
                  </tr>
                  {/* smallest normal */}
                  <tr className="border-b border-slate-800/50 bg-sky-500/5">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">0001</span> <span className="text-blue-400">000</span></td>
                    <td className="py-2 px-3 text-sky-400">최소 정규화수 <span className="text-slate-500 text-xs">(1.000₂ × 2⁻⁶)</span></td>
                    <td className="py-2 px-3 text-right text-white font-bold">0.015625</td>
                  </tr>
                  {/* 1.0 */}
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">0111</span> <span className="text-blue-400">000</span></td>
                    <td className="py-2 px-3 text-slate-400">1.0 <span className="text-slate-500 text-xs">(1.000₂ × 2⁰)</span></td>
                    <td className="py-2 px-3 text-right text-white font-bold">1.0</td>
                  </tr>
                  {/* some normals */}
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">1000</span> <span className="text-blue-400">000</span></td>
                    <td className="py-2 px-3 text-slate-400">2.0 <span className="text-slate-500 text-xs">(1.000₂ × 2¹)</span></td>
                    <td className="py-2 px-3 text-right text-white font-bold">2.0</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">1001</span> <span className="text-blue-400">011</span></td>
                    <td className="py-2 px-3 text-slate-400">5.5 <span className="text-slate-500 text-xs">(1.011₂ × 2²)</span></td>
                    <td className="py-2 px-3 text-right text-white font-bold">5.5</td>
                  </tr>
                  {/* largest normal */}
                  <tr className="border-b border-slate-800/50 bg-sky-500/5">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">1110</span> <span className="text-blue-400">111</span></td>
                    <td className="py-2 px-3 text-sky-400">최대 정규화수 <span className="text-slate-500 text-xs">(1.111₂ × 2⁷)</span></td>
                    <td className="py-2 px-3 text-right text-white font-bold">240</td>
                  </tr>
                  {/* +Inf */}
                  <tr className="border-b border-slate-800/50 bg-rose-500/5">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">1111</span> <span className="text-blue-400">000</span></td>
                    <td className="py-2 px-3 text-rose-400 font-bold">+Infinity</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">+∞</td>
                  </tr>
                  {/* -Inf */}
                  <tr className="border-b border-slate-800/50 bg-rose-500/5">
                    <td className="py-2 px-3"><span className="text-rose-400">1</span> <span className="text-amber-400">1111</span> <span className="text-blue-400">000</span></td>
                    <td className="py-2 px-3 text-rose-400 font-bold">-Infinity</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">-∞</td>
                  </tr>
                  {/* NaN */}
                  <tr className="bg-rose-500/5">
                    <td className="py-2 px-3"><span className="text-rose-400">0</span> <span className="text-amber-400">1111</span> <span className="text-blue-400">001~111</span></td>
                    <td className="py-2 px-3 text-rose-400 font-bold">NaN (Not a Number)</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">NaN</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rules summary */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-sm space-y-1">
                <p className="text-emerald-400 font-bold">E = 0000 → 특수</p>
                <p className="text-slate-400 text-xs">M = 000: <span className="text-white">±0</span></p>
                <p className="text-slate-400 text-xs">M ≠ 000: <span className="text-purple-400">비정규화수</span></p>
                <p className="text-slate-500 text-xs">(0.M × 2⁻⁶, hidden bit 없음)</p>
              </div>
              <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4 text-sm space-y-1">
                <p className="text-sky-400 font-bold">E = 0001~1110 → 정규화</p>
                <p className="text-slate-400 text-xs">일반적인 수의 표현</p>
                <p className="text-slate-500 text-xs">(1.M × 2^(E-7), hidden bit 있음)</p>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 text-sm space-y-1">
                <p className="text-rose-400 font-bold">E = 1111 → 특수</p>
                <p className="text-slate-400 text-xs">M = 000: <span className="text-white">±Infinity</span></p>
                <p className="text-slate-400 text-xs">M ≠ 000: <span className="text-rose-400">NaN</span></p>
              </div>
            </div>
          </div>

          {/* Number line visualization */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <p className="text-amber-400 font-bold text-lg">8비트 부동소수점의 수직선</p>
            <p className="text-slate-400 text-sm">양수 영역만 표시합니다. 음수는 부호 비트만 다르고 대칭입니다.</p>

            {/* SVG number line */}
            <div className="overflow-x-auto">
              <svg viewBox="0 0 760 120" className="w-full min-w-[600px]" xmlns="http://www.w3.org/2000/svg">
                {/* Main axis */}
                <line x1="30" y1="50" x2="730" y2="50" stroke="#475569" strokeWidth="2" />
                {/* Arrow tips */}
                <polygon points="28,50 36,46 36,54" fill="#475569" />
                <polygon points="732,50 724,46 724,54" fill="#475569" />

                {/* -∞ */}
                <rect x="32" y="30" width="44" height="40" rx="5" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.4)" strokeWidth="1" />
                <text x="54" y="54" textAnchor="middle" fill="#fb7185" fontSize="12" fontWeight="bold">−∞</text>

                {/* Negative normals */}
                <rect x="82" y="30" width="120" height="40" rx="5" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
                <text x="142" y="47" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="600">음수 정규화</text>
                <text x="142" y="60" textAnchor="middle" fill="#64748b" fontSize="7.5">−240 ~ −0.016</text>

                {/* Negative denorms */}
                <rect x="208" y="30" width="80" height="40" rx="5" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" />
                <text x="248" y="47" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">음수 비정규화</text>
                <text x="248" y="60" textAnchor="middle" fill="#64748b" fontSize="7.5">−0.055 ~ −0.008</text>

                {/* ±0 */}
                <rect x="294" y="26" width="36" height="48" rx="5" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
                <text x="312" y="54" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">±0</text>

                {/* Positive denorms */}
                <rect x="336" y="30" width="80" height="40" rx="5" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" />
                <text x="376" y="47" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">양수 비정규화</text>
                <text x="376" y="60" textAnchor="middle" fill="#64748b" fontSize="7.5">0.008 ~ 0.055</text>

                {/* Positive normals */}
                <rect x="422" y="30" width="230" height="40" rx="5" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
                <text x="537" y="47" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="600">양수 정규화</text>
                <text x="537" y="60" textAnchor="middle" fill="#64748b" fontSize="7.5">0.016 ~ 240</text>

                {/* +∞ */}
                <rect x="658" y="30" width="44" height="40" rx="5" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.4)" strokeWidth="1" />
                <text x="680" y="54" textAnchor="middle" fill="#fb7185" fontSize="12" fontWeight="bold">+∞</text>

                {/* Boundary ticks */}
                <line x1="294" y1="74" x2="294" y2="85" stroke="#64748b" strokeWidth="1" />
                <text x="294" y="95" textAnchor="middle" fill="#64748b" fontSize="7">−0.008</text>
                <line x1="336" y1="74" x2="336" y2="85" stroke="#64748b" strokeWidth="1" />
                <text x="336" y="95" textAnchor="middle" fill="#64748b" fontSize="7">+0.008</text>
                <line x1="422" y1="74" x2="422" y2="85" stroke="#64748b" strokeWidth="1" />
                <text x="422" y="95" textAnchor="middle" fill="#64748b" fontSize="7">0.016</text>
                <line x1="652" y1="74" x2="652" y2="85" stroke="#64748b" strokeWidth="1" />
                <text x="652" y="95" textAnchor="middle" fill="#64748b" fontSize="7">240</text>

                {/* NaN note */}
                <text x="380" y="115" textAnchor="middle" fill="#f43f5e" fontSize="9" fontStyle="italic">NaN은 수직선 위에 존재하지 않음 (E=1111, M≠0)</text>
              </svg>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm text-slate-400 space-y-1">
              <p className="text-amber-400 font-semibold">8비트 미니 float 요약:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>표현 가능한 가장 작은 양수 (비정규화): <span className="text-purple-400 font-mono">0.0078125</span> = <M>{"2^{-7}"}</M></li>
                <li>표현 가능한 가장 작은 정규화 양수: <span className="text-sky-400 font-mono">0.015625</span> = <M>{"2^{-6}"}</M></li>
                <li>표현 가능한 가장 큰 유한수: <span className="text-sky-400 font-mono">240</span> = <M>{"1.111_2 \\times 2^7 = 1.875 \\times 128"}</M></li>
                <li>240보다 큰 수를 표현하면 → <span className="text-rose-400 font-bold">Overflow → ∞</span></li>
                <li>0에 너무 가까운 수 → <span className="text-purple-400">비정규화수로 점진적 언더플로우</span></li>
              </ul>
            </div>
          </div>

          {/* representable numbers density */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <p className="text-amber-400 font-bold">표현 가능한 수의 밀도: 숫자가 커지면 간격이 넓어진다</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="text-slate-500 text-xs border-b border-slate-700">
                    <th className="py-2 px-3 text-left">구간</th>
                    <th className="py-2 px-3 text-center">표현 가능한 수 개수</th>
                    <th className="py-2 px-3 text-center">수 사이 간격</th>
                    <th className="py-2 px-3 text-left">예시</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3 text-white">0.5 ~ 1</td>
                    <td className="py-2 px-3 text-center text-amber-300">8개</td>
                    <td className="py-2 px-3 text-center">0.0625</td>
                    <td className="py-2 px-3 text-slate-400 text-xs">0.5, 0.5625, 0.625, …, 0.9375</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3 text-white">1 ~ 2</td>
                    <td className="py-2 px-3 text-center text-amber-300">8개</td>
                    <td className="py-2 px-3 text-center">0.125</td>
                    <td className="py-2 px-3 text-slate-400 text-xs">1.0, 1.125, 1.25, …, 1.875</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3 text-white">2 ~ 4</td>
                    <td className="py-2 px-3 text-center text-amber-300">8개</td>
                    <td className="py-2 px-3 text-center">0.25</td>
                    <td className="py-2 px-3 text-slate-400 text-xs">2.0, 2.25, 2.5, …, 3.75</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3 text-white">4 ~ 8</td>
                    <td className="py-2 px-3 text-center text-amber-300">8개</td>
                    <td className="py-2 px-3 text-center">0.5</td>
                    <td className="py-2 px-3 text-slate-400 text-xs">4.0, 4.5, 5.0, …, 7.5</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-3 text-white">64 ~ 128</td>
                    <td className="py-2 px-3 text-center text-amber-300">8개</td>
                    <td className="py-2 px-3 text-center text-rose-400 font-bold">8</td>
                    <td className="py-2 px-3 text-slate-400 text-xs">64, 72, 80, …, 120</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-white">128 ~ 240</td>
                    <td className="py-2 px-3 text-center text-amber-300">8개</td>
                    <td className="py-2 px-3 text-center text-rose-400 font-bold">16</td>
                    <td className="py-2 px-3 text-slate-400 text-xs">128, 144, 160, …, 240</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm text-slate-400 space-y-1">
              <p className="text-amber-400 font-semibold">관찰 포인트:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>각 구간마다 <span className="text-amber-300 font-bold">8개</span>의 수가 있습니다 (= 가수 3비트 = 2³ = 8가지)</li>
                <li>구간이 2배 넓어질 때마다 간격도 2배 → <span className="text-amber-400 font-medium">상대 오차(간격/값)는 일정</span></li>
                <li>128~240 구간에서는 간격이 16! → 예: 130이나 135 같은 수는 표현 불가</li>
                <li>→ 64비트도 원리는 동일. 단, 간격이 <M>{"\\sim 10^{-16}"}</M> 수준으로 매우 작을 뿐</li>
              </ul>
            </div>

            {/* Machine Epsilon preview */}
            <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4 text-sm space-y-2">
              <p className="text-sky-400 font-semibold">미리보기: Machine Epsilon (<M>{"\\varepsilon_{\\text{mach}}"}</M>)</p>
              <p className="text-slate-400 leading-relaxed">
                위 표에서 <span className="text-white font-bold">1 ~ 2 구간</span>의 간격을 보세요: <span className="text-amber-300 font-mono">0.125</span>입니다.
                이것이 바로 이 8비트 시스템의 <span className="text-sky-300 font-bold">Machine Epsilon</span>입니다.
              </p>
              <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 space-y-1">
                <p className="text-slate-300"><span className="text-sky-400 font-bold">Machine Epsilon</span> = 1에 더했을 때 <span className="text-white">1이 아닌 다른 수</span>가 되는 가장 작은 값</p>
                <p className="text-slate-300">= 1과 그 다음 표현 가능한 수 사이의 간격</p>
                <p className="text-slate-300">= <M>{"2^{-t}"}</M> (t = 가수 비트 수)</p>
              </div>

              {/* Rounding explanation with number line */}
              <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-3">
                <p className="text-sky-300 font-semibold text-xs">그렇다면 1.0에 얼마까지 더해야 1.0으로 반올림될까?</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  1.0과 다음 수(1.125) 사이의 간격이 <span className="text-amber-300 font-bold">ε_mach = 0.125</span>이므로,
                  그 <span className="text-rose-300 font-bold">중간점 = ε_mach ÷ 2 = 0.0625</span>가 반올림 경계입니다.
                </p>
                <svg viewBox="0 0 600 100" className="w-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Axis */}
                  <line x1="40" y1="45" x2="560" y2="45" stroke="#475569" strokeWidth="1.5" />

                  {/* 1.0 */}
                  <line x1="80" y1="30" x2="80" y2="60" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="80" cy="45" r="4" fill="#ffffff" />
                  <text x="80" y="22" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">1.0</text>
                  <text x="80" y="75" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">1.000₂</text>

                  {/* eps/2 midpoint (반올림 경계) */}
                  <line x1="260" y1="30" x2="260" y2="60" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,3" />
                  <text x="260" y="22" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="bold">반올림 경계</text>
                  <text x="260" y="75" textAnchor="middle" fill="#f43f5e" fontSize="8" fontFamily="monospace">1.0 + ε/2</text>
                  <text x="260" y="87" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">= 1.0 + 0.0625</text>

                  {/* 1.0 + eps = 1.125 */}
                  <line x1="440" y1="30" x2="440" y2="60" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="440" cy="45" r="4" fill="#38bdf8" />
                  <text x="440" y="22" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">1.125</text>
                  <text x="440" y="75" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">1.001₂</text>

                  {/* Round-down zone */}
                  <rect x="85" y="35" width="170" height="20" rx="3" fill="rgba(244,63,94,0.1)" />
                  <text x="170" y="49" textAnchor="middle" fill="#fb7185" fontSize="8">← 여기 더하면 1.0으로 반올림</text>

                  {/* Round-up zone */}
                  <rect x="265" y="35" width="170" height="20" rx="3" fill="rgba(56,189,248,0.1)" />
                  <text x="350" y="49" textAnchor="middle" fill="#38bdf8" fontSize="8">여기 더하면 1.125로 반올림 →</text>
                </svg>
                <div className="text-xs text-slate-400 space-y-1">
                  <p><span className="text-rose-400 font-bold">1.0 + x → 1.0</span>: x가 <M>{"\\varepsilon/2 = 0.0625"}</M> 미만이면, 1.0에 더 가까우므로 <span className="text-rose-300">1.0으로 반올림</span></p>
                  <p><span className="text-sky-400 font-bold">1.0 + x → 1.125</span>: x가 <M>{"\\varepsilon/2 = 0.0625"}</M> 이상이면, 1.125에 더 가까우므로 <span className="text-sky-300">1.125로 반올림</span></p>
                  <p className="text-slate-500 mt-1">→ 즉, <M>{"\\varepsilon_{\\text{mach}}/2"}</M>보다 작은 변화는 <span className="text-white font-bold">완전히 사라집니다</span>. 이것이 반올림 오차의 핵심입니다.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-2 text-center">
                  <p className="text-slate-500 text-xs">8비트 (가수 3bit)</p>
                  <p className="text-sky-300 font-mono font-bold"><M>{"2^{-3} = 0.125"}</M></p>
                </div>
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-2 text-center">
                  <p className="text-slate-500 text-xs">32비트 (가수 23bit)</p>
                  <p className="text-sky-300 font-mono font-bold"><M>{"2^{-23} \\approx 1.2 \\times 10^{-7}"}</M></p>
                </div>
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-2 text-center">
                  <p className="text-slate-500 text-xs">64비트 (가수 52bit)</p>
                  <p className="text-sky-300 font-mono font-bold"><M>{"2^{-52} \\approx 2.2 \\times 10^{-16}"}</M></p>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-1">→ 다음 섹션에서 Machine Epsilon을 더 자세히 다룹니다.</p>
            </div>
          </div>

          {/* 8-bit to 64-bit bridge */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <p className="text-amber-400 font-bold mb-4">8비트 → 64비트: 원리는 같고 정밀도만 다르다</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs border-b border-slate-700">
                    <th className="py-2 px-4 text-left">항목</th>
                    <th className="py-2 px-4 text-center">8비트 (미니)</th>
                    <th className="py-2 px-4 text-center">32비트 (single)</th>
                    <th className="py-2 px-4 text-center">64비트 (double)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-4 text-rose-400">부호</td>
                    <td className="py-2 px-4 text-center">1 bit</td>
                    <td className="py-2 px-4 text-center">1 bit</td>
                    <td className="py-2 px-4 text-center">1 bit</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-4 text-amber-400">지수</td>
                    <td className="py-2 px-4 text-center">4 bits (bias 7)</td>
                    <td className="py-2 px-4 text-center">8 bits (bias 127)</td>
                    <td className="py-2 px-4 text-center">11 bits (bias 1023)</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-4 text-blue-400">가수</td>
                    <td className="py-2 px-4 text-center">3 bits</td>
                    <td className="py-2 px-4 text-center">23 bits</td>
                    <td className="py-2 px-4 text-center">52 bits</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 px-4 text-slate-400">유효숫자</td>
                    <td className="py-2 px-4 text-center">~1자리</td>
                    <td className="py-2 px-4 text-center">~7자리</td>
                    <td className="py-2 px-4 text-center">~16자리</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-slate-400">Machine epsilon</td>
                    <td className="py-2 px-4 text-center"><M>{"2^{-3} = 0.125"}</M></td>
                    <td className="py-2 px-4 text-center"><M>{"2^{-23} \\approx 1.2 \\times 10^{-7}"}</M></td>
                    <td className="py-2 px-4 text-center"><M>{"2^{-52} \\approx 2.2 \\times 10^{-16}"}</M></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ──────── 3. Visual Bit Layout ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            64-bit Double 비트 구조
            <span className="text-amber-400"> — 0.1<sub>10</sub> 의 표현</span>
          </h3>
          <p className="text-slate-400 text-sm">
            십진수 0.1은 이진수로 <span className="font-mono text-orange-300">0.0001100110011…</span> (무한 반복)이며, 64비트에 잘려 저장됩니다.
          </p>

          {/* bit boxes */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 overflow-x-auto">
            <div className="flex gap-[2px] min-w-max">
              {/* sign */}
              {exampleBits.sign.map((b, i) => (
                <div
                  key={`s${i}`}
                  className="w-8 h-10 flex items-center justify-center rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs"
                >
                  {b}
                </div>
              ))}
              {/* exponent */}
              {exampleBits.exponent.map((b, i) => (
                <div
                  key={`e${i}`}
                  className="w-8 h-10 flex items-center justify-center rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs"
                >
                  {b}
                </div>
              ))}
              {/* mantissa */}
              {exampleBits.mantissa.map((b, i) => (
                <div
                  key={`m${i}`}
                  className="w-8 h-10 flex items-center justify-center rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono text-xs"
                >
                  {b}
                </div>
              ))}
            </div>

            {/* legend */}
            <div className="flex gap-6 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-rose-500/40" /> Sign (1)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-amber-500/40" /> Exponent (11)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-blue-500/40" /> Mantissa (52)
              </span>
            </div>
          </div>

          {/* toggle binary expansion */}
          <button
            onClick={() => setShowBinary(!showBinary)}
            className="text-sm text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
          >
            {showBinary ? "이진 전개 숨기기 ▲" : "0.1의 이진 전개 보기 ▼"}
          </button>

          {showBinary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-2xl bg-slate-900/60 border border-amber-500/20 p-5 font-mono text-sm space-y-2"
            >
              <p className="text-slate-300">0.1₁₀ 를 이진수로 변환:</p>
              <p className="text-orange-300">
                0.1 × 2 = 0.2 → <span className="text-white font-bold">0</span>
              </p>
              <p className="text-orange-300">
                0.2 × 2 = 0.4 → <span className="text-white font-bold">0</span>
              </p>
              <p className="text-orange-300">
                0.4 × 2 = 0.8 → <span className="text-white font-bold">0</span>
              </p>
              <p className="text-orange-300">
                0.8 × 2 = 1.6 → <span className="text-white font-bold">1</span>
              </p>
              <p className="text-orange-300">
                0.6 × 2 = 1.2 → <span className="text-white font-bold">1</span>
              </p>
              <p className="text-orange-300">
                0.2 × 2 = 0.4 → <span className="text-white font-bold">0</span>
              </p>
              <p className="text-slate-500">… (0011 반복)</p>
              <p className="mt-2 text-amber-400">
                = 0.0<span className="underline decoration-amber-500/50">0011</span>
                <span className="underline decoration-amber-500/50">0011</span>
                <span className="underline decoration-amber-500/50">0011</span>…₂ (무한 반복)
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ──────── 4. Why 0.1 + 0.2 ≠ 0.3 & MATLAB ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            부동소수점의 함정&nbsp;
            <span className="text-amber-400">— 0.1 + 0.2 ≠ 0.3 & MATLAB</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            0.1과 0.2는 이진수로 무한소수이므로 저장 시 잘림이 발생합니다.
            두 근사값을 더하면 0.3의 근사값과 미세하게 달라, 동등 비교(<span className="font-mono text-white">==</span>)가 실패합니다.
          </p>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            {/* MATLAB code */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                MATLAB
              </span>
            </div>
            <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
              <code>
                <span className="text-slate-500">%% 0.1 + 0.2 == 0.3 ?</span>{"\n"}
                <span className="text-amber-300">format</span> <span className="text-white">long</span>{"\n\n"}
                <span className="text-slate-300">a = </span><span className="text-orange-400">0.1</span><span className="text-slate-300">;</span>{"\n"}
                <span className="text-slate-300">b = </span><span className="text-orange-400">0.2</span><span className="text-slate-300">;</span>{"\n"}
                <span className="text-slate-300">c = a + b;</span>{"\n\n"}
                <span className="text-slate-500">% 결과 확인</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(c)</span>{"          "}
                <span className="text-slate-500">% 0.300000000000000</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(c == </span><span className="text-orange-400">0.3</span><span className="text-slate-300">)</span>{"   "}
                <span className="text-slate-500">% 0  (false!)</span>{"\n\n"}
                <span className="text-slate-500">% 실제 차이</span>{"\n"}
                <span className="text-amber-300">fprintf</span><span className="text-slate-300">(</span><span className="text-green-400">&apos;차이 = %.20e\n&apos;</span><span className="text-slate-300">, c - </span><span className="text-orange-400">0.3</span><span className="text-slate-300">)</span>{"\n"}
                <span className="text-slate-500">% 차이 = 5.55111512312578270e-17</span>
              </code>
            </pre>

            {/* visual comparison */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">저장된 실제 값 (format long)</p>
              <div className="flex flex-col gap-1 font-mono text-sm">
                <span className="text-slate-300">
                  0.1 → <span className="text-orange-400">0.10000000000000001</span>
                </span>
                <span className="text-slate-300">
                  0.2 → <span className="text-orange-400">0.20000000000000001</span>
                </span>
                <span className="text-slate-300">
                  합계 → <span className="text-rose-400">0.30000000000000004</span>
                </span>
                <span className="text-slate-300">
                  0.3 → <span className="text-blue-400">0.29999999999999999</span>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                MATLAB
              </span>
              <span className="text-xs text-slate-500">부동소수점 탐색</span>
            </div>
            <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
              <code>
                <span className="text-slate-500">%% 부동소수점 기본 상수</span>{"\n"}
                <span className="text-amber-300">format</span> <span className="text-white">long</span>{"\n\n"}
                <span className="text-slate-500">% Machine epsilon: 1과 구별 가능한 가장 작은 차이</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(</span><span className="text-amber-300">eps</span><span className="text-slate-300">)</span>{"            "}
                <span className="text-slate-500">% 2.220446049250313e-16</span>{"\n\n"}
                <span className="text-slate-500">% 가장 작은 정규화 양수</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(</span><span className="text-amber-300">realmin</span><span className="text-slate-300">)</span>{"        "}
                <span className="text-slate-500">% 2.225073858507201e-308</span>{"\n\n"}
                <span className="text-slate-500">% 가장 큰 유한 양수</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(</span><span className="text-amber-300">realmax</span><span className="text-slate-300">)</span>{"        "}
                <span className="text-slate-500">% 1.797693134862316e+308</span>{"\n\n"}
                <span className="text-slate-500">%% 데이터 타입 확인</span>{"\n"}
                <span className="text-slate-300">x = </span><span className="text-orange-400">3.14</span><span className="text-slate-300">;</span>{"\n"}
                <span className="text-amber-300">class</span><span className="text-slate-300">(x)</span>{"             "}
                <span className="text-slate-500">% &apos;double&apos;</span>{"\n\n"}
                <span className="text-slate-300">y = </span><span className="text-amber-300">single</span><span className="text-slate-300">(</span><span className="text-orange-400">3.14</span><span className="text-slate-300">);</span>{"\n"}
                <span className="text-amber-300">class</span><span className="text-slate-300">(y)</span>{"             "}
                <span className="text-slate-500">% &apos;single&apos;</span>{"\n\n"}
                <span className="text-slate-500">%% Overflow / Underflow</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(</span><span className="text-amber-300">realmax</span><span className="text-slate-300"> * </span><span className="text-orange-400">2</span><span className="text-slate-300">)</span>{"    "}
                <span className="text-slate-500">% Inf</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(</span><span className="text-amber-300">realmin</span><span className="text-slate-300"> / </span><span className="text-orange-400">2</span><span className="text-slate-300">)</span>{"    "}
                <span className="text-slate-500">% 비정규화수 (denormalized)</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(</span><span className="text-orange-400">0</span><span className="text-slate-300"> / </span><span className="text-orange-400">0</span><span className="text-slate-300">)</span>{"         "}
                <span className="text-slate-500">% NaN</span>{"\n"}
                <span className="text-amber-300">disp</span><span className="text-slate-300">(</span><span className="text-orange-400">1</span><span className="text-slate-300"> / </span><span className="text-orange-400">0</span><span className="text-slate-300">)</span>{"         "}
                <span className="text-slate-500">% Inf</span>
              </code>
            </pre>
          </div>

          {/* summary note */}
          <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-5">
            <p className="text-amber-400 font-semibold mb-2">핵심 정리</p>
            <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
              <li>
                <span className="font-mono text-amber-300">eps</span> (<M>{"\\approx 2.2 \\times 10^{-16}"}</M>): 1.0 옆의 가장 가까운 double과의 차이 — 상대 정밀도의 척도
              </li>
              <li>
                부동소수점 비교는 <span className="font-mono text-white">abs(a - b) &lt; tol</span> 형태로 해야 안전합니다
              </li>
              <li>
                MATLAB의 기본 타입은 <span className="font-mono text-orange-300">double</span> (64-bit),
                필요시 <span className="font-mono text-orange-300">single</span> (32-bit) 사용 가능
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
