"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ── Dual code block: MATLAB (emerald) vs Python (blue) ── */
function DualCode({
  matlab,
  python,
}: {
  matlab: string;
  python: string;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* MATLAB */}
      <div className="rounded-xl overflow-hidden text-sm font-mono">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-t-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 text-xs font-semibold">MATLAB</span>
        </div>
        <div className="bg-slate-950 border border-t-0 border-slate-800 p-4 overflow-x-auto">
          {matlab.trim().split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none text-slate-600 w-8 shrink-0 text-right mr-4">
                {i + 1}
              </span>
              <span className="text-emerald-300">{line}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Python */}
      <div className="rounded-xl overflow-hidden text-sm font-mono">
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-t-xl">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-blue-400 text-xs font-semibold">Python</span>
        </div>
        <div className="bg-slate-950 border border-t-0 border-slate-800 p-4 overflow-x-auto">
          {python.trim().split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none text-slate-600 w-8 shrink-0 text-right mr-4">
                {i + 1}
              </span>
              <span className="text-blue-300">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Comparison topics ── */
const topics = [
  {
    id: "float",
    label: "부동소수점",
    matlab: `format long;
result = 0.1 + 0.2
% 0.300000000000000

eps              % 2.2204e-16
realmin          % 2.2251e-308
realmax          % 1.7977e+308`,
    python: `result = 0.1 + 0.2
print(result)    # 0.30000000000000004

import numpy as np, sys
np.finfo(float).eps        # 2.220446049250313e-16
sys.float_info.min         # 2.2250738585072014e-308
sys.float_info.max         # 1.7976931348623157e+308`,
  },
  {
    id: "eps",
    label: "머신 엡실론",
    matlab: `% 내장 상수
eps   % 2.2204e-16

% while 루프로 구하기
e = 1;
while (1 + e) > 1
    e = e / 2;
end
e = 2 * e;
fprintf('Machine eps = %e\\n', e);`,
    python: `# NumPy 상수
import numpy as np
np.finfo(float).eps   # 2.220446049250313e-16

# while 루프로 구하기
e = 1.0
while (1.0 + e) > 1.0:
    e = e / 2
e = 2 * e
print(f"Machine eps = {e:.6e}")`,
  },
  {
    id: "error",
    label: "오차 계산",
    matlab: `exact = pi;
approx = 3.14;

abs_err = abs(exact - approx);
rel_err = abs_err / abs(exact);

fprintf('절대오차: %.6e\\n', abs_err);
fprintf('상대오차: %.6e\\n', rel_err);
fprintf('유효숫자: %d자리\\n', ...
    floor(-log10(rel_err)));`,
    python: `import math

exact = math.pi
approx = 3.14

abs_err = abs(exact - approx)
rel_err = abs_err / abs(exact)

print(f"절대오차: {abs_err:.6e}")
print(f"상대오차: {rel_err:.6e}")
print(f"유효숫자: {int(-math.log10(rel_err))}자리")`,
  },
  {
    id: "cancel",
    label: "상쇄 오차",
    matlab: `% 이차방정식: x^2 - 1e8*x + 1 = 0
a = 1; b = -1e8; c = 1;

% 나쁜 방법 (상쇄 오차 발생)
x1 = (-b - sqrt(b^2 - 4*a*c)) / (2*a);

% 좋은 방법 (유리화)
x2 = (2*c) / (-b + sqrt(b^2 - 4*a*c));

fprintf('나쁜: %.15e\\n', x1);
fprintf('좋은: %.15e\\n', x2);`,
    python: `import math

# 이차방정식: x^2 - 1e8*x + 1 = 0
a, b, c = 1, -1e8, 1

# 나쁜 방법 (상쇄 오차 발생)
disc = math.sqrt(b**2 - 4*a*c)
x1 = (-b - disc) / (2*a)

# 좋은 방법 (유리화)
x2 = (2*c) / (-b + disc)

print(f"나쁜: {x1:.15e}")
print(f"좋은: {x2:.15e}")`,
  },
  {
    id: "taylor",
    label: "Taylor 급수",
    matlab: `% e^x 의 Taylor 전개 (x=1)
x = 1;
exact = exp(x);
approx = 0;

for n = 0:20
    approx = approx + x^n / factorial(n);
end

fprintf('근사값: %.15f\\n', approx);
fprintf('참 값: %.15f\\n', exact);
fprintf('오차:  %.2e\\n', abs(exact - approx));`,
    python: `import math, numpy as np

# e^x 의 Taylor 전개 (x=1)
x = 1.0
exact = np.exp(x)
approx = 0.0

for n in range(21):
    approx += x**n / math.factorial(n)

print(f"근사값: {approx:.15f}")
print(f"참 값: {exact:.15f}")
print(f"오차:  {abs(exact - approx):.2e}")`,
  },
  {
    id: "numdiff",
    label: "수치미분",
    matlab: `% f(x) = sin(x) 의 x=1 에서 미분
f = @(x) sin(x);
exact = cos(1);

fprintf('%12s %20s %12s\\n', 'h', 'approx', 'error');
for k = 1:16
    h = 10^(-k);
    approx = (f(1+h) - f(1)) / h;
    err = abs(exact - approx);
    fprintf('%12.0e %20.15f %12.2e\\n', ...
        h, approx, err);
end`,
    python: `import numpy as np

# f(x) = sin(x) 의 x=1 에서 미분
f = lambda x: np.sin(x)
exact = np.cos(1)

print(f"{'h':>12s} {'approx':>20s} {'error':>12s}")
for k in range(1, 17):
    h = 10**(-k)
    approx = (f(1 + h) - f(1)) / h
    err = abs(exact - approx)
    print(f"{h:12.0e} {approx:20.15f} {err:12.2e}")`,
  },
];

/* ── Key differences data ── */
const keyDiffs = [
  {
    topic: "Machine epsilon",
    matlab: "eps",
    python: "np.finfo(float).eps",
  },
  {
    topic: "최소/최대 실수",
    matlab: "realmin / realmax",
    python: "sys.float_info.min / max",
  },
  {
    topic: "정밀도 표시",
    matlab: "format long",
    python: "항상 전체 정밀도 표시",
  },
  {
    topic: "포맷 출력",
    matlab: "fprintf('%.6e', x)",
    python: "f\"{x:.6e}\" (f-string)",
  },
  {
    topic: "eps(x)",
    matlab: "eps(x) — x 근처 간격",
    python: "np.spacing(x)",
  },
  {
    topic: "팩토리얼",
    matlab: "factorial(n)",
    python: "math.factorial(n)",
  },
  {
    topic: "익명 함수",
    matlab: "f = @(x) sin(x)",
    python: "f = lambda x: np.sin(x)",
  },
];

/* ── Complete example: Optimal h finder ── */
const optimalHMatlab = `% 전방차분의 최적 h 찾기
% f(x) = sin(x), x = 1
f = @(x) sin(x);
exact_deriv = cos(1);

h_vals = logspace(-1, -16, 16);
errors = zeros(size(h_vals));

for i = 1:length(h_vals)
    h = h_vals(i);
    fd = (f(1 + h) - f(1)) / h;
    errors(i) = abs(fd - exact_deriv);
end

[min_err, idx] = min(errors);
fprintf('최적 h    = %.2e\\n', h_vals(idx));
fprintf('최소 오차 = %.2e\\n', min_err);

% 이론적 최적 h = sqrt(eps) ~ 1.5e-8
fprintf('sqrt(eps) = %.2e\\n', sqrt(eps));

loglog(h_vals, errors, 'bo-');
xlabel('h'); ylabel('|error|');
title('Forward Difference Error vs h');
grid on;`;

const optimalHPython = `# 전방차분의 최적 h 찾기
# f(x) = sin(x), x = 1
import numpy as np
import matplotlib.pyplot as plt

f = lambda x: np.sin(x)
exact_deriv = np.cos(1)

h_vals = np.logspace(-1, -16, 16)
errors = np.zeros(len(h_vals))

for i, h in enumerate(h_vals):
    fd = (f(1 + h) - f(1)) / h
    errors[i] = abs(fd - exact_deriv)

idx = np.argmin(errors)
print(f"최적 h    = {h_vals[idx]:.2e}")
print(f"최소 오차 = {errors[idx]:.2e}")

# 이론적 최적 h = sqrt(eps) ~ 1.5e-8
eps = np.finfo(float).eps
print(f"sqrt(eps) = {np.sqrt(eps):.2e}")

plt.loglog(h_vals, errors, 'bo-')
plt.xlabel('h'); plt.ylabel('|error|')
plt.title('Forward Difference Error vs h')
plt.grid(True)
plt.show()`;

/* ── Main component ── */
export default function ErrorPythonComparison() {
  const [activeTopic, setActiveTopic] = useState("float");
  const current = topics.find((t) => t.id === activeTopic)!;

  return (
    <section className="bg-slate-950 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-400 to-yellow-400 text-slate-950">
            Bonus
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Python으로도 해보기 &mdash; 오차 편
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Week 3에서 배운 오차 분석 내용을 Python / NumPy로 옮겨봅니다
          </p>
        </motion.div>

        {/* ── Setup 안내 ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">
            환경 설정 <span className="text-slate-500 text-sm font-normal">Setup</span>
          </h3>
          <div className="font-mono text-sm bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 overflow-x-auto">
            <p className="text-yellow-300">$ pip install numpy matplotlib</p>
            <p className="text-slate-600 mt-3"># 파일 상단에 import</p>
            <p className="text-blue-300">import numpy as np</p>
            <p className="text-blue-300">import sys</p>
            <p className="text-blue-300">import math</p>
          </div>
        </motion.div>

        {/* ── Side-by-side comparison ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            오차 분석 문법 비교{" "}
            <span className="text-slate-500 text-sm font-normal">Error Analysis Comparison</span>
          </h3>

          {/* Topic tabs */}
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTopic === t.id
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Dual code */}
          <DualCode matlab={current.matlab} python={current.python} />
        </motion.div>

        {/* ── Key differences 정리 ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            오차 분석 핵심 차이점{" "}
            <span className="text-slate-500 text-sm font-normal">Key Differences for Error Analysis</span>
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">항목</th>
                  <th className="text-left px-5 py-3 text-emerald-400 font-medium">MATLAB</th>
                  <th className="text-left px-5 py-3 text-blue-400 font-medium">Python / NumPy</th>
                </tr>
              </thead>
              <tbody>
                {keyDiffs.map((d, i) => (
                  <tr
                    key={i}
                    className={i < keyDiffs.length - 1 ? "border-b border-slate-800/60" : ""}
                  >
                    <td className="px-5 py-3 text-slate-300 font-medium">{d.topic}</td>
                    <td className="px-5 py-3 text-emerald-300 font-mono text-xs">{d.matlab}</td>
                    <td className="px-5 py-3 text-blue-300 font-mono text-xs">{d.python}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Complete example: Optimal h finder ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            전체 예제: 최적 h 찾기{" "}
            <span className="text-slate-500 text-sm font-normal">
              Optimal Step Size for Forward Difference
            </span>
          </h3>
          <p className="text-slate-400 text-sm">
            전방차분법에서 절단오차와 반올림오차의 균형을 이루는 최적 h를 찾는 실험입니다.
            이론적 최적값은 h = sqrt(eps)입니다.
          </p>
          <DualCode matlab={optimalHMatlab} python={optimalHPython} />
        </motion.div>

        {/* ── Closing note ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/20 rounded-2xl p-6 text-center space-y-2"
        >
          <p className="text-slate-300 text-sm">
            Python은 기본적으로 IEEE 754 배정밀도를 사용하므로 MATLAB과 동일한 부동소수점 결과를 얻습니다.
            NumPy의 np.spacing(x)은 MATLAB의 eps(x)와 정확히 같은 역할을 합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
