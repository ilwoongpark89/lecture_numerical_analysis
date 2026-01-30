"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ── Helper: code block with line numbers ── */
function CodeBlock({ code, output }: { code: string; output?: string }) {
  const lines = code.trim().split("\n");
  return (
    <div className="rounded-xl overflow-hidden text-sm font-mono">
      <div className="bg-slate-950 border border-slate-800 p-4 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="select-none text-slate-600 w-8 shrink-0 text-right mr-4">
              {i + 1}
            </span>
            <span className="text-emerald-300">{line}</span>
          </div>
        ))}
      </div>
      {output && (
        <div className="bg-slate-900 border border-t-0 border-slate-800 p-4">
          <p className="text-xs text-slate-500 mb-1">Output:</p>
          <pre className="text-amber-300 whitespace-pre-wrap text-xs">{output}</pre>
        </div>
      )}
    </div>
  );
}

/* ── Data ── */

const comparisonRows = [
  { label: "파일 형태", script: ".m", func: ".m" },
  { label: "입출력", script: "없음", func: "있음 (arguments)" },
  { label: "변수 범위", script: "Workspace 공유", func: "로컬 (독립적)" },
  { label: "용도", script: "순차 실행", func: "재사용 가능한 모듈" },
];

const functionExamples = [
  {
    title: "예제 1: 화씨 → 섭씨 변환 (단일 입출력)",
    code: `function c = fahr2cel(f)
    % 화씨를 섭씨로 변환
    c = (f - 32) * 5/9;
end`,
    output: `>> fahr2cel(212)
ans = 100

>> fahr2cel(32)
ans = 0`,
  },
  {
    title: "예제 2: 다중 출력 — 평균과 표준편차",
    code: `function [m, s] = my_stats(data)
    % 데이터의 평균과 표준편차 계산
    m = mean(data);
    s = std(data);
end`,
    output: `>> [m, s] = my_stats([10 20 30 40 50])
m = 30
s = 15.8114`,
  },
  {
    title: "예제 3: 벡터 입력 — norm 계산",
    code: `function n = my_norm(v)
    % 벡터의 유클리드 노름(크기) 계산
    n = sqrt(sum(v.^2));
end`,
    output: `>> my_norm([3 4])
ans = 5

>> my_norm([1 2 2])
ans = 3`,
  },
];

const anonymousExamples = [
  {
    code: `f = @(x) x.^2 + 2*x + 1;`,
    usage: `>> f(3)
ans = 16

>> f([0 1 2 3])
ans = [1 4 9 16]`,
  },
  {
    code: `g = @(x, y) sqrt(x.^2 + y.^2);`,
    usage: `>> g(3, 4)
ans = 5`,
  },
  {
    code: `% fplot과 함께 사용
h = @(x) sin(x)./x;
fplot(h, [-10, 10])`,
    usage: `% sinc 함수 그래프 출력`,
  },
];

