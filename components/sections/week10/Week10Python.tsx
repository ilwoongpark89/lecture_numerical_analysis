"use client";

import { motion } from "framer-motion";
import { M } from "@/components/Math";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="space-y-3">
      <h4 className="text-purple-400 font-semibold">{title}</h4>
      <pre className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm text-slate-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const lagrangeCode = `import numpy as np
from scipy.interpolate import lagrange

# 데이터 점 정의
x = np.array([1, 2, 3])
y = np.array([1, 4, 9])

# Lagrange 보간 다항식 생성
poly = lagrange(x, y)
print("보간 다항식 계수:", poly.coefficients)
# 출력: [1. 0. 0.]  → x²

# 새로운 점에서 평가
x_new = 2.5
print(f"P({x_new}) = {poly(x_new)}")  # 6.25`;

const dividedDiffCode = `import numpy as np

def divided_difference_table(x, y):
    """분할 차분 테이블을 계산합니다."""
    n = len(x)
    table = np.zeros((n, n))
    table[:, 0] = y  # 0차 차분 = y 값

    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = (table[i+1][j-1] - table[i][j-1]) / (x[i+j] - x[i])

    return table

def newton_interpolation(x_data, table, x):
    """Newton 보간 다항식을 평가합니다."""
    n = len(x_data)
    result = table[0][0]  # f[x_0]
    product = 1.0

    for i in range(1, n):
        product *= (x - x_data[i-1])
        result += table[0][i] * product

    return result

# 사용 예시
x = np.array([1.0, 2.0, 3.0])
y = np.array([1.0, 4.0, 9.0])

table = divided_difference_table(x, y)
print("분할 차분 테이블:")
print(table)

# 보간값 계산
x_eval = 2.5
print(f"\\nP({x_eval}) = {newton_interpolation(x, table, x_eval)}")`;

const cubicSplineCode = `import numpy as np
from scipy.interpolate import CubicSpline
import matplotlib.pyplot as plt

# 데이터 점 정의
x = np.array([0, 1, 2, 3, 4])
y = np.array([0, 1, 0, 1, 0])

# Natural cubic spline (bc_type='natural')
cs = CubicSpline(x, y, bc_type='natural')

# 촘촘한 격자에서 평가
x_fine = np.linspace(0, 4, 200)
y_fine = cs(x_fine)

# 시각화
plt.figure(figsize=(10, 6))
plt.plot(x_fine, y_fine, 'b-', linewidth=2, label='Cubic Spline')
plt.plot(x, y, 'ro', markersize=8, label='Data Points')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Natural Cubic Spline Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# 도함수 확인
print("각 매듭점에서의 2차 도함수:")
for xi in x:
    print(f"  S''({xi}) = {cs(xi, 2):.6f}")`;

const rungeCode = `import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import lagrange

def runge(x):
    return 1 / (1 + 25 * x**2)

x_fine = np.linspace(-1, 1, 500)
y_true = runge(x_fine)

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# 등간격 노드 vs Chebyshev 노드
for n in [5, 10, 15]:
    # 등간격
    x_eq = np.linspace(-1, 1, n + 1)
    y_eq = runge(x_eq)
    poly_eq = lagrange(x_eq, y_eq)

    # Chebyshev 노드
    k = np.arange(n + 1)
    x_ch = np.cos((2*k + 1) * np.pi / (2*(n + 1)))
    y_ch = runge(x_ch)
    poly_ch = lagrange(x_ch, y_ch)

    axes[0].plot(x_fine, poly_eq(x_fine), label=f'n={n}')
    axes[1].plot(x_fine, poly_ch(x_fine), label=f'n={n}')

for ax in axes:
    ax.plot(x_fine, y_true, 'k--', linewidth=2, label='True f(x)')
    ax.set_ylim(-1, 2)
    ax.legend()
    ax.grid(True, alpha=0.3)

axes[0].set_title('Equally Spaced Nodes (Runge Phenomenon)')
axes[1].set_title('Chebyshev Nodes (No Oscillation)')
plt.tight_layout()
plt.show()`;

export default function Week10Python() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Python Implementation
          </h2>
          <p className="text-slate-400 text-lg">
            SciPy와 NumPy를 활용한 보간법 구현
          </p>
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock
            title="1. Lagrange 보간 (scipy.interpolate.lagrange)"
            code={lagrangeCode}
          />
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock
            title="2. Newton 분할 차분 (수동 구현)"
            code={dividedDiffCode}
          />
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
            <p className="text-violet-300 text-sm">
              <strong>참고:</strong> SciPy에는 Newton 보간 전용 함수가 없으므로 직접 구현합니다.
              분할 차분 테이블을 한 번 구성하면, 새로운 점 추가 시 마지막 열만 계산하면 됩니다.
            </p>
          </div>
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock
            title="3. Cubic Spline (scipy.interpolate.CubicSpline)"
            code={cubicSplineCode}
          />
          <div className="bg-slate-800/50 rounded-xl p-4 space-y-2 text-sm text-slate-400">
            <p><strong className="text-purple-400">bc_type 옵션:</strong></p>
            <ul className="space-y-1 ml-4">
              <li><code className="text-violet-300">&apos;natural&apos;</code> : <M>{"S''(x_0) = S''(x_n) = 0"}</M> (natural spline)</li>
              <li><code className="text-violet-300">&apos;clamped&apos;</code> : <M>{"S'(x_0) = f'(x_0),\\; S'(x_n) = f'(x_n)"}</M> (clamped spline)</li>
              <li><code className="text-violet-300">&apos;not-a-knot&apos;</code> : 첫 두 구간과 마지막 두 구간에서 3차 도함수 연속 (기본값)</li>
            </ul>
          </div>
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock
            title="4. Runge 현상 시각화"
            code={rungeCode}
          />
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 text-sm">
              왼쪽 그래프에서 <M>{"n"}</M>이 커질수록 양 끝에서 진동이 심해지는 것을 확인할 수 있습니다.
              반면 Chebyshev 노드(오른쪽)를 사용하면 차수가 높아져도 안정적인 근사를 얻습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
