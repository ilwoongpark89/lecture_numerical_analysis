"use client";

import { motion } from "framer-motion";

const skills = [
  {
    title: "Decompose",
    desc: "복잡한 문제를 더 단순한 단계로 분해합니다.",
    color: "text-blue-400",
    borderColor: "border-blue-500/20",
  },
  {
    title: "Develop",
    desc: "논리적 알고리즘을 개발하고 오류를 효과적으로 디버깅합니다.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/20",
  },
  {
    title: "Convert",
    desc: "수학적 개념을 코드로 변환하고 결과를 분석합니다.",
    color: "text-teal-400",
    borderColor: "border-teal-500/20",
  },
  {
    title: "Explore",
    desc: "다양한 수치 방법을 탐색하여 최적의 해를 찾습니다.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
];

const powers = [
  {
    title: "Solve the Unsolvable",
    desc: "복잡한 형상, 비선형 재료, 난류 유동 — 해석해가 없는 문제를 풉니다. 교과서 예제에서 산업 수준의 도전으로 나아갑니다.",
  },
  {
    title: "Virtual Designer & Tester",
    desc: "FEA로 부품의 강도를 가상 테스트하고, CFD로 유동을 시뮬레이션합니다. 물리적 프로토타입 없이 설계를 검증합니다.",
  },
  {
    title: "Optimize Everything",
    desc: "하중을 견디면서 가장 가벼운 부품? 가장 공기역학적인 형상? 수치 방법이 최적 설계의 엔진입니다.",
  },
  {
    title: "Make Sense of Data",
    desc: "실험 데이터에 곡선을 적합하여 예측 모델을 만들고, 노이즈가 있는 실제 측정 데이터를 처리합니다.",
  },
];

export default function WhatIsNumericalAnalysis() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Motivation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Study Numerical Analysis?
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            A Mechanical Engineer&apos;s Power
          </p>
        </motion.div>

        {/* Steve Jobs Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-8">
            <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed text-center">
              &ldquo;Everybody should learn to <span className="text-blue-400">program a computer</span>,
              because it teaches you <span className="text-cyan-400">how to think</span>.&rdquo;
            </blockquote>
            <p className="text-sm text-gray-500 mt-4 text-center">— Steve Jobs, 1995</p>
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-sm text-gray-400 leading-relaxed text-center">
                수치해석은 복잡한 문제를 풀기 위한 알고리즘을 설계하고 구현하는 과정입니다.
                이 과정은 다음과 같은 사고 능력을 키워줍니다:
              </p>
            </div>
          </div>
        </motion.div>

        {/* Thinking Skills */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20">
          {skills.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-xl bg-slate-800/60 border ${s.borderColor} p-5 text-center`}
            >
              <h3 className={`text-lg font-bold ${s.color} mb-2`}>{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* The Problem / The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-6">
              <h3 className="text-red-400 font-bold text-lg mb-3">The Problem</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Most real-world engineering problems are too complex to be solved with pen-and-paper mathematics.
                Think about the airflow over a race car, the heat distribution in a processor, or the vibrations in a bridge.
                Exact equations are often impossible to find.
              </p>
            </div>
            <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-6">
              <h3 className="text-blue-400 font-bold text-lg mb-3">The Solution</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Numerical analysis gives us the tools to solve these complex problems using computers.
                It&apos;s about finding powerful, practical approximations that are accurate enough to design and build the future.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Four Powers */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {powers.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl bg-slate-800/40 border border-slate-700 p-6"
            >
              <h3 className="text-white font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Textbook Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">From the Textbook</p>
            <blockquote className="text-sm text-gray-300 leading-relaxed italic">
              &ldquo;Numerical methods greatly expand the types of problems you can address.
              They are capable of handling large systems of equations, nonlinearities, and complicated geometries
              that are <span className="text-blue-400 not-italic font-medium">often impossible to solve analytically with standard calculus</span>.
              As such, they greatly enhance your problem-solving skills.&rdquo;
            </blockquote>
            <p className="text-xs text-gray-500 mt-3">— Chapra, Applied Numerical Methods with MATLAB</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
