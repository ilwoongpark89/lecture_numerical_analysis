"use client";

import { motion } from "framer-motion";

const applications = [
  {
    field: "열전달",
    title: "Heat Transfer",
    color: "from-red-500 to-orange-500",
    borderColor: "border-red-500/20",
    bgColor: "bg-red-500/5",
    textColor: "text-red-400",
    problem: "복잡한 형상에서 온도 분포 계산",
    method: "유한차분법 (FDM), 유한요소법 (FEM)",
    example: "엔진 블록의 냉각 설계 — 수천 개 격자점에서 열전도 방정식을 풀어 과열 지점을 예측합니다.",
    equation: "∂T/∂t = α(∂²T/∂x² + ∂²T/∂y² + ∂²T/∂z²)",
  },
  {
    field: "유체역학",
    title: "Fluid Mechanics",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    textColor: "text-blue-400",
    problem: "유동 패턴과 압력 분포 예측",
    method: "전산유체역학 (CFD)",
    example: "항공기 날개 주위의 양력/항력 계산 — Navier-Stokes 방정식을 수백만 격자에서 풉니다.",
    equation: "ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + ρg",
  },
  {
    field: "구조역학",
    title: "Structural Mechanics",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    textColor: "text-emerald-400",
    problem: "복잡한 구조물의 응력/변형 해석",
    method: "유한요소법 (FEM)",
    example: "교량 구조의 응력 분포 — 수천 개 요소로 분할하여 각 지점의 응력과 변형을 계산합니다.",
    equation: "[K]{u} = {F}  (강성행렬 × 변위 = 외력)",
  },
  {
    field: "동역학",
    title: "Dynamics & Vibration",
    color: "from-violet-500 to-purple-500",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/5",
    textColor: "text-violet-400",
    problem: "다자유도 진동계의 시간 응답",
    method: "ODE 수치적분 (Runge-Kutta)",
    example: "자동차 서스펜션의 노면 진동 응답 — 비선형 감쇠를 포함한 ODE를 시간 적분합니다.",
    equation: "Mẍ + Cẋ + Kx = F(t)",
  },
  {
    field: "제어공학",
    title: "Control Systems",
    color: "from-amber-500 to-yellow-500",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
    textColor: "text-amber-400",
    problem: "제어기 설계와 시스템 응답 시뮬레이션",
    method: "고유값 해석, ODE 수치적분",
    example: "로봇 팔의 PID 제어 — 비선형 동역학 모델을 수치적으로 시뮬레이션하여 제어 파라미터를 조정합니다.",
    equation: "ẋ = Ax + Bu,  y = Cx + Du",
  },
  {
    field: "재료공학",
    title: "Materials Engineering",
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/20",
    bgColor: "bg-pink-500/5",
    textColor: "text-pink-400",
    problem: "상변화, 확산, 피로 수명 예측",
    method: "곡선적합, 보간법, ODE",
    example: "합금의 냉각 곡선으로부터 상변태 온도를 수치적으로 결정합니다.",
    equation: "∂C/∂t = D(∂²C/∂x²)  (Fick의 확산 방정식)",
  },
];

export default function EngineeringApplications() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            Applications
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            공학 응용 분야
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            수치해석은 기계공학의 거의 모든 분야에서 사용됩니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-2xl ${app.bgColor} border ${app.borderColor} p-6`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${app.color} text-white text-xs font-bold`}>
                  {app.field}
                </div>
                <span className="text-xs text-gray-500">{app.title}</span>
              </div>

              {/* Problem */}
              <h3 className="text-white font-semibold mb-2">{app.problem}</h3>
              <p className="text-xs text-gray-500 mb-3">
                <span className={`font-medium ${app.textColor}`}>사용 기법:</span> {app.method}
              </p>

              {/* Equation */}
              <div className="bg-slate-900/60 rounded-lg px-3 py-2 mb-3">
                <p className="font-mono text-xs text-gray-400">{app.equation}</p>
              </div>

              {/* Example */}
              <p className="text-sm text-gray-400 leading-relaxed">{app.example}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
