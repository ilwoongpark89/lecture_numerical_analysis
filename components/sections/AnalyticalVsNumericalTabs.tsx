"use client";

import { useState, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";

// ─── Shared helpers ───
const g = 9.81;

// ─── Mini simulations ───

function HeatConduction1D({ mode }: { mode: "analytical" | "numerical" }) {
  const [T1, setT1] = useState(100);
  const [T2, setT2] = useState(25);
  const N = 20;

  const analyticalT = Array.from({ length: N }, (_, i) => T1 + (T2 - T1) * (i / (N - 1)));

  const [iterations, setIterations] = useState(3);
  const numericalT = useMemo(() => {
    const T = Array(N).fill((T1 + T2) / 2);
    T[0] = T1;
    T[N - 1] = T2;
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 1; i < N - 1; i++) {
        T[i] = (T[i - 1] + T[i + 1]) / 2;
      }
    }
    return [...T];
  }, [T1, T2, iterations, N]);

  const data = mode === "analytical" ? analyticalT : numericalT;

  const W = 500, H = 200, PAD = 45;
  const scX = (i: number) => PAD + (i / (N - 1)) * (W - PAD * 2);
  const minT = Math.min(T1, T2) - 5, maxT = Math.max(T1, T2) + 5;
  const scY = (t: number) => H - PAD - ((t - minT) / (maxT - minT)) * (H - PAD * 2);
  const tempToColor = (t: number) => {
    const ratio = (t - Math.min(T1, T2)) / (Math.max(T1, T2) - Math.min(T1, T2) || 1);
    const r = Math.round(255 * ratio), b = Math.round(255 * (1 - ratio));
    return `rgb(${r},60,${b})`;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="text-xs text-gray-400 flex items-center gap-2">
          T<sub>left</sub>
          <input type="range" min={0} max={200} value={T1} onChange={(e) => setT1(+e.target.value)}
            className="w-24 h-1 accent-red-400" />
          <span className="text-red-400 font-mono w-14">{T1}°C</span>
        </label>
        <label className="text-xs text-gray-400 flex items-center gap-2">
          T<sub>right</sub>
          <input type="range" min={0} max={200} value={T2} onChange={(e) => setT2(+e.target.value)}
            className="w-24 h-1 accent-blue-400" />
          <span className="text-blue-400 font-mono w-14">{T2}°C</span>
        </label>
        {mode === "numerical" && (
          <label className="text-xs text-gray-400 flex items-center gap-2">
            반복 횟수
            <input type="range" min={1} max={30} value={iterations} onChange={(e) => setIterations(+e.target.value)}
              className="w-20 h-1 accent-amber-400" />
            <span className="text-amber-400 font-mono w-8">{iterations}</span>
          </label>
        )}
      </div>
      <div className="flex h-6 rounded overflow-hidden mb-3">
        {data.map((t, i) => (
          <div key={i} style={{ flex: 1, background: tempToColor(t) }} />
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const tv = minT + f * (maxT - minT);
          return (
            <g key={f}>
              <line x1={PAD} y1={scY(tv)} x2={W - PAD} y2={scY(tv)} stroke="#334155" strokeWidth={0.5} />
              <text x={PAD - 5} y={scY(tv) + 4} textAnchor="end" fill="#64748b" fontSize={9}>{tv.toFixed(0)}</text>
            </g>
          );
        })}
        <polyline fill="none" stroke="#22d3ee" strokeWidth={mode === "analytical" ? 2 : 1} opacity={mode === "analytical" ? 1 : 0.3}
          strokeDasharray={mode === "numerical" ? "4 3" : "0"}
          points={analyticalT.map((t, i) => `${scX(i)},${scY(t)}`).join(" ")} />
        {mode === "numerical" && (
          <>
            <polyline fill="none" stroke="#f59e0b" strokeWidth={2}
              points={numericalT.map((t, i) => `${scX(i)},${scY(t)}`).join(" ")} />
            {numericalT.map((t, i) => (
              <circle key={i} cx={scX(i)} cy={scY(t)} r={2.5} fill="#f59e0b" />
            ))}
          </>
        )}
        <text x={W / 2} y={H - 5} textAnchor="middle" fill="#94a3b8" fontSize={10}>x / L</text>
        <text x={8} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize={10} transform={`rotate(-90 8 ${H / 2})`}>T (°C)</text>
      </svg>
      <p className="text-xs text-gray-500 mt-2">
        {mode === "analytical"
          ? "정상상태 1D 열전도 → 온도가 직선 분포 (해석해: T(x) = T₁ + (T₂−T₁)·x/L)"
          : `Gauss-Seidel ${iterations}회 반복 — 반복 횟수를 늘려 해석해(점선)에 수렴하는 과정을 확인하세요`}
      </p>
    </div>
  );
}

