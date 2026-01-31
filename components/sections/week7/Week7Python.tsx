"use client";

import { motion } from "framer-motion";

export default function Week7Python() {
  return (
    <section className="py-20 px-4 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">Python</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Python / NumPy 구현</h2>
        </motion.div>

        {/* Jacobi */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">Jacobi Method</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`import numpy as np

def jacobi(A, b, x0=None, tol=1e-8, maxiter=1000):
    """Jacobi iterative method."""
    n = len(b)
    x = np.zeros(n) if x0 is None else x0.copy()
    D = np.diag(np.diag(A))
    R = A - D  # L + U

    for k in range(maxiter):
        x_new = np.linalg.solve(D, b - R @ x)
        if np.max(np.abs(x_new - x)) < tol:
            print(f"Jacobi converged in {k+1} iterations")
            return x_new
        x = x_new

    print("Warning: max iterations reached")
    return x

A = np.array([[4, -1, 1], [4, -8, 1], [-2, 1, 5]], dtype=float)
b = np.array([7, -21, 15], dtype=float)
x = jacobi(A, b)
print(f"Solution: {x}")  # [2. 4. 3.]`}</pre>
          </div>
        </motion.div>

        {/* Gauss-Seidel */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">Gauss-Seidel Method</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`def gauss_seidel(A, b, x0=None, tol=1e-8, maxiter=1000):
    """Gauss-Seidel iterative method."""
    n = len(b)
    x = np.zeros(n) if x0 is None else x0.copy()

    for k in range(maxiter):
        x_old = x.copy()
        for i in range(n):
            sigma = A[i, :i] @ x[:i] + A[i, i+1:] @ x[i+1:]
            x[i] = (b[i] - sigma) / A[i, i]

        if np.max(np.abs(x - x_old)) < tol:
            print(f"Gauss-Seidel converged in {k+1} iterations")
            return x

    print("Warning: max iterations reached")
    return x

x = gauss_seidel(A, b)
print(f"Solution: {x}")`}</pre>
          </div>
        </motion.div>

        {/* SOR */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-sky-400">SOR Method</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`def sor(A, b, omega=1.2, x0=None, tol=1e-8, maxiter=1000):
    """Successive Over-Relaxation method."""
    n = len(b)
    x = np.zeros(n) if x0 is None else x0.copy()

    for k in range(maxiter):
        x_old = x.copy()
        for i in range(n):
            sigma = A[i, :i] @ x[:i] + A[i, i+1:] @ x[i+1:]
            gs_update = (b[i] - sigma) / A[i, i]
            x[i] = (1 - omega) * x_old[i] + omega * gs_update

        if np.max(np.abs(x - x_old)) < tol:
            print(f"SOR (ω={omega}) converged in {k+1} iterations")
            return x

    print("Warning: max iterations reached")
    return x

# Compare convergence for different omega
for w in [0.8, 1.0, 1.2, 1.5]:
    x = sor(A, b, omega=w)`}</pre>
          </div>
        </motion.div>

        {/* Sparse Systems */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-blue-400">대규모 희소행렬</h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre">{`from scipy import sparse
from scipy.sparse.linalg import spsolve

# 1D heat equation: tridiagonal system
n = 1000
diag_main = 2 * np.ones(n)
diag_off = -1 * np.ones(n - 1)
A_sparse = sparse.diags([diag_off, diag_main, diag_off], [-1, 0, 1], format='csr')

b = np.zeros(n)
b[0] = 100   # boundary condition
b[-1] = 50

# Direct solve (sparse LU)
x = spsolve(A_sparse, b)
print(f"Direct solve: x[0]={x[0]:.4f}, x[-1]={x[-1]:.4f}")

# Check diagonal dominance
print("Diagonally dominant:", np.all(
    np.abs(A_sparse.diagonal()) > np.array(
        [np.sum(np.abs(row)) - np.abs(row[0, i])
         for i, row in enumerate(A_sparse)]
    )
))`}</pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
