"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ── Dual code block: MATLAB (emerald) vs Python (blue) ── */
function DualCode({
  matlab,
  python,
}: {
  matlab: string;
  python: string;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* MATLAB */}
      <div className="rounded-xl overflow-hidden text-sm font-mono">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-t-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 text-xs font-semibold">MATLAB</span>
        </div>
        <div className="bg-slate-950 border border-t-0 border-slate-800 p-4 overflow-x-auto">
          {matlab.trim().split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none text-slate-600 w-8 shrink-0 text-right mr-4">
                {i + 1}
              </span>
              <span className="text-emerald-300">{line}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Python */}
      <div className="rounded-xl overflow-hidden text-sm font-mono">
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-t-xl">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-blue-400 text-xs font-semibold">Python</span>
        </div>
        <div className="bg-slate-950 border border-t-0 border-slate-800 p-4 overflow-x-auto">
          {python.trim().split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none text-slate-600 w-8 shrink-0 text-right mr-4">
                {i + 1}
              </span>
              <span className="text-blue-300">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Comparison topics ── */
const topics = [
  {
    id: "vars",
    label: "변수와 연산",
    matlab: `a = 5;
b = 3;
c = a^2 + b   % c = 28`,
    python: `a = 5
b = 3
c = a**2 + b   # c = 28`,
  },
  {
    id: "vectors",
    label: "벡터/배열",
    matlab: `x = 1:0.5:5;          % [1, 1.5, 2, ..., 5]
y = linspace(0, 1, 100); % 0~1 사이 100개
length(x)              % 9`,
    python: `x = np.arange(1, 5.5, 0.5)    # [1, 1.5, 2, ..., 5]
y = np.linspace(0, 1, 100)    # 0~1 사이 100개
len(x)                         # 9`,
  },
  {
    id: "matrix",
    label: "행렬",
    matlab: `A = [1 2; 3 4];
B = [5 6; 7 8];
C = A * B;     % 행렬 곱
D = A .* B;    % 요소별 곱
x = A \\ b;     % 선형 시스템 풀기`,
    python: `A = np.array([[1,2],[3,4]])
B = np.array([[5,6],[7,8]])
C = A @ B              # 행렬 곱
D = A * B              # 요소별 곱
x = np.linalg.solve(A, b)  # 선형 시스템 풀기`,
  },
  {
    id: "control",
    label: "제어문",
    matlab: `% for 루프
for i = 1:10
    disp(i);
end

% 조건문
if x > 0
    disp('양수');
elseif x == 0
    disp('영');
else
    disp('음수');
end`,
    python: `# for 루프
for i in range(1, 11):
    print(i)

# 조건문
if x > 0:
    print('양수')
elif x == 0:
    print('영')
else:
    print('음수')`,
  },
  {
    id: "functions",
    label: "함수",
    matlab: `% myFunc.m 파일로 저장
function y = myFunc(x)
    y = x^2 + 2*x + 1;
end

% 호출
result = myFunc(3);  % 16`,
    python: `# 같은 파일 내에서 정의 가능
def my_func(x):
    return x**2 + 2*x + 1

# 호출
result = my_func(3)  # 16`,
  },
  {
    id: "plot",
    label: "시각화",
    matlab: `x = linspace(0, 2*pi, 100);
y = sin(x);
plot(x, y, 'r--', 'LineWidth', 2);
xlabel('x');
ylabel('sin(x)');
title('사인 함수');
legend('sin');
grid on;`,
    python: `x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)
plt.plot(x, y, 'r--', linewidth=2)
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.title('사인 함수')
plt.legend(['sin'])
plt.grid(True)
plt.show()`,
  },
];

/* ── Key differences data ── */
const keyDiffs = [
  { topic: "Indexing", matlab: "1-based (A(1))", python: "0-based (A[0])" },
  { topic: "배열 곱셈", matlab: "* = 행렬곱, .* = 요소별", python: "@ = 행렬곱, * = 요소별" },
  { topic: "세미콜론 ;", matlab: "출력 억제", python: "문장 구분 (보통 줄바꿈)" },
  { topic: "블록 종료", matlab: "end 키워드", python: "들여쓰기 (indentation)" },
  { topic: "선형 시스템", matlab: "A\\b", python: "np.linalg.solve(A, b)" },
];

/* ── Euler method example ── */
const eulerMatlab = `% Euler Method: dy/dt = -2y, y(0) = 1
h = 0.1;
t = 0:h:2;
y = zeros(size(t));
y(1) = 1;

for i = 1:length(t)-1
    y(i+1) = y(i) + h * (-2 * y(i));
end

plot(t, y, 'bo-'); hold on;
plot(t, exp(-2*t), 'r-');
xlabel('t'); ylabel('y');
legend('Euler', 'Exact');
title('Euler Method');`;

const eulerPython = `# Euler Method: dy/dt = -2y, y(0) = 1
import numpy as np
import matplotlib.pyplot as plt

h = 0.1
t = np.arange(0, 2 + h, h)
y = np.zeros(len(t))
y[0] = 1

for i in range(len(t) - 1):
    y[i+1] = y[i] + h * (-2 * y[i])

plt.plot(t, y, 'bo-', label='Euler')
plt.plot(t, np.exp(-2*t), 'r-', label='Exact')
plt.xlabel('t'); plt.ylabel('y')
plt.legend()
plt.title('Euler Method')
plt.show()`;

/* ── Main component ── */
export default function PythonComparison() {
  const [activeTopic, setActiveTopic] = useState("vars");
  const current = topics.find((t) => t.id === activeTopic)!;

  return (
    <section className="bg-slate-950 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-400 to-yellow-400 text-slate-950">
            Bonus
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Python으로도 해보기
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            MATLAB에서 배운 내용을 Python으로 옮겨보세요
          </p>
        </motion.div>

        {/* ── Setup 안내 ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">
            환경 설정 <span className="text-slate-500 text-sm font-normal">Setup</span>
          </h3>
          <div className="font-mono text-sm bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 overflow-x-auto">
            <p className="text-yellow-300">$ pip install numpy matplotlib</p>
            <p className="text-slate-600 mt-3"># 파일 상단에 import</p>
            <p className="text-blue-300">import numpy as np</p>
            <p className="text-blue-300">import matplotlib.pyplot as plt</p>
          </div>
        </motion.div>

        {/* ── Side-by-side comparison ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            문법 비교 <span className="text-slate-500 text-sm font-normal">Syntax Comparison</span>
          </h3>

          {/* Topic tabs */}
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTopic === t.id
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Dual code */}
          <DualCode matlab={current.matlab} python={current.python} />
        </motion.div>

        {/* ── Key differences 정리 ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            핵심 차이점 정리 <span className="text-slate-500 text-sm font-normal">Key Differences</span>
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">항목</th>
                  <th className="text-left px-5 py-3 text-emerald-400 font-medium">MATLAB</th>
                  <th className="text-left px-5 py-3 text-blue-400 font-medium">Python / NumPy</th>
                </tr>
              </thead>
              <tbody>
                {keyDiffs.map((d, i) => (
                  <tr
                    key={i}
                    className={i < keyDiffs.length - 1 ? "border-b border-slate-800/60" : ""}
                  >
                    <td className="px-5 py-3 text-slate-300 font-medium">{d.topic}</td>
                    <td className="px-5 py-3 text-emerald-300 font-mono text-xs">{d.matlab}</td>
                    <td className="px-5 py-3 text-blue-300 font-mono text-xs">{d.python}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Complete example: Euler method ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-white">
            전체 예제: Euler Method{" "}
            <span className="text-slate-500 text-sm font-normal">
              dy/dt = −2y, y(0) = 1
            </span>
          </h3>
          <p className="text-slate-400 text-sm">
            수치해석의 가장 기본적인 ODE 풀이법인 Euler method를 양쪽 언어로 비교합니다.
          </p>
          <DualCode matlab={eulerMatlab} python={eulerPython} />
        </motion.div>

        {/* ── Closing note ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/20 rounded-2xl p-6 text-center space-y-2"
        >
          <p className="text-slate-300 text-sm">
            💡 MATLAB과 Python 모두 수치해석에 강력한 도구입니다.
            본 강의는 MATLAB을 기준으로 진행하지만, Python에 익숙한 학생은 동일한 로직을 Python으로 구현해 보는 것을 추천합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
