"use client";

import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function CurveCrossingVisual() {
  // f(x) crossing the x-axis
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-md mx-auto">
      {/* axes */}
      <line x1="40" y1="110" x2="380" y2="110" stroke="#475569" strokeWidth="1.5" />
      <line x1="40" y1="10" x2="40" y2="210" stroke="#475569" strokeWidth="1.5" />
      <text x="385" y="114" fill="#94a3b8" fontSize="12">x</text>
      <text x="28" y="14" fill="#94a3b8" fontSize="12">y</text>

      {/* curve: roughly sin-like, crossing zero near x=210 */}
      <path
        d="M60,40 C100,30 140,50 180,90 Q200,115 220,140 C260,180 310,190 360,170"
        fill="none"
        stroke="#fb7185"
        strokeWidth="2.5"
      />

      {/* zero crossing marker */}
      <circle cx="198" cy="110" r="5" fill="#fb7185" stroke="#fff" strokeWidth="1.5" />
      <text x="188" y="100" fill="#fda4af" fontSize="11" fontFamily="monospace">root</text>

      {/* label */}
      <text x="320" y="160" fill="#fda4af" fontSize="12" fontFamily="monospace">f(x)</text>
      <text x="190" y="130" fill="#94a3b8" fontSize="11">f(x)=0</text>
    </svg>
  );
}

function IVTVisual() {
  return (
    <svg viewBox="0 0 420 260" className="w-full max-w-lg mx-auto">
      {/* axes */}
      <line x1="50" y1="130" x2="400" y2="130" stroke="#475569" strokeWidth="1.5" />
      <line x1="50" y1="20" x2="50" y2="250" stroke="#475569" strokeWidth="1.5" />
      <text x="405" y="134" fill="#94a3b8" fontSize="12">x</text>
      <text x="38" y="18" fill="#94a3b8" fontSize="12">y</text>

      {/* bracket region shading */}
      <rect x="100" y="20" width="220" height="230" fill="#fb718510" rx="4" />

      {/* vertical dashed lines at a and b */}
      <line x1="100" y1="25" x2="100" y2="245" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="320" y1="25" x2="320" y2="245" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />

      {/* curve crossing zero */}
      <path
        d="M80,60 C130,50 160,80 200,130 Q220,155 250,170 C290,195 310,200 350,210"
        fill="none"
        stroke="#fb7185"
        strokeWidth="2.5"
      />

      {/* f(a) point — above axis */}
      <circle cx="100" cy="65" r="5" fill="#34d399" stroke="#fff" strokeWidth="1.5" />
      <text x="65" y="58" fill="#34d399" fontSize="11" fontFamily="monospace">f(a)&gt;0</text>

      {/* f(b) point — below axis */}
      <circle cx="320" cy="200" r="5" fill="#f87171" stroke="#fff" strokeWidth="1.5" />
      <text x="325" y="198" fill="#f87171" fontSize="11" fontFamily="monospace">f(b)&lt;0</text>

      {/* root marker */}
      <circle cx="200" cy="130" r="6" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />
      <text x="205" y="122" fill="#fbbf24" fontSize="11" fontFamily="monospace">root c</text>

      {/* labels a, b */}
      <text x="93" y="245" fill="#cbd5e1" fontSize="12" fontFamily="monospace">a</text>
      <text x="315" y="245" fill="#cbd5e1" fontSize="12" fontFamily="monospace">b</text>

      {/* sign indicator arrows */}
      <text x="140" y="48" fill="#94a3b8" fontSize="10">f(a)·f(b) &lt; 0</text>
    </svg>
  );
}

function BracketNarrowingVisual() {
  const brackets = [
    { a: 60, b: 360, label: "1st bracket", color: "#fb7185" },
    { a: 140, b: 360, label: "2nd", color: "#f472b6" },
    { a: 140, b: 250, label: "3rd", color: "#e879f9" },
    { a: 180, b: 250, label: "4th", color: "#c084fc" },
  ];
  return (
    <svg viewBox="0 0 420 160" className="w-full max-w-md mx-auto">
      {/* axis */}
      <line x1="40" y1="140" x2="400" y2="140" stroke="#475569" strokeWidth="1.5" />
      {brackets.map((br, i) => (
        <g key={i}>
          <line x1={br.a} y1={30 + i * 28} x2={br.b} y2={30 + i * 28} stroke={br.color} strokeWidth="3" strokeLinecap="round" />
          <circle cx={br.a} cy={30 + i * 28} r="3" fill={br.color} />
          <circle cx={br.b} cy={30 + i * 28} r="3" fill={br.color} />
          <text x={br.b + 8} y={34 + i * 28} fill="#94a3b8" fontSize="10">{br.label}</text>
        </g>
      ))}
      {/* root position */}
      <line x1="210" y1="20" x2="210" y2="140" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
      <text x="200" y="155" fill="#fbbf24" fontSize="10" fontFamily="monospace">root</text>
    </svg>
  );
}

