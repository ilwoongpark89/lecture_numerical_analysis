"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, MBlock } from "@/components/Math";

// Step 3 gets its own rich component
function FiniteDifferenceExplainer() {
  const [dt, setDt] = useState(2);

  const g = 9.81, m = 68.1, cd = 0.25;
  const analyticalV = (t: number) =>
    Math.sqrt((g * m) / cd) * Math.tanh(Math.sqrt((g * cd) / m) * t);

  const v0 = analyticalV(0);
  const v1 = analyticalV(dt);
  const approxSlope = (v1 - v0) / dt;
  const exactSlope = g;

  const W = 500, H = 220, PAD = 50;
  const tMax = 6, vMax = 50;
  const scX = (t: number) => PAD + (t / tMax) * (W - PAD * 2);
  const scY = (v: number) => H - PAD - (v / vMax) * (H - PAD * 2);

  const curvePoints = Array.from({ length: 61 }, (_, i) => {
    const t = i * 0.1;
    return `${scX(t)},${scY(analyticalV(t))}`;
  }).join(" ");

  const tangentEnd = 3;
  const tangentPoints = `${scX(0)},${scY(0)} ${scX(tangentEnd)},${scY(exactSlope * tangentEnd)}`;

  return (
    <div className="space-y-4">
      {/* 3 concept cards */}
      <div className="space-y-4">
        <div className="rounded-xl bg-slate-900/60 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">미적분에서 배운 미분의 정의</p>
          <div className="bg-slate-800 rounded-lg p-4 font-mono text-center">
            <div className="text-gray-400 text-sm">
              <M>{"\\frac{dv}{dt} = \\lim_{\\Delta t \\to 0} \\frac{\\Delta v}{\\Delta t}"}</M>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            미분은 <span className="text-cyan-400">Δt를 무한히 작게</span> 만든 극한입니다.
            하지만 컴퓨터는 무한히 작은 값을 다룰 수 없죠.
          </p>
        </div>

        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5">
          <p className="text-xs text-amber-400 uppercase tracking-wider font-bold mb-3">수치해석의 핵심 아이디어</p>
          <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-center">
            <div className="text-lg">
              <M>{"\\frac{dv}{dt} \\approx \\frac{\\Delta v}{\\Delta t}"}</M>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              <M>{"= \\frac{v_{\\text{나중}} - v_{\\text{지금}}}{\\Delta t}"}</M>
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-3 leading-relaxed">
            극한을 취하지 않고, <span className="text-amber-400 font-medium">유한한 크기의 Δt</span>를 사용합니다.
            이것이 <span className="text-white font-bold">유한차분(Finite Difference)</span>입니다.
          </p>
        </div>

        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
          <p className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-3">이것을 뒤집으면</p>
          <div className="bg-slate-900/60 rounded-lg p-4 font-mono text-center">
            <div className="text-lg text-emerald-300">
              <M>{"v_{\\text{나중}} = v_{\\text{지금}} + (\\text{기울기}) \\times \\Delta t"}</M>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              <span className="text-emerald-400">New</span> = <span className="text-gray-300">Old</span> + <span className="text-rose-400">Slope</span> × <span className="text-amber-400">Step</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            현재 상태와 기울기만 알면 다음 값을 예측할 수 있습니다!
          </p>
        </div>
      </div>

      {/* Interactive chart */}
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white font-bold">기하학적 의미</span>
            <label className="text-xs text-gray-400 flex items-center gap-2">
              Δt =
              <input type="range" min={0.3} max={4} step={0.1} value={dt}
                onChange={(e) => setDt(+e.target.value)}
                className="w-20 h-1 accent-amber-400" />
              <span className="text-amber-400 font-mono w-10">{dt.toFixed(1)}s</span>
            </label>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
            {[0, 10, 20, 30, 40, 50].map((v) => (
              <g key={v}>
                <line x1={PAD} y1={scY(v)} x2={W - PAD} y2={scY(v)} stroke="#334155" strokeWidth={0.5} />
                <text x={PAD - 5} y={scY(v) + 4} textAnchor="end" fill="#64748b" fontSize={9}>{v}</text>
              </g>
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map((t) => (
              <g key={t}>
                <line x1={scX(t)} y1={PAD / 2} x2={scX(t)} y2={H - PAD} stroke="#334155" strokeWidth={0.5} />
                <text x={scX(t)} y={H - PAD + 14} textAnchor="middle" fill="#64748b" fontSize={9}>{t}</text>
              </g>
            ))}
            <polyline fill="none" stroke="#22d3ee" strokeWidth={2} points={curvePoints} />
            <polyline fill="none" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="6 3" opacity={0.6}
              points={tangentPoints} />
            <text x={scX(tangentEnd) + 3} y={scY(exactSlope * tangentEnd) - 3} fill="#22d3ee" fontSize={8} opacity={0.7}>
              접선 (dv/dt)
            </text>
            <line x1={scX(0)} y1={scY(v0)} x2={scX(dt)} y2={scY(v1)}
              stroke="#f59e0b" strokeWidth={2.5} />
            <circle cx={scX(0)} cy={scY(v0)} r={4} fill="#f59e0b" />
            <circle cx={scX(dt)} cy={scY(v1)} r={4} fill="#f59e0b" />
            <line x1={scX(0)} y1={scY(v0) + 15} x2={scX(dt)} y2={scY(v0) + 15} stroke="#f59e0b" strokeWidth={1.5} />
            <line x1={scX(0)} y1={scY(v0) + 10} x2={scX(0)} y2={scY(v0) + 20} stroke="#f59e0b" strokeWidth={1.5} />
            <line x1={scX(dt)} y1={scY(v0) + 10} x2={scX(dt)} y2={scY(v0) + 20} stroke="#f59e0b" strokeWidth={1.5} />
            <text x={(scX(0) + scX(dt)) / 2} y={scY(v0) + 28} textAnchor="middle" fill="#f59e0b" fontSize={10} fontWeight="bold">
              Δt = {dt.toFixed(1)}s
            </text>
            <line x1={scX(dt) + 10} y1={scY(v0)} x2={scX(dt) + 10} y2={scY(v1)} stroke="#f59e0b" strokeWidth={1.5} />
            <line x1={scX(dt) + 5} y1={scY(v0)} x2={scX(dt) + 15} y2={scY(v0)} stroke="#f59e0b" strokeWidth={1.5} />
            <line x1={scX(dt) + 5} y1={scY(v1)} x2={scX(dt) + 15} y2={scY(v1)} stroke="#f59e0b" strokeWidth={1.5} />
            <text x={scX(dt) + 20} y={(scY(v0) + scY(v1)) / 2 + 4} fill="#f59e0b" fontSize={10} fontWeight="bold">
              Δv = {v1.toFixed(1)}
            </text>
            <text x={W / 2} y={H - 3} textAnchor="middle" fill="#94a3b8" fontSize={10}>t (s)</text>
            <text x={10} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize={10} transform={`rotate(-90 10 ${H / 2})`}>v (m/s)</text>
            <line x1={PAD + 5} y1={16} x2={PAD + 20} y2={16} stroke="#22d3ee" strokeWidth={2} />
            <text x={PAD + 25} y={20} fill="#22d3ee" fontSize={9}>실제 곡선 v(t)</text>
            <line x1={PAD + 5} y1={30} x2={PAD + 20} y2={30} stroke="#f59e0b" strokeWidth={2.5} />
            <text x={PAD + 25} y={34} fill="#f59e0b" fontSize={9}>할선 (Δv/Δt)</text>
          </svg>
        </div>

        <div className="rounded-xl bg-slate-900/60 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">정확한 기울기 (접선)</div>
              <div className="text-cyan-400 font-mono font-bold text-lg">dv/dt = {exactSlope.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">근사 기울기 (할선)</div>
              <div className="text-amber-400 font-mono font-bold text-lg">Δv/Δt = {approxSlope.toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-3 bg-slate-800 rounded-lg p-2 text-center">
            <span className="text-xs text-gray-500">오차: </span>
            <span className={`text-sm font-mono font-bold ${Math.abs(approxSlope - exactSlope) / exactSlope < 0.05 ? "text-emerald-400" : Math.abs(approxSlope - exactSlope) / exactSlope < 0.2 ? "text-amber-400" : "text-rose-400"}`}>
              {(Math.abs(approxSlope - exactSlope) / exactSlope * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">— Δt를 줄여보세요!</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 px-1">
          <span className="text-amber-400">할선(secant)</span>의 기울기 Δv/Δt는
          <span className="text-cyan-400"> 접선(tangent)</span>의 기울기 dv/dt의 근사값입니다.
          Δt가 작아질수록 할선이 접선에 가까워지고, 근사가 정확해집니다.
        </p>
      </div>
    </div>
  );
}

const steps = [
  {
    num: 1,
    title: "Problem",
    subtitle: "물리적 문제 정의",
    color: "bg-blue-500",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    description: "번지점퍼가 다리에서 뛰어내립니다. 시간에 따른 속도를 알고 싶습니다.",
    visual: "🪂",
    isRich: false,
    items: [
      "질량 m = 68.1 kg",
      "항력계수 cd = 0.25 kg/m",
      "초기 속도 v(0) = 0",
      "궁금한 것: v(t) = ?",
    ],
  },
  {
    num: 2,
    title: "Model",
    subtitle: "수학적 모델 수립",
    color: "bg-cyan-500",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    description: "뉴턴 제2법칙을 적용하여 속도 변화를 수식으로 표현합니다.",
    visual: "📐",
    isRich: false,
    items: [
      "F = ma → mg − cd·v² = m·(dv/dt)",
      "정리: dv/dt = g − (cd/m)·v²",
      "의미: 속도의 변화율 = 중력 − 공기저항",
      "초기조건: v(0) = 0 (정지 상태에서 출발)",
    ],
  },
  {
    num: 3,
    title: "Approximate",
    subtitle: "미분을 유한차분으로 근사",
    color: "bg-emerald-500",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    description: "수치해석의 가장 핵심적인 아이디어입니다. 미분(dv/dt)을 유한한 차분(Δv/Δt)으로 바꿉니다.",
    visual: "📐",
    isRich: true,
    items: [],
  },
  {
    num: 4,
    title: "Compute",
    subtitle: "컴퓨터로 반복 계산",
    color: "bg-amber-500",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    description: "유한차분 공식을 반복 적용하여 시간별 속도를 계산합니다.",
    visual: "💻",
    isRich: false,
    items: [
      "현재 기울기 계산: dv/dt = 9.81 − (0.25/68.1)·v²",
      "다음 값 예측: v_new = v_old + 기울기 × Δt",
      "시간 전진: t = 0 → 2 → 4 → ... → 12s",
      "MATLAB으로 이 반복을 자동화",
    ],
  },
  {
    num: 5,
    title: "Verify",
    subtitle: "결과 검증",
    color: "bg-rose-500",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/20",
    description: "해석해(있다면)와 비교하고, 물리적 타당성을 검증합니다.",
    visual: "✅",
    isRich: false,
    items: [
      "해석해와 비교 → 오차 확인",
      "Δt를 줄여서 수렴 확인",
      "종단속도 ≈ 51.69 m/s (물리적으로 합리적?)",
      "오차가 허용범위 내인지 판단",
    ],
  },
];

export default function NumericalProcessSteps() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            수치해석 5단계 프로세스
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            모든 수치해석 문제는 이 다섯 단계를 따릅니다
          </p>
        </motion.div>

        {/* All 5 steps stacked vertically */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl bg-slate-800/60 border ${step.borderColor} p-6 md:p-8`}
            >
              {/* Step header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
                  {step.num}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-xl">{step.title}</h3>
                    <span className="text-2xl hidden sm:inline">{step.visual}</span>
                  </div>
                  <p className={`text-sm ${step.textColor}`}>{step.subtitle}</p>
                </div>
              </div>

              {step.isRich ? (
                /* Step 3: Finite difference explainer */
                <div>
                  <p className="text-sm text-gray-400 mb-6">{step.description}</p>
                  <FiniteDifferenceExplainer />
                </div>
              ) : (
                /* Regular steps */
                <div>
                  <p className="text-sm text-gray-400 mb-5">{step.description}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {step.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-2 bg-slate-900/50 rounded-lg px-3 py-2.5"
                      >
                        <span className={`${step.textColor} font-bold text-sm mt-0.5`}>
                          {j + 1}.
                        </span>
                        <span className="text-sm text-gray-300 font-mono leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connector line between steps */}
              {i < steps.length - 1 && (
                <div className="flex justify-center mt-6 -mb-10">
                  <div className={`w-0.5 h-8 ${step.color} opacity-30`} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
