"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

/* ── Key concept cards ── */
const conceptCards = [
  {
    tag: "정규화",
    eng: "Normalization",
    icon: "1.",
    body: "IEEE 754는 가수부를 항상 1.xxxxx₂ 형태로 정규화합니다. 정수 부분의 1은 저장하지 않는 'hidden bit'으로, 실제 52비트에 53비트의 정밀도를 확보합니다.",
    formula: "(-1)^s × 1.f × 2^(e - 1023)",
  },
  {
    tag: "비정규화",
    eng: "Denormalized",
    icon: "0.",
    body: "지수가 모두 0인 경우, hidden bit 없이 0.xxxxx₂ × 2^(-1022) 형태로 표현합니다. 이를 통해 0 근처의 매우 작은 수를 점진적으로(gradual underflow) 나타낼 수 있습니다.",
    formula: "(-1)^s × 0.f × 2^(-1022)",
  },
  {
    tag: "특수값",
    eng: "Special Values",
    icon: "∞",
    body: "지수가 모두 1(= 2047)이면 특수값입니다. 가수부가 0이면 ±Infinity, 0이 아니면 NaN(Not a Number)입니다. 또한 +0과 -0이 별도로 존재합니다.",
    formula: "±Inf, NaN, ±0",
  },
  {
    tag: "표현 범위",
    eng: "Representable Range",
    icon: "R",
    body: "Double precision의 양수 표현 범위는 약 2.2 × 10⁻³⁰⁸ ~ 1.8 × 10³⁰⁸ 입니다. MATLAB에서 realmin, realmax로 확인할 수 있습니다.",
    formula: "realmin ≈ 2.2e-308, realmax ≈ 1.8e+308",
  },
];

/* ── Component ── */
export default function FloatingPoint() {
  const [showBinary, setShowBinary] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

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
            과학적 표기법 <span className="font-mono text-orange-400">±M × β^E</span>와 동일한 원리입니다.
            컴퓨터는 β = 2(이진수)를 사용하여 부호(sign), 지수(exponent), 가수(mantissa)를 각각 저장합니다.
          </p>

          {/* formula card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center">
            <p className="font-mono text-2xl sm:text-3xl text-white">
              <span className="text-rose-400">(-1)</span>
              <sup className="text-rose-400">s</sup>
              <span className="text-slate-500 mx-2">×</span>
              <span className="text-blue-400">1.f</span>
              <span className="text-slate-500 mx-2">×</span>
              <span className="text-amber-400">2</span>
              <sup className="text-amber-400">(e − 1023)</sup>
            </p>
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
            <span className="text-amber-400"> — 0.1₁₀ 의 표현</span>
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

        {/* ──────── 4. Key Concept Cards ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            핵심 개념 <span className="text-amber-400">— Key Concepts</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conceptCards.map((card, i) => {
              const isOpen = activeCard === i;
              return (
                <motion.div
                  key={card.tag}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  onClick={() => setActiveCard(isOpen ? null : i)}
                  className={`cursor-pointer rounded-2xl bg-slate-900/60 border p-5 transition-colors ${
                    isOpen ? "border-amber-500/50" : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono text-amber-400 text-lg font-bold">
                      {card.icon}
                    </span>
                    <div className="space-y-1">
                      <p className="text-white font-semibold">
                        {card.tag}{" "}
                        <span className="text-slate-500 text-sm font-normal">
                          {card.eng}
                        </span>
                      </p>
                      <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
                      {isOpen && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 font-mono text-xs text-orange-400 bg-orange-500/5 border border-orange-500/20 rounded-lg px-3 py-2"
                        >
                          {card.formula}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ──────── 5. Why 0.1 + 0.2 ≠ 0.3 ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            왜&nbsp;
            <span className="font-mono text-orange-400">0.1 + 0.2 ≠ 0.3</span>
            &nbsp;인가?
          </h3>
          <p className="text-slate-400 leading-relaxed">
            0.1과 0.2는 이진수로 무한소수이므로 저장 시 잘림이 발생합니다.
            두 근사값을 더하면 0.3의 근사값과 미세하게 달라, 동등 비교(<span className="font-mono text-white">==</span>)가 실패합니다.
            이것이 수치해석에서 <span className="text-amber-400 font-medium">부동소수점 산술의 위험성</span>을 보여주는 대표적 예시입니다.
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
        </motion.div>

        {/* ──────── 6. MATLAB Demo Code ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            MATLAB 실습 <span className="text-amber-400">— Floating-Point Exploration</span>
          </h3>

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
                <span className="font-mono text-amber-300">eps</span> (≈ 2.2 × 10⁻¹⁶): 1.0 옆의 가장 가까운 double과의 차이 — 상대 정밀도의 척도
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
