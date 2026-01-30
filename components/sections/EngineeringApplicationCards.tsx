"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const applications = [
  {
    field: "열전달",
    title: "Heat Transfer",
    color: "from-red-500 to-orange-500",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/5",
    textColor: "text-red-400",
    icon: "🔥",
    summary: "복잡한 형상에서 온도 분포 계산",
    detail: {
      problem: "엔진 블록의 냉각 설계 — 과열 지점은 어디인가?",
      equation: "∂T/∂t = α(∂²T/∂x² + ∂²T/∂y² + ∂²T/∂z²)",
      method: "유한차분법 (FDM), 유한요소법 (FEM)",
      numerical:
        "3차원 열전도 방정식을 수천~수백만 격자점에서 반복 계산하여 온도 분포를 구합니다. 해석해는 단순 1D 문제에서만 가능합니다.",
      topics: ["Week 11: Integration", "Week 14: PDE"],
    },
  },
  {
    field: "유체역학",
    title: "Fluid Mechanics",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    textColor: "text-blue-400",
    icon: "🌊",
    summary: "유동 패턴과 압력 분포 예측",
    detail: {
      problem: "항공기 날개의 양력과 항력 — 형상을 바꾸면 어떻게 될까?",
      equation: "ρ(∂v/∂t + v·∇v) = −∇p + μ∇²v + ρg",
      method: "전산유체역학 (CFD)",
      numerical:
        "Navier-Stokes 방정식을 수백만 격자에서 풉니다. 난류, 비압축성, 이동 경계 등 해석해가 존재하지 않는 문제를 다룹니다.",
      topics: ["Week 13: ODE", "Week 14: PDE"],
    },
  },
  {
    field: "구조역학",
    title: "Structural Mechanics",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/5",
    textColor: "text-emerald-400",
    icon: "🏗️",
    summary: "복잡한 구조물의 응력/변형 해석",
    detail: {
      problem: "교량에 하중이 가해질 때 — 어디가 가장 위험한가?",
      equation: "[K]{u} = {F}  (강성행렬 × 변위 = 외력)",
      method: "유한요소법 (FEM)",
      numerical:
        "구조물을 수천 개 요소로 분할하여 각 절점의 변위와 응력을 계산합니다. 대규모 연립방정식을 풀어야 합니다.",
      topics: ["Week 6: Gauss Elimination", "Week 7: Iterative Methods"],
    },
  },
  {
    field: "동역학",
    title: "Dynamics & Vibration",
    color: "from-violet-500 to-purple-500",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-500/5",
    textColor: "text-violet-400",
    icon: "📳",
    summary: "다자유도 진동계의 시간 응답",
    detail: {
      problem: "자동차 서스펜션 — 노면 진동에 어떻게 반응하는가?",
      equation: "Mẍ + Cẋ + Kx = F(t)",
      method: "ODE 수치적분 (Runge-Kutta)",
      numerical:
        "비선형 감쇠를 포함한 ODE를 시간 적분합니다. 번지점퍼 예제의 확장 — 더 복잡한 시스템에 동일한 원리를 적용합니다.",
      topics: ["Week 13: ODE", "Week 14: Eigenvalues"],
    },
  },
  {
    field: "제어공학",
    title: "Control Systems",
    color: "from-amber-500 to-yellow-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    textColor: "text-amber-400",
    icon: "🎛️",
    summary: "제어기 설계와 시스템 시뮬레이션",
    detail: {
      problem: "로봇 팔의 PID 제어 — 최적 파라미터는?",
      equation: "ẋ = Ax + Bu,  y = Cx + Du",
      method: "고유값 해석, ODE 수치적분",
      numerical:
        "상태공간 모델의 시간 응답을 시뮬레이션하고, 고유값 분석으로 안정성을 판단합니다.",
      topics: ["Week 13: ODE", "Week 14: Eigenvalues"],
    },
  },
  {
    field: "재료공학",
    title: "Materials Engineering",
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/30",
    bgColor: "bg-pink-500/5",
    textColor: "text-pink-400",
    icon: "🧬",
    summary: "상변화, 확산, 피로 수명 예측",
    detail: {
      problem: "합금의 냉각 곡선 — 상변태 온도는?",
      equation: "∂C/∂t = D(∂²C/∂x²)  (Fick's diffusion)",
      method: "곡선적합, 보간법, ODE",
      numerical:
        "실험 데이터에 곡선을 적합하여 물성치를 추출하고, 확산 방정식을 수치적으로 풀어 농도 변화를 예측합니다.",
      topics: ["Week 9: Curve Fitting", "Week 10: Interpolation"],
    },
  },
];

export default function EngineeringApplicationCards() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            Applications
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            공학 응용 분야
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            수치해석은 기계공학의 거의 모든 분야에서 사용됩니다 — 카드를 클릭해서 자세히 보세요
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map((app, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`text-left rounded-2xl ${app.bgColor} border ${app.borderColor} p-5 transition-all hover:scale-[1.02] ${
                selected === i ? "ring-2 ring-white/20 scale-[1.02]" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{app.icon}</span>
                <div>
                  <div className={`text-sm font-bold ${app.textColor}`}>{app.field}</div>
                  <div className="text-xs text-gray-500">{app.title}</div>
                </div>
              </div>
              <p className="text-sm text-gray-300">{app.summary}</p>
              <div className="mt-3 text-xs text-gray-500">
                {selected === i ? "닫기 ↑" : "자세히 보기 →"}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Expanded detail */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className={`mt-6 rounded-2xl ${applications[selected].bgColor} border ${applications[selected].borderColor} p-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{applications[selected].icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {applications[selected].field} — {applications[selected].title}
                    </h3>
                    <p className="text-sm text-gray-400">{applications[selected].detail.problem}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left: equation & method */}
                  <div className="space-y-3">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">지배방정식</div>
                      <div className="font-mono text-sm text-gray-300">
                        {applications[selected].detail.equation}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">수치적 방법</div>
                      <div className={`text-sm font-medium ${applications[selected].textColor}`}>
                        {applications[selected].detail.method}
                      </div>
                    </div>
                  </div>

                  {/* Right: description & related topics */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {applications[selected].detail.numerical}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {applications[selected].detail.topics.map((topic, ti) => (
                        <span
                          key={ti}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${applications[selected].bgColor} border ${applications[selected].borderColor} ${applications[selected].textColor}`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
