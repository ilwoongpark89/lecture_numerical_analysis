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

const specialVars = [
  { name: "pi", desc: "원주율 π ≈ 3.14159", example: "pi", result: "3.1416" },
  { name: "inf", desc: "무한대 (∞)", example: "1/0", result: "Inf" },
  { name: "NaN", desc: "정의 불가 (Not a Number)", example: "0/0", result: "NaN" },
  { name: "eps", desc: "머신 엡실론 ≈ 2.2e-16", example: "eps", result: "2.2204e-16" },
  { name: "i, j", desc: "허수 단위 √(-1)", example: "1 + 2i", result: "1.0000 + 2.0000i" },
  { name: "ans", desc: "마지막 연산 결과", example: "3 + 4", result: "ans = 7" },
];

const builtinCategories = [
  {
    label: "수학 함수",
    fns: [
      { name: "abs(x)", desc: "절대값", example: "abs(-5)", result: "5" },
      { name: "sqrt(x)", desc: "제곱근", example: "sqrt(9)", result: "3" },
      { name: "exp(x)", desc: "e^x", example: "exp(1)", result: "2.7183" },
      { name: "log(x)", desc: "자연로그 ln", example: "log(exp(2))", result: "2" },
      { name: "log10(x)", desc: "상용로그", example: "log10(100)", result: "2" },
      { name: "sin(x)", desc: "사인 (rad)", example: "sin(pi/2)", result: "1" },
      { name: "cos(x)", desc: "코사인 (rad)", example: "cos(0)", result: "1" },
      { name: "tan(x)", desc: "탄젠트 (rad)", example: "tan(pi/4)", result: "1" },
      { name: "round(x)", desc: "반올림", example: "round(3.7)", result: "4" },
      { name: "floor(x)", desc: "내림", example: "floor(3.7)", result: "3" },
      { name: "ceil(x)", desc: "올림", example: "ceil(3.2)", result: "4" },
    ],
  },
  {
    label: "통계 함수",
    fns: [
      { name: "mean(x)", desc: "평균", example: "mean([1 2 3 4])", result: "2.5" },
      { name: "std(x)", desc: "표준편차", example: "std([1 2 3 4])", result: "1.2910" },
      { name: "max(x)", desc: "최댓값", example: "max([3 1 4])", result: "4" },
      { name: "min(x)", desc: "최솟값", example: "min([3 1 4])", result: "1" },
      { name: "sum(x)", desc: "합계", example: "sum([1 2 3])", result: "6" },
      { name: "sort(x)", desc: "오름차순 정렬", example: "sort([3 1 2])", result: "[1 2 3]" },
    ],
  },
];

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

