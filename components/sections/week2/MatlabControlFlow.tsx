"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================================================================
   Week 2 — 제어문 (Control Flow) Section
   MATLAB Fundamentals for Numerical Analysis
   ================================================================ */

const tabs = [
  { id: "if", label: "if / elseif / else" },
  { id: "for", label: "for 반복문" },
  { id: "while", label: "while 반복문" },
  { id: "break", label: "break & continue" },
  { id: "switch", label: "switch-case" },
  { id: "patterns", label: "실전 패턴" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── Reusable Code Block ── */
function CodeBlock({ code, output }: { code: string; output?: string }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 rounded-xl bg-slate-950 border border-slate-700 p-4 overflow-x-auto">
        <div className="text-xs text-slate-500 mb-2 font-sans">MATLAB Code</div>
        <pre className="font-mono text-sm text-emerald-300 whitespace-pre leading-relaxed">
          {code}
        </pre>
      </div>
      {output && (
        <div className="flex-1 lg:max-w-xs rounded-xl bg-slate-950 border border-slate-700 p-4 overflow-x-auto">
          <div className="text-xs text-slate-500 mb-2 font-sans">Output</div>
          <pre className="font-mono text-sm text-amber-300 whitespace-pre leading-relaxed">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ── Small inline code ── */
function IC({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-sm">
      {children}
    </code>
  );
}

/* ================================================================
   1. if / elseif / else
   ================================================================ */
function IfSection() {
  return (
    <div className="space-y-8">
      {/* Syntax */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">기본 문법</h4>
        <CodeBlock
          code={`if 조건1
    실행문1
elseif 조건2
    실행문2
else
    실행문3
end`}
        />
        <p className="text-slate-400 text-sm mt-2">
          조건이 참(true, nonzero)이면 해당 블록을 실행합니다. <IC>end</IC>로 반드시 닫아야 합니다.
        </p>
      </div>

      {/* Example: 학점 판정 */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          예제: 점수에 따른 학점 판정
        </h4>
        <CodeBlock
          code={`score = 85;

if score >= 90
    grade = 'A';
elseif score >= 80
    grade = 'B';
elseif score >= 70
    grade = 'C';
elseif score >= 60
    grade = 'D';
else
    grade = 'F';
end

fprintf('점수: %d → 학점: %s\\n', score, grade);`}
          output={`점수: 85 → 학점: B`}
        />
      </div>

      {/* Flowchart */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-4">흐름도 (Flowchart)</h4>
        <div className="flex flex-col items-center gap-1 text-sm">
          {/* Start */}
          <div className="px-6 py-2 rounded-full bg-slate-800 border border-slate-600 text-slate-300">
            Start
          </div>
          <Arrow />

          {/* Diamond: score >= 90? */}
          <Diamond label="score >= 90?" />
          <div className="flex items-start gap-8">
            {/* True */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-emerald-400 font-semibold">True</span>
              <Arrow />
              <ActionBox label="grade = 'A'" color="emerald" />
            </div>
            {/* False */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-rose-400 font-semibold">False</span>
              <Arrow />
              <Diamond label="score >= 80?" small />
              <div className="flex items-start gap-6 mt-1">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-emerald-400 font-semibold">T</span>
                  <ActionBox label="grade = 'B'" color="emerald" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-rose-400 font-semibold">F</span>
                  <ActionBox label="grade = 'C'/'D'/'F'" color="rose" />
                </div>
              </div>
            </div>
          </div>

          <Arrow />
          <div className="px-6 py-2 rounded-full bg-slate-800 border border-slate-600 text-slate-300 mt-2">
            End
          </div>
        </div>
      </div>
    </div>
  );
}

function Diamond({ label, small }: { label: string; small?: boolean }) {
  const size = small ? "w-28 h-28" : "w-36 h-36";
  return (
    <div className={`${size} flex items-center justify-center`}>
      <div
        className="w-full h-full flex items-center justify-center bg-slate-800 border-2 border-teal-500 text-teal-300 text-xs font-mono text-center p-2"
        style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
      >
        {label}
      </div>
    </div>
  );
}

function ActionBox({ label, color }: { label: string; color: "emerald" | "rose" | "slate" }) {
  const border =
    color === "emerald"
      ? "border-emerald-600"
      : color === "rose"
        ? "border-rose-600"
        : "border-slate-600";
  return (
    <div className={`px-4 py-2 rounded-lg bg-slate-800 border ${border} text-slate-200 text-xs font-mono`}>
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <div className="w-px h-5 bg-slate-600 relative">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-600" />
    </div>
  );
}

/* ================================================================
   2. for 반복문
   ================================================================ */
function ForSection() {
  const [visibleRows, setVisibleRows] = useState(0);
  const totalRows = 5;

  useEffect(() => {
    setVisibleRows(0);
    const timer = setInterval(() => {
      setVisibleRows((prev) => {
        if (prev >= totalRows) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const iterationData = [
    { i: 1, sum: 1 },
    { i: 2, sum: 3 },
    { i: 3, sum: 6 },
    { i: 4, sum: 10 },
    { i: 5, sum: 15 },
  ];

  return (
    <div className="space-y-8">
      {/* Syntax */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">기본 문법</h4>
        <CodeBlock
          code={`for i = 시작:끝
    실행문
end

% 증분 지정 가능
for i = 1:2:10   % 1, 3, 5, 7, 9
    ...
end`}
        />
      </div>

      {/* Example 1: 합 */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          예제 1: 1부터 100까지의 합
        </h4>
        <CodeBlock
          code={`sum = 0;
for i = 1:100
    sum = sum + i;
end
fprintf('합계: %d\\n', sum);`}
          output={`합계: 5050`}
        />
      </div>

      {/* Iteration Table (animated) */}
      <div>
        <h4 className="text-sm font-semibold text-slate-400 mb-2">반복 과정 (i=1:5 일 때)</h4>
        <div className="rounded-xl bg-slate-950 border border-slate-700 overflow-hidden max-w-sm">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-slate-800 text-slate-400">
                <th className="px-4 py-2 text-left">반복</th>
                <th className="px-4 py-2 text-left">i</th>
                <th className="px-4 py-2 text-left">sum</th>
              </tr>
            </thead>
            <tbody>
              {iterationData.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={idx < visibleRows ? { opacity: 1, x: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={idx < visibleRows ? "border-t border-slate-800" : ""}
                >
                  <td className="px-4 py-1.5 text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-1.5 text-teal-400">{row.i}</td>
                  <td className="px-4 py-1.5 text-amber-400">{row.sum}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => {
            setVisibleRows(0);
            setTimeout(() => {
              let count = 0;
              const t = setInterval(() => {
                count++;
                setVisibleRows(count);
                if (count >= totalRows) clearInterval(t);
              }, 400);
            }, 100);
          }}
          className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 underline"
        >
          다시 재생
        </button>
      </div>

      {/* Example 2: Factorial */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          예제 2: 팩토리얼 계산 (n!)
        </h4>
        <CodeBlock
          code={`n = 5;
result = 1;
for i = 1:n
    result = result * i;
end
fprintf('%d! = %d\\n', n, result);`}
          output={`5! = 120`}
        />
      </div>

      {/* Example 3: 벡터 연산 */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          예제 3: 벡터의 각 원소에 대해 연산
        </h4>
        <CodeBlock
          code={`v = [2, 5, 8, 3, 7];
n = length(v);

for i = 1:n
    fprintf('v(%d) = %d, 제곱 = %d\\n', i, v(i), v(i)^2);
end`}
          output={`v(1) = 2, 제곱 = 4
v(2) = 5, 제곱 = 25
v(3) = 8, 제곱 = 64
v(4) = 3, 제곱 = 9
v(5) = 7, 제곱 = 49`}
        />
      </div>
    </div>
  );
}

/* ================================================================
   3. while 반복문
   ================================================================ */
function WhileSection() {
  return (
    <div className="space-y-8">
      {/* Syntax */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">기본 문법</h4>
        <CodeBlock
          code={`while 조건
    실행문
    % 조건이 거짓이 될 때까지 반복
end`}
        />
        <p className="text-slate-400 text-sm mt-2">
          <IC>for</IC>와의 차이: 반복 횟수를 미리 알 수 없을 때 사용합니다.
          수치해석에서 <strong className="text-teal-400">수렴할 때까지 반복</strong>하는 핵심 구조입니다.
        </p>
      </div>

      {/* Example 1: 수렴 반복 */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          예제 1: 수렴할 때까지 반복 (Euler Method 핵심 구조)
        </h4>
        <CodeBlock
          code={`x = 0;
tol = 1e-6;
error = 1;       % 초기 오차를 크게 설정
iter = 0;

while error > tol
    x_new = cos(x);       % 반복 공식
    error = abs(x_new - x);
    x = x_new;
    iter = iter + 1;
end

fprintf('수렴값: %.6f (반복: %d회)\\n', x, iter);`}
          output={`수렴값: 0.739085 (반복: 34회)`}
        />
      </div>

      {/* Example 2: Machine Epsilon */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          예제 2: 머신 엡실론 (Machine Epsilon) 찾기
        </h4>
        <CodeBlock
          code={`eps_val = 1;
count = 0;

while (1 + eps_val) > 1
    eps_val = eps_val / 2;
    count = count + 1;
end

fprintf('Machine epsilon ≈ %.2e\\n', eps_val);
fprintf('반복 횟수: %d\\n', count);`}
          output={`Machine epsilon ≈ 1.11e-16
반복 횟수: 53`}
        />
        <div className="mt-3 p-3 rounded-lg bg-teal-950/30 border border-teal-800/50 text-sm text-teal-300">
          컴퓨터가 1과 구별할 수 있는 가장 작은 수를 찾는 예제입니다.
          IEEE 754 배정밀도에서 약 2.2 x 10<sup>-16</sup> 입니다.
        </div>
      </div>

      {/* for vs while */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">for vs while 비교</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-950 border border-slate-700 p-4">
            <div className="text-sm font-semibold text-teal-400 mb-2">for 반복문</div>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>반복 횟수를 <strong className="text-slate-200">미리 아는</strong> 경우</li>
              <li>배열/벡터 순회</li>
              <li>고정된 구간 계산</li>
            </ul>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-700 p-4">
            <div className="text-sm font-semibold text-amber-400 mb-2">while 반복문</div>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>반복 횟수를 <strong className="text-slate-200">모르는</strong> 경우</li>
              <li>수렴 판정, 오차 기반 종료</li>
              <li>사용자 입력 대기</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   4. break & continue
   ================================================================ */
function BreakContinueSection() {
  return (
    <div className="space-y-8">
      {/* break */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          break — 반복문 즉시 탈출
        </h4>
        <CodeBlock
          code={`for i = 1:100
    if i > 5
        break;    % i가 6이 되면 즉시 종료
    end
    fprintf('i = %d\\n', i);
end
fprintf('반복 종료. 마지막 i = %d\\n', i);`}
          output={`i = 1
i = 2
i = 3
i = 4
i = 5
반복 종료. 마지막 i = 6`}
        />
      </div>

      {/* continue */}
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">
          continue — 현재 반복 건너뛰기
        </h4>
        <CodeBlock
          code={`% 홀수만 출력
for i = 1:10
    if mod(i, 2) == 0
        continue;   % 짝수이면 건너뜀
    end
    fprintf('%d ', i);
end
fprintf('\\n');`}
          output={`1 3 5 7 9`}
        />
      </div>

      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-400">
        <IC>break</IC>는 반복문을 <strong className="text-rose-400">완전히 빠져나가고</strong>,
        <IC>continue</IC>는 <strong className="text-amber-400">다음 반복으로 건너뜁니다</strong>.
        중첩 반복문에서 <IC>break</IC>는 가장 안쪽 반복문만 탈출합니다.
      </div>
    </div>
  );
}

/* ================================================================
   5. switch-case
   ================================================================ */
function SwitchSection() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">기본 문법</h4>
        <CodeBlock
          code={`switch 변수
    case 값1
        실행문1
    case 값2
        실행문2
    otherwise
        기본 실행문
end`}
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">예제: 요일 판별</h4>
        <CodeBlock
          code={`day = 'Mon';

switch day
    case 'Mon'
        fprintf('월요일입니다.\\n');
    case {'Sat', 'Sun'}
        fprintf('주말입니다!\\n');
    otherwise
        fprintf('평일입니다.\\n');
end`}
          output={`월요일입니다.`}
        />
        <p className="text-slate-400 text-sm mt-2">
          여러 값을 하나의 case로 묶으려면 중괄호 <IC>{`{'Sat','Sun'}`}</IC>를 사용합니다.
          C/C++과 달리 <IC>break</IC>가 필요 없습니다.
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   6. 실전 패턴
   ================================================================ */
function PatternsSection() {
  const patterns = [
    {
      title: "패턴 1: for + 배열 저장",
      desc: "결과를 배열에 누적하여 나중에 그래프로 시각화",
      code: `n = 100;
x = linspace(0, 2*pi, n);
y = zeros(1, n);          % 미리 배열 할당 (속도!)

for i = 1:n
    y(i) = sin(x(i));     % 각 원소에 결과 저장
end

plot(x, y);`,
      annotation: "% zeros로 미리 할당 → 속도 향상 (pre-allocation)",
    },
    {
      title: "패턴 2: while + 수렴 판정",
      desc: "오차가 허용 범위 이내가 될 때까지 반복 (수치해석의 핵심!)",
      code: `tol = 1e-8;
max_iter = 1000;
error = inf;
iter = 0;

while error > tol && iter < max_iter
    % --- 수치 계산 수행 ---
    x_new = g(x_old);
    error = abs(x_new - x_old);
    x_old = x_new;
    iter = iter + 1;
end`,
      annotation: "% max_iter로 무한루프 방지 — 항상 안전장치를 넣으세요!",
    },
    {
      title: "패턴 3: for + if (조건부 연산)",
      desc: "반복하며 특정 조건을 만족하는 원소만 처리",
      code: `data = [3, -1, 4, -2, 7, -5, 8];
positive_sum = 0;
count = 0;

for i = 1:length(data)
    if data(i) > 0
        positive_sum = positive_sum + data(i);
        count = count + 1;
    end
end

fprintf('양수의 합: %d (개수: %d)\\n', positive_sum, count);`,
      annotation: "% 조건에 맞는 데이터만 선택적으로 처리",
    },
  ];

  return (
    <div className="space-y-8">
      <p className="text-slate-400 text-sm">
        수치해석 프로그래밍에서 가장 자주 등장하는 제어문 조합 패턴입니다.
        이 세 가지를 익히면 대부분의 수치 알고리즘을 구현할 수 있습니다.
      </p>

      {patterns.map((pat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.15 }}
          className="rounded-xl bg-slate-900/60 border border-slate-700 p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-950 bg-emerald-400 rounded-full w-6 h-6 flex items-center justify-center">
              {idx + 1}
            </span>
            <h4 className="text-base font-semibold text-emerald-400">{pat.title}</h4>
          </div>
          <p className="text-sm text-slate-400">{pat.desc}</p>
          <div className="rounded-xl bg-slate-950 border border-slate-700 p-4 overflow-x-auto">
            <pre className="font-mono text-sm text-emerald-300 whitespace-pre leading-relaxed">
              {pat.code}
            </pre>
          </div>
          <div className="text-xs font-mono text-teal-500">{pat.annotation}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ================================================================
   Main Component
   ================================================================ */
export default function MatlabControlFlow() {
  const [activeTab, setActiveTab] = useState<TabId>("if");

  const renderContent = () => {
    switch (activeTab) {
      case "if":
        return <IfSection />;
      case "for":
        return <ForSection />;
      case "while":
        return <WhileSection />;
      case "break":
        return <BreakContinueSection />;
      case "switch":
        return <SwitchSection />;
      case "patterns":
        return <PatternsSection />;
    }
  };

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            제어문{" "}
            <span className="text-emerald-400">(Control Flow)</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            프로그램의 실행 흐름을 제어하는 핵심 구문입니다.
            조건 분기와 반복을 통해 수치 알고리즘을 구현합니다.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
