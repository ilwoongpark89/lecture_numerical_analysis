"use client";

import { motion } from "framer-motion";

const anim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="space-y-3">
      <h4 className="text-pink-400 font-semibold">{title}</h4>
      <pre className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-sm text-slate-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const scipyBasic = `import numpy as np
from scipy import integrate

# 피적분함수 정의
f = lambda x: np.exp(x)

# --- 복합 사다리꼴 (scipy.integrate.trapezoid) ---
n = 100
x = np.linspace(0, 1, n + 1)
y = f(x)
result_trap = integrate.trapezoid(y, x)
print(f"복합 사다리꼴 (n={n}): {result_trap:.10f}")

# --- 복합 Simpson (scipy.integrate.simpson) ---
result_simp = integrate.simpson(y, x=x)
print(f"복합 Simpson  (n={n}): {result_simp:.10f}")

# --- 정확한 값 ---
exact = np.e - 1
print(f"정확한 값:            {exact:.10f}")
print(f"사다리꼴 오차: {abs(result_trap - exact):.2e}")
print(f"Simpson 오차:  {abs(result_simp - exact):.2e}")`;

const quadCode = `from scipy import integrate
import numpy as np

# quad: 적응형 Gauss 구적법 (가장 범용적)
result, error = integrate.quad(lambda x: np.exp(x), 0, 1)
print(f"quad 결과: {result:.15f}")
print(f"추정 오차: {error:.2e}")

# 다양한 함수에 적용
# 1) 삼각함수
I1, _ = integrate.quad(np.sin, 0, np.pi)
print(f"∫₀^π sin(x) dx = {I1:.10f}")  # 정확값: 2

# 2) 특이점이 있는 함수
I2, _ = integrate.quad(lambda x: 1/np.sqrt(x), 0, 1)
print(f"∫₀¹ 1/√x dx = {I2:.10f}")  # 정확값: 2

# 3) 무한 구간
I3, _ = integrate.quad(lambda x: np.exp(-x**2), -np.inf, np.inf)
print(f"∫₋∞^∞ e^(-x²) dx = {I3:.10f}")  # 정확값: √π`;

const manualTrap = `import numpy as np

def composite_trapezoidal(f, a, b, n):
    """복합 사다리꼴 공식을 직접 구현합니다."""
    h = (b - a) / n
    x = np.linspace(a, b, n + 1)

    result = f(x[0]) + f(x[-1])
    for i in range(1, n):
        result += 2 * f(x[i])

    return (h / 2) * result

def composite_simpson(f, a, b, n):
    """복합 Simpson 1/3 공식을 직접 구현합니다.
    n은 짝수여야 합니다."""
    if n % 2 != 0:
        n += 1
    h = (b - a) / n
    x = np.linspace(a, b, n + 1)

    result = f(x[0]) + f(x[-1])
    for i in range(1, n):
        if i % 2 == 1:
            result += 4 * f(x[i])
        else:
            result += 2 * f(x[i])

    return (h / 3) * result

# 테스트: ∫₀¹ eˣ dx
f = np.exp
exact = np.e - 1

for n in [2, 4, 8, 16, 32]:
    trap = composite_trapezoidal(f, 0, 1, n)
    simp = composite_simpson(f, 0, 1, n)
    print(f"n={n:3d}  사다리꼴 오차: {abs(trap-exact):.2e}  "
          f"Simpson 오차: {abs(simp-exact):.2e}")`;

const convergencePlot = `import numpy as np
import matplotlib.pyplot as plt

def composite_trapezoidal(f, a, b, n):
    h = (b - a) / n
    x = np.linspace(a, b, n + 1)
    result = f(x[0]) + f(x[-1])
    for i in range(1, n):
        result += 2 * f(x[i])
    return (h / 2) * result

def composite_simpson(f, a, b, n):
    if n % 2 != 0:
        n += 1
    h = (b - a) / n
    x = np.linspace(a, b, n + 1)
    result = f(x[0]) + f(x[-1])
    for i in range(1, n):
        result += (4 if i % 2 == 1 else 2) * f(x[i])
    return (h / 3) * result

f = np.exp
exact = np.e - 1
ns = [2, 4, 8, 16, 32, 64, 128, 256]

trap_errors = [abs(composite_trapezoidal(f, 0, 1, n) - exact) for n in ns]
simp_errors = [abs(composite_simpson(f, 0, 1, n) - exact) for n in ns]
hs = [1.0 / n for n in ns]

plt.figure(figsize=(8, 6))
plt.loglog(hs, trap_errors, 'o-', color='#e879f9', label='복합 사다리꼴', linewidth=2)
plt.loglog(hs, simp_errors, 's-', color='#f472b6', label='복합 Simpson', linewidth=2)
# 기울기 참고선
plt.loglog(hs, [h**2 * 0.5 for h in hs], '--', color='gray', alpha=0.5, label='O(h²)')
plt.loglog(hs, [h**4 * 0.5 for h in hs], ':', color='gray', alpha=0.5, label='O(h⁴)')

plt.xlabel('h (구간 크기)', fontsize=12)
plt.ylabel('|오차|', fontsize=12)
plt.title('수치 적분 수렴 비교: ∫₀¹ eˣ dx', fontsize=14)
plt.legend(fontsize=11)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('integration_convergence.png', dpi=150)
plt.show()`;

export default function Week11Python() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Title */}
        <motion.div {...anim} className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Python 구현
          </h2>
          <p className="text-slate-400 text-lg">SciPy를 활용한 수치 적분</p>
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock title="SciPy 기본: trapezoid & simpson" code={scipyBasic} />
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock title="scipy.integrate.quad (적응형 Gauss 구적법)" code={quadCode} />
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock title="복합 공식 직접 구현" code={manualTrap} />
        </motion.div>

        <motion.div {...anim} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-8">
          <CodeBlock title="수렴 비교 그래프" code={convergencePlot} />
        </motion.div>
      </div>
    </section>
  );
}