function DampedOscillation({ mode }: { mode: "analytical" | "numerical" }) {
  const [zeta, setZeta] = useState(0.2);
  const [omega, setOmega] = useState(5);
  const dt = 0.02;
  const tMax = 4;
  const steps = Math.floor(tMax / dt);

  const omegaD = omega * Math.sqrt(1 - zeta * zeta);
  const analyticalData = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i * dt;
    return { t, x: Math.exp(-zeta * omega * t) * Math.cos(omegaD * t) };
  });

  const numericalData = useMemo(() => {
    const pts: { t: number; x: number }[] = [{ t: 0, x: 1 }];
    let x = 1, v = 0;
    for (let i = 1; i <= steps; i++) {
      const a = -2 * zeta * omega * v - omega * omega * x;
      v += a * dt;
      x += v * dt;
      pts.push({ t: i * dt, x });
    }
    return pts;
  }, [zeta, omega, steps]);

  const W = 500, H = 200, PAD = 40;
  const scX = (t: number) => PAD + (t / tMax) * (W - PAD * 2);
  const scY = (x: number) => H / 2 - x * (H / 2 - PAD);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="text-xs text-gray-400 flex items-center gap-2">
          감쇠비 ζ
          <input type="range" min={0.01} max={0.99} step={0.01} value={zeta} onChange={(e) => setZeta(+e.target.value)}
            className="w-24 h-1 accent-violet-400" />
          <span className="text-violet-400 font-mono w-10">{zeta.toFixed(2)}</span>
        </label>
        <label className="text-xs text-gray-400 flex items-center gap-2">
          고유진동수 ω
          <input type="range" min={1} max={15} step={0.5} value={omega} onChange={(e) => setOmega(+e.target.value)}
            className="w-24 h-1 accent-violet-400" />
          <span className="text-violet-400 font-mono w-10">{omega.toFixed(1)}</span>
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#334155" strokeWidth={0.5} />
        {[0, 1, 2, 3, 4].map((t) => (
          <g key={t}>
            <line x1={scX(t)} y1={PAD} x2={scX(t)} y2={H - PAD} stroke="#334155" strokeWidth={0.5} />
            <text x={scX(t)} y={H - PAD + 14} textAnchor="middle" fill="#64748b" fontSize={9}>{t}</text>
          </g>
        ))}
        <polyline fill="none" stroke="#475569" strokeWidth={0.8} strokeDasharray="3 3"
          points={analyticalData.map((d) => `${scX(d.t)},${scY(Math.exp(-zeta * omega * d.t))}`).join(" ")} />
        <polyline fill="none" stroke="#475569" strokeWidth={0.8} strokeDasharray="3 3"
          points={analyticalData.map((d) => `${scX(d.t)},${scY(-Math.exp(-zeta * omega * d.t))}`).join(" ")} />
        <polyline fill="none" stroke="#a78bfa" strokeWidth={mode === "analytical" ? 2 : 1} opacity={mode === "analytical" ? 1 : 0.3}
          strokeDasharray={mode === "numerical" ? "4 3" : "0"}
          points={analyticalData.map((d) => `${scX(d.t)},${scY(d.x)}`).join(" ")} />
        {mode === "numerical" && (
          <polyline fill="none" stroke="#f59e0b" strokeWidth={2}
            points={numericalData.map((d) => `${scX(d.t)},${scY(d.x)}`).join(" ")} />
        )}
        <text x={W / 2} y={H - 2} textAnchor="middle" fill="#94a3b8" fontSize={10}>t (s)</text>
        <text x={8} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize={10} transform={`rotate(-90 8 ${H / 2})`}>x</text>
      </svg>
      <p className="text-xs text-gray-500 mt-2">
        {mode === "analytical"
          ? `감쇠 자유진동: x(t) = e^{-ζωt}cos(ω_d·t), ω_d = ${omegaD.toFixed(2)} rad/s`
          : "Euler Method (Δt=0.02s) — 감쇠비를 높여보세요. 점선은 해석해."}
      </p>
    </div>
  );
}

