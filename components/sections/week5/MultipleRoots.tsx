"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6 },
};

const convergenceTable = [
  { m: 1, rate: "Quadratic (p≈2)", newton: "Fast", modified: "—" },
  { m: 2, rate: "Linear (p≈1)", newton: "Slow", modified: "Quadratic with m=2" },
  { m: 3, rate: "Linear (p≈1)", newton: "Very slow", modified: "Quadratic with m=3" },
  { m: 4, rate: "Linear (p≈1)", newton: "Extremely slow", modified: "Quadratic with m=4" },
];

const remedies = [
  {
    title: "Known Multiplicity m",
    subtitle: "Modified Newton's Method",
    formula: "x_{n+1} = x_n - m \\cdot \\frac{f(x_n)}{f'(x_n)}",
    desc: "근의 중복도 m을 알고 있다면, Newton 공식에 m을 곱하여 2차 수렴을 복원할 수 있습니다.",
    code: `function x = modified_newton(f, df, x0, m, tol)
  for i = 1:100
    x = x0 - m * f(x0) / df(x0);
    if abs(x - x0) < tol, return; end
    x0 = x;
  end
end
% Example: f(x) = (x-1)^2, m = 2
f = @(x)(x-1).^2;  df = @(x)2*(x-1);
root = modified_newton(f, df, 0.5, 2, 1e-12)`,
  },
  {
    title: "Unknown Multiplicity — u(x) Method",
    subtitle: "Reduces to Simple Roots",
    formula: "u(x) = \\frac{f(x)}{f'(x)},\\quad x_{n+1} = x_n - \\frac{f \\cdot f'}{f'^{2} - f \\cdot f''}",
    desc: "u(x) = f(x)/f'(x)를 정의하면, u(x)는 오직 단근만 갖습니다. u(x)에 Newton법을 적용하면 중복도에 관계없이 2차 수렴합니다.",
    code: `function x = newton_u(f, df, d2f, x0, tol)
  for i = 1:100
    fv = f(x0); dfv = df(x0); d2fv = d2f(x0);
    x = x0 - (fv * dfv) / (dfv^2 - fv * d2fv);
    if abs(x - x0) < tol, return; end
    x0 = x;
  end
end
% Example: f(x) = (x-1)^3
f = @(x)(x-1).^3;
df = @(x)3*(x-1).^2;
d2f = @(x)6*(x-1);
root = newton_u(f, df, d2f, 2.0, 1e-12)`,
  },
  {
    title: "Deflation",
    subtitle: "Factor Out Known Roots",
    formula: "g(x) = \\frac{f(x)}{x - r_1} \\;\\Rightarrow\\; \\text{find remaining roots of } g(x)",
    desc: "근 r을 찾은 후, f(x)를 (x-r)로 나누어 차수를 줄입니다. 나머지 다항식에서 추가 근을 찾습니다.",
    code: `% Deflation example
p = [1 -6 11 -6]; % x^3 - 6x^2 + 11x - 6
r1 = 1; % known root
[q, rem] = deconv(p, [1 -r1]);
% q = [1 -5 6] => (x-2)(x-3)
r2 = roots(q); % finds 2 and 3`,
  },
];

const failureCases = [
  {
    title: "Cycling (순환)",
    desc: "두 값 사이를 반복하며 수렴하지 않음",
    example: "f(x) = x³ - 2x + 2, x₀ = 0",
  },
  {
    title: "Divergence (발산)",
    desc: "반복값이 무한대로 발산",
    example: "f(x) = arctan(x), x₀ large",
  },
  {
    title: "Wrong Root (잘못된 근)",
    desc: "원하는 근이 아닌 다른 근으로 수렴",
    example: "Multiple roots: initial guess determines which root",
  },
  {
    title: "Sensitivity (초기값 민감도)",
    desc: "초기값의 미세한 변화가 전혀 다른 결과를 생성",
    example: "Fractal basins of attraction in Newton's method",
  },
];

const practicalTips = [
  "그래프를 먼저 그려서 근의 대략적 위치와 개수를 파악하세요.",
  "Bracket method (Bisection)로 먼저 범위를 좁힌 후 Newton법을 적용하세요.",
  "수렴 판정 기준: |f(x_n)| < ε 과 |x_n - x_{n-1}| < ε 를 동시에 확인하세요.",
  "최대 반복 횟수를 설정하여 무한 루프를 방지하세요.",
  "f'(x_n) ≈ 0 인 경우를 감지하고 step size를 제한하세요.",
  "다중근이 의심되면 u(x) method를 먼저 시도하세요.",
  "Deflation 사용 시 수치 오차 누적에 주의하세요 — 역순으로 polish 하세요.",
  "Hybrid 전략: Bisection + Newton (e.g., Brent's method)이 실전에서 가장 안정적입니다.",
];

