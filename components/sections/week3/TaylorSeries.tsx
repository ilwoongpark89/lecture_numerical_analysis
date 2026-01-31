"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

const taylorExp = (x: number, terms: number): number => {
  let sum = 0;
  for (let n = 0; n < terms; n++) {
    sum += Math.pow(x, n) / factorial(n);
  }
  return sum;
};

const convergenceData = (() => {
  const hValues = [0.1, 0.05, 0.01, 0.005, 0.001];
  const x0 = Math.PI / 4;
  const trueDeriv = Math.cos(x0);

  return hValues.map((h) => {
    const forward = (Math.sin(x0 + h) - Math.sin(x0)) / h;
    const central = (Math.sin(x0 + h) - Math.sin(x0 - h)) / (2 * h);
    return {
      h,
      forwardErr: Math.abs(forward - trueDeriv),
      centralErr: Math.abs(central - trueDeriv),
    };
  });
})();

export default function TaylorSeries() {
  const [numTerms, setNumTerms] = useState(3);
  const xVal = 0.5;
  const trueVal = Math.exp(xVal);

  const termResults = Array.from({ length: 6 }, (_, i) => {
    const terms = i + 1;
    const approx = taylorExp(xVal, terms);
    const error = Math.abs(trueVal - approx);
    return { terms, approx, error };
  });

  const currentApprox = taylorExp(xVal, numTerms);
  const currentError = Math.abs(trueVal - currentApprox);
  const maxError = termResults[0].error;

  const termLabels = [
    "1",
    "x",
    "\\frac{x^{2}}{2!}",
    "\\frac{x^{3}}{3!}",
    "\\frac{x^{4}}{4!}",
    "\\frac{x^{5}}{5!}",
  ];

  const termValues = Array.from({ length: 6 }, (_, n) =>
    Math.pow(xVal, n) / factorial(n)
  );

  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 space-y-20">
        {/* ─── 1. Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
            Week 3 — Errors
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Taylor 급수와{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              절단 오차
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            함수의 다항식 근사와 그에 따른 오차를 이해합니다.
          </p>
        </motion.div>

        {/* ─── 2. Taylor Series Formula ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            Taylor 급수 전개식
          </h3>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
            <p className="text-slate-300 leading-relaxed">
              함수 <M>{"f(x)"}</M>를{" "}
              <M>{"x = x_i"}</M> 근방에서
              전개하면 다음과 같이 표현할 수 있습니다.
            </p>

            {/* Main formula as term cards */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-white text-lg">
                <M>{"f(x_{i+1}) ="}</M>
              </span>
              {[
                { label: "f(x_i)", color: "amber" },
                { label: "f'(x_i) \\cdot h", color: "amber" },
                { label: "\\frac{f''(x_i) \\cdot h^{2}}{2!}", color: "orange" },
                { label: "\\frac{f'''(x_i) \\cdot h^{3}}{3!}", color: "orange" },
                { label: "\\cdots", color: "slate" },
                { label: "R_{n}", color: "red" },
              ].map((term, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-slate-500 text-lg font-mono">+</span>
                  )}
                  <span
                    className={`inline-block px-3 py-2 rounded-xl font-mono text-sm border ${
                      term.color === "amber"
                        ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                        : term.color === "orange"
                        ? "bg-orange-400/10 text-orange-400 border-orange-400/20"
                        : term.color === "red"
                        ? "bg-red-400/10 text-red-400 border-red-400/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <M>{term.label}</M>
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-300 font-mono text-sm">
                여기서{" "}
                <M>{"h = x_{i+1} - x_i"}</M>{" "}
                는 스텝 크기(step size)이며,{" "}
                <M>{"R_{n}"}</M>은 나머지 항(remainder
                term)입니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── 3. Truncation Error ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            절단 오차 (Truncation Error)
          </h3>

          {/* Intuitive intro */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-5 text-sm text-slate-400 leading-relaxed space-y-3">
            <p>
              Taylor 급수는 무한히 많은 항을 더해야 정확한 값이 됩니다.
              하지만 컴퓨터는 <span className="text-white font-semibold">유한한 항만 계산</span>할 수 있으므로, 나머지 항을 잘라냅니다.
            </p>
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs space-y-1">
              <p className="text-slate-300"><M>{"e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots"}</M> <span className="text-slate-500">(무한 항 = 정확)</span></p>
              <p className="text-slate-300"><M>{"e^x \\approx 1 + x + \\frac{x^2}{2!}"}</M> <span className="text-rose-400">(2차에서 자름 = 근사)</span></p>
              <p className="text-slate-500 mt-2">잘라낸 나머지 = <span className="text-amber-300 font-bold">Truncation Error (절단 오차)</span></p>
            </div>
            <p>
              이 오차는 <span className="text-amber-300 font-bold">알고리즘의 선택</span>에 의해 결정됩니다 (몇 항까지 쓸 것인가?).
              반올림 오차와 달리 <span className="text-white">컴퓨터의 비트 수와 무관</span>하며,
              항을 더 많이 포함하거나 더 나은 근사 방법을 사용하면 줄일 수 있습니다.
            </p>
          </div>

          {/* Mean Value Theorem → ξ explanation */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h4 className="text-lg font-semibold text-amber-400">
              잘라낸 오차를 어떻게 추정할까? — 평균값 정리에서 <M>{"\\xi"}</M>까지
            </h4>

            {/* Step 1: MVT */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-sm font-bold">1</span>
                <h5 className="text-white font-semibold">평균값 정리 (Mean Value Theorem)</h5>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center space-y-2">
                <p className="text-slate-300 text-sm">
                  f가 [a, b]에서 연속이고 (a, b)에서 미분 가능하면,
                </p>
                <MBlock>{"f(b) - f(a) = f'(\\xi) \\cdot (b - a)"}</MBlock>
                <p className="text-slate-300 text-sm">
                  를 만족하는 <M>{"\\xi \\in (a, b)"}</M>가 <span className="text-white font-semibold">반드시 존재</span>합니다.
                </p>
              </div>

              {/* Visual: MVT diagram */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                <svg viewBox="0 0 440 240" className="w-full h-auto max-w-lg mx-auto">
                  {/* Axes */}
                  <line x1="40" y1="200" x2="420" y2="200" stroke="#475569" strokeWidth="1" />
                  <line x1="40" y1="200" x2="40" y2="15" stroke="#475569" strokeWidth="1" />
                  <text x="415" y="215" fill="#64748b" fontSize="9" textAnchor="end">x</text>
                  <text x="30" y="22" fill="#64748b" fontSize="9" textAnchor="end">y</text>

                  {/*
                    Curve f(x): concave-up curve from a=(80,170) to b=(380,50)
                    Design: starts steep, flattens in middle, steepens again
                    Using cubic bezier: C control points chosen so that at ξ≈(210,88)
                    the curve's tangent slope matches the secant slope.

                    Secant slope = (50-170)/(380-80) = -120/300 = -0.4

                    The curve: M80,170 C130,170 170,85 210,88 S330,40 380,50
                    At ξ=(210,88): the curve transitions direction, and the local
                    tangent has slope ≈ -0.4, matching the secant.
                  */}
                  <path
                    d="M80,170 C120,170 160,160 190,130 C210,110 220,92 235,88 C260,82 310,60 380,50"
                    fill="none" stroke="#fbbf24" strokeWidth="2.5"
                  />
                  <text x="115" y="148" fill="#fbbf24" fontSize="11">f(x)</text>

                  {/*
                    Secant line: a=(80,170) to b=(380,50)
                    Slope = -0.4
                    Extended slightly: at x=60, y=178; at x=400, y=42
                  */}
                  <line x1="60" y1="178" x2="400" y2="42" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" />
                  <text x="395" y="36" fill="#94a3b8" fontSize="10">할선 (secant)</text>

                  {/*
                    Tangent at ξ=(235,88): slope = -0.4 (SAME as secant = parallel)
                    The tangent TOUCHES the curve at ξ and goes in both directions.
                    Through (235,88) with slope -0.4:
                    At x=140: y = 88 + 0.4*(235-140) = 88 + 38 = 126
                    At x=330: y = 88 - 0.4*(330-235) = 88 - 38 = 50
                  */}
                  <line x1="140" y1="126" x2="330" y2="50" stroke="#f97316" strokeWidth="2.5" />
                  <text x="148" y="140" fill="#f97316" fontSize="10" fontWeight="bold">접선 (tangent)</text>

                  {/* Point a on curve */}
                  <circle cx="80" cy="170" r="5" fill="#38bdf8" />
                  <text x="65" y="185" fill="#38bdf8" fontSize="12" fontWeight="bold">a</text>
                  {/* f(a) label */}
                  <line x1="80" y1="170" x2="80" y2="200" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

                  {/* Point b on curve */}
                  <circle cx="380" cy="50" r="5" fill="#38bdf8" />
                  <text x="385" y="65" fill="#38bdf8" fontSize="12" fontWeight="bold">b</text>
                  <line x1="380" y1="50" x2="380" y2="200" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

                  {/* Point ξ on curve — tangent touches curve HERE */}
                  <circle cx="235" cy="88" r="6" fill="#f97316" stroke="#f97316" strokeWidth="2" />
                  <text x="248" y="80" fill="#f97316" fontSize="13" fontWeight="bold">ξ</text>
                  <line x1="235" y1="88" x2="235" y2="200" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

                  {/* Parallel marks — two small slashes on each line to indicate ∥ */}
                  <g transform="translate(105,152) rotate(-21.8)">
                    <line x1="-3" y1="-3" x2="3" y2="3" stroke="#a78bfa" strokeWidth="1.5" />
                    <line x1="1" y1="-3" x2="7" y2="3" stroke="#a78bfa" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(175,99) rotate(-21.8)">
                    <line x1="-3" y1="-3" x2="3" y2="3" stroke="#a78bfa" strokeWidth="1.5" />
                    <line x1="1" y1="-3" x2="7" y2="3" stroke="#a78bfa" strokeWidth="1.5" />
                  </g>
                  <text x="178" y="115" fill="#a78bfa" fontSize="9" fontWeight="bold">∥ 평행</text>
                </svg>
                <p className="text-xs text-slate-500 text-center mt-2">
                  <M>{"\\xi"}</M>에서 곡선에 <span className="text-orange-400 font-semibold">접하는 직선</span>의 기울기가
                  a→b <span className="text-slate-300">할선</span>의 기울기와 정확히 같습니다 (<span className="text-purple-400 font-semibold">평행</span>).
                </p>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                기하학적 의미: a와 b를 잇는 <span className="text-slate-200">할선(secant)</span>의 기울기와
                정확히 같은 <span className="text-orange-400">접선(tangent)</span> 기울기를 갖는 점이
                (a, b) 구간 안에 반드시 존재합니다. 그 점이 바로 <M>{"\\xi"}</M>입니다.
              </p>
            </div>

            {/* Step 2: Generalized MVT → Taylor Remainder */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-sm font-bold">2</span>
                <h5 className="text-white font-semibold">일반화: Taylor 나머지 정리</h5>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                평균값 정리를 고차 도함수로 일반화하면 <span className="text-white font-semibold">Taylor 나머지 정리</span>가 됩니다.
                f(x)를 n차까지 전개했을 때 나머지 항은:
              </p>
              <div className="bg-slate-800/50 rounded-xl p-5 text-center space-y-3">
                <MBlock>{"R_{n} = \\frac{f^{(n+1)}(\\xi) \\cdot h^{n+1}}{(n+1)!}"}</MBlock>
                <p className="text-slate-300 text-sm">
                  여기서 <M>{"\\xi \\in (x_i,\\, x_{i+1})"}</M>{" "}
                  는 구간 내의 &quot;어떤 값&quot;
                </p>
              </div>
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-amber-200 font-semibold"><M>{"\\xi"}</M>에 대한 핵심 포인트:</p>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span><M>{"\\xi"}</M>의 <span className="text-white font-semibold">정확한 값은 알 수 없습니다</span> — 존재한다는 것만 보장됩니다.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>MVT가 &quot;기울기가 같은 점이 있다&quot;를 보장하듯, Taylor 정리는 &quot;나머지를 정확히 표현하는 <M>{"\\xi"}</M>가 있다&quot;를 보장합니다.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>실용적으로는 <M>{"\\xi"}</M>를 직접 구하지 않고, <M>{"f^{(n+1)}"}</M>의 <span className="text-amber-400">최댓값</span>으로 <span className="text-white font-semibold">오차의 상한(upper bound)</span>을 구합니다.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3: Concrete example */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-sm font-bold">3</span>
                <h5 className="text-white font-semibold">구체적 예: <M>{"e^{x}"}</M>의 1차 근사 오차</h5>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <M>{"f(x) = e^{x}"}</M>를 x = 0에서 1차까지 전개하면:{" "}
                  <M>{"e^{x} \\approx 1 + x"}</M>
                </p>
                <div className="font-mono text-sm space-y-1 text-slate-300">
                  <p>나머지: <M>{"R_1 = \\frac{f''(\\xi) \\cdot x^{2}}{2!} = \\frac{e^{\\xi} \\cdot x^{2}}{2}"}</M></p>
                  <p className="text-slate-500">여기서 <M>{"\\xi \\in (0, x)"}</M></p>
                </div>
                <div className="bg-slate-950 rounded-lg p-3 text-sm space-y-1">
                  <p className="text-slate-500">x = 0.5일 때 오차 상한:</p>
                  <p className="text-slate-300">
                    <M>{"|R_1| \\leq \\max|e^{\\xi}| \\cdot (0.5)^{2} / 2, \\quad \\xi \\in (0,\\, 0.5)"}</M>
                  </p>
                  <p className="text-slate-300">
                    <M>{"\\leq e^{0.5} \\cdot 0.25 / 2 = "}</M><span className="text-amber-400 font-bold">0.2061</span>
                  </p>
                  <p className="text-slate-300">
                    실제 오차: <M>{"|e^{0.5} - 1.5| = "}</M><span className="text-orange-400 font-bold">0.1487</span> -- 상한 이내
                  </p>
                </div>
                <p className="text-slate-400 text-xs">
                  <M>{"\\xi"}</M>의 정확한 값은 모르지만, <M>{"f^{(n+1)}(\\xi)"}</M>의 최댓값을 사용하면 오차의 상한을 구할 수 있습니다.
                  이것이 수치해석에서 <M>{"\\xi"}</M>를 활용하는 실용적 방법입니다.
                </p>
              </div>
            </div>

            {/* MVT special case note */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-sm">
              <p className="text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-semibold">참고:</span>{" "}
                평균값 정리는 사실 Taylor 나머지 정리의 <span className="text-white">n = 0인 특수한 경우</span>입니다.
                n = 0이면: <M>{"f(b) = f(a) + f'(\\xi)(b - a)"}</M> — 바로 MVT입니다.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Remainder term summary */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-lg font-semibold text-amber-400">
                나머지 항 요약
              </h4>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <MBlock>{"R_{n} = \\frac{f^{(n+1)}(\\xi) \\cdot h^{n+1}}{(n+1)!}"}</MBlock>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                급수를 유한 개의 항에서 잘라냄으로써
                발생하는 오차를{" "}
                <span className="text-amber-400 font-semibold">
                  절단 오차
                </span>
                라고 합니다. <M>{"\\xi"}</M>의 정확한 값은 모르지만,
                오차의 차수 <M>{"O(h^{n+1})"}</M>는 알 수 있습니다.
              </p>
            </div>

            {/* Truncation vs Roundoff */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-lg font-semibold text-orange-400">
                절단 오차 vs 반올림 오차
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      절단 오차 (Truncation Error)
                    </p>
                    <p className="text-slate-400 text-sm">
                      수학적 모델을 유한 단계로 근사할 때 발생. 항의 수를
                      늘리면 감소합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 w-3 h-3 rounded-full bg-orange-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      반올림 오차 (Roundoff Error)
                    </p>
                    <p className="text-slate-400 text-sm">
                      컴퓨터의 유한 자릿수 표현으로 발생. 부동소수점 연산의
                      본질적 한계입니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <p className="text-slate-400 text-xs">
                  수치 해석에서는 두 오차의 균형을 맞추는 것이 핵심입니다.
                  h를 너무 줄이면 반올림 오차가 커질 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── 4. Interactive: e^x Approximation ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            Interactive: <M>{"e^{x}"}</M> 근사 (Maclaurin 급수)
          </h3>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
            {/* Formula */}
            <div className="text-center space-y-2">
              <div>
                <MBlock>{"e^{x} = 1 + x + \\frac{x^{2}}{2!} + \\frac{x^{3}}{3!} + \\frac{x^{4}}{4!} + \\cdots"}</MBlock>
              </div>
              <p className="text-slate-400 text-sm">
                x = 0 에서의 Taylor 전개 (Maclaurin 급수). 평가점:{" "}
                <span className="font-mono text-amber-400">x = {xVal}</span>
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-semibold">
                  사용할 항의 수
                </label>
                <span className="font-mono text-2xl font-bold text-amber-400">
                  {numTerms}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={numTerms}
                onChange={(e) => setNumTerms(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700 accent-amber-400"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>

            {/* Current expansion display */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <p className="font-mono text-slate-300 text-sm mb-2">
                현재 전개식:
              </p>
              <p className="text-amber-400 text-lg">
                <M>{termLabels.slice(0, numTerms).join(" + ")}</M>
              </p>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">근사값</p>
                  <p className="font-mono text-white">
                    {currentApprox.toFixed(10)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">참값 (e⁰·⁵)</p>
                  <p className="font-mono text-white">
                    {trueVal.toFixed(10)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">오차</p>
                  <p className="font-mono text-orange-400">
                    {currentError.toExponential(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Term breakdown */}
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-semibold">
                각 항의 기여값 (x = {xVal}):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {termLabels.map((label, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3 border text-center transition-all duration-300 ${
                      i < numTerms
                        ? "bg-amber-400/10 border-amber-400/30"
                        : "bg-slate-800/30 border-slate-700/50 opacity-40"
                    }`}
                  >
                    <p className="text-xs text-slate-400"><M>{label}</M></p>
                    <p
                      className={`font-mono text-sm mt-1 ${
                        i < numTerms ? "text-amber-400" : "text-slate-600"
                      }`}
                    >
                      {termValues[i].toFixed(6)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Error bar chart */}
            <div className="space-y-3">
              <p className="text-slate-400 text-sm font-semibold">
                항 수에 따른 오차 변화:
              </p>
              <div className="space-y-2">
                {termResults.map((r) => {
                  const barWidth =
                    maxError > 0
                      ? Math.max((r.error / maxError) * 100, 0.5)
                      : 0;
                  const isActive = r.terms === numTerms;
                  return (
                    <div key={r.terms} className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs w-20 text-right ${
                          isActive ? "text-amber-400 font-bold" : "text-slate-500"
                        }`}
                      >
                        {r.terms}항
                      </span>
                      <div className="flex-1 h-6 bg-slate-800 rounded-lg overflow-hidden relative">
                        <motion.div
                          className={`h-full rounded-lg ${
                            isActive
                              ? "bg-gradient-to-r from-amber-400 to-orange-400"
                              : "bg-slate-600"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <span
                        className={`font-mono text-xs w-24 ${
                          isActive ? "text-orange-400" : "text-slate-500"
                        }`}
                      >
                        {r.error.toExponential(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── 5. From Remainder to Big-O ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            절단 오차의 크기는 어떻게 결정되는가
          </h3>

          {/* h definition FIRST */}
          <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-5 text-sm space-y-3">
            <p className="text-sky-300 font-bold text-base">먼저: h란 무엇인가?</p>
            <p className="text-slate-400 leading-relaxed">
              Taylor 급수에서 <M>{"f(x_i + h)"}</M>를 전개할 때,
              <M>{"h = x_{i+1} - x_i"}</M>는 전개 중심 <M>{"x_i"}</M>로부터 근사하려는 점까지의 거리입니다.
              이것을 <span className="text-white font-semibold">스텝 크기(step size)</span>라고 부릅니다.
            </p>
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 text-center">
              <MBlock>{"f(\\underbrace{x_i}_{\\text{알고 있는 점}} + \\underbrace{h}_{\\text{스텝 크기}}) = f(x_i) + f'(x_i)\\,h + \\frac{f''(x_i)}{2!}\\,h^2 + \\cdots"}</MBlock>
            </div>
            <p className="text-slate-400 leading-relaxed">
              h가 작을수록 <M>{"x_i"}</M>에서 가까운 점을 근사하는 것이므로 더 정확합니다.
              그런데 <span className="text-white font-semibold">얼마나 더 정확해지는지</span>는 어떻게 알 수 있을까요?
              이것은 <span className="text-amber-300">잘라낸 나머지 항의 구조</span>를 보면 알 수 있습니다.
            </p>
          </div>

          {/* Step-by-step term addition */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h4 className="text-amber-400 font-bold">한 항씩 추가할 때 나머지는 어떻게 변하는가</h4>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4 text-sm">
              {/* 0th order */}
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-bold">0차 근사 (상수만 사용):</p>
                <p className="text-slate-300">
                  <M>{"f(x_i + h) \\approx f(x_i)"}</M>
                </p>
                <p className="text-rose-400 text-xs">
                  버린 나머지: <M>{"f'h + \\frac{f''}{2!}h^2 + \\frac{f'''}{3!}h^3 + \\cdots"}</M>
                </p>
                <p className="text-amber-300 text-xs">
                  → 버린 것 중 <span className="text-white font-bold">첫 항</span>: <M>{"f' \\cdot h"}</M>
                </p>
              </div>

              <div className="border-t border-slate-800" />

              {/* 1st order */}
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-bold">1차 근사 (1차 항까지 사용):</p>
                <p className="text-slate-300">
                  <M>{"f(x_i + h) \\approx f(x_i) + f'(x_i)\\,h"}</M>
                </p>
                <p className="text-rose-400 text-xs">
                  버린 나머지: <M>{"\\frac{f''}{2!}h^2 + \\frac{f'''}{3!}h^3 + \\cdots"}</M>
                </p>
                <p className="text-amber-300 text-xs">
                  → 버린 것 중 <span className="text-white font-bold">첫 항</span>: <M>{"\\frac{f''}{2!} \\cdot h^2"}</M>
                </p>
              </div>

              <div className="border-t border-slate-800" />

              {/* 2nd order */}
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-bold">2차 근사 (2차 항까지 사용):</p>
                <p className="text-slate-300">
                  <M>{"f(x_i + h) \\approx f(x_i) + f'h + \\frac{f''}{2!}h^2"}</M>
                </p>
                <p className="text-rose-400 text-xs">
                  버린 나머지: <M>{"\\frac{f'''}{3!}h^3 + \\frac{f^{(4)}}{4!}h^4 + \\cdots"}</M>
                </p>
                <p className="text-amber-300 text-xs">
                  → 버린 것 중 <span className="text-white font-bold">첫 항</span>: <M>{"\\frac{f'''}{3!} \\cdot h^3"}</M>
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm">
              패턴이 보입니다: n차까지 사용하면, 버린 나머지의 첫 항은 항상 <M>{"h^{n+1}"}</M>을 포함합니다.
              그런데 이 <span className="text-white font-semibold">첫 항 하나</span>로 나머지 전체를 대표해도 될까요?
            </p>

            {/* Why first term dominates — with concrete numbers */}
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-5 text-sm space-y-3">
              <p className="text-amber-300 font-bold">왜 첫 번째 버린 항이 나머지 전체를 대변하는가</p>
              <p className="text-slate-400 leading-relaxed">
                구체적인 숫자로 확인해봅시다. 1차 근사의 나머지를 봅니다:
              </p>
              <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-2">
                <p className="text-slate-400 text-xs">h = 0.1이라 하고, 모든 도함수 값이 대략 1이라 가정하면:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-700">
                        <th className="py-1 px-2 text-left">항</th>
                        <th className="py-1 px-2 text-right">h의 거듭제곱</th>
                        <th className="py-1 px-2 text-right">계수 (1/n!)</th>
                        <th className="py-1 px-2 text-right">크기</th>
                        <th className="py-1 px-2 text-right">비율</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-800/50 bg-amber-500/5">
                        <td className="py-1 px-2 text-amber-300 font-bold">첫 항 (h²)</td>
                        <td className="py-1 px-2 text-right">0.01</td>
                        <td className="py-1 px-2 text-right">1/2</td>
                        <td className="py-1 px-2 text-right text-amber-300 font-bold">0.005</td>
                        <td className="py-1 px-2 text-right text-white">기준</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-1 px-2">둘째 항 (h³)</td>
                        <td className="py-1 px-2 text-right">0.001</td>
                        <td className="py-1 px-2 text-right">1/6</td>
                        <td className="py-1 px-2 text-right">0.000167</td>
                        <td className="py-1 px-2 text-right text-slate-500">3.3%</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-1 px-2">셋째 항 (h⁴)</td>
                        <td className="py-1 px-2 text-right">0.0001</td>
                        <td className="py-1 px-2 text-right">1/24</td>
                        <td className="py-1 px-2 text-right">0.0000042</td>
                        <td className="py-1 px-2 text-right text-slate-500">0.08%</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 text-slate-500">그 이후…</td>
                        <td className="py-1 px-2 text-right text-slate-600">→ 0</td>
                        <td className="py-1 px-2 text-right text-slate-600">→ 0</td>
                        <td className="py-1 px-2 text-right text-slate-600">무시 가능</td>
                        <td className="py-1 px-2 text-right text-slate-600">&lt; 0.01%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  나머지 전체 합 ≈ 0.005 + 0.000167 + 0.0000042 + … ≈ <span className="text-amber-300 font-bold">0.00517</span>
                </p>
                <p className="text-slate-400 text-xs">
                  첫 항(0.005)만으로 전체의 <span className="text-white font-bold">96.7%</span>를 설명합니다.
                </p>
              </div>
              <p className="text-slate-400 leading-relaxed">
                이유는 간단합니다: h가 1보다 작으면, 거듭제곱할수록 값이 급격히 작아지고(<M>{"h^2 \\gg h^3 \\gg h^4"}</M>),
                factorial(n!)은 분모를 더 크게 만듭니다. 두 효과가 합쳐져서
                <span className="text-white font-semibold"> 뒤의 항들은 첫 항에 비해 무시할 수 있을 만큼 작습니다</span>.
              </p>
              <p className="text-slate-400 leading-relaxed">
                따라서 n차까지 사용했을 때의 절단 오차는 <span className="text-amber-300 font-bold">버린 나머지의 첫 항</span>,
                즉 <M>{"h^{n+1}"}</M>을 포함하는 항으로 대표할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Big-O notation */}
          <h3 className="text-2xl font-bold text-white">
            Big-O 표기법: <M>{"O(h^{n})"}</M>
          </h3>

          <p className="text-slate-400 leading-relaxed">
            위에서 확인했듯이, n차 근사의 절단 오차 ≈ 첫 번째 버린 항 ∝ <M>{"h^{n+1}"}</M>입니다.
            이를 간결하게 <span className="text-amber-300 font-bold"><M>{"O(h^{n+1})"}</M></span>로 표기합니다.
            <M>{"O(h^{n+1})"}</M>는 &quot;h를 줄이면 오차가 <M>{"h^{n+1}"}</M>의 비율로 줄어든다&quot;는 뜻입니다.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* O(h) — Forward difference */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono text-sm font-bold">
                  O(h)
                </span>
                <span className="text-white font-semibold">
                  1차 정확도 (First-order)
                </span>
              </div>

              <p className="text-slate-500 text-xs font-bold">유도 — Taylor 전개에서 시작:</p>
              <div className="bg-slate-950 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-slate-300">
                  <M>{"f(x+h) = f(x) + f'(x)\\,h + \\frac{f''(\\xi)}{2}\\,h^2"}</M>
                </p>
                <p className="text-slate-400">양변에서 <M>{"f(x)"}</M>를 빼고 <M>{"h"}</M>로 나누면:</p>
                <p className="text-slate-300">
                  <M>{"f'(x) = \\frac{f(x+h) - f(x)}{h} - \\underbrace{\\frac{f''(\\xi)}{2}\\,h}_{\\text{이것이 } O(h)}"}</M>
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <MBlock>{"f'(x) \\approx \\frac{f(x+h) - f(x)}{h} + O(h)"}</MBlock>
                <p className="text-amber-300 text-xs mt-1">
                  여기서 <M>{"O(h) = -\\frac{f''(\\xi)}{2}\\,h"}</M>
                </p>
              </div>
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">전진 차분</span>{" "}
                (Forward Difference): 오차가 <M>{"h"}</M>에 비례하므로,
                h를 반으로 줄이면 오차도 약 반으로 줄어듭니다.
              </p>
            </div>

            {/* O(h²) — Central difference */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20 font-mono text-sm font-bold">
                  O(h²)
                </span>
                <span className="text-white font-semibold">
                  2차 정확도 (Second-order)
                </span>
              </div>

              <p className="text-slate-500 text-xs font-bold">유도 — 양쪽 Taylor 전개:</p>
              <div className="bg-slate-950 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-slate-300">
                  <M>{"f(x+h) = f(x) + f'h + \\frac{f''}{2}h^2 + \\frac{f'''}{6}h^3 + \\cdots"}</M>
                </p>
                <p className="text-slate-300">
                  <M>{"f(x-h) = f(x) - f'h + \\frac{f''}{2}h^2 - \\frac{f'''}{6}h^3 + \\cdots"}</M>
                </p>
                <p className="text-slate-400">위에서 아래를 빼면 <M>{"f''"}</M> 항이 상쇄:</p>
                <p className="text-slate-300">
                  <M>{"f(x+h) - f(x-h) = 2f'h + \\frac{f'''}{3}h^3 + \\cdots"}</M>
                </p>
                <p className="text-slate-400"><M>{"2h"}</M>로 나누면:</p>
                <p className="text-slate-300">
                  <M>{"f'(x) = \\frac{f(x+h) - f(x-h)}{2h} - \\underbrace{\\frac{f'''(\\xi)}{6}\\,h^2}_{\\text{이것이 } O(h^2)}"}</M>
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <MBlock>{"f'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h} + O(h^2)"}</MBlock>
                <p className="text-orange-300 text-xs mt-1">
                  여기서 <M>{"O(h^2) = -\\frac{f'''(\\xi)}{6}\\,h^2"}</M>
                </p>
              </div>
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">중심 차분</span>{" "}
                (Central Difference): <M>{"f''"}</M> 항이 상쇄되어 오차가 <M>{"h^2"}</M>에 비례.
                h를 반으로 줄이면 오차는 약 1/4로 줄어듭니다.
              </p>
            </div>
          </div>

          {/* MATLAB code for both methods */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-white">
              MATLAB: 전진 차분 vs 중심 차분 비교
            </h4>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code>
                  <span className="text-slate-500">% f(x) = sin(x), x0 = pi/4</span>
                  {"\n"}
                  <span className="text-amber-400">x0</span>
                  <span className="text-slate-300"> = </span>
                  <span className="text-orange-400">pi/4</span>
                  <span className="text-slate-300">;</span>
                  {"\n"}
                  <span className="text-amber-400">true_deriv</span>
                  <span className="text-slate-300"> = </span>
                  <span className="text-orange-400">cos</span>
                  <span className="text-slate-300">(x0);</span>
                  {"\n\n"}
                  <span className="text-amber-400">h_vals</span>
                  <span className="text-slate-300"> = [</span>
                  <span className="text-orange-400">0.1, 0.05, 0.01, 0.005, 0.001</span>
                  <span className="text-slate-300">];</span>
                  {"\n\n"}
                  <span className="text-slate-500">fprintf</span>
                  <span className="text-slate-300">(</span>
                  <span className="text-green-400">&apos;%10s %15s %15s\n&apos;</span>
                  <span className="text-slate-300">, </span>
                  <span className="text-green-400">&apos;h&apos;</span>
                  <span className="text-slate-300">, </span>
                  <span className="text-green-400">&apos;Forward Err&apos;</span>
                  <span className="text-slate-300">, </span>
                  <span className="text-green-400">&apos;Central Err&apos;</span>
                  <span className="text-slate-300">);</span>
                  {"\n\n"}
                  <span className="text-purple-400">for</span>
                  <span className="text-slate-300"> i = 1:</span>
                  <span className="text-orange-400">length</span>
                  <span className="text-slate-300">(h_vals)</span>
                  {"\n"}
                  <span className="text-slate-300">    h = h_vals(i);</span>
                  {"\n"}
                  <span className="text-slate-300">    fwd = (</span>
                  <span className="text-orange-400">sin</span>
                  <span className="text-slate-300">(x0+h) - </span>
                  <span className="text-orange-400">sin</span>
                  <span className="text-slate-300">(x0)) / h;</span>
                  {"\n"}
                  <span className="text-slate-300">    ctr = (</span>
                  <span className="text-orange-400">sin</span>
                  <span className="text-slate-300">(x0+h) - </span>
                  <span className="text-orange-400">sin</span>
                  <span className="text-slate-300">(x0-h)) / (2*h);</span>
                  {"\n"}
                  <span className="text-slate-300">    </span>
                  <span className="text-slate-500">fprintf</span>
                  <span className="text-slate-300">(</span>
                  <span className="text-green-400">&apos;%10.4f %15.2e %15.2e\n&apos;</span>
                  <span className="text-slate-300">, h, </span>
                  <span className="text-orange-400">abs</span>
                  <span className="text-slate-300">(fwd-true_deriv), </span>
                  <span className="text-orange-400">abs</span>
                  <span className="text-slate-300">(ctr-true_deriv));</span>
                  {"\n"}
                  <span className="text-purple-400">end</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Convergence table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-white">
              수렴 비교표: <M>{"f(x) = \\sin(x),\\, x_0 = \\pi/4"}</M>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 font-mono text-slate-400">
                      h
                    </th>
                    <th className="text-left py-3 px-4 font-mono text-amber-400">
                      Forward Error (<M>{"O(h)"}</M>)
                    </th>
                    <th className="text-left py-3 px-4 font-mono text-orange-400">
                      Central Error (<M>{"O(h^{2})"}</M>)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {convergenceData.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-mono text-slate-300">
                        {row.h}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-amber-400/80">
                        {row.forwardErr.toExponential(4)}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-orange-400/80">
                        {row.centralErr.toExponential(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
              <p className="text-slate-400 text-xs">
                h가 10배 줄어들 때: 전진 차분 오차는 약{" "}
                <span className="text-amber-400">10배</span> 감소, 중심 차분
                오차는 약{" "}
                <span className="text-orange-400">100배</span> 감소합니다.
                이것이 <M>{"O(h)"}</M> vs <M>{"O(h^{2})"}</M>의 차이입니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── 6. MATLAB Demo ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">
            MATLAB 실습: Taylor 근사 수렴
          </h3>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <p className="text-slate-400 text-sm">
              아래 코드는{" "}
              <span className="font-mono text-amber-400">e^(0.5)</span>를
              Taylor 급수로 근사하면서 항이 추가될 때마다 오차가 줄어드는
              과정을 보여줍니다.
            </p>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code>
                  <span className="text-amber-400">x</span>
                  <span className="text-slate-300"> = </span>
                  <span className="text-orange-400">0.5</span>
                  <span className="text-slate-300">;</span>
                  {"\n"}
                  <span className="text-amber-400">true_val</span>
                  <span className="text-slate-300"> = </span>
                  <span className="text-orange-400">exp</span>
                  <span className="text-slate-300">(x);</span>
                  {"\n"}
                  <span className="text-amber-400">approx</span>
                  <span className="text-slate-300"> = </span>
                  <span className="text-orange-400">0</span>
                  <span className="text-slate-300">;</span>
                  {"\n\n"}
                  <span className="text-purple-400">for</span>
                  <span className="text-slate-300"> n = </span>
                  <span className="text-orange-400">0</span>
                  <span className="text-slate-300">:</span>
                  <span className="text-orange-400">5</span>
                  {"\n"}
                  <span className="text-slate-300">    approx = approx + x^n / </span>
                  <span className="text-orange-400">factorial</span>
                  <span className="text-slate-300">(n);</span>
                  {"\n"}
                  <span className="text-slate-300">    err = </span>
                  <span className="text-orange-400">abs</span>
                  <span className="text-slate-300">(true_val - approx);</span>
                  {"\n"}
                  <span className="text-slate-300">    </span>
                  <span className="text-slate-500">fprintf</span>
                  <span className="text-slate-300">(</span>
                  <span className="text-green-400">&apos;n=%d: approx=%.10f, error=%.2e\n&apos;</span>
                  <span className="text-slate-300">, n, approx, err);</span>
                  {"\n"}
                  <span className="text-purple-400">end</span>
                </code>
              </pre>
            </div>

            {/* Simulated output */}
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
              <p className="text-slate-500 text-xs mb-3 font-mono">
                &gt;&gt; 실행 결과:
              </p>
              <div className="font-mono text-sm space-y-1">
                {termResults.map((r, i) => (
                  <p key={i} className="text-slate-300">
                    <span className="text-amber-400">n={i}</span>: approx=
                    <span className="text-white">
                      {r.approx.toFixed(10)}
                    </span>
                    , error=
                    <span className="text-orange-400">
                      {r.error.toExponential(2)}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-300 text-sm leading-relaxed">
                항이 추가될수록 오차가{" "}
                <span className="text-amber-400 font-semibold">
                  기하급수적으로
                </span>{" "}
                감소하는 것을 확인할 수 있습니다. 이는 <M>{"e^{x}"}</M>의
                Taylor 급수가 모든 실수에서 수렴하기 때문입니다. 하지만 모든
                함수가 이렇게 빠르게 수렴하지는 않습니다 — 수렴 반경(radius
                of convergence)에 주의해야 합니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
