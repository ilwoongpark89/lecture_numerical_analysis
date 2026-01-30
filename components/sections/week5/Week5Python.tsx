"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["Secant Method", "Fixed-Point", "비선형 연립방정식", "다중근 처리"];

const matlabCodes = [
  // Secant Method
  `% Secant Method (MATLAB)
f = @(x) x^3 - 2*x - 5;

x0 = 2; x1 = 3;
tol = 1e-10; maxIter = 50;

for i = 1:maxIter
    fx0 = f(x0); fx1 = f(x1);
    x2 = x1 - fx1*(x1 - x0)/(fx1 - fx0);
    if abs(x2 - x1) < tol
        fprintf('Root: %.12f (iter %d)\\n', x2, i);
        break;
    end
    x0 = x1; x1 = x2;
end`,

  // Fixed-Point
  `% Fixed-Point Iteration (MATLAB)
g = @(x) (2*x + 5)^(1/3);

x = 2.0; tol = 1e-10; maxIter = 100;

for i = 1:maxIter
    xNew = g(x);
    if abs(xNew - x) < tol
        fprintf('Fixed point: %.12f\\n', xNew);
        break;
    end
    x = xNew;
end`,

  // 비선형 연립방정식
  `% Nonlinear System — fsolve (MATLAB)
F = @(x) [
    x(1)^2 + x(2)^2 - 4;
    exp(x(1)) + x(2) - 1
];

J = @(x) [
    2*x(1),        2*x(2);
    exp(x(1)),     1
];

opts = optimoptions('fsolve', ...
    'SpecifyObjectiveGradient', true, ...
    'Display', 'iter');

x0 = [1; 0];
[xSol, fval] = fsolve(@(x) deal(F(x), J(x)), x0, opts);
disp(xSol);`,

  // 다중근 처리
  `% Modified Newton for Multiple Roots (MATLAB)
f  = @(x) (x - 1).^3;
fp = @(x) 3*(x - 1).^2;
fpp = @(x) 6*(x - 1);

x = 0.5; tol = 1e-12; maxIter = 100;

for i = 1:maxIter
    fx = f(x); fpx = fp(x); fppx = fpp(x);
    denom = fpx^2 - fx*fppx;
    if abs(denom) < eps
        break;
    end
    xNew = x - fx*fpx / denom;
    if abs(xNew - x) < tol
        fprintf('Root: %.12f (iter %d)\\n', xNew, i);
        break;
    end
    x = xNew;
end`,
];

const pythonCodes = [
  // Secant Method
  `# Secant Method (Python)
import numpy as np
from scipy.optimize import newton

f = lambda x: x**3 - 2*x - 5

# 수동 구현
x0, x1 = 2.0, 3.0
tol = 1e-10

for i in range(50):
    fx0, fx1 = f(x0), f(x1)
    x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
    if abs(x2 - x1) < tol:
        print(f"Root: {x2:.12f} (iter {i+1})")
        break
    x0, x1 = x1, x2

# scipy (x1 인자 → secant method 사용)
root = newton(f, x0=2, x1=3, tol=1e-10)
print(f"scipy root: {root:.12f}")`,

  // Fixed-Point
  `# Fixed-Point Iteration (Python)
import numpy as np

g = lambda x: (2*x + 5) ** (1/3)

x = 2.0
tol = 1e-10

for i in range(100):
    x_new = g(x)
    if abs(x_new - x) < tol:
        print(f"Fixed point: {x_new:.12f}")
        break
    x = x_new`,

  // 비선형 연립방정식
  `# Nonlinear System — fsolve (Python)
import numpy as np
from scipy.optimize import fsolve

def F(x):
    return [
        x[0]**2 + x[1]**2 - 4,
        np.exp(x[0]) + x[1] - 1
    ]

def J(x):
    return [
        [2*x[0],       2*x[1]],
        [np.exp(x[0]), 1      ]
    ]

x0 = [1.0, 0.0]
sol = fsolve(F, x0, fprime=J, full_output=True)
print(f"Solution: {sol[0]}")
print(f"Info: {sol[1]}")`,

  // 다중근 처리
  `# Modified Newton for Multiple Roots (Python)
import numpy as np

f   = lambda x: (x - 1)**3
fp  = lambda x: 3*(x - 1)**2
fpp = lambda x: 6*(x - 1)

x = 0.5
tol = 1e-12

for i in range(100):
    fx, fpx, fppx = f(x), fp(x), fpp(x)
    denom = fpx**2 - fx * fppx
    if abs(denom) < 1e-15:
        break
    x_new = x - fx * fpx / denom
    if abs(x_new - x) < tol:
        print(f"Root: {x_new:.12f} (iter {i+1})")
        break
    x = x_new`,
];