function PoiseuilleFlow({ mode }: { mode: "analytical" | "numerical" }) {
  const [dpdx, setDpDx] = useState(100);
  const R = 1, mu = 0.01;
  const N = 21;

  const analyticalU = Array.from({ length: N }, (_, i) => {
    const r = -R + i * (2 * R) / (N - 1);
    return { r, u: ((R * R - r * r) / (4 * mu)) * dpdx };
  });
  const uMax = (R * R / (4 * mu)) * dpdx;

  const [iters, setIters] = useState(5);
  const numericalU = useMemo(() => {
    const half = Math.floor(N / 2);
    const u = Array(half + 1).fill(0);
    u[half] = 0;
    const drr = R / half;
    for (let it = 0; it < iters; it++) {
      for (let i = 1; i < half; i++) {
        const r = i * drr;
        u[i] = ((u[i - 1] * (1 + drr / (2 * r)) + u[i + 1] * (1 - drr / (2 * r))) / 2) + (drr * drr * dpdx) / (2 * mu);
      }
      u[0] = u[1];
    }
    return Array.from({ length: N }, (_, i) => {
      const idx = i <= half ? half - i : i - half;
      const r = -R + i * (2 * R) / (N - 1);
      return { r, u: u[idx] };
    });
  }, [dpdx, iters, N, mu, R]);

  const W = 500, H = 220, PAD = 45;
  const displayMax = uMax * 1.1 || 1;
  const scX = (u: number) => PAD + (u / displayMax) * (W - PAD * 2);
  const scY = (r: number) => PAD + ((r + R) / (2 * R)) * (H - PAD * 2);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="text-xs text-gray-400 flex items-center gap-2">
          압력구배 −dp/dx
          <input type="range" min={10} max={500} value={dpdx} onChange={(e) => setDpDx(+e.target.value)}
            className="w-24 h-1 accent-blue-400" />
          <span className="text-blue-400 font-mono w-12">{dpdx}</span>
        </label>
        {mode === "numerical" && (
          <label className="text-xs text-gray-400 flex items-center gap-2">
            반복
            <input type="range" min={1} max={50} value={iters} onChange={(e) => setIters(+e.target.value)}
              className="w-20 h-1 accent-amber-400" />
            <span className="text-amber-400 font-mono w-8">{iters}</span>
          </label>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
        <line x1={PAD} y1={scY(-R)} x2={W - PAD} y2={scY(-R)} stroke="#475569" strokeWidth={2} />
        <line x1={PAD} y1={scY(R)} x2={W - PAD} y2={scY(R)} stroke="#475569" strokeWidth={2} />
        <line x1={PAD} y1={scY(-R)} x2={PAD} y2={scY(R)} stroke="#334155" strokeWidth={0.5} />
        <polyline fill="none" stroke="#38bdf8" strokeWidth={mode === "analytical" ? 2.5 : 1} opacity={mode === "analytical" ? 1 : 0.3}
          strokeDasharray={mode === "numerical" ? "4 3" : "0"}
          points={analyticalU.map((d) => `${scX(d.u)},${scY(d.r)}`).join(" ")} />
        {mode === "analytical" && analyticalU.filter((_, i) => i % 2 === 0).map((d, i) => (
          <line key={i} x1={PAD} y1={scY(d.r)} x2={scX(d.u)} y2={scY(d.r)} stroke="#38bdf8" strokeWidth={1} opacity={0.4} />
        ))}
        {mode === "numerical" && (
          <>
            <polyline fill="none" stroke="#f59e0b" strokeWidth={2.5}
              points={numericalU.map((d) => `${scX(d.u)},${scY(d.r)}`).join(" ")} />
            {numericalU.map((d, i) => (
              <circle key={i} cx={scX(d.u)} cy={scY(d.r)} r={2.5} fill="#f59e0b" />
            ))}
          </>
        )}
        <text x={W / 2} y={H - 3} textAnchor="middle" fill="#94a3b8" fontSize={10}>u (m/s)</text>
        <text x={8} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize={10} transform={`rotate(-90 8 ${H / 2})`}>r</text>
      </svg>
      <p className="text-xs text-gray-500 mt-2">
        {mode === "analytical"
          ? `Hagen-Poiseuille: u(r) = (R²−r²)/(4μ)·(−dp/dx), u_max = ${uMax.toFixed(1)} m/s`
          : `유한차분법 ${iters}회 반복 — 반복 횟수를 늘려 포물선(점선)에 수렴시켜 보세요`}
      </p>
    </div>
  );
}

function CantileverBeam({ mode }: { mode: "analytical" | "numerical" }) {
  const [P, setP] = useState(1000);
  const [EI, setEI] = useState(1e6);
  const L = 2;
  const N = 21;

  const analyticalY = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * L;
    return { x, y: (P * x * x * (3 * L - x)) / (6 * EI) };
  });
  const yTip = (P * L * L * L) / (3 * EI);

  const [fdmN, setFdmN] = useState(6);
  const numericalY = useMemo(() => {
    const nn = Math.max(fdmN, 3);
    const dx = L / nn;
    const y = Array(nn + 1).fill(0);
    y[0] = 0;
    y[1] = 0;
    for (let i = 1; i < nn; i++) {
      const xi = i * dx;
      const ypp = (P * (L - xi)) / EI;
      y[i + 1] = 2 * y[i] - y[i - 1] + ypp * dx * dx;
    }
    return Array.from({ length: nn + 1 }, (_, i) => ({
      x: i * dx,
      y: y[i],
    }));
  }, [P, EI, fdmN, L]);

  const W = 500, H = 200, PAD = 45;
  const maxY = yTip * 1.2 || 0.001;
  const scX = (x: number) => PAD + (x / L) * (W - PAD * 2);
  const scY = (y: number) => PAD + (y / maxY) * (H - PAD * 2);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="text-xs text-gray-400 flex items-center gap-2">
          하중 P
          <input type="range" min={100} max={5000} step={100} value={P} onChange={(e) => setP(+e.target.value)}
            className="w-24 h-1 accent-emerald-400" />
          <span className="text-emerald-400 font-mono w-14">{P} N</span>
        </label>
        <label className="text-xs text-gray-400 flex items-center gap-2">
          EI
          <input type="range" min={1e5} max={1e7} step={1e5} value={EI} onChange={(e) => setEI(+e.target.value)}
            className="w-24 h-1 accent-emerald-400" />
          <span className="text-emerald-400 font-mono w-20">{(EI / 1e6).toFixed(1)}×10⁶</span>
        </label>
        {mode === "numerical" && (
          <label className="text-xs text-gray-400 flex items-center gap-2">
            격자수
            <input type="range" min={3} max={30} value={fdmN} onChange={(e) => setFdmN(+e.target.value)}
              className="w-20 h-1 accent-amber-400" />
            <span className="text-amber-400 font-mono w-8">{fdmN}</span>
          </label>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        <line x1={scX(0)} y1={scY(0)} x2={scX(L)} y2={scY(0)} stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
        <line x1={scX(0)} y1={scY(-maxY * 0.05)} x2={scX(0)} y2={scY(maxY * 0.3)} stroke="#64748b" strokeWidth={3} />
        <line x1={scX(L)} y1={scY(0) - 30} x2={scX(L)} y2={scY(0) - 5} stroke="#ef4444" strokeWidth={2} markerEnd="url(#arrowR)" />
        <text x={scX(L) + 5} y={scY(0) - 20} fill="#ef4444" fontSize={10}>P</text>
        <defs><marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#ef4444" /></marker></defs>
        <polyline fill="none" stroke="#34d399" strokeWidth={mode === "analytical" ? 2.5 : 1} opacity={mode === "analytical" ? 1 : 0.3}
          strokeDasharray={mode === "numerical" ? "4 3" : "0"}
          points={analyticalY.map((d) => `${scX(d.x)},${scY(d.y)}`).join(" ")} />
        {mode === "numerical" && (
          <>
            <polyline fill="none" stroke="#f59e0b" strokeWidth={2.5}
              points={numericalY.map((d) => `${scX(d.x)},${scY(d.y)}`).join(" ")} />
            {numericalY.map((d, i) => (
              <circle key={i} cx={scX(d.x)} cy={scY(d.y)} r={3} fill="#f59e0b" />
            ))}
          </>
        )}
        <text x={W / 2} y={H - 3} textAnchor="middle" fill="#94a3b8" fontSize={10}>x (m)</text>
        <text x={8} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize={10} transform={`rotate(-90 8 ${H / 2})`}>y (m)</text>
      </svg>
      <p className="text-xs text-gray-500 mt-2">
        {mode === "analytical"
          ? `외팔보: y(x) = Px²(3L−x)/(6EI), 끝단 처짐 = ${(yTip * 1000).toFixed(2)} mm`
          : `유한차분 (${fdmN}격자) — 격자를 늘려 해석해(점선)와 비교해보세요`}
      </p>
    </div>
  );
}