function CounterExampleVisual() {
  // Two roots between a and b, so f(a)·f(b) > 0 but roots exist
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-sm mx-auto">
      <line x1="40" y1="100" x2="380" y2="100" stroke="#475569" strokeWidth="1.5" />
      <line x1="40" y1="10" x2="40" y2="190" stroke="#475569" strokeWidth="1.5" />

      {/* curve with two zero crossings */}
      <path
        d="M70,50 C110,40 140,70 170,100 Q190,120 210,140 C240,170 270,170 300,100 Q310,75 330,50"
        fill="none"
        stroke="#fb7185"
        strokeWidth="2.5"
      />

      {/* f(a) above */}
      <circle cx="70" cy="50" r="4" fill="#34d399" />
      <text x="50" y="42" fill="#34d399" fontSize="10" fontFamily="monospace">f(a)&gt;0</text>

      {/* f(b) above */}
      <circle cx="330" cy="50" r="4" fill="#34d399" />
      <text x="335" y="45" fill="#34d399" fontSize="10" fontFamily="monospace">f(b)&gt;0</text>

      {/* two roots */}
      <circle cx="170" cy="100" r="4" fill="#fbbf24" />
      <circle cx="300" cy="100" r="4" fill="#fbbf24" />
      <text x="145" y="120" fill="#fbbf24" fontSize="9">root 1</text>
      <text x="280" y="120" fill="#fbbf24" fontSize="9">root 2</text>

      <text x="120" y="190" fill="#94a3b8" fontSize="10">f(a)·f(b) &gt; 0 but 2 roots exist!</text>
    </svg>
  );
}

