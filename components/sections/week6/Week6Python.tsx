"use client";

import { motion } from "framer-motion";

export default function Week6Python() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Python</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Python / NumPy 구현</h2>
        </motion.div>

        {/* numpy.linalg.solve */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">NumPy 내장 함수</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`import numpy as np

A = np.array([[2, 1, -1],
              [-3, -1, 2],
              [-2, 1, 2]], dtype=float)
b = np.array([8, -11, -3], dtype=float)

# 가장 간단한 방법
x = np.linalg.solve(A, b)
print(f"Solution: {x}")  # [2. 3. -1.]

# 조건수 확인
print(f"Condition number: {np.linalg.cond(A):.2f}")`}</pre>
          </div>
        </motion.div>

        {/* Manual Gauss */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-violet-400">Gauss Elimination 직접 구현</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`def gauss_elimination(A, b):
    """Gauss elimination with partial pivoting."""
    n = len(b)
    # Augmented matrix
    Aug = np.hstack([A.copy(), b.reshape(-1, 1)])

    # Forward elimination with partial pivoting
    for k in range(n - 1):
        # Partial pivoting
        max_row = np.argmax(np.abs(Aug[k:, k])) + k
        if max_row != k:
            Aug[[k, max_row]] = Aug[[max_row, k]]

        for i in range(k + 1, n):
            factor = Aug[i, k] / Aug[k, k]
            Aug[i, k:] -= factor * Aug[k, k:]

    # Back substitution
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (Aug[i, -1] - Aug[i, i+1:n] @ x[i+1:n]) / Aug[i, i]

    return x

x = gauss_elimination(A, b)
print(f"Solution: {x}")  # [2. 3. -1.]`}</pre>
          </div>
        </motion.div>

        {/* LU with SciPy */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">SciPy LU Decomposition</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`from scipy import linalg

# LU decomposition with pivoting
P, L, U = linalg.lu(A)

print("P =\\n", P)
print("L =\\n", L)
print("U =\\n", U)

# Verify: P @ A = L @ U
print("Verification:", np.allclose(P @ A, L @ U))

# Solve using LU factors
# For multiple right-hand sides:
b1 = np.array([8, -11, -3])
b2 = np.array([1, 0, 0])

lu_factor = linalg.lu_factor(A)
x1 = linalg.lu_solve(lu_factor, b1)
x2 = linalg.lu_solve(lu_factor, b2)  # Reuses the same factorization!

print(f"x1 = {x1}")
print(f"x2 = {x2}")

# Condition number
print(f"cond(A) = {np.linalg.cond(A):.4f}")`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