const keyDifferences = [
  {
    topic: "fzero vs brentq / newton",
    matlab: "fzero(f, [a, b]) — 자동으로 Brent's method 선택",
    python: "brentq(f, a, b) 또는 newton(f, x0) — 명시적으로 알고리즘 선택",
  },
  {
    topic: "fsolve 비교",
    matlab: "fsolve(fun, x0, options) — optimoptions로 설정",
    python: "fsolve(func, x0, fprime=J) — 키워드 인자로 설정. API가 매우 유사!",
  },
  {
    topic: "Jacobian 전달",
    matlab: "function handle + optimoptions('SpecifyObjectiveGradient', true)",
    python: "fprime=callable — 훨씬 간결",
  },
  {
    topic: "옵션 설정",
    matlab: "optimoptions('fsolve', 'Display', 'iter', ...)",
    python: "키워드 인자: full_output=True, maxfev=500 등",
  },
];

const completeExample = {
  matlab: `% Complete Example: 2D Nonlinear System
% x^2 + y^2 = 4,  x*y = 1

F = @(v) [v(1)^2 + v(2)^2 - 4; v(1)*v(2) - 1];
J = @(v) [2*v(1), 2*v(2); v(2), v(1)];

opts = optimoptions('fsolve', ...
    'SpecifyObjectiveGradient', true, ...
    'Display', 'final', ...
    'FunctionTolerance', 1e-14);

x0 = [1.5; 0.5];
[sol, fval, flag] = fsolve(@(v) deal(F(v), J(v)), x0, opts);
fprintf('Solution: (%.8f, %.8f)\\n', sol(1), sol(2));
fprintf('Residual: [%.2e, %.2e]\\n', fval(1), fval(2));`,

  python: `# Complete Example: 2D Nonlinear System
# x^2 + y^2 = 4,  x*y = 1
import numpy as np
from scipy.optimize import fsolve

def F(v):
    return [v[0]**2 + v[1]**2 - 4, v[0]*v[1] - 1]

def J(v):
    return [[2*v[0], 2*v[1]],
            [v[1],   v[0]  ]]

x0 = [1.5, 0.5]
sol, info, ier, msg = fsolve(F, x0, fprime=J, full_output=True)
print(f"Solution: ({sol[0]:.8f}, {sol[1]:.8f})")
print(f"Residual: {info['fvec']}")
print(f"Converged: {ier == 1}")`,
};

export default function Week5Python() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-20 px-4 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-400 to-yellow-400 text-slate-950 mb-4">
            Bonus
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Python으로도 해보기 —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">
              고급 근 찾기 편
            </span>
          </h2>
        </motion.div>

        {/* Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <h3 className="text-lg font-bold text-blue-400 mb-3">Setup</h3>
          <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
{`from scipy.optimize import brentq, newton, fsolve
import numpy as np`}
          </pre>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === i
                    ? "bg-gradient-to-r from-blue-400 to-yellow-400 text-slate-950"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* MATLAB */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-400 mb-3">
                MATLAB
              </span>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                {matlabCodes[activeTab]}
              </pre>
            </div>
            {/* Python */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-400/20 text-blue-400 mb-3">
                Python
              </span>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                {pythonCodes[activeTab]}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Key Differences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">
            Key Differences — 주요 차이점
          </h3>
          <div className="space-y-4">
            {keyDifferences.map((item, i) => (
              <motion.div
                key={item.topic}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-slate-700 bg-slate-800/50 p-4"
              >
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400 mb-2">
                  {item.topic}
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-emerald-400">MATLAB:</span>{" "}
                    <span className="text-slate-300">{item.matlab}</span>
                  </div>
                  <div>
                    <span className="text-blue-400">Python:</span>{" "}
                    <span className="text-slate-300">{item.python}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Complete Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-2">
            Complete Example — 비선형 연립방정식 풀기
          </h3>
          <p className="text-sm text-slate-400 mb-5 font-mono">
            x² + y² = 4, x·y = 1
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-400 mb-3">
                MATLAB
              </span>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                {completeExample.matlab}
              </pre>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-400/20 text-blue-400 mb-3">
                Python
              </span>
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                {completeExample.python}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
