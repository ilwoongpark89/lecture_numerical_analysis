"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const arithmeticErrors = [
  {
    op: "덧셈 (Addition)",
    formula: "\\Delta(a + b) = \\Delta a + \\Delta b",
    note: "절대 오차가 단순 합산됩니다.",
    danger: false,
  },
  {
    op: "곱셈 (Multiplication)",
    formula: "\\Delta(ab) / |ab| \\approx |\\Delta a/a| + |\\Delta b/b|",
    note: "상대 오차가 합산됩니다.",
    danger: false,
  },
  {
    op: "뺄셈 (Subtraction)",
    formula: "\\Delta(a - b) = \\Delta a + \\Delta b",
    note: "a ≈ b이면 상대 오차가 폭발적으로 증가! (Catastrophic Cancellation)",
    danger: true,
  },
];

const hilbertData = [
  { n: 5, cond: "4.77 \\times 10^{5}" },
  { n: 10, cond: "1.60 \\times 10^{13}" },
  { n: 15, cond: "3.67 \\times 10^{17}" },
];

const convergenceTable = [
  { h: "0.1", oh: "0.1", oh2: "0.01" },
  { h: "0.05", oh: "0.05", oh2: "0.0025" },
  { h: "0.025", oh: "0.025", oh2: "6.25e-4" },
  { h: "0.0125", oh: "0.0125", oh2: "1.56e-4" },
];

const significantDigitsExamples = [
  { value: "3.1416", digits: 5, relErr: "< 0.5 \\times 10^{-3}" },
  { value: "0.001234", digits: 4, relErr: "< 0.5 \\times 10^{-2}" },
  { value: "2.7183", digits: 5, relErr: "< 0.5 \\times 10^{-3}" },
];