function BungeeJumperMini({ mode }: { mode: "analytical" | "numerical" }) {
  const [mass, setMass] = useState(68.1);
  const [cdVal, setCdVal] = useState(0.25);
  const dtEuler = 2;
  const tMax = 12;

  const termV = Math.sqrt((g * mass) / cdVal);
  const analyticalData = Array.from({ length: 121 }, (_, i) => {
    const t = i * 0.1;
    return { t, v: Math.sqrt((g * mass) / cdVal) * Math.tanh(Math.sqrt((g * cdVal) / mass) * t) };
  });
  const numericalData = useMemo(() => {
    const pts: { t: number; v: number }[] = [{ t: 0, v: 0 }];
    let v = 0, t = 0;
    while (t < tMax - dtEuler / 2) {
      const dvdt = g - (cdVal / mass) * v * v;
      v += dvdt * dtEuler;
      t += dtEuler;
      pts.push({ t, v });
    }
    return pts;
  }, [mass, cdVal]);

  const W = 500, H = 200, PAD = 45;
  const yM = Math.ceil(termV / 10) * 10 + 10;
  const scX = (t: number) => PAD + (t / tMax) * (W - PAD * 2);
  const scY = (v: number) => H - PAD - (v / yM) * (H - PAD * 2);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="text-xs text-gray-400 flex items-center gap-2">
          m
          <input type="range" min={30} max={150} step={0.1} value={mass} onChange={(e) => setMass(+e.target.value)}
            className="w-24 h-1 accent-cyan-400" />
          <span className="text-cyan-400 font-mono w-16">{mass.toFixed(1)} kg</span>
        </label>
        <label className="text-xs text-gray-400 flex items-center gap-2">
          c<sub>d</sub>
          <input type="range" min={0.05} max={1} step={0.01} value={cdVal} onChange={(e) => setCdVal(+e.target.value)}
            className="w-24 h-1 accent-cyan-400" />
          <span className="text-cyan-400 font-mono w-12">{cdVal.toFixed(2)}</span>
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        {[0, 2, 4, 6, 8, 10, 12].map((t) => (
          <g key={t}>
            <line x1={scX(t)} y1={PAD} x2={scX(t)} y2={H - PAD} stroke="#334155" strokeWidth={0.5} />
            <text x={scX(t)} y={H - PAD + 14} textAnchor="middle" fill="#64748b" fontSize={9}>{t}</text>
          </g>
        ))}
        <line x1={PAD} y1={scY(termV)} x2={W - PAD} y2={scY(termV)} stroke="#475569" strokeWidth={0.8} strokeDasharray="4 3" />
        <polyline fill="none" stroke="#22d3ee" strokeWidth={mode === "analytical" ? 2.5 : 1} opacity={mode === "analytical" ? 1 : 0.3}
          strokeDasharray={mode === "numerical" ? "4 3" : "0"}
          points={analyticalData.map((d) => `${scX(d.t)},${scY(d.v)}`).join(" ")} />
        {mode === "numerical" && (
          <>
            <polyline fill="none" stroke="#f59e0b" strokeWidth={2}
              points={numericalData.map((d) => `${scX(d.t)},${scY(d.v)}`).join(" ")} />
            {numericalData.map((d, i) => (
              <circle key={i} cx={scX(d.t)} cy={scY(d.v)} r={3} fill="#f59e0b" />
            ))}
          </>
        )}
        <text x={W / 2} y={H - 2} textAnchor="middle" fill="#94a3b8" fontSize={10}>t (s)</text>
      </svg>
      <p className="text-xs text-gray-500 mt-2">
        {mode === "analytical"
          ? `v(t) = ${termV.toFixed(1)}·tanh(${Math.sqrt((g * cdVal) / mass).toFixed(4)}·t), 종단속도 = ${termV.toFixed(1)} m/s`
          : `Euler (Δt=2s) — 큰 step size에서 오차가 보입니다. 해석해(점선)와 비교하세요.`}
      </p>
    </div>
  );
}