const builtinCategories = [
  {
    label: "수학",
    color: "emerald",
    fns: [
      { name: "abs", desc: "절대값", ex: "abs(-5) → 5" },
      { name: "sqrt", desc: "제곱근", ex: "sqrt(9) → 3" },
      { name: "exp", desc: "지수 함수 e^x", ex: "exp(1) → 2.718" },
      { name: "log", desc: "자연로그 ln", ex: "log(exp(2)) → 2" },
      { name: "sin", desc: "사인 (rad)", ex: "sin(pi/2) → 1" },
      { name: "cos", desc: "코사인 (rad)", ex: "cos(0) → 1" },
      { name: "tan", desc: "탄젠트 (rad)", ex: "tan(pi/4) → 1" },
      { name: "round", desc: "반올림", ex: "round(3.7) → 4" },
      { name: "floor", desc: "내림", ex: "floor(3.7) → 3" },
      { name: "ceil", desc: "올림", ex: "ceil(3.2) → 4" },
    ],
  },
  {
    label: "행렬",
    color: "teal",
    fns: [
      { name: "det", desc: "행렬식", ex: "det([1 2;3 4]) → -2" },
      { name: "inv", desc: "역행렬", ex: "inv(A)" },
      { name: "eig", desc: "고유값/벡터", ex: "eig(A)" },
      { name: "rank", desc: "행렬 랭크", ex: "rank(A)" },
      { name: "trace", desc: "대각합", ex: "trace(eye(3)) → 3" },
      { name: "norm", desc: "노름", ex: "norm([3 4]) → 5" },
    ],
  },
  {
    label: "통계",
    color: "cyan",
    fns: [
      { name: "mean", desc: "평균", ex: "mean([1 2 3]) → 2" },
      { name: "std", desc: "표준편차", ex: "std([1 2 3])" },
      { name: "var", desc: "분산", ex: "var([1 2 3])" },
      { name: "median", desc: "중앙값", ex: "median([1 3 5]) → 3" },
      { name: "max", desc: "최댓값", ex: "max([3 1 4]) → 4" },
      { name: "min", desc: "최솟값", ex: "min([3 1 4]) → 1" },
      { name: "sum", desc: "합계", ex: "sum([1 2 3]) → 6" },
      { name: "prod", desc: "곱", ex: "prod([2 3 4]) → 24" },
    ],
  },
  {
    label: "수치해석",
    color: "violet",
    fns: [
      { name: "fzero", desc: "방정식의 근", ex: "fzero(@(x)x^2-4, 1)" },
      { name: "fsolve", desc: "비선형 시스템 풀기", ex: "fsolve(@f, x0)" },
      { name: "ode45", desc: "상미분방정식 풀기", ex: "ode45(@f, tspan, y0)" },
      { name: "quad", desc: "수치 적분", ex: "quad(@sin, 0, pi)" },
      { name: "interp1", desc: "1차원 보간", ex: "interp1(x, y, xq)" },
    ],
  },
];

type TabKey = "script" | "function" | "anonymous";

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