export default function ErrorPropagation() {
  return (
    <section className="bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center space-y-4">
          <span className="inline-block bg-amber-400/10 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-amber-400/20">
            Week 3 — Errors
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            오차 전파와 수렴 차수
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            입력 오차가 출력에 어떻게 전파되는지, 그리고 수치 방법의 수렴 속도를 측정하는 방법을 학습합니다.
          </p>
        </motion.div>

        {/* 1. Error Propagation */}
        <motion.div {...fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-white">
            오차 전파 <span className="text-amber-400">(Error Propagation)</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            입력값에 오차 <M>{"\\Delta x"}</M>가 있을 때, 함수 출력의 오차 <M>{"\\Delta f"}</M>는 어떻게 될까요?
          </p>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">단일 변수 (Single Variable)</h4>
            <div className="text-center py-2">
              <MBlock>{"\\Delta f \\approx f'(x) \\cdot \\Delta x"}</MBlock>
            </div>
            <p className="text-slate-400 text-sm">
              1차 테일러 근사를 사용하면 출력 오차는 도함수와 입력 오차의 곱으로 근사됩니다.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">다변수 (Multi-variable)</h4>
            <div className="text-center py-2">
              <MBlock>{"\\Delta f \\approx \\sum \\frac{\\partial f}{\\partial x_i} \\cdot \\Delta x_i"}</MBlock>
            </div>
            <p className="text-slate-400 text-sm">
              각 변수의 편미분과 해당 입력 오차의 곱을 합산합니다.
            </p>
          </div>

          {/* Arithmetic operation cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {arithmeticErrors.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-5 border space-y-3 ${
                  item.danger
                    ? "bg-red-950/40 border-red-800/60"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <h4 className={`font-semibold ${item.danger ? "text-red-400" : "text-amber-400"}`}>
                  {item.op}
                  {item.danger && <span className="ml-2 text-xs">⚠ 위험</span>}
                </h4>
                <p className="text-white text-sm"><M>{item.formula}</M></p>
                <p className="text-slate-400 text-xs leading-relaxed">{item.note}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 2. Condition Number */}
        <motion.div {...fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-white">
            조건수 <span className="text-amber-400">(Condition Number)</span>
          </h3>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">정의</h4>
            <div className="text-center py-3">
              <MBlock>{"\\text{cond}(f, x) = \\left| \\frac{x \\cdot f'(x)}{f(x)} \\right|"}</MBlock>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              조건수는 입력의 상대 오차가 출력의 상대 오차로 얼마나 증폭되는지를 나타냅니다.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-green-400 font-semibold text-sm">Well-conditioned</p>
                <p className="text-slate-400 text-xs mt-1">
                  cond ≈ 1 — 입력 오차가 거의 증폭되지 않음
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-red-400 font-semibold text-sm">Ill-conditioned</p>
                <p className="text-slate-400 text-xs mt-1">
                  cond ≫ 1 — 작은 입력 변화가 큰 출력 변화 유발
                </p>
              </div>
            </div>
          </div>

          {/* MATLAB cond */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">
              MATLAB: <span className="font-mono">cond(A)</span>
            </h4>
            <pre className="font-mono text-sm text-slate-300 bg-slate-800/60 rounded-xl p-4 overflow-x-auto">
{`>> cond(hilb(5))
ans = 4.7661e+05

>> cond(hilb(10))
ans = 1.6025e+13

>> cond(hilb(15))
ans = 3.6744e+17`}
            </pre>
          </div>

          {/* Hilbert matrix cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {hilbertData.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center space-y-2"
              >
                <p className="text-slate-400 text-sm">
                  hilb(<span className="text-amber-400 font-mono">{item.n}</span>)
                </p>
                <p className="text-white text-lg font-bold"><M>{item.cond}</M></p>
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-red-500 mx-auto"
                  style={{ width: `${30 + i * 30}%` }}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-slate-500 text-sm text-center">
            Hilbert 행렬은 크기가 커질수록 조건수가 기하급수적으로 증가하여 ill-conditioned의 대표적 예시입니다.
          </p>
        </motion.div>

        {/* 3. Total Error = Roundoff + Truncation */}
        <motion.div {...fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-white">
            전체 오차 <span className="text-amber-400">= Roundoff + Truncation</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            스텝 크기 h를 줄이면 절단 오차(truncation error)는 감소하지만,
            반올림 오차(roundoff error)는 증가합니다.
            두 오차의 합인 <span className="text-amber-400 font-semibold">전체 오차가 최소</span>가 되는
            최적의 h가 존재합니다.
          </p>

          {/* SVG Chart — log-log scale concept */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <p className="text-slate-400 text-sm">아래는 log-log 스케일에서의 개념도입니다. x축은 log(h), y축은 log(error).</p>
            <svg viewBox="0 0 520 320" className="w-full h-auto" aria-label="Total error diagram (log-log)">
              {/* Background grid */}
              {[60, 100, 140, 180, 220].map(y => (
                <line key={y} x1="70" y1={y} x2="470" y2={y} stroke="#1e293b" strokeWidth="0.5" />
              ))}
              {[120, 190, 260, 330, 400].map(x => (
                <line key={x} x1={x} y1="30" x2={x} y2="250" stroke="#1e293b" strokeWidth="0.5" />
              ))}

              {/* Axes */}
              <line x1="70" y1="250" x2="480" y2="250" stroke="#475569" strokeWidth="1.5" />
              <line x1="70" y1="250" x2="70" y2="25" stroke="#475569" strokeWidth="1.5" />
              <polygon points="480,250 472,246 472,254" fill="#475569" />
              <polygon points="70,25 66,33 74,33" fill="#475569" />

              {/* Axis labels */}
              <text x="275" y="280" textAnchor="middle" fill="#94a3b8" fontSize="12">log(h)</text>
              <text x="25" y="140" textAnchor="middle" fill="#94a3b8" fontSize="12" transform="rotate(-90, 25, 140)">log(error)</text>

              {/* x-axis tick labels */}
              <text x="120" y="265" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">10⁻¹⁶</text>
              <text x="190" y="265" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">10⁻¹²</text>
              <text x="260" y="265" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">10⁻⁸</text>
              <text x="330" y="265" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">10⁻⁴</text>
              <text x="400" y="265" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">10⁻¹</text>

              {/*
                Roundoff error: ε/h behavior → decreases as h grows (line going down-right)
                In log-log: slope ≈ -1
                Left (small h) = high error, Right (large h) = low error
              */}
              <path
                d="M100,50 L180,100 L260,150 L340,200 L420,235"
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              <text x="425" y="230" fill="#f87171" fontSize="11" fontWeight="bold">Roundoff</text>
              <text x="105" y="45" fill="#f87171" fontSize="9">(∝ ε/h)</text>

              {/*
                Truncation error: O(h) behavior → increases as h grows (line going up-right)
                In log-log: slope ≈ +1
                Left (small h) = low error, Right (large h) = high error
              */}
              <path
                d="M100,235 L180,200 L260,150 L340,100 L420,50"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              <text x="425" y="48" fill="#38bdf8" fontSize="11" fontWeight="bold">Truncation</text>
              <text x="380" y="65" fill="#38bdf8" fontSize="9">(∝ h)</text>

              {/* Crossing point */}
              <circle cx="260" cy="150" r="4" fill="#a855f7" opacity="0.6" />

              {/*
                Total error = Roundoff + Truncation
                U-shaped: high at both extremes, MINIMUM near the crossing point
                The minimum is the key point!
              */}
              <path
                d="M100,55 Q140,70 180,105 Q220,125 245,130 Q260,132 275,130 Q300,125 340,105 Q380,75 420,55"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
              />

              {/* Minimum point of total error — clearly at optimal h */}
              <circle cx="260" cy="132" r="6" fill="#fbbf24" />
              <line x1="260" y1="132" x2="260" y2="250" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />

              {/* Labels for total error */}
              <text x="260" y="118" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">
                Total Error
              </text>
              <text x="260" y="302" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">
                ★ optimal h ≈ √ε ≈ 10⁻⁸
              </text>
              <text x="260" y="315" textAnchor="middle" fill="#fbbf24" fontSize="10">
                (전체 오차 최소!)
              </text>

              {/* Region labels */}
              <rect x="85" y="70" width="100" height="32" rx="6" fill="#f87171" fillOpacity="0.08" stroke="#f87171" strokeOpacity="0.3" strokeWidth="1" />
              <text x="135" y="85" textAnchor="middle" fill="#f87171" fontSize="9">Roundoff 지배</text>
              <text x="135" y="97" textAnchor="middle" fill="#f87171" fontSize="9">(h가 너무 작음)</text>

              <rect x="340" y="70" width="100" height="32" rx="6" fill="#38bdf8" fillOpacity="0.08" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1" />
              <text x="390" y="85" textAnchor="middle" fill="#38bdf8" fontSize="9">Truncation 지배</text>
              <text x="390" y="97" textAnchor="middle" fill="#38bdf8" fontSize="9">(h가 너무 큼)</text>
            </svg>

            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 text-sm space-y-2">
              <p className="text-amber-200 font-semibold">핵심 정리:</p>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-red-400 shrink-0">•</span>
                  <span><span className="text-red-400 font-semibold">Roundoff error <M>{"\\propto \\varepsilon/h"}</M></span> — h가 작을수록 증가 (나눗셈에서 유효숫자 손실)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-sky-400 shrink-0">•</span>
                  <span><span className="text-sky-400 font-semibold">Truncation error <M>{"\\propto h"}</M></span> — h가 클수록 증가 (급수 절단)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span><span className="text-amber-400 font-semibold">Total error = 두 오차의 합</span> → 두 곡선이 교차하는 부근에서 <span className="text-white font-bold">최솟값</span></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>Forward difference: optimal <M>{"h \\approx \\sqrt{\\varepsilon_{\\text{mach}}} \\approx 10^{-8}"}</M></span>
                </li>
              </ul>
            </div>
          </div>

          {/* MATLAB example */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h4 className="text-lg font-semibold text-orange-400">
              MATLAB 실습: sin(x) 미분의 전방 차분
            </h4>
            <pre className="font-mono text-sm text-slate-300 bg-slate-800/60 rounded-xl p-4 overflow-x-auto leading-relaxed">
{`x = pi/4;
exact = cos(x);

h = logspace(-1, -16, 16);
approx = (sin(x + h) - sin(x)) ./ h;
err = abs(approx - exact);

loglog(h, err, 'o-', 'LineWidth', 1.5);
xlabel('h'); ylabel('|error|');
title('Forward Difference Error for sin''(x)');
grid on;

% h ≈ 10^(-8) 근처에서 최소 오차 관찰
% h가 더 작아지면 roundoff error가 지배`}
            </pre>
            <p className="text-slate-500 text-sm">
              <M>{"h \\approx 10^{-8}"}</M> 부근에서 최소 오차가 나타나며, 이보다 작은 h에서는 반올림 오차가 급격히 증가합니다.
            </p>
          </div>
        </motion.div>

        {/* 4. Convergence Order */}
        <motion.div {...fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-white">
            수렴 차수 <span className="text-amber-400">(Convergence Order)</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            오차가 <M>{"\\text{error} \\propto h^{n}"}</M>이면, 해당 방법은 <strong className="text-white">n차(nth-order)</strong> 방법입니다.
          </p>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">Log-Log Plot 기법</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              양변에 로그를 취하면 <M>{"\\log(\\text{error}) = n \\cdot \\log(h) + C"}</M> 형태의
              직선이 됩니다. 기울기가 곧 수렴 차수 n입니다.
            </p>
          </div>

          {/* Convergence table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-6 py-3 text-left font-mono">h</th>
                  <th className="px-6 py-3 text-left">
                    <M>{"O(h)"}</M> error
                    <span className="text-slate-600 ml-1">— 1차</span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <M>{"O(h^{2})"}</M> error
                    <span className="text-slate-600 ml-1">— 2차</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {convergenceTable.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="px-6 py-3 font-mono text-amber-400">{row.h}</td>
                    <td className="px-6 py-3 font-mono text-white">{row.oh}</td>
                    <td className="px-6 py-3 font-mono text-white">{row.oh2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 text-slate-500 text-xs border-t border-slate-800">
              h를 반으로 줄이면: <M>{"O(h)"}</M>은 오차가 1/2, <M>{"O(h^{2})"}</M>은 오차가 1/4로 감소합니다.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <p className="text-amber-400 font-semibold"><M>{"O(h)"}</M> — 1차 방법</p>
              <p className="text-slate-400 text-sm">
                h → h/2 일 때 error → error/2
              </p>
              <p className="font-mono text-white text-sm">Forward difference</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <p className="text-amber-400 font-semibold"><M>{"O(h^{2})"}</M> — 2차 방법</p>
              <p className="text-slate-400 text-sm">
                h → h/2 일 때 error → error/4
              </p>
              <p className="font-mono text-white text-sm">Central difference</p>
            </div>
          </div>

          {/* MATLAB convergence verification */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h4 className="text-lg font-semibold text-orange-400">
              MATLAB: 수렴 차수 확인
            </h4>
            <pre className="font-mono text-sm text-slate-300 bg-slate-800/60 rounded-xl p-4 overflow-x-auto leading-relaxed">
{`x = 1.0;
exact = cos(x);      % d/dx sin(x) = cos(x)

h = logspace(-1, -8, 8);

% Forward difference (1st order)
fwd = (sin(x+h) - sin(x)) ./ h;
err_fwd = abs(fwd - exact);

% Central difference (2nd order)
ctr = (sin(x+h) - sin(x-h)) ./ (2*h);
err_ctr = abs(ctr - exact);

loglog(h, err_fwd, 'o-', h, err_ctr, 's-', 'LineWidth', 1.5);
legend('Forward O(h)', 'Central O(h^2)');
xlabel('h'); ylabel('|error|');

% 기울기 확인
slope_fwd = diff(log(err_fwd)) ./ diff(log(h));
slope_ctr = diff(log(err_ctr)) ./ diff(log(h));
disp(['Forward slope: ', num2str(slope_fwd(1))]);  % ≈ 1
disp(['Central slope: ', num2str(slope_ctr(1))]);   % ≈ 2`}
            </pre>
          </div>
        </motion.div>

        {/* 5. Significant Digits */}
        <motion.div {...fadeUp} className="space-y-6">
          <h3 className="text-2xl font-bold text-white">
            유효 숫자 <span className="text-amber-400">(Significant Digits)</span>
          </h3>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">정의</h4>
            <p className="text-slate-400 leading-relaxed">
              근사값이 <strong className="text-white">n개의 유효 숫자</strong>를 가진다는 것은
              상대 오차가 다음 조건을 만족한다는 의미입니다:
            </p>
            <div className="text-center py-3">
              <MBlock>{"| \\text{relative error} | < 0.5 \\times 10^{2-n}"}</MBlock>
            </div>
            <p className="text-slate-500 text-sm">
              즉 유효 숫자가 많을수록 상대 오차의 상한이 작아져 더 정확한 근사입니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {significantDigitsExamples.map((ex, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2 text-center"
              >
                <p className="font-mono text-white text-lg">{ex.value}</p>
                <p className="text-amber-400 font-semibold">
                  {ex.digits} significant digits
                </p>
                <p className="text-slate-400 text-xs">
                  rel. error <M>{ex.relErr}</M>
                </p>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h4 className="text-lg font-semibold text-orange-400">유효 숫자와 오차의 관계</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="px-4 py-2 text-left">유효 숫자 (n)</th>
                    <th className="px-4 py-2 text-left">상대 오차 상한</th>
                    <th className="px-4 py-2 text-left">예시</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-white text-sm">
                  <tr className="border-b border-slate-800/50">
                    <td className="px-4 py-2 text-amber-400">3</td>
                    <td className="px-4 py-2"><M>{"0.5 \\times 10^{-1} = 5\\%"}</M></td>
                    <td className="px-4 py-2 text-slate-400">3.14 for <M>{"\\pi"}</M></td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="px-4 py-2 text-amber-400">5</td>
                    <td className="px-4 py-2"><M>{"0.5 \\times 10^{-3} = 0.05\\%"}</M></td>
                    <td className="px-4 py-2 text-slate-400">3.1416 for <M>{"\\pi"}</M></td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="px-4 py-2 text-amber-400">7</td>
                    <td className="px-4 py-2"><M>{"0.5 \\times 10^{-5} = 0.0005\\%"}</M></td>
                    <td className="px-4 py-2 text-slate-400">3.141593 for <M>{"\\pi"}</M></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div {...fadeUp} className="bg-gradient-to-br from-amber-400/5 to-orange-400/5 border border-amber-400/20 rounded-2xl p-8 space-y-4">
          <h3 className="text-xl font-bold text-amber-400">핵심 정리</h3>
          <ul className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">1.</span>
              <span>
                <strong className="text-white">오차 전파:</strong> <M>{"\\Delta f \\approx f'(x) \\cdot \\Delta x"}</M> — 뺄셈 시 catastrophic cancellation에 주의
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">2.</span>
              <span>
                <strong className="text-white">조건수:</strong> cond가 크면 ill-conditioned — Hilbert 행렬이 대표적 예시
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">3.</span>
              <span>
                <strong className="text-white">전체 오차:</strong> roundoff + truncation의 합으로 최적 h가 존재
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">4.</span>
              <span>
                <strong className="text-white">수렴 차수:</strong> log-log plot의 기울기로 확인 — <M>{"O(h)"}</M> vs <M>{"O(h^{2})"}</M>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">5.</span>
              <span>
                <strong className="text-white">유효 숫자:</strong> n자리 유효 숫자 → 상대 오차 <M>{"< 0.5 \\times 10^{2-n}"}</M>
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