// ─── Example definitions ───
interface ExampleDef {
  field: string;
  fieldColor: string;
  borderColor: string;
  bgColor: string;
  title: string;
  analyticalLabel: string;
  numericalLabel: string;
  equation: string;
  compareNote: string;
  render: (mode: "analytical" | "numerical") => ReactNode;
}

const examples: ExampleDef[] = [
  {
    field: "동역학",
    fieldColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    bgColor: "bg-cyan-500/5",
    title: "번지점퍼 자유낙하",
    analyticalLabel: "변수분리 → tanh 해 (정확)",
    numericalLabel: "Euler Method Δt=2s (근사)",
    equation: "dv/dt = g − (c_d/m)v²",
    compareNote: "해석해는 단순 1D이므로 가능하지만, 3D 형상·바람·탄성 로프가 추가되면 수치해만 가능합니다.",
    render: (mode) => <BungeeJumperMini mode={mode} />,
  },
  {
    field: "열전달",
    fieldColor: "text-red-400",
    borderColor: "border-red-500/20",
    bgColor: "bg-red-500/5",
    title: "1D 정상상태 열전도",
    analyticalLabel: "적분 → 직선 온도분포 (정확)",
    numericalLabel: "Gauss-Seidel 반복법 (근사)",
    equation: "d²T/dx² = 0",
    compareNote: "1D 균일 물성치는 해석해 가능. 2D/3D 복잡 형상이나 온도 의존 물성치에서는 수치해 필수.",
    render: (mode) => <HeatConduction1D mode={mode} />,
  },
  {
    field: "진동",
    fieldColor: "text-violet-400",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/5",
    title: "감쇠 자유진동 (1-DOF)",
    analyticalLabel: "특성방정식 → 지수·삼각함수 (정확)",
    numericalLabel: "Euler Method Δt=0.02s (근사)",
    equation: "mẍ + cẋ + kx = 0",
    compareNote: "선형 1자유도는 해석해 존재. 다자유도·비선형 감쇠·외력이 추가되면 수치적분 필요.",
    render: (mode) => <DampedOscillation mode={mode} />,
  },
  {
    field: "유체역학",
    fieldColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    title: "원관 층류 유동 (Poiseuille)",
    analyticalLabel: "적분 → 포물선 속도분포 (정확)",
    numericalLabel: "유한차분 반복법 (근사)",
    equation: "d²u/dr² + (1/r)du/dr = (1/μ)dp/dx",
    compareNote: "완전발달 층류는 해석해 가능. 난류, 입구 영역, 복잡 단면에서는 CFD(수치해) 필수.",
    render: (mode) => <PoiseuilleFlow mode={mode} />,
  },
  {
    field: "고체역학",
    fieldColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    title: "외팔보 처짐",
    analyticalLabel: "이중적분 → 3차 곡선 (정확)",
    numericalLabel: "유한차분법 FDM (근사)",
    equation: "EI · d²y/dx² = M(x)",
    compareNote: "단순 하중·균일 단면은 해석해 가능. 복잡 하중·가변 단면·비선형 재료에서는 FEM(수치해) 필수.",
    render: (mode) => <CantileverBeam mode={mode} />,
  },
];