export default function RootFindingIntro() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ─── Header ─── */}
        <motion.div {...anim} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-sm font-mono border border-rose-500/30">
            Week 4 &mdash; Nonlinear Equations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
            근 찾기와 중간값 정리
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            비선형 방정식 f(x) = 0의 근을 수치적으로 구하는 방법과 그 이론적 기초를 학습합니다.
          </p>
        </motion.div>

        {/* ─── 1. What is root finding? ─── */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">Root Finding이란?</h3>
          <p className="text-slate-300 leading-relaxed">
            주어진 함수 <M>{"f(x) = 0"}</M>을 만족하는{" "}
            <M>{"x"}</M>를 찾는 문제입니다.
            대수적(해석적) 풀이가 불가능한 경우가 대부분이므로 수치적 방법이 필요합니다.
          </p>

          <CurveCrossingVisual />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
              <h4 className="text-sm font-mono text-rose-400 mb-2">왜 해석적 풀이가 안 되는가?</h4>
              <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
                <li>5차 이상 다항식: Abel-Ruffini 정리에 의해 일반해 없음</li>
                <li>초월방정식 (Transcendental): 닫힌 형태의 해가 존재하지 않음</li>
                <li>실제 공학 문제의 대부분은 비선형</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
              <h4 className="text-sm font-mono text-rose-400 mb-2">대표적 예시</h4>
              <div className="space-y-2 font-mono text-sm">
                <p className="text-pink-300">
                  <M>{"e^{-x} = x \\;\\rightarrow\\; e^{-x} - x = 0"}</M>
                </p>
                <p className="text-pink-300">
                  <M>{"x - \\cos(x) = 0"}</M>
                </p>
                <p className="text-pink-300">
                  <M>{"x^{3} - 2x - 5 = 0"}</M>
                </p>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                위 방정식들은 해석적으로 풀 수 없습니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── 2. Intermediate Value Theorem ─── */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">중간값 정리 (Intermediate Value Theorem)</h3>

          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6">
            <p className="text-slate-200 leading-relaxed">
              함수 <M>{"f"}</M>가 닫힌 구간{" "}
              <M>{"[a, b]"}</M>에서 <strong>연속</strong>이고,{" "}
              <M>{"f(a) \\cdot f(b) < 0"}</M>이면,{" "}
              구간 <M>{"(a, b)"}</M> 안에 적어도 하나의 근{" "}
              <M>{"c"}</M>가 존재한다.
            </p>
            <p className="text-sm text-rose-300 mt-3">
              <M>{"\\exists\\, c \\in (a, b) \\;\\text{such that}\\; f(c) = 0"}</M>
            </p>
          </div>

          <IVTVisual />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
              <h4 className="text-sm font-mono text-emerald-400 mb-2">보장하는 것</h4>
              <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
                <li>근의 <strong className="text-emerald-400">존재성</strong> (Existence)</li>
                <li>부호 변화가 있으면 반드시 근이 있다</li>
                <li>Bracketing 방법의 이론적 근거</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
              <h4 className="text-sm font-mono text-amber-400 mb-2">보장하지 않는 것</h4>
              <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
                <li>근의 <strong className="text-amber-400">유일성</strong> (Uniqueness) &mdash; 여러 근이 있을 수 있음</li>
                <li>f(a)&middot;f(b) &gt; 0이라도 근이 없다는 보장 없음</li>
              </ul>
            </div>
          </div>

          {/* Counter-example */}
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-amber-500/30 space-y-3">
            <h4 className="text-sm font-mono text-amber-400">
              반례: f(a)&middot;f(b) &gt; 0이지만 근이 존재하는 경우
            </h4>
            <CounterExampleVisual />
            <p className="text-slate-400 text-sm">
              짝수 개의 근이 존재하면 양 끝점의 부호가 같을 수 있습니다.
              IVT의 조건이 만족되지 않더라도 근이 없다고 단정할 수 없습니다.
            </p>
          </div>
        </motion.div>

        {/* ─── 3. Bracketing concept ─── */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">Bracketing (구간 탐색)</h3>
          <p className="text-slate-300 leading-relaxed">
            부호 변화가 일어나는 구간 <M>{"[a, b]"}</M>를 찾은 뒤,
            그 구간을 점차 좁혀 가며 근에 접근합니다.
          </p>

          <BracketNarrowingVisual />

          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
            <h4 className="text-sm font-mono text-rose-400 mb-3">MATLAB: Bracket 탐색 코드</h4>
            <pre className="font-mono text-sm text-slate-300 overflow-x-auto leading-relaxed">
{`function [a, b] = find_bracket(f, x0, x1, n)
% f: 함수 핸들, [x0, x1]: 탐색 범위, n: 분할 수
    dx = (x1 - x0) / n;
    a = x0;
    fa = f(a);
    for i = 1:n
        b = a + dx;
        fb = f(b);
        if fa * fb < 0
            fprintf('Bracket found: [%.4f, %.4f]\\n', a, b);
            return;
        end
        a = b;
        fa = fb;
    end
    error('No bracket found in the given range.');
end

% 사용 예시
f = @(x) exp(-x) - x;
[a, b] = find_bracket(f, 0, 2, 100);`}
            </pre>
          </div>
        </motion.div>

        {/* ─── 4. Types of root-finding methods ─── */}
        <motion.div {...anim} className="space-y-6">
          <h3 className="text-2xl font-bold text-rose-400 text-center">근 찾기 방법의 분류</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Bracketing */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">B</span>
                <h4 className="text-lg font-bold text-emerald-400">Bracketing Methods</h4>
              </div>
              <p className="text-slate-400 text-sm">부호 변화 구간을 반복적으로 좁혀가는 방법</p>
              <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                <li><span className="font-mono text-pink-300">Bisection Method</span> (이분법)</li>
                <li><span className="font-mono text-pink-300">False Position</span> (가위치법)</li>
              </ul>
              <div className="bg-slate-800/50 rounded-xl p-3 text-sm space-y-1">
                <p className="text-emerald-400 font-mono">장점: 수렴 보장 (guaranteed convergence)</p>
                <p className="text-amber-400 font-mono">단점: 느린 수렴 속도 (linear)</p>
              </div>
            </div>

            {/* Open */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-lg">O</span>
                <h4 className="text-lg font-bold text-rose-400">Open Methods</h4>
              </div>
              <p className="text-slate-400 text-sm">초기 추정값으로부터 빠르게 근에 접근</p>
              <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                <li><span className="font-mono text-pink-300">Newton-Raphson Method</span></li>
                <li><span className="font-mono text-pink-300">Secant Method</span></li>
                <li><span className="font-mono text-pink-300">Fixed-Point Iteration</span></li>
              </ul>
              <div className="bg-slate-800/50 rounded-xl p-3 text-sm space-y-1">
                <p className="text-emerald-400 font-mono">장점: 빠른 수렴 (quadratic for N-R)</p>
                <p className="text-amber-400 font-mono">단점: 발산 가능 (may diverge)</p>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <h4 className="text-sm font-mono text-rose-400 mb-4">비교표 (Comparison)</h4>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-2 pr-4">특성</th>
                  <th className="py-2 pr-4">Bracketing (Bisection)</th>
                  <th className="py-2">Open (Newton-Raphson)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-4 font-mono text-slate-400">수렴 보장</td>
                  <td className="py-2 pr-4 text-emerald-400">Yes</td>
                  <td className="py-2 text-amber-400">No</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-4 font-mono text-slate-400">수렴 속도</td>
                  <td className="py-2 pr-4">Linear (느림)</td>
                  <td className="py-2">Quadratic (빠름)</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-4 font-mono text-slate-400">필요 정보</td>
                  <td className="py-2 pr-4">f(a), f(b) 부호 변화</td>
                  <td className="py-2">f(x), f&apos;(x) 필요</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-4 font-mono text-slate-400">초기 조건</td>
                  <td className="py-2 pr-4">Bracket [a, b]</td>
                  <td className="py-2">초기 추정값 <M>{"x_{0}"}</M></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-slate-400">적합한 상황</td>
                  <td className="py-2 pr-4">안정성 우선</td>
                  <td className="py-2">속도 우선, 좋은 초기값</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ─── 5. When do methods fail? ─── */}
        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-rose-400">방법이 실패하는 경우</h3>
          <p className="text-slate-300">
            수치적 근 찾기 방법은 항상 성공하지 않습니다. 다음과 같은 상황에서 주의가 필요합니다.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Multiple roots */}
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 space-y-3">
              <h4 className="font-mono text-pink-400 text-sm">중근 (Multiple Roots)</h4>
              <svg viewBox="0 0 160 120" className="w-full">
                <line x1="10" y1="60" x2="150" y2="60" stroke="#475569" strokeWidth="1" />
                {/* parabola touching axis */}
                <path d="M30,20 Q80,100 130,20" fill="none" stroke="#fb7185" strokeWidth="2" />
                <circle cx="80" cy="60" r="4" fill="#fbbf24" />
                <text x="55" y="80" fill="#fbbf24" fontSize="8" fontFamily="monospace">tangent</text>
              </svg>
              <p className="text-slate-400 text-xs">
                접선 근 (even multiplicity): 부호 변화 없이 축에 접함.
                Bracketing 실패.
              </p>
            </div>

            {/* Near-zero but no crossing */}
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 space-y-3">
              <h4 className="font-mono text-pink-400 text-sm">불연속 (Discontinuity)</h4>
              <svg viewBox="0 0 160 120" className="w-full">
                <line x1="10" y1="60" x2="150" y2="60" stroke="#475569" strokeWidth="1" />
                {/* discontinuous jump */}
                <line x1="20" y1="90" x2="75" y2="70" stroke="#fb7185" strokeWidth="2" />
                <circle cx="75" cy="70" r="3" fill="none" stroke="#fb7185" strokeWidth="1.5" />
                <circle cx="80" cy="35" r="3" fill="#fb7185" />
                <line x1="80" y1="35" x2="140" y2="25" stroke="#fb7185" strokeWidth="2" />
                <text x="50" y="105" fill="#94a3b8" fontSize="8">sign change but no root</text>
              </svg>
              <p className="text-slate-400 text-xs">
                불연속점에서 부호가 바뀌지만 실제 근이 아닌 경우.
                IVT는 연속 함수에만 적용.
              </p>
            </div>

            {/* Divergence */}
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 space-y-3">
              <h4 className="font-mono text-pink-400 text-sm">발산 (Divergence)</h4>
              <svg viewBox="0 0 160 120" className="w-full">
                <line x1="10" y1="60" x2="150" y2="60" stroke="#475569" strokeWidth="1" />
                {/* spiral diverging */}
                <path d="M60,58 L80,55 L70,65 L90,50 L65,72 L100,40" fill="none" stroke="#fb7185" strokeWidth="1.5" />
                <circle cx="60" cy="58" r="3" fill="#34d399" />
                <text x="95" y="38" fill="#f87171" fontSize="8" fontFamily="monospace">diverge!</text>
                <text x="30" y="105" fill="#94a3b8" fontSize="8">poor initial guess (N-R)</text>
              </svg>
              <p className="text-slate-400 text-xs">
                Newton-Raphson 등 Open method에서 초기값이 나쁘면 발산할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5">
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-rose-400">실전 전략:</strong> 먼저 Bracketing으로 대략적 근의 위치를 파악한 뒤,
              Open method로 정밀하게 수렴시키는 하이브리드 접근이
              가장 안정적이고 효율적입니다. MATLAB의{" "}
              <code className="text-pink-400">fzero</code> 함수가 이 전략을 사용합니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
