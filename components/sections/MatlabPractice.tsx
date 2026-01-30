"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── 각 스크립트: 코드 라인 + 줄별 설명 + 실행 결과 ── */

interface CodeLine {
  code: string;
  comment: string;
}

interface Script {
  id: string;
  title: string;
  desc: string;
  icon: string;
  lines: CodeLine[];
  output: string;
}

const scripts: Script[] = [
  /* ───────── 1. MATLAB 기본 연산 ───────── */
  {
    id: "basics",
    title: "MATLAB 기본 연산",
    desc: "변수, 산술 연산, 내장 함수 사용법",
    icon: "🔢",
    lines: [
      { code: "clc", comment: "명령 창(Command Window) 내용을 모두 지웁니다." },
      { code: "clear", comment: "워크스페이스의 모든 변수를 삭제합니다." },
      { code: "", comment: "" },
      { code: "a = 3", comment: "변수 a에 3을 대입합니다. 세미콜론(;)이 없으므로 결과가 출력됩니다." },
      { code: "b = 4;", comment: "변수 b에 4를 대입합니다. 세미콜론(;)이 있으므로 결과가 출력되지 않습니다." },
      { code: "c = a + b", comment: "a와 b를 더한 결과를 c에 저장합니다." },
      { code: "d = a * b", comment: "a와 b를 곱한 결과를 d에 저장합니다." },
      { code: "e = a^2", comment: "a의 제곱을 계산합니다. (^는 거듭제곱 연산자)" },
      { code: "", comment: "" },
      { code: "% 내장 함수 사용", comment: "% 기호 뒤는 주석(comment)으로 실행되지 않습니다." },
      { code: "x = sqrt(16)", comment: "16의 제곱근을 계산합니다. → 4" },
      { code: "y = exp(1)", comment: "e^1 = 2.7183... (자연상수)" },
      { code: "z = log(y)", comment: "자연로그 ln(e) = 1 (MATLAB에서 log는 자연로그입니다)" },
      { code: "w = pi", comment: "원주율 π = 3.1416..." },
    ],
    output: `a =
     3

c =
     7

d =
    12

e =
     9

x =
     4

y =
    2.7183

z =
     1

w =
    3.1416`,
  },

  /* ───────── 2. 벡터와 행렬 ───────── */
  {
    id: "vectors",
    title: "벡터와 행렬",
    desc: "벡터/행렬 생성, 인덱싱, 기본 연산",
    icon: "📊",
    lines: [
      { code: "clc; clear;", comment: "화면 지우기 + 변수 초기화 (한 줄에 세미콜론으로 구분)" },
      { code: "", comment: "" },
      { code: "% 행 벡터 (Row vector)", comment: "" },
      { code: "v = [1 2 3 4 5]", comment: "1×5 행 벡터를 생성합니다. 공백 또는 쉼표로 원소를 구분합니다." },
      { code: "", comment: "" },
      { code: "% 열 벡터 (Column vector)", comment: "" },
      { code: "u = [10; 20; 30]", comment: "3×1 열 벡터를 생성합니다. 세미콜론(;)으로 행을 구분합니다." },
      { code: "", comment: "" },
      { code: "% 등간격 벡터", comment: "" },
      { code: "t = 0:2:12", comment: "0부터 12까지 2 간격으로 벡터 생성 → [0 2 4 6 8 10 12]" },
      { code: "s = linspace(0, 1, 5)", comment: "0부터 1까지 5개의 균등 분할 점 생성" },
      { code: "", comment: "" },
      { code: "% 행렬 (Matrix)", comment: "" },
      { code: "A = [1 2 3; 4 5 6; 7 8 9]", comment: "3×3 행렬. 세미콜론(;)으로 행을 구분합니다." },
      { code: "", comment: "" },
      { code: "% 인덱싱 (Indexing)", comment: "" },
      { code: "A(2,3)", comment: "2행 3열의 원소를 가져옵니다. → 6" },
      { code: "A(1,:)", comment: "1행 전체를 가져옵니다. → [1 2 3]  (:는 '전체'를 의미)" },
      { code: "A(:,2)", comment: "2열 전체를 가져옵니다. → [2; 5; 8]" },
      { code: "", comment: "" },
      { code: "% 행렬 크기 확인", comment: "" },
      { code: "size(A)", comment: "행렬의 크기(행 수, 열 수)를 반환합니다. → [3 3]" },
      { code: "length(v)", comment: "벡터의 길이를 반환합니다. → 5" },
    ],
    output: `v =
     1     2     3     4     5

u =
    10
    20
    30

t =
     0     2     4     6     8    10    12

s =
         0    0.2500    0.5000    0.7500    1.0000

A =
     1     2     3
     4     5     6
     7     8     9

ans =
     6

ans =
     1     2     3

ans =
     2
     5
     8

ans =
     3     3

ans =
     5`,
  },

  /* ───────── 3. 그래프 그리기 ───────── */
  {
    id: "plotting",
    title: "그래프 그리기 (plot)",
    desc: "2D 그래프 생성, 라벨, 범례, 다중 그래프",
    icon: "📈",
    lines: [
      { code: "clc; clear;", comment: "초기화" },
      { code: "", comment: "" },
      { code: "x = 0:0.1:2*pi;", comment: "0부터 2π까지 0.1 간격의 벡터 생성 (약 63개 점)" },
      { code: "y1 = sin(x);", comment: "각 x에 대해 sin 값을 계산하여 y1에 저장" },
      { code: "y2 = cos(x);", comment: "각 x에 대해 cos 값을 계산하여 y2에 저장" },
      { code: "", comment: "" },
      { code: "figure;", comment: "새 그림 창을 엽니다." },
      { code: "plot(x, y1, 'b-', 'LineWidth', 2);", comment: "x vs y1을 파란 실선(b-)으로 그립니다. 선 두께 2" },
      { code: "hold on;", comment: "기존 그래프 위에 새 그래프를 추가합니다. (없으면 덮어씌움)" },
      { code: "plot(x, y2, 'r--', 'LineWidth', 2);", comment: "x vs y2를 빨간 점선(r--)으로 추가합니다." },
      { code: "hold off;", comment: "hold를 해제합니다." },
      { code: "", comment: "" },
      { code: "xlabel('x (rad)');", comment: "x축 이름을 설정합니다." },
      { code: "ylabel('y');", comment: "y축 이름을 설정합니다." },
      { code: "title('Sine and Cosine');", comment: "그래프 제목을 설정합니다." },
      { code: "legend('sin(x)', 'cos(x)');", comment: "범례를 추가합니다." },
      { code: "grid on;", comment: "격자(grid)를 표시합니다." },
    ],
    output: `[Figure 창에 sin(x)와 cos(x) 그래프가 표시됩니다]

  1 |     /\\          파란 실선: sin(x)
    |    /  \\         빨간 점선: cos(x)
    |   /    \\
  0 | -/------\\------/---
    |          \\    /
    |           \\  /
 -1 |            \\/
    +--+--+--+--+--+--+--
    0  1  2  3  4  5  6
              x (rad)`,
  },

  /* ───────── 4. for 반복문 ───────── */
  {
    id: "forloop",
    title: "for 반복문",
    desc: "반복 계산의 기본 — Euler method의 핵심 구조",
    icon: "🔄",
    lines: [
      { code: "clc; clear;", comment: "초기화" },
      { code: "", comment: "" },
      { code: "% 1부터 5까지 합 구하기", comment: "" },
      { code: "total = 0;", comment: "합계를 저장할 변수를 0으로 초기화합니다." },
      { code: "", comment: "" },
      { code: "for i = 1:5", comment: "i가 1, 2, 3, 4, 5 순서로 반복됩니다." },
      { code: "    total = total + i;", comment: "현재 합계에 i를 더합니다." },
      { code: "    fprintf('i = %d, total = %d\\n', i, total);", comment: "현재 i와 누적 합계를 출력합니다. %d는 정수 형식" },
      { code: "end", comment: "for 반복문의 끝을 나타냅니다." },
      { code: "", comment: "" },
      { code: "fprintf('최종 합계 = %d\\n', total);", comment: "반복이 끝난 후 최종 결과를 출력합니다." },
    ],
    output: `i = 1, total = 1
i = 2, total = 3
i = 3, total = 6
i = 4, total = 10
i = 5, total = 15
최종 합계 = 15`,
  },

  /* ───────── 5. Bungee Jumper — Euler Method ───────── */
  {
    id: "bungee",
    title: "Bungee Jumper — Euler Method",
    desc: "수치해석의 핵심 예제: 번지 점프 속도를 수치적으로 계산",
    icon: "🪂",
    lines: [
      { code: "clc; clear;", comment: "초기화" },
      { code: "", comment: "" },
      { code: "% 매개변수 설정", comment: "" },
      { code: "g  = 9.81;", comment: "중력가속도 (m/s^2)" },
      { code: "m  = 68.1;", comment: "점프하는 사람의 질량 (kg)" },
      { code: "cd = 0.25;", comment: "항력 계수 (kg/m)" },
      { code: "dt = 2;", comment: "시간 간격 Δt (s) — 이 값을 바꾸면 정확도가 달라집니다" },
      { code: "tf = 12;", comment: "계산할 최종 시간 (s)" },
      { code: "", comment: "" },
      { code: "% 초기 조건", comment: "" },
      { code: "t = 0;", comment: "시작 시간 = 0" },
      { code: "v = 0;", comment: "초기 속도 = 0 (정지 상태에서 점프)" },
      { code: "", comment: "" },
      { code: "% 결과 저장 배열", comment: "" },
      { code: "t_save = t;", comment: "시간 값을 저장할 배열 (첫 값은 0)" },
      { code: "v_save = v;", comment: "속도 값을 저장할 배열 (첫 값은 0)" },
      { code: "", comment: "" },
      { code: "% Euler Method 반복", comment: "" },
      { code: "while t < tf", comment: "현재 시간이 최종 시간보다 작으면 계속 반복합니다." },
      { code: "    dvdt = g - (cd/m)*v^2;", comment: "현재 속도에서의 가속도(기울기)를 계산합니다: dv/dt = g - (cd/m)*v^2" },
      { code: "    v = v + dvdt*dt;", comment: "Euler: 새 속도 = 현재 속도 + 기울기 × Δt" },
      { code: "    t = t + dt;", comment: "시간을 Δt만큼 전진시킵니다." },
      { code: "    t_save = [t_save, t];", comment: "시간 값을 배열에 추가합니다." },
      { code: "    v_save = [v_save, v];", comment: "속도 값을 배열에 추가합니다." },
      { code: "    fprintf('t = %4.1f s, v = %8.4f m/s\\n', t, v);", comment: "매 스텝의 결과를 출력합니다." },
      { code: "end", comment: "while 반복문의 끝" },
      { code: "", comment: "" },
      { code: "% 해석해 (비교용)", comment: "" },
      { code: "t_exact = 0:0.01:tf;", comment: "해석해 계산을 위한 촘촘한 시간 벡터" },
      { code: "v_exact = sqrt(g*m/cd)*tanh(sqrt(g*cd/m)*t_exact);", comment: "해석해: v(t) = √(gm/cd) × tanh(√(gcd/m) × t)" },
      { code: "", comment: "" },
      { code: "% 그래프 그리기", comment: "" },
      { code: "figure;", comment: "새 그림 창" },
      { code: "plot(t_exact, v_exact, 'b-', 'LineWidth', 2);", comment: "해석해를 파란 실선으로 그립니다." },
      { code: "hold on;", comment: "그래프 유지" },
      { code: "plot(t_save, v_save, 'ro--', 'LineWidth', 1.5, ...", comment: "수치해를 빨간 원+점선으로 그립니다." },
      { code: "     'MarkerSize', 8, 'MarkerFaceColor', 'r');", comment: "마커 크기 8, 빨간색 채움" },
      { code: "hold off;", comment: "" },
      { code: "xlabel('Time (s)');", comment: "x축 라벨" },
      { code: "ylabel('Velocity (m/s)');", comment: "y축 라벨" },
      { code: "title('Bungee Jumper: Euler Method');", comment: "제목" },
      { code: "legend('Analytical', sprintf('Euler (dt=%.1f)', dt));", comment: "범례에 Δt 값을 표시합니다." },
      { code: "grid on;", comment: "격자 표시" },
    ],
    output: `t =  2.0 s, v =  19.6200 m/s
t =  4.0 s, v =  36.4137 m/s
t =  6.0 s, v =  46.2983 m/s
t =  8.0 s, v =  50.1802 m/s
t = 10.0 s, v =  51.3123 m/s
t = 12.0 s, v =  51.6008 m/s

[Figure 창: 해석해(파란 곡선)와 수치해(빨간 점선)가 비교되어 표시됩니다]
→ Δt가 작을수록 해석해에 더 가까워집니다!`,
  },

  /* ───────── 6. fprintf로 표 만들기 ───────── */
  {
    id: "fprintf",
    title: "fprintf로 결과 표 만들기",
    desc: "형식 지정 출력으로 깔끔한 결과 표 작성",
    icon: "📋",
    lines: [
      { code: "clc; clear;", comment: "초기화" },
      { code: "", comment: "" },
      { code: "g  = 9.81;  m = 68.1;  cd = 0.25;", comment: "매개변수 설정 (한 줄에 여러 변수)" },
      { code: "", comment: "" },
      { code: "% 표 헤더 출력", comment: "" },
      { code: "fprintf('%-6s  %-12s  %-12s  %-10s\\n', ...", comment: "%-6s는 왼쪽 정렬 6칸 문자열 형식입니다." },
      { code: "        't(s)', 'Analytical', 'Numerical', 'Error(%)');", comment: "4개의 열 제목을 출력합니다." },
      { code: "fprintf('%s\\n', repmat('-', 1, 46));", comment: "구분선(-)을 46개 반복하여 출력합니다." },
      { code: "", comment: "" },
      { code: "dt = 2;  t = 0;  v_num = 0;", comment: "Euler 방법 초기 설정" },
      { code: "", comment: "" },
      { code: "for i = 0:dt:12", comment: "0부터 12까지 dt 간격으로 반복합니다." },
      { code: "    v_ana = sqrt(g*m/cd)*tanh(sqrt(g*cd/m)*i);", comment: "해석해 계산" },
      { code: "    if i > 0", comment: "첫 스텝(t=0)이 아니면 Euler 업데이트 수행" },
      { code: "        dvdt = g - (cd/m)*v_num^2;", comment: "기울기 계산" },
      { code: "        v_num = v_num + dvdt*dt;", comment: "Euler 업데이트" },
      { code: "    end", comment: "" },
      { code: "    err = abs(v_ana - v_num)/v_ana * 100;", comment: "상대 오차(%)를 계산합니다." },
      { code: "    if i == 0, err = 0; end", comment: "t=0일 때는 0/0이므로 오차를 0으로 설정" },
      { code: "    fprintf('%-6.1f  %-12.4f  %-12.4f  %-10.2f\\n', ...", comment: "각 값을 형식에 맞춰 출력합니다." },
      { code: "            i, v_ana, v_num, err);", comment: "시간, 해석해, 수치해, 오차" },
      { code: "end", comment: "" },
    ],
    output: `t(s)    Analytical    Numerical     Error(%)
----------------------------------------------
0.0     0.0000        0.0000        0.00
2.0     18.7292       19.6200       4.76
4.0     33.1118       36.4137       9.97
6.0     42.0762       46.2983       10.03
8.0     46.9575       50.1802       6.86
10.0    49.4214       51.3123       3.82
12.0    50.6175       51.6008       1.94`,
  },
];