// ─── Main Component ───
export default function AnalyticalVsNumericalTabs() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Two Approaches
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            해석적 방법 vs 수치적 방법
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            같은 문제를 두 가지 방법으로 풀어봅니다 — 좌우를 비교하며 차이를 느껴보세요
          </p>
        </motion.div>

        {/* All examples stacked vertically */}
        <div className="space-y-12">
          {examples.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {/* Field header */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${ex.fieldColor} bg-slate-800`}>
                  {ex.field}
                </span>
                <h3 className="text-white font-bold text-lg">{ex.title}</h3>
                <span className="bg-slate-800 rounded px-2 py-1 font-mono text-xs text-gray-500">
                  {ex.equation}
                </span>
              </div>

              {/* Side by side: Analytical | Numerical */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Analytical */}
                <div className={`rounded-2xl ${ex.bgColor} border ${ex.borderColor} p-5`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">해석적 방법</span>
                    <span className="text-xs text-gray-500 ml-auto">{ex.analyticalLabel}</span>
                  </div>
                  {ex.render("analytical")}
                </div>

                {/* Numerical */}
                <div className={`rounded-2xl ${ex.bgColor} border ${ex.borderColor} p-5`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm font-bold text-amber-400">수치적 방법</span>
                    <span className="text-xs text-gray-500 ml-auto">{ex.numericalLabel}</span>
                  </div>
                  {ex.render("numerical")}
                </div>
              </div>

              {/* Comparison note below */}
              <div className={`mt-3 rounded-xl border ${ex.borderColor} bg-slate-800/40 px-5 py-3 flex items-start gap-3`}>
                <span className="text-gray-500 text-sm mt-0.5">💡</span>
                <p className="text-sm text-gray-400 leading-relaxed">{ex.compareNote}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-purple-500/20 p-8 text-center"
        >
          <h3 className="text-white font-bold text-xl mb-3">핵심 요약</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-900/60 rounded-xl p-4">
              <div className="text-emerald-400 font-bold mb-1">해석적 방법</div>
              <p className="text-gray-400">정확하지만 단순한 문제에서만 가능</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-4">
              <div className="text-amber-400 font-bold mb-1">수치적 방법</div>
              <p className="text-gray-400">근사이지만 거의 모든 문제에 적용 가능</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-4">
              <div className="text-purple-400 font-bold mb-1">이 수업에서</div>
              <p className="text-gray-400">해석해로 검증하며 수치해를 배웁니다</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