/* ══════════════════════════════════════════════════════════ */
export default function MatlabFunctions() {
  const [activeTab, setActiveTab] = useState<TabKey>("script");
  const [hoveredFn, setHoveredFn] = useState<string | null>(null);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "script", label: "스크립트" },
    { key: "function", label: "함수" },
    { key: "anonymous", label: "익명 함수" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "border-emerald-500/40 bg-emerald-500/5",
    teal: "border-teal-500/40 bg-teal-500/5",
    cyan: "border-cyan-500/40 bg-cyan-500/5",
    violet: "border-violet-500/40 bg-violet-500/5",
  };

  const badgeMap: Record<string, string> = {
    emerald: "bg-emerald-500/20 text-emerald-400",
    teal: "bg-teal-500/20 text-teal-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
    violet: "bg-violet-500/20 text-violet-400",
  };

  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ── Title ── */}
        <motion.div {...fade} className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            스크립트와 함수
          </h2>
          <p className="text-slate-400 text-lg">
            MATLAB 코드를 파일로 저장하고 재사용하는 방법
          </p>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div {...fade} className="flex justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === t.key
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* ── Tab Content ── */}
        <div className="min-h-[400px]">
          {/* Script Tab */}
          {activeTab === "script" && (
            <motion.div
              key="script"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-4">
                <h3 className="text-xl font-bold text-emerald-400">
                  스크립트 파일 (.m file)
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">&#9654;</span>
                    <span>
                      <strong className="text-white">스크립트란:</strong>{" "}
                      명령어를 순서대로 저장한 파일. Command Window에 직접 입력하는 대신 파일로 관리
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">&#9654;</span>
                    <span>
                      <strong className="text-white">생성 방법:</strong>{" "}
                      Editor에서 작성 &rarr; 저장(.m) &rarr; 실행(F5 또는 Run)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">&#9654;</span>
                    <span>
                      <strong className="text-white">변수 공유:</strong>{" "}
                      작업 공간(Workspace)의 변수를 공유함 — 스크립트 내 변수는 Workspace에서 접근 가능
                    </span>
                  </li>
                </ul>
              </div>

              {/* Editor mockup */}
              <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">
                {/* Title bar */}
                <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-slate-300 text-sm ml-2 font-mono">
                      my_script.m
                    </span>
                  </div>
                  <div className="bg-emerald-600 text-white text-xs px-3 py-1 rounded font-medium">
                    &#9654; Run (F5)
                  </div>
                </div>
                <CodeBlock
                  code={`% my_script.m — 원의 넓이 계산
r = 5;              % 반지름
area = pi * r^2;    % 넓이 계산
fprintf('반지름 %d인 원의 넓이: %.2f\\n', r, area);`}
                  output={`반지름 5인 원의 넓이: 78.54`}
                />
              </div>
            </motion.div>
          )}

          {/* Function Tab */}
          {activeTab === "function" && (
            <motion.div
              key="function"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Syntax */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-4">
                <h3 className="text-xl font-bold text-teal-400">
                  함수 기본 문법
                </h3>
                <CodeBlock
                  code={`function [출력] = 함수이름(입력)
    % 함수 본문
end`}
                />
                <p className="text-slate-400 text-sm">
                  함수 파일은 반드시 <strong className="text-white">함수 이름과 동일한 파일명</strong>으로
                  저장해야 합니다. (예: <code className="text-teal-300">fahr2cel.m</code>)
                </p>
              </div>

              {/* Comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">항목</th>
                      <th className="text-left py-3 px-4 text-emerald-400 font-medium">스크립트</th>
                      <th className="text-left py-3 px-4 text-teal-400 font-medium">함수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-white font-medium">{row.label}</td>
                        <td className="py-3 px-4 text-slate-300">{row.script}</td>
                        <td className="py-3 px-4 text-slate-300">{row.func}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Function examples */}
              <div className="space-y-6">
                {functionExamples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="space-y-2"
                  >
                    <h4 className="text-teal-300 font-semibold">{ex.title}</h4>
                    <CodeBlock code={ex.code} output={ex.output} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Anonymous Tab */}
          {activeTab === "anonymous" && (
            <motion.div
              key="anonymous"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-4">
                <h3 className="text-xl font-bold text-cyan-400">
                  익명 함수 (Anonymous Functions)
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">&#9654;</span>
                    <span>
                      <code className="text-cyan-300">@(x)</code> 문법으로 한 줄에 간단한 수학 함수 정의
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">&#9654;</span>
                    <span>
                      별도 .m 파일 없이 변수에 함수를 저장
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">&#9654;</span>
                    <span>
                      수치해석에서 자주 사용: <code className="text-cyan-300">fzero</code>,{" "}
                      <code className="text-cyan-300">fplot</code>,{" "}
                      <code className="text-cyan-300">ode45</code> 등에 인자로 전달
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                {anonymousExamples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <CodeBlock code={ex.code} output={ex.usage} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Built-in Functions Grid ── */}
        <motion.div {...fade} className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">
              유용한 내장 함수 카테고리
            </h3>
            <p className="text-slate-400">
              함수 카드에 마우스를 올리면 사용 예시를 확인할 수 있습니다
            </p>
          </div>

          <div className="space-y-10">
            {builtinCategories.map((cat) => (
              <div key={cat.label} className="space-y-4">
                <span
                  className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                    badgeMap[cat.color]
                  }`}
                >
                  {cat.label}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {cat.fns.map((fn) => {
                    const isHovered = hoveredFn === `${cat.label}-${fn.name}`;
                    return (
                      <motion.div
                        key={fn.name}
                        onHoverStart={() =>
                          setHoveredFn(`${cat.label}-${fn.name}`)
                        }
                        onHoverEnd={() => setHoveredFn(null)}
                        whileHover={{ scale: 1.04 }}
                        className={`relative rounded-xl border p-3 transition-colors cursor-default ${
                          colorMap[cat.color]
                        }`}
                      >
                        <p className="font-mono font-bold text-white text-sm">
                          {fn.name}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {fn.desc}
                        </p>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-0 right-0 -bottom-8 z-10 bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap"
                          >
                            {fn.ex}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
