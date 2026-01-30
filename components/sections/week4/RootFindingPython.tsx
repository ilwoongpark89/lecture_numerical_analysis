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
    id: "bisection",
    label: "이분법",
    matlab: `% Bisection Method: f(x) = x^3 - x - 2
f = @(x) x^3 - x - 2;
a = 1; b = 2;
tol = 1e-8;

for i = 1:100
    c = (a + b) / 2;
    if abs(f(c)) < tol
        break;
    end
    if f(a)*f(c) < 0
        b = c;
    else
        a = c;
    end
end
fprintf('Root: %.10f\\n', c);`,
    python: `# Bisection Method: f(x) = x^3 - x - 2
import numpy as np
from scipy.optimize import brentq

f = lambda x: x**3 - x - 2
a, b = 1, 2
tol = 1e-8

for i in range(100):
    c = (a + b) / 2
    if abs(f(c)) < tol:
        break
    if f(a) * f(c) < 0:
        b = c
    else:
        a = c
print(f"Root: {c:.10f}")

# scipy 한 줄
root = brentq(f, 1, 2)
print(f"brentq: {root:.10f}")`,
  },
  {
    id: "newton",
    label: "Newton-Raphson",
    matlab: `% Newton-Raphson: f(x) = x^3 - x - 2
f  = @(x) x^3 - x - 2;
df = @(x) 3*x^2 - 1;
x = 1.5;
tol = 1e-10;

for i = 1:50
    x_new = x - f(x)/df(x);
    if abs(x_new - x) < tol
        break;
    end
    x = x_new;
end
fprintf('Root: %.10f (iter %d)\\n', x, i);`,
    python: `# Newton-Raphson: f(x) = x^3 - x - 2
import numpy as np
from scipy.optimize import newton

f  = lambda x: x**3 - x - 2
df = lambda x: 3*x**2 - 1
x = 1.5
tol = 1e-10

for i in range(50):
    x_new = x - f(x) / df(x)
    if abs(x_new - x) < tol:
        break
    x = x_new
print(f"Root: {x:.10f} (iter {i+1})")

# scipy 한 줄
root = newton(f, 1.5, fprime=df)
print(f"newton: {root:.10f}")`,
  },
  {
    id: "plot",
    label: "시각화",
    matlab: `% 함수 그래프 + 근 표시
f = @(x) x.^3 - x - 2;
fplot(f, [0, 3], 'b-', 'LineWidth', 2);
hold on;
yline(0, 'k--');

root = fzero(f, 1.5);
plot(root, 0, 'ro', 'MarkerSize', 10, ...
     'MarkerFaceColor', 'r');
xlabel('x'); ylabel('f(x)');
title('x^3 - x - 2 의 근');
legend('f(x)', 'y=0', 'root');
grid on;`,
    python: `# 함수 그래프 + 근 표시
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import brentq

f = lambda x: x**3 - x - 2
x = np.linspace(0, 3, 300)
plt.plot(x, f(x), 'b-', linewidth=2)
plt.axhline(y=0, color='k', linestyle='--')

root = brentq(f, 1, 2)
plt.plot(root, 0, 'ro', markersize=10)
plt.xlabel('x'); plt.ylabel('f(x)')
plt.title('$x^3 - x - 2$ 의 근')
plt.legend(['f(x)', 'y=0', 'root'])
plt.grid(True)
plt.show()`,
  },
  {
    id: "builtin",
    label: "내장 함수",
    matlab: `% fzero: 조합 알고리즘 (bisection + secant + IQI)
f = @(x) x^3 - x - 2;

% 초기 추측값 하나만 제공
root1 = fzero(f, 1.5);

% 구간 [a, b] 제공
root2 = fzero(f, [1, 2]);

fprintf('fzero(f, 1.5)  = %.10f\\n', root1);
fprintf('fzero(f,[1,2]) = %.10f\\n', root2);

% options 설정
opts = optimset('TolX', 1e-12, ...
                'Display', 'iter');
root3 = fzero(f, 1.5, opts);`,
    python: `# brentq / newton from scipy.optimize
from scipy.optimize import brentq, newton

f  = lambda x: x**3 - x - 2
df = lambda x: 3*x**2 - 1

# brentq: 구간 [a, b] 필수 (bracket)
root1 = brentq(f, 1, 2)

# newton: 초기값 + 도함수 (선택)
root2 = newton(f, 1.5, fprime=df)

print(f"brentq: {root1:.10f}")
print(f"newton: {root2:.10f}")

# 고급: xtol, maxiter 설정
root3 = brentq(f, 1, 2,
               xtol=1e-12, maxiter=200)`,
  },
];