/* ══════════════════════════════════════════════════════════ */
export default function MatlabBasics() {
  const [matOp, setMatOp] = useState<"matrix" | "element">("matrix");
  const [formatTab, setFormatTab] = useState<"short" | "long" | "rat">("short");

  return (
    <section className="relative py-24 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6">
        {/* ── Header ── */}
        <motion.div {...fade} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            MATLAB Fundamentals
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            MATLAB 기본 문법
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            수치 해석의 핵심 도구인 MATLAB의 변수, 연산자, 내장 함수, 출력 제어까지
            기초 문법을 체계적으로 학습합니다.
          </p>
        </motion.div>

        {/* ═══ 1. 변수와 데이터 타입 ═══ */}
        <motion.div {...fade} className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-emerald-400">01</span> 변수와 데이터 타입
          </h3>
          <p className="text-slate-400 mb-6">
            MATLAB에서 변수를 선언하고 다양한 데이터 타입을 다루는 방법을
            알아봅니다.
          </p>

          {/* 변수 이름 규칙 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              변수 이름 규칙
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              {[
                "영문자(a-z, A-Z)로 시작해야 합니다",
                "영문자, 숫자, 밑줄(_)만 사용 가능",
                "대소문자를 구분합니다 (myVar ≠ myvar)",
                "예약어(if, for, end 등)는 변수명으로 사용 불가",
                "최대 63자까지 인식 (namelengthmax)",
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* 데이터 타입 예제 */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              {
                title: "숫자형 (double)",
                code: "x = 3.14;\ny = int32(10);\nclass(x)",
                output: "ans = 'double'",
              },
              {
                title: "문자열 (string / char)",
                code: "s1 = 'hello';      % char\ns2 = \"world\";     % string\nclass(s2)",
                output: "ans = 'string'",
              },
              {
                title: "논리형 (logical)",
                code: "a = true;\nb = (3 > 5);\nclass(a)",
                output: "ans = 'logical'",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5"
              >
                <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                  {item.title}
                </h4>
                <CodeBlock code={item.code} output={item.output} />
              </div>
            ))}
          </div>

          {/* 특수 변수 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              특수 변수 (Special Variables)
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {specialVars.map((v) => (
                <div
                  key={v.name}
                  className="bg-slate-950 rounded-xl border border-slate-800 p-4"
                >
                  <p className="font-mono text-emerald-400 font-bold text-sm">
                    {v.name}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">{v.desc}</p>
                  <div className="mt-2 font-mono text-xs">
                    <span className="text-slate-500">&gt;&gt; </span>
                    <span className="text-sky-300">{v.example}</span>
                    <span className="text-amber-300 block ml-4">
                      {v.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══ 2. 산술 연산자 ═══ */}
        <motion.div {...fade} className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-emerald-400">02</span> 산술 연산자
          </h3>
          <p className="text-slate-400 mb-6">
            기본 산술 연산과 행렬 연산 vs 원소별 연산의 차이를 이해합니다.
          </p>

          {/* 기본 연산자 테이블 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2 pr-4">연산자</th>
                  <th className="text-left py-2 pr-4">설명</th>
                  <th className="text-left py-2 pr-4 font-mono">예시</th>
                  <th className="text-left py-2 font-mono">결과</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {[
                  ["+", "덧셈", "3 + 4", "7"],
                  ["-", "뺄셈", "10 - 6", "4"],
                  ["*", "곱셈 (행렬곱)", "3 * 4", "12"],
                  ["/", "나눗셈", "10 / 3", "3.3333"],
                  ["^", "거듭제곱", "2^10", "1024"],
                  ["mod(a,b)", "나머지 (양수)", "mod(7,3)", "1"],
                  ["rem(a,b)", "나머지 (부호 보존)", "rem(-7,3)", "-1"],
                ].map(([op, desc, ex, res], i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 font-mono text-emerald-400">{op}</td>
                    <td className="py-2 pr-4">{desc}</td>
                    <td className="py-2 pr-4 font-mono text-sky-300">{ex}</td>
                    <td className="py-2 font-mono text-amber-300">{res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 행렬 vs 원소별 토글 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              행렬 연산 vs 원소별 연산
            </h4>
            <div className="flex gap-2 mb-5">
              {(["matrix", "element"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMatOp(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    matOp === tab
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "matrix" ? "행렬 연산 ( * / ^ )" : "원소별 연산 ( .* ./ .^ )"}
                </button>
              ))}
            </div>

            {matOp === "matrix" ? (
              <div className="grid md:grid-cols-2 gap-4">
                <CodeBlock
                  code={`A = [1 2; 3 4];\nB = [5 6; 7 8];\nC = A * B`}
                  output={`C =\n    19    22\n    43    50`}
                />
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-sm text-slate-300 flex items-center">
                  <div>
                    <p className="text-white font-semibold mb-2">행렬 곱 (A*B)</p>
                    <p className="font-mono text-xs leading-6">
                      C(1,1) = 1×5 + 2×7 = <span className="text-amber-300">19</span><br />
                      C(1,2) = 1×6 + 2×8 = <span className="text-amber-300">22</span><br />
                      C(2,1) = 3×5 + 4×7 = <span className="text-amber-300">43</span><br />
                      C(2,2) = 3×6 + 4×8 = <span className="text-amber-300">50</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <CodeBlock
                  code={`A = [1 2; 3 4];\nB = [5 6; 7 8];\nC = A .* B`}
                  output={`C =\n     5    12\n    21    32`}
                />
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-sm text-slate-300 flex items-center">
                  <div>
                    <p className="text-white font-semibold mb-2">
                      원소별 곱 (A.*B)
                    </p>
                    <p className="font-mono text-xs leading-6">
                      C(1,1) = 1×5 = <span className="text-amber-300">5</span><br />
                      C(1,2) = 2×6 = <span className="text-amber-300">12</span><br />
                      C(2,1) = 3×7 = <span className="text-amber-300">21</span><br />
                      C(2,2) = 4×8 = <span className="text-amber-300">32</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
              {[
                ["*  vs  .*", "곱셈", "행렬곱 vs 원소별곱"],
                ["/  vs  ./", "나눗셈", "A/B = A*inv(B) vs 원소별"],
                ["^  vs  .^", "거듭제곱", "행렬 거듭제곱 vs 원소별"],
              ].map(([ops, label, desc], i) => (
                <div
                  key={i}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3"
                >
                  <p className="font-mono text-emerald-400 font-bold">{ops}</p>
                  <p className="text-slate-500 mt-1">
                    {label}: {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══ 3. 관계 및 논리 연산자 ═══ */}
        <motion.div {...fade} className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-emerald-400">03</span> 관계 및 논리 연산자
          </h3>
          <p className="text-slate-400 mb-6">
            조건 판단에 사용되는 관계 연산자와 논리 연산자를 학습합니다.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 관계 연산자 */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                관계 연산자
              </h4>
              <table className="w-full text-sm">
                <tbody className="text-slate-300">
                  {[
                    ["==", "같다", "5 == 5", "1 (true)"],
                    ["~=", "같지 않다", "5 ~= 3", "1 (true)"],
                    ["<", "작다", "3 < 5", "1 (true)"],
                    [">", "크다", "3 > 5", "0 (false)"],
                    ["<=", "작거나 같다", "5 <= 5", "1 (true)"],
                    [">=", "크거나 같다", "3 >= 5", "0 (false)"],
                  ].map(([op, desc, ex, res], i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="py-1.5 font-mono text-emerald-400 w-12">{op}</td>
                      <td className="py-1.5 text-slate-400 w-28">{desc}</td>
                      <td className="py-1.5 font-mono text-sky-300">{ex}</td>
                      <td className="py-1.5 font-mono text-amber-300 text-right">{res}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 논리 연산자 */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                논리 연산자
              </h4>
              <table className="w-full text-sm">
                <tbody className="text-slate-300">
                  {[
                    ["&", "AND (원소별)", "true & false", "0"],
                    ["|", "OR (원소별)", "true | false", "1"],
                    ["~", "NOT", "~true", "0"],
                    ["&&", "AND (단락 평가)", "true && false", "0"],
                    ["||", "OR (단락 평가)", "false || true", "1"],
                  ].map(([op, desc, ex, res], i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="py-1.5 font-mono text-emerald-400 w-12">{op}</td>
                      <td className="py-1.5 text-slate-400 w-32">{desc}</td>
                      <td className="py-1.5 font-mono text-sky-300">{ex}</td>
                      <td className="py-1.5 font-mono text-amber-300 text-right">{res}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-500 mt-3">
                &&, || 는 스칼라 전용이며 왼쪽 조건만으로 결과가 확정되면 오른쪽을
                평가하지 않습니다 (short-circuit).
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══ 4. 유용한 내장 함수 ═══ */}
        <motion.div {...fade} className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-emerald-400">04</span> 유용한 내장 함수
          </h3>
          <p className="text-slate-400 mb-6">
            MATLAB에서 자주 사용하는 수학 함수와 통계 함수를 카테고리별로
            정리합니다.
          </p>

          {builtinCategories.map((cat) => (
            <div key={cat.label} className="mb-6">
              <h4 className="text-base font-semibold text-emerald-400 mb-3">
                {cat.label}
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {cat.fns.map((fn) => (
                  <div
                    key={fn.name}
                    className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 hover:border-emerald-500/30 transition-colors"
                  >
                    <p className="font-mono text-emerald-400 font-bold text-sm">
                      {fn.name}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">{fn.desc}</p>
                    <div className="mt-2 bg-slate-950 rounded-lg p-2 font-mono text-xs">
                      <span className="text-slate-500">&gt;&gt; </span>
                      <span className="text-sky-300">{fn.example}</span>
                      <br />
                      <span className="text-amber-300 ml-4">{fn.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ═══ 5. 세미콜론과 출력 제어 ═══ */}
        <motion.div {...fade}>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-emerald-400">05</span> 세미콜론과 출력 제어
          </h3>
          <p className="text-slate-400 mb-6">
            출력 억제, 표시 함수, 숫자 형식 설정 방법을 알아봅니다.
          </p>

          {/* 세미콜론 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                세미콜론 없음 → 결과 출력
              </h4>
              <CodeBlock
                code={`x = 42`}
                output={`x =\n    42`}
              />
            </div>
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                세미콜론 있음 → 출력 억제
              </h4>
              <CodeBlock
                code={`x = 42;`}
                output={`(출력 없음)`}
              />
            </div>
          </div>

          {/* disp vs fprintf */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              disp() vs fprintf()
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <CodeBlock
                code={`disp('Hello MATLAB');\ndisp(3.14);`}
                output={`Hello MATLAB\n    3.1400`}
              />
              <CodeBlock
                code={`name = 'MATLAB';\nver = 2024;\nfprintf('Hello %s R%d\\n', name, ver);`}
                output={`Hello MATLAB R2024`}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              disp()는 간단한 출력에, fprintf()는 서식 지정 출력에 사용합니다. fprintf는 C 언어의 printf와 유사합니다.
            </p>
          </div>

          {/* format 탭 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              숫자 표시 형식 (format)
            </h4>
            <div className="flex gap-2 mb-4">
              {(["short", "long", "rat"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFormatTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-colors ${
                    formatTab === tab
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  format {tab}
                </button>
              ))}
            </div>
            {formatTab === "short" && (
              <CodeBlock
                code={`format short\npi`}
                output={`ans =\n    3.1416`}
              />
            )}
            {formatTab === "long" && (
              <CodeBlock
                code={`format long\npi`}
                output={`ans =\n   3.141592653589793`}
              />
            )}
            {formatTab === "rat" && (
              <CodeBlock
                code={`format rat\npi`}
                output={`ans =\n   355/113`}
              />
            )}
            <p className="text-xs text-slate-500 mt-3">
              format 명령은 표시 형식만 변경하며, 내부 연산 정밀도(double, 약 15~16자리)에는
              영향을 주지 않습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