export default function MultipleRoots() {
  return (
    <section className="py-20 px-4 bg-slate-950">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <motion.div {...anim} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-mono">
            Multiple Roots &amp; Convergence Issues
          </span>
          <h2 className="text-4xl font-bold text-white">
            다중근과 수렴 문제
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Newton법의 수렴 속도가 저하되는 원인과 해결 방법을 학습합니다.
          </p>
        </motion.div>

        {/* What are multiple roots? */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">
            다중근이란? <M>{"f(x) = (x - r)^{m}"}</M>
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { m: 1, label: "Simple Root (단근)", cond: "f(r)=0,\\; f'(r)\\neq 0", behavior: "곡선이 x축을 관통" },
              { m: 2, label: "Double Root (이중근)", cond: "f(r)=0,\\; f'(r)=0,\\; f''(r)\\neq 0", behavior: "곡선이 x축에 접함" },
              { m: 3, label: "Triple Root (삼중근)", cond: "f(r)=0,\\; f'(r)=0,\\; f''(r)=0", behavior: "변곡점에서 x축 관통" },
            ].map((item) => (
              <div key={item.m} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 space-y-2">
                <span className="text-fuchsia-400 font-mono text-sm"><M>{`m = ${item.m}`}</M></span>
                <h4 className="text-white font-semibold">{item.label}</h4>
                <p className="text-slate-400 text-sm"><M>{item.cond}</M></p>
                <p className="text-slate-300 text-sm">{item.behavior}</p>
              </div>
            ))}
          </div>

          {/* SVG showing three cases */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
            <svg viewBox="0 0 720 200" className="w-full h-auto">
              {/* Grid lines */}
              {[0, 1, 2].map((i) => {
                const ox = 120 + i * 240;
                return (
                  <g key={i}>
                    <line x1={ox - 90} y1={100} x2={ox + 90} y2={100} stroke="#334155" strokeWidth={1} />
                    <line x1={ox} y1={20} x2={ox} y2={180} stroke="#334155" strokeWidth={1} />
                    <text x={ox} y={195} fill="#94a3b8" fontSize={11} textAnchor="middle" fontFamily="monospace">
                      {["m=1: (x-1)", "m=2: (x-1)²", "m=3: (x-1)³"][i]}
                    </text>
                    <circle cx={ox} cy={100} r={3} fill="#f472b6" />
                  </g>
                );
              })}
              {/* m=1: line crossing */}
              <path d="M30,170 Q120,100 210,30" fill="none" stroke="#f472b6" strokeWidth={2} />
              {/* m=2: parabola touching */}
              <path d="M270,40 Q360,160 450,40" fill="none" stroke="#e879f9" strokeWidth={2} />
              {/* m=3: cubic inflection crossing */}
              <path d="M510,160 Q550,130 600,100 Q650,70 690,40" fill="none" stroke="#c084fc" strokeWidth={2} />
            </svg>
          </div>
        </motion.div>

        {/* Impact on convergence */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">수렴 속도에 미치는 영향</h3>

          <div className="space-y-4 text-slate-300">
            <p>
              <span className="text-pink-400 font-semibold">단근 (<M>{"m=1"}</M>):</span>{" "}
              Newton법은 <span className="text-fuchsia-400">2차 수렴 (quadratic)</span>을 보입니다.
            </p>
            <p>
              <span className="text-pink-400 font-semibold">다중근 (<M>{"m \\geq 2"}</M>):</span>{" "}
              수렴 속도가 <span className="text-fuchsia-400">1차 수렴 (linear)</span>으로 퇴화합니다.
            </p>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Why?</p>
              <p className="text-pink-400 text-sm">
                <M>{"f'(r) = 0"}</M> for multiple roots → <M>{"f(x)/f'(x) \\to 0/0"}</M> indeterminate form near root
              </p>
            </div>
          </div>

          {/* Convergence table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="py-2 px-3 text-pink-400 font-mono">Multiplicity m</th>
                  <th className="py-2 px-3 text-pink-400 font-mono">Convergence Rate</th>
                  <th className="py-2 px-3 text-pink-400 font-mono">Standard Newton</th>
                  <th className="py-2 px-3 text-pink-400 font-mono">Modified Newton</th>
                </tr>
              </thead>
              <tbody>
                {convergenceTable.map((row) => (
                  <tr key={row.m} className="border-b border-slate-800 text-slate-300">
                    <td className="py-2 px-3 font-mono text-fuchsia-400">{row.m}</td>
                    <td className="py-2 px-3 font-mono">{row.rate}</td>
                    <td className="py-2 px-3">{row.newton}</td>
                    <td className="py-2 px-3">{row.modified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MATLAB demo */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
            <p className="text-fuchsia-400 font-mono text-sm mb-3">% MATLAB: Newton on multiple roots — iteration count comparison</p>
            <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">{`f1 = @(x)(x-1).^2;   df1 = @(x)2*(x-1);       % double root
f2 = @(x)(x-1).^3;   df2 = @(x)3*(x-1).^2;     % triple root
f3 = @(x)(x-1);      df3 = @(x)1;               % simple root

x0 = 0.5; tol = 1e-10;
for each case:
  x = x0;
  for k = 1:200
    x = x - f(x)/df(x);
    if abs(x - 1) < tol
      fprintf('Converged in %d iterations\\n', k);
      break;
    end
  end
end
% Results: simple ~5 iter, double ~35 iter, triple ~55 iter`}</pre>
          </div>
        </motion.div>

        {/* Remedies */}
        <motion.div {...anim} className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-center">해결 방법 (Remedies)</h3>
          <div className="space-y-6">
            {remedies.map((r, i) => (
              <motion.div
                key={i}
                {...anim}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 font-mono font-bold flex items-center justify-center text-sm">
                    {String.fromCharCode(97 + i)}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-lg">{r.title}</h4>
                    <p className="text-fuchsia-400 text-sm font-mono">{r.subtitle}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <MBlock>{r.formula}</MBlock>
                </div>
                <p className="text-slate-300 text-sm">{r.desc}</p>
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                  <pre className="text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {r.code}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Convergence failure gallery */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white">수렴 실패 갤러리 (Convergence Failure Gallery)</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {failureCases.map((fc, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 space-y-3">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 60 60" className="w-12 h-12 flex-shrink-0">
                    {i === 0 && (
                      /* Cycling */
                      <g>
                        <circle cx={30} cy={30} r={20} fill="none" stroke="#f472b6" strokeWidth={2} />
                        <path d="M20,30 L30,20 L40,30 L30,40 Z" fill="none" stroke="#e879f9" strokeWidth={1.5} />
                        <path d="M25,25 Q35,20 35,30 Q35,40 25,35" fill="none" stroke="#c084fc" strokeWidth={1.5} markerEnd="url(#arrow)" />
                      </g>
                    )}
                    {i === 1 && (
                      /* Divergence */
                      <g>
                        <line x1={10} y1={50} x2={50} y2={50} stroke="#334155" strokeWidth={1} />
                        <path d="M15,48 Q20,45 25,30 Q30,10 35,5" fill="none" stroke="#f472b6" strokeWidth={2} />
                        <path d="M35,5 L37,12 M35,5 L28,7" stroke="#e879f9" strokeWidth={1.5} />
                      </g>
                    )}
                    {i === 2 && (
                      /* Wrong root */
                      <g>
                        <line x1={5} y1={30} x2={55} y2={30} stroke="#334155" strokeWidth={1} />
                        <circle cx={20} cy={30} r={3} fill="#f472b6" />
                        <circle cx={45} cy={30} r={3} fill="#64748b" />
                        <path d="M45,25 Q35,15 20,25" fill="none" stroke="#e879f9" strokeWidth={1.5} strokeDasharray="3,2" />
                      </g>
                    )}
                    {i === 3 && (
                      /* Sensitivity */
                      <g>
                        <line x1={30} y1={5} x2={30} y2={55} stroke="#334155" strokeWidth={1} />
                        <path d="M28,10 Q15,30 10,50" fill="none" stroke="#f472b6" strokeWidth={1.5} />
                        <path d="M32,10 Q45,30 50,50" fill="none" stroke="#c084fc" strokeWidth={1.5} />
                        <circle cx={30} cy={10} r={2} fill="#e879f9" />
                      </g>
                    )}
                  </svg>
                  <div>
                    <h4 className="text-white font-bold">{fc.title}</h4>
                    <p className="text-slate-400 text-sm">{fc.desc}</p>
                  </div>
                </div>
                <p className="text-xs font-mono text-fuchsia-400 bg-slate-950 rounded-lg px-3 py-2 border border-slate-800">
                  {fc.example}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Practical tips */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-5">
          <h3 className="text-2xl font-bold text-white">실전 팁 (Practical Tips)</h3>
          <ul className="space-y-3">
            {practicalTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 font-mono text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