/* ═══════════════════ Component ═══════════════════ */

export default function MatlabPractice() {
  const [activeScript, setActiveScript] = useState(scripts[0].id);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const current = scripts.find((s) => s.id === activeScript)!;

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            MATLAB Practice
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            MATLAB 실습 스크립트
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            각 코드를 한 줄씩 따라 치면서 MATLAB에 익숙해지세요.
            <br />
            줄을 클릭하면 상세 설명을 볼 수 있습니다.
          </p>
        </motion.div>

        {/* Script Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {scripts.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveScript(s.id); setHoveredLine(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeScript === s.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-gray-400 border border-slate-700 hover:border-slate-500"
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Script Info */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">{current.icon}</span>
                {current.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{current.desc}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left — Code */}
              <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-gray-500 ml-2 font-mono">
                    {current.id}.m — MATLAB Script
                  </span>
                </div>

                {/* Code lines */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {current.lines.map((line, i) => {
                        const isBlank = line.code === "" && line.comment === "";
                        const isCommentOnly = line.code.startsWith("%");
                        const isActive = hoveredLine === i;

                        return (
                          <tr
                            key={i}
                            onClick={() => setHoveredLine(isActive ? null : i)}
                            className={`cursor-pointer transition-colors ${
                              isActive
                                ? "bg-emerald-500/10"
                                : "hover:bg-slate-800/60"
                            }`}
                          >
                            {/* Line number */}
                            <td className="w-10 text-right pr-3 py-0.5 text-xs text-gray-600 font-mono select-none border-r border-slate-800">
                              {i + 1}
                            </td>
                            {/* Code */}
                            <td className="px-4 py-0.5">
                              {isBlank ? (
                                <span>&nbsp;</span>
                              ) : (
                                <code
                                  className={`text-sm font-mono whitespace-pre ${
                                    isCommentOnly
                                      ? "text-green-500/70"
                                      : "text-gray-200"
                                  }`}
                                >
                                  {line.code}
                                </code>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Inline explanation */}
                <AnimatePresence>
                  {hoveredLine !== null && current.lines[hoveredLine]?.comment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-emerald-500/30 bg-emerald-500/5 px-4 py-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 text-xs font-mono mt-0.5 flex-shrink-0">
                          Line {hoveredLine + 1}
                        </span>
                        <p className="text-sm text-emerald-200/90 leading-relaxed">
                          {current.lines[hoveredLine].comment}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right — Output + All Explanations */}
              <div className="space-y-4">
                {/* Output */}
                <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-gray-400 font-medium">
                      Command Window — 실행 결과
                    </span>
                  </div>
                  <pre className="p-4 text-sm font-mono text-amber-300/90 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[300px] overflow-y-auto">
                    {current.output}
                  </pre>
                </div>

                {/* Line-by-line explanation list */}
                <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                    <span className="text-xs text-gray-400 font-medium">
                      줄별 설명
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-800/50">
                    {current.lines
                      .map((line, i) => ({ ...line, idx: i }))
                      .filter((l) => l.comment && l.code && !l.code.startsWith("%"))
                      .map((line) => (
                        <div
                          key={line.idx}
                          onClick={() => setHoveredLine(hoveredLine === line.idx ? null : line.idx)}
                          className={`px-4 py-2 cursor-pointer transition-colors ${
                            hoveredLine === line.idx ? "bg-emerald-500/10" : "hover:bg-slate-800/40"
                          }`}
                        >
                          <code className="text-xs font-mono text-cyan-400">
                            {line.code}
                          </code>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {line.comment}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