/* ── Key differences data ── */
const keyDiffs = [
  {
    topic: "근 찾기 함수",
    matlab: "fzero(f, x0) / fzero(f, [a,b])",
    python: "brentq(f, a, b) / newton(f, x0)",
  },
  {
    topic: "익명 함수",
    matlab: "@(x) x^3 - x - 2",
    python: "lambda x: x**3 - x - 2",
  },
  {
    topic: "그래프 그리기",
    matlab: "fplot(f, [0, 3])",
    python: "plt.plot(np.linspace(0,3,N), f(x))",
  },
  {
    topic: "연립방정식 근",
    matlab: "fsolve(@myfun, x0)",
    python: "scipy.optimize.root(fun, x0)",
  },
  {
    topic: "알고리즘 선택",
    matlab: "fzero 내부 자동 선택",
    python: "brentq / newton / bisect 명시 선택",
  },
];

/* ── Complete example: Colebrook equation ── */
const colebrookMatlab = `% Colebrook equation (파이프 마찰계수)
% 1/sqrt(f) = -2*log10(e/(3.7*D) + 2.51/(Re*sqrt(f)))
Re = 1e5;        % Reynolds number
eD = 0.001;      % relative roughness (e/D)

% fzero 활용
g = @(f) 1/sqrt(f) + 2*log10(eD/3.7 ...
         + 2.51/(Re*sqrt(f)));

f0 = 0.02;  % 초기 추측
f_root = fzero(g, f0);
fprintf('마찰계수 f = %.6f\\n', f_root);

% 검증
fprintf('잔차: %.2e\\n', g(f_root));`;

const colebrookPython = `# Colebrook equation (파이프 마찰계수)
# 1/sqrt(f) = -2*log10(e/(3.7*D) + 2.51/(Re*sqrt(f)))
import numpy as np
from scipy.optimize import brentq

Re = 1e5       # Reynolds number
eD = 0.001     # relative roughness (e/D)

# brentq 활용 (bracket 필요)
def g(f):
    return (1/np.sqrt(f)
            + 2*np.log10(eD/3.7
            + 2.51/(Re*np.sqrt(f))))

f_root = brentq(g, 1e-6, 0.1)
print(f"마찰계수 f = {f_root:.6f}")

# 검증
print(f"잔차: {g(f_root):.2e}")`;

/* ── Main component ── */
export default function RootFindingPython() {
  const [activeTopic, setActiveTopic] = useState("bisection");
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
            Python으로도 해보기 &mdash; 근 찾기 편
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            MATLAB의 근 찾기 함수들을 Python / SciPy로 옮겨보세요
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
            <p className="text-yellow-300">$ pip install numpy scipy matplotlib</p>
            <p className="text-slate-600 mt-3"># 파일 상단에 import</p>
            <p className="text-blue-300">import numpy as np</p>
            <p className="text-blue-300">from scipy.optimize import brentq, newton</p>
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
            근 찾기 비교{" "}
            <span className="text-slate-500 text-sm font-normal">Root Finding Comparison</span>
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
            핵심 차이점 정리{" "}
            <span className="text-slate-500 text-sm font-normal">Key Differences</span>
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">항목</th>
                  <th className="text-left px-5 py-3 text-emerald-400 font-medium">MATLAB</th>
                  <th className="text-left px-5 py-3 text-blue-400 font-medium">Python / SciPy</th>
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

        {/* ── Complete example: Colebrook equation ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            전체 예제: Colebrook Equation{" "}
            <span className="text-slate-500 text-sm font-normal">
              파이프 마찰계수 구하기
            </span>
          </h3>
          <p className="text-slate-400 text-sm">
            유체역학에서 자주 등장하는 Colebrook 방정식은 비선형이므로 반드시
            수치적으로 풀어야 합니다. 양쪽 언어로 비교해 봅시다.
          </p>
          <DualCode matlab={colebrookMatlab} python={colebrookPython} />
        </motion.div>

        {/* ── Closing note ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/20 rounded-2xl p-6 text-center space-y-2"
        >
          <p className="text-slate-300 text-sm">
            MATLAB의 <code className="text-emerald-400">fzero</code>는 내부적으로 bisection + secant + IQI를 조합하며,
            Python에서는 <code className="text-blue-400">brentq</code>(bracket 필요)와{" "}
            <code className="text-blue-400">newton</code>(초기값 + 도함수)을 명시적으로 선택합니다.
            연립 비선형 방정식에는 <code className="text-blue-400">scipy.optimize.root</code>를 사용하세요.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
