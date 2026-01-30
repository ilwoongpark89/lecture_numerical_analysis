"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ================================================================
   Section: 벡터와 행렬 (Vectors & Matrices)
   MATLAB = MATrix LABoratory — this IS the core.
   ================================================================ */

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

/* ── helper: code block ── */
function Code({ children }: { children: string }) {
  return (
    <pre className="bg-slate-950 rounded-xl p-4 text-sm font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
      {children}
    </pre>
  );
}

/* ── helper: inline code ── */
function IC({ children }: { children: string }) {
  return (
    <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );
}

/* ── helper: section card ── */
function Card({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay }}
      className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-4"
    >
      <h3 className="text-xl font-bold text-emerald-400">{title}</h3>
      {children}
    </motion.div>
  );
}

/* ── Vector block visual ── */
function VectorBlocks({
  values,
  vertical = false,
  color = "emerald",
}: {
  values: (number | string)[];
  vertical?: boolean;
  color?: string;
}) {
  const bg =
    color === "cyan"
      ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-300"
      : color === "amber"
        ? "bg-amber-600/30 border-amber-500/50 text-amber-300"
        : "bg-emerald-600/30 border-emerald-500/50 text-emerald-300";
  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row"} gap-1`}>
      {values.map((v, i) => (
        <div
          key={i}
          className={`${bg} border rounded-lg w-11 h-11 flex items-center justify-center font-mono text-sm font-semibold`}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

/* ── Matrix grid visual ── */
function MatrixGrid({
  data,
  highlight,
  color = "emerald",
}: {
  data: (number | string)[][];
  highlight?: Set<string>;
  color?: string;
}) {
  return (
    <div className="inline-flex flex-col gap-1">
      {data.map((row, r) => (
        <div key={r} className="flex gap-1">
          {row.map((val, c) => {
            const key = `${r},${c}`;
            const isHl = highlight?.has(key);
            const base = isHl
              ? "bg-emerald-500/40 border-emerald-400 text-emerald-200 scale-110"
              : color === "cyan"
                ? "bg-cyan-600/20 border-cyan-600/40 text-cyan-300"
                : color === "amber"
                  ? "bg-amber-600/20 border-amber-600/40 text-amber-300"
                  : "bg-slate-700/50 border-slate-600/50 text-slate-300";
            return (
              <div
                key={c}
                className={`${base} border rounded-lg w-12 h-12 flex items-center justify-center font-mono text-sm font-semibold transition-all duration-300`}
              >
                {val}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   Interactive indexing demo data & logic
   ================================================================ */
const indexMatrix: number[][] = [
  [10, 20, 30, 40],
  [50, 60, 70, 80],
  [90, 100, 110, 120],
  [130, 140, 150, 160],
];

interface IndexOption {
  label: string;
  code: string;
  desc: string;
  cells: string[]; // "r,c" keys
  result: string;
}

const indexOptions: IndexOption[] = [
  {
    label: "A(2,3)",
    code: "A(2,3)",
    desc: "2행 3열의 단일 원소",
    cells: ["1,2"],
    result: "ans = 70",
  },
  {
    label: "A(1,:)",
    code: "A(1,:)",
    desc: "1행 전체 (행 벡터)",
    cells: ["0,0", "0,1", "0,2", "0,3"],
    result: "ans = [10  20  30  40]",
  },
  {
    label: "A(:,2)",
    code: "A(:,2)",
    desc: "2열 전체 (열 벡터)",
    cells: ["0,1", "1,1", "2,1", "3,1"],
    result: "ans = [20; 60; 100; 140]",
  },
  {
    label: "A(1:2,2:3)",
    code: "A(1:2, 2:3)",
    desc: "1~2행, 2~3열 부분 행렬",
    cells: ["0,1", "0,2", "1,1", "1,2"],
    result: "ans = [20 30; 60 70]",
  },
  {
    label: "A(end,:)",
    code: "A(end, :)",
    desc: "마지막 행 전체",
    cells: ["3,0", "3,1", "3,2", "3,3"],
    result: "ans = [130  140  150  160]",
  },
  {
    label: "A(2:3,1:2)",
    code: "A(2:3, 1:2)",
    desc: "2~3행, 1~2열 부분 행렬",
    cells: ["1,0", "1,1", "2,0", "2,1"],
    result: "ans = [50 60; 90 100]",
  },
  {
    label: "A(end,end)",
    code: "A(end, end)",
    desc: "마지막 행, 마지막 열 원소",
    cells: ["3,3"],
    result: "ans = 160",
  },
];

/* ================================================================
   Main component
   ================================================================ */
export default function MatlabVectorMatrix() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const opt = indexOptions[selectedIdx];
  const hlSet = new Set(opt.cells);

  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* ── Title ── */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <h2 className="text-4xl font-extrabold text-white">
            벡터와 행렬{" "}
            <span className="text-emerald-400">(Vectors &amp; Matrices)</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            MATLAB = <strong className="text-emerald-400">MAT</strong>rix{" "}
            <strong className="text-emerald-400">LAB</strong>oratory — 행렬
            연산이 MATLAB의 핵심입니다.
          </p>
        </motion.div>

        {/* ================================================================
           1. 벡터 생성
           ================================================================ */}
        <Card title="1. 벡터 생성 (Creating Vectors)" delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Row vector */}
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">행 벡터 (Row Vector)</p>
              <Code>{`v = [1 2 3 4 5]
% 또는
v = [1, 2, 3, 4, 5]`}</Code>
              <VectorBlocks values={[1, 2, 3, 4, 5]} />
            </div>

            {/* Column vector */}
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">열 벡터 (Column Vector)</p>
              <Code>{`u = [1; 2; 3]
% 또는
u = [1 2 3]'   % 전치(transpose)`}</Code>
              <VectorBlocks values={[1, 2, 3]} vertical color="cyan" />
            </div>

            {/* Colon operator */}
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">
                등간격 벡터 (Colon Operator)
              </p>
              <Code>{`t = 0:0.5:2
% → [0  0.5  1.0  1.5  2.0]
% start : step : end`}</Code>
              <VectorBlocks values={["0", "0.5", "1.0", "1.5", "2.0"]} color="amber" />
            </div>

            {/* linspace */}
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">linspace</p>
              <Code>{`s = linspace(0, 1, 5)
% → [0  0.25  0.5  0.75  1.0]
% linspace(start, end, n)`}</Code>
              <VectorBlocks values={["0", ".25", ".50", ".75", "1.0"]} color="amber" />
            </div>

            {/* Special vectors */}
            <div className="md:col-span-2 space-y-2">
              <p className="text-slate-300 font-semibold">특수 벡터</p>
              <Code>{`zeros(1,5)   % → [0 0 0 0 0]
ones(1,5)    % → [1 1 1 1 1]
rand(1,5)    % → 0~1 균일분포 난수 5개`}</Code>
              <div className="flex flex-wrap gap-6 items-end">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono">zeros(1,5)</span>
                  <VectorBlocks values={[0, 0, 0, 0, 0]} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono">ones(1,5)</span>
                  <VectorBlocks values={[1, 1, 1, 1, 1]} color="cyan" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono">rand(1,5)</span>
                  <VectorBlocks values={[".23", ".87", ".41", ".65", ".09"]} color="amber" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ================================================================
           2. 행렬 생성
           ================================================================ */}
        <Card title="2. 행렬 생성 (Creating Matrices)" delay={0.15}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-slate-300 font-semibold">직접 입력</p>
              <Code>{`A = [1 2 3; 4 5 6; 7 8 9]
% 세미콜론(;)으로 행 구분`}</Code>
              <MatrixGrid
                data={[
                  [1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 9],
                ]}
              />
            </div>

            <div className="space-y-3">
              <p className="text-slate-300 font-semibold">단위행렬 eye(3)</p>
              <Code>{`I = eye(3)
% 대각선이 1, 나머지 0`}</Code>
              <MatrixGrid
                data={[
                  [1, 0, 0],
                  [0, 1, 0],
                  [0, 0, 1],
                ]}
                highlight={new Set(["0,0", "1,1", "2,2"])}
              />
            </div>

            <div className="space-y-3">
              <p className="text-slate-300 font-semibold">대각행렬 diag</p>
              <Code>{`D = diag([2 5 8])
% 주어진 벡터를 대각선에 배치`}</Code>
              <MatrixGrid
                data={[
                  [2, 0, 0],
                  [0, 5, 0],
                  [0, 0, 8],
                ]}
                highlight={new Set(["0,0", "1,1", "2,2"])}
              />
            </div>

            <div className="space-y-3">
              <p className="text-slate-300 font-semibold">특수 행렬</p>
              <Code>{`zeros(3)  % 모든 원소 0
ones(3)   % 모든 원소 1
rand(3)   % 0~1 난수`}</Code>
              <div className="flex gap-4 flex-wrap">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono">zeros(3)</span>
                  <MatrixGrid
                    data={[
                      [0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0],
                    ]}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono">ones(3)</span>
                  <MatrixGrid
                    data={[
                      [1, 1, 1],
                      [1, 1, 1],
                      [1, 1, 1],
                    ]}
                    color="cyan"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ================================================================
           3. 인덱싱 — Interactive
           ================================================================ */}
        <Card title="3. 인덱싱 (Indexing) — 가장 중요!" delay={0.2}>
          <p className="text-slate-400 text-sm">
            MATLAB 인덱스는 <IC>1</IC>부터 시작합니다 (C/Python과 다름).
            아래 버튼을 눌러 어떤 원소가 선택되는지 확인하세요.
          </p>

          <div className="flex flex-wrap gap-2">
            {indexOptions.map((o, i) => (
              <button
                key={o.label}
                onClick={() => setSelectedIdx(i)}
                className={`px-3 py-1.5 rounded-lg font-mono text-sm transition-all ${
                  i === selectedIdx
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Matrix grid */}
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-mono">
                A = [10 20 30 40; 50 60 70 80; 90 100 110 120; 130 140 150 160]
              </p>
              <div className="flex items-center gap-2">
                {/* row labels */}
                <div className="flex flex-col gap-1">
                  {["1", "2", "3", "4"].map((r) => (
                    <div
                      key={r}
                      className="w-6 h-12 flex items-center justify-center text-xs text-slate-500 font-mono"
                    >
                      {r}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {/* col labels */}
                  <div className="flex gap-1 pl-0">
                    {["1", "2", "3", "4"].map((c) => (
                      <div
                        key={c}
                        className="w-12 text-center text-xs text-slate-500 font-mono"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                  <MatrixGrid data={indexMatrix} highlight={hlSet} />
                </div>
              </div>
            </div>

            {/* Code & result */}
            <div className="space-y-3">
              <div className="bg-slate-950 rounded-xl p-4 space-y-2">
                <p className="text-xs text-slate-500">MATLAB 코드</p>
                <p className="font-mono text-emerald-300 text-lg">{opt.code}</p>
                <p className="text-slate-400 text-sm">{opt.desc}</p>
              </div>
              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">실행 결과</p>
                <p className="font-mono text-cyan-300">{opt.result}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ================================================================
           4. 벡터/행렬 연산
           ================================================================ */}
        <Card title="4. 벡터/행렬 연산 (Operations)" delay={0.2}>
          {/* Addition */}
          <div className="space-y-3">
            <p className="text-slate-300 font-semibold">행렬 덧셈 / 뺄셈</p>
            <Code>{`A = [1 2; 3 4];
B = [5 6; 7 8];
C = A + B   % → [6 8; 10 12]
D = A - B   % → [-4 -4; -4 -4]`}</Code>
          </div>

          {/* Multiplication comparison — the key visual */}
          <div className="space-y-3">
            <p className="text-slate-300 font-semibold">
              행렬 곱셈 vs 원소별 곱셈 비교
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* A * B */}
              <div className="bg-slate-950 rounded-xl p-5 space-y-3">
                <p className="text-emerald-400 font-mono font-bold">A * B (행렬 곱셈)</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <MatrixGrid
                    data={[
                      [1, 2],
                      [3, 4],
                    ]}
                  />
                  <span className="text-2xl text-slate-500">*</span>
                  <MatrixGrid
                    data={[
                      [5, 6],
                      [7, 8],
                    ]}
                    color="cyan"
                  />
                  <span className="text-2xl text-slate-500">=</span>
                  <MatrixGrid
                    data={[
                      [19, 22],
                      [43, 50],
                    ]}
                    color="amber"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  (1*5+2*7)=19, (1*6+2*8)=22, (3*5+4*7)=43, (3*6+4*8)=50
                </p>
              </div>

              {/* A .* B */}
              <div className="bg-slate-950 rounded-xl p-5 space-y-3">
                <p className="text-cyan-400 font-mono font-bold">
                  A .* B (원소별 곱셈)
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <MatrixGrid
                    data={[
                      [1, 2],
                      [3, 4],
                    ]}
                  />
                  <span className="text-2xl text-slate-500">.*</span>
                  <MatrixGrid
                    data={[
                      [5, 6],
                      [7, 8],
                    ]}
                    color="cyan"
                  />
                  <span className="text-2xl text-slate-500">=</span>
                  <MatrixGrid
                    data={[
                      [5, 12],
                      [21, 32],
                    ]}
                    color="amber"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  1*5=5, 2*6=12, 3*7=21, 4*8=32 (각 위치끼리 곱)
                </p>
              </div>
            </div>
          </div>

          {/* Other element-wise */}
          <div className="space-y-3">
            <p className="text-slate-300 font-semibold">기타 원소별 연산</p>
            <Code>{`A ./ B   % 원소별 나눗셈
A .^ 2   % 원소별 거듭제곱 → [1 4; 9 16]`}</Code>
          </div>

          {/* Transpose, inverse, determinant */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-950 rounded-xl p-4 space-y-2">
              <p className="text-emerald-400 font-mono font-bold text-sm">전치 A&apos;</p>
              <Code>{`A = [1 2; 3 4];
A'  % → [1 3; 2 4]`}</Code>
              <div className="flex items-center gap-2">
                <MatrixGrid
                  data={[
                    [1, 2],
                    [3, 4],
                  ]}
                />
                <span className="text-slate-500">→</span>
                <MatrixGrid
                  data={[
                    [1, 3],
                    [2, 4],
                  ]}
                  color="cyan"
                />
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 space-y-2">
              <p className="text-emerald-400 font-mono font-bold text-sm">
                역행렬 inv(A)
              </p>
              <Code>{`inv(A)
% → [-2  1; 1.5 -0.5]
% A * inv(A) = I`}</Code>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 space-y-2">
              <p className="text-emerald-400 font-mono font-bold text-sm">
                행렬식 det(A)
              </p>
              <Code>{`det(A)
% → (1*4 - 2*3) = -2
% det ≠ 0 → 역행렬 존재`}</Code>
            </div>
          </div>
        </Card>

        {/* ================================================================
           5. 유용한 행렬 함수
           ================================================================ */}
        <Card title="5. 유용한 행렬 함수" delay={0.25}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Size / length / numel */}
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">크기 관련</p>
              <Code>{`A = [1 2 3; 4 5 6];

size(A)     % → [2 3]  (행, 열)
length(A)   % → 3  (가장 긴 차원)
numel(A)    % → 6  (총 원소 수)`}</Code>
            </div>

            {/* Aggregation */}
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">집계 함수 (열 단위 기본)</p>
              <Code>{`sum(A)    % → [5 7 9]   각 열의 합
max(A)    % → [4 5 6]   각 열의 최댓값
min(A)    % → [1 2 3]   각 열의 최솟값
sum(A,2)  % → [6; 15]   각 행의 합`}</Code>
            </div>

            {/* sort & reshape */}
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">정렬 / 재배치</p>
              <Code>{`v = [3 1 4 1 5];
sort(v)         % → [1 1 3 4 5]
sort(v,'descend') % → [5 4 3 1 1]

B = reshape(1:6, 2, 3)
% B = [1 3 5; 2 4 6]
% (열 우선 배치에 주의!)`}</Code>
            </div>

            {/* Backslash — THE most important for numerical analysis */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-slate-300 font-semibold">
                  연립방정식 풀기 A\b
                </p>
                <span className="text-xs bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  핵심!
                </span>
              </div>
              <Code>{`% 2x + y = 5
% x + 3y = 7
% → Ax = b 형태

A = [2 1; 1 3];
b = [5; 7];
x = A\\b       % 백슬래시 연산자
% x = [1.6; 1.8]

% inv(A)*b 보다 A\\b가
% 더 빠르고 수치적으로 안정적!`}</Code>
              <div className="bg-slate-950 rounded-xl p-3 text-sm text-amber-300/80">
                <strong>수치해석 핵심:</strong> <IC>{"A\\b"}</IC>는{" "}
                <IC>inv(A)*b</IC>보다 효율적이고 정확합니다. 내부적으로 LU 분해
                등을 사용합니다.
              </div>
            </div>
          </div>
        </Card>

        {/* ── Summary tip ── */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/40 rounded-2xl p-6 text-center space-y-2"
        >
          <p className="text-emerald-300 font-bold text-lg">
            MATLAB 핵심 정리
          </p>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            <IC>:</IC> 콜론으로 범위 지정 &middot;{" "}
            <IC>.</IC> 점으로 원소별 연산 &middot;{" "}
            <IC>&apos;</IC> 어포스트로피로 전치 &middot;{" "}
            <IC>\</IC> 백슬래시로 연립방정식 풀기 &mdash; 이 네 가지가 MATLAB의
            핵심입니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
