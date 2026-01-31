"use client";

import { motion } from "framer-motion";

export default function Week9Python() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Python</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Python Implementation</h2>
        </motion.div>

        {/* numpy.polyfit */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">numpy.polyfit -- 다항 회귀</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`import numpy as np

# 데이터
x = np.array([1, 2, 3, 4, 5])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])

# 1차 다항식 (직선) 적합
coeffs = np.polyfit(x, y, deg=1)  # [a1, a0] (높은 차수부터)
print(f"y = {coeffs[1]:.4f} + {coeffs[0]:.4f} x")
# y = 0.2900 + 1.9100 x

# 2차 다항식 적합
coeffs2 = np.polyfit(x, y, deg=2)
print(f"y = {coeffs2[2]:.4f} + {coeffs2[1]:.4f} x + {coeffs2[0]:.4f} x²")

# 예측값 계산
p = np.poly1d(coeffs)
y_pred = p(x)
print(f"예측값: {y_pred}")

# R² 계산
ss_res = np.sum((y - y_pred)**2)
ss_tot = np.sum((y - np.mean(y))**2)
r_squared = 1 - ss_res / ss_tot
print(f"R² = {r_squared:.6f}")`}</pre>
          </div>
        </motion.div>

        {/* scipy.optimize.curve_fit */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">scipy.optimize.curve_fit -- 비선형 적합</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`from scipy.optimize import curve_fit
import numpy as np

x = np.array([1, 2, 3, 4, 5])
y = np.array([4.0, 6.5, 10.0, 16.1, 25.0])

# 지수 모델: y = a * exp(b * x)
def exp_model(x, a, b):
    return a * np.exp(b * x)

popt, pcov = curve_fit(exp_model, x, y, p0=[1, 0.5])
a, b = popt
print(f"y = {a:.4f} * exp({b:.4f} * x)")

# 거듭제곱 모델: y = a * x^b
def power_model(x, a, b):
    return a * x**b

popt2, pcov2 = curve_fit(power_model, x, y, p0=[1, 2])
print(f"y = {popt2[0]:.4f} * x^{popt2[1]:.4f}")

# 포화 모델: y = a*x / (b + x)
def saturation_model(x, a, b):
    return a * x / (b + x)

popt3, pcov3 = curve_fit(saturation_model, x, y, p0=[50, 5])
print(f"y = {popt3[0]:.2f} * x / ({popt3[1]:.2f} + x)")

# 표준 오차
perr = np.sqrt(np.diag(pcov))
print(f"매개변수 표준 오차: a ± {perr[0]:.4f}, b ± {perr[1]:.4f}")`}</pre>
          </div>
        </motion.div>

        {/* sklearn */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-emerald-400">sklearn.linear_model.LinearRegression</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

x = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])

# 단순 선형 회귀
model = LinearRegression()
model.fit(x, y)
print(f"절편: {model.intercept_:.4f}, 기울기: {model.coef_[0]:.4f}")
print(f"R² = {model.score(x, y):.6f}")

# 다항 회귀 (2차)
poly = PolynomialFeatures(degree=2)
x_poly = poly.fit_transform(x)

model2 = LinearRegression()
model2.fit(x_poly, y)
print(f"\\n2차 다항 회귀:")
print(f"계수: {model2.intercept_:.4f}, {model2.coef_}")
print(f"R² = {model2.score(x_poly, y):.6f}")`}</pre>
          </div>
        </motion.div>

        {/* matplotlib visualization */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-teal-400">matplotlib 시각화</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`import numpy as np
import matplotlib.pyplot as plt

x = np.array([1, 2, 3, 4, 5])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])

# 1차, 2차 적합
c1 = np.polyfit(x, y, 1)
c2 = np.polyfit(x, y, 2)

x_fine = np.linspace(0.5, 5.5, 100)
y1 = np.poly1d(c1)(x_fine)
y2 = np.poly1d(c2)(x_fine)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# 선형 적합
axes[0].scatter(x, y, color='red', s=80, zorder=5, label='Data')
axes[0].plot(x_fine, y1, 'b-', linewidth=2, label=f'Linear: y={c1[1]:.2f}+{c1[0]:.2f}x')
axes[0].set_title('Linear Regression')
axes[0].legend()
axes[0].grid(alpha=0.3)

# 잔차 시각화
y_pred = np.poly1d(c1)(x)
for xi, yi, yp in zip(x, y, y_pred):
    axes[0].plot([xi, xi], [yi, yp], 'g--', linewidth=1)

# 2차 적합
axes[1].scatter(x, y, color='red', s=80, zorder=5, label='Data')
axes[1].plot(x_fine, y2, 'b-', linewidth=2, label='Quadratic')
axes[1].set_title('Polynomial Regression (deg=2)')
axes[1].legend()
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.savefig('curve_fitting.png', dpi=150, bbox_inches='tight')
plt.show()`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
