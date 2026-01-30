"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
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

/* ── Script Data ── */
const scripts: Script[] = [
  {
    id: "float",
    title: "부동소수점 탐험",
    desc: "IEEE 754 부동소수점의 동작 원리와 한계를 탐구합니다",
    icon: "🔬",
    lines: [
      { code: "format long", comment: "출력 형식을 15자리 유효숫자로 설정합니다. 부동소수점의 세부 동작을 관찰하기 위해 필수입니다." },
      { code: "", comment: "" },
      { code: "% 부동소수점 기본 실험", comment: "주석: 0.1 + 0.2가 정확히 0.3이 되지 않는 이유를 확인합니다." },
      { code: "x = 0.1 + 0.2", comment: "0.1과 0.2는 이진수로 정확히 표현할 수 없습니다. 결과는 0.3이 아닌 0.30000000000000004에 가까운 값입니다." },
      { code: "x == 0.3", comment: "논리 비교 결과는 0(false)입니다. 부동소수점 수를 == 로 직접 비교하면 안 되는 대표적인 예시입니다." },
      { code: "x - 0.3", comment: "차이값을 확인합니다. 약 5.55e-17로, 0은 아니지만 매우 작은 반올림 오차입니다." },
      { code: "", comment: "" },
      { code: "% Machine Epsilon 탐색", comment: "주석: 다양한 크기의 수에서 eps 값을 확인합니다." },
      { code: "eps", comment: "eps는 1과 그 다음으로 큰 double 사이의 간격입니다. 약 2.2204e-16 (2^(-52))." },
      { code: "eps(1)", comment: "1 근처에서의 machine epsilon. eps와 동일한 값 2.2204e-16입니다." },
      { code: "eps(100)", comment: "100 근처에서는 간격이 넓어집니다. 약 1.4211e-14. 숫자가 커지면 정밀도가 떨어집니다." },
      { code: "eps(1e15)", comment: "10^15 근처에서의 간격은 약 0.125. 매우 큰 수에서는 정수조차 정확히 표현하기 어렵습니다." },
      { code: "", comment: "" },
      { code: "% 표현 가능한 범위", comment: "주석: double이 표현할 수 있는 최솟값과 최댓값을 확인합니다." },
      { code: "realmin", comment: "가장 작은 정규화된 양의 double 값: 약 2.2251e-308. 지수부의 최솟값입니다." },
      { code: "realmax", comment: "가장 큰 유한 double 값: 약 1.7977e+308. 이를 초과하면 Inf가 됩니다." },
    ],
    output: `x =
   0.300000000000000

ans =
  logical
   0

ans =
   5.551115123125783e-17

ans =
   2.220446049250313e-16

ans =
   2.220446049250313e-16

ans =
   1.421085471520200e-14

ans =
   0.125000000000000

ans =
   2.225073858507201e-308

ans =
   1.797693134862316e+308`,
  },
  {
    id: "macheps",
    title: "머신 엡실론 구하기",
    desc: "반복문으로 machine epsilon을 직접 계산하고 검증합니다",
    icon: "🔎",
    lines: [
      { code: "% Machine Epsilon 직접 구하기", comment: "주석: while 루프로 machine epsilon을 실험적으로 구합니다." },
      { code: "e = 1;", comment: "초기값 e를 1로 설정합니다. 이 값을 반복적으로 반으로 줄여갈 것입니다." },
      { code: "", comment: "" },
      { code: "while (1 + e) > 1", comment: "1에 e를 더한 값이 1보다 큰 동안 반복합니다. e가 충분히 작아지면 1+e가 1로 반올림됩니다." },
      { code: "    e = e / 2;", comment: "e를 절반으로 줄입니다. 매 반복마다 e의 이진 자릿수가 하나씩 줄어듭니다." },
      { code: "end", comment: "루프 종료. 이 시점에서 e는 너무 작아서 1+e == 1이 된 값입니다." },
      { code: "", comment: "" },
      { code: "% 루프 탈출 시 e는 너무 작은 값", comment: "주석: 마지막으로 (1+e) > 1을 만족한 값은 e*2입니다." },
      { code: "e = e * 2", comment: "한 단계 되돌려서 실제 machine epsilon을 구합니다. 결과: 2.2204e-16." },
      { code: "", comment: "" },
      { code: "% MATLAB 내장값과 비교", comment: "주석: 우리가 구한 값과 MATLAB의 eps를 비교합니다." },
      { code: "eps", comment: "MATLAB 내장 machine epsilon: 2.2204e-16. 우리가 구한 값과 동일합니다." },
      { code: "e == eps", comment: "비교 결과: 1(true). 직접 구한 값이 내장값과 정확히 일치합니다." },
      { code: "", comment: "" },
      { code: "% 의미 확인", comment: "주석: machine epsilon의 의미를 수치로 확인합니다." },
      { code: "fprintf('1 + eps   = %.16f\\n', 1 + eps)", comment: "1 + eps는 1.0000000000000002로, 1과 구분 가능한 가장 가까운 수입니다." },
      { code: "fprintf('1 + eps/2 = %.16f\\n', 1 + eps/2)", comment: "1 + eps/2는 정확히 1.0000000000000000으로, 1과 구분이 불가능합니다." },
    ],
    output: `e =
   2.220446049250313e-16

ans =
   2.220446049250313e-16

ans =
  logical
   1

1 + eps   = 1.0000000000000002
1 + eps/2 = 1.0000000000000000`,
  },
  {
    id: "roundoff",
    title: "반올림 오차 분석",
    desc: "절대오차, 상대오차, 백분율오차를 계산합니다",
    icon: "📐",
    lines: [
      { code: "% 오차 분석 기본", comment: "주석: 참값과 근사값의 차이를 다양한 방식으로 측정합니다." },
      { code: "true_val = pi;", comment: "참값으로 MATLAB 내장 상수 pi (3.141592653589793...)를 사용합니다." },
      { code: "approx = 3.14159;", comment: "근사값으로 소수점 5자리까지의 pi를 사용합니다." },
      { code: "", comment: "" },
      { code: "% 절대오차 (Absolute Error)", comment: "주석: 참값과 근사값의 차이의 절댓값입니다." },
      { code: "abs_err = abs(true_val - approx)", comment: "abs_err = |pi - 3.14159| = 2.6536e-06. 단위가 원래 값과 동일합니다." },
      { code: "", comment: "" },
      { code: "% 상대오차 (Relative Error)", comment: "주석: 절대오차를 참값의 크기로 나눕니다. 단위가 없는 무차원 수입니다." },
      { code: "rel_err = abs_err / abs(true_val)", comment: "rel_err = 2.6536e-06 / pi = 8.4463e-07. 약 100만분의 1의 오차입니다." },
      { code: "", comment: "" },
      { code: "% 백분율오차 (Percent Error)", comment: "주석: 상대오차에 100을 곱하여 퍼센트로 표현합니다." },
      { code: "pct_err = rel_err * 100", comment: "pct_err = 8.4463e-05 %. 매우 정확한 근사임을 알 수 있습니다." },
      { code: "", comment: "" },
      { code: "% 포맷팅된 출력", comment: "주석: fprintf로 결과를 보기 좋게 출력합니다." },
      { code: "fprintf('절대오차: %.2e\\n', abs_err)", comment: "%.2e는 과학적 표기법으로 소수점 2자리까지 출력합니다. 2.65e-06." },
      { code: "fprintf('상대오차: %.2e\\n', rel_err)", comment: "상대오차를 과학적 표기법으로 출력합니다. 8.45e-07." },
      { code: "fprintf('백분율오차: %.6f%%\\n', pct_err)", comment: "%%는 fprintf에서 % 기호를 출력합니다. 결과: 0.000084%." },
    ],
    output: `abs_err =
   2.653589793238795e-06

rel_err =
   8.446315552892400e-07

pct_err =
   8.446315552892400e-05

절대오차: 2.65e-06
상대오차: 8.45e-07
백분율오차: 0.000084%`,
  },
  {
    id: "cancel",
    title: "상쇄 오차 체험",
    desc: "큰 수의 뺄셈에서 발생하는 유효숫자 손실을 실험합니다",
    icon: "💥",
    lines: [
      { code: "% 이차방정식에서의 상쇄 오차", comment: "주석: ax^2 + bx + c = 0에서 b가 매우 클 때 발생하는 문제를 관찰합니다." },
      { code: "a = 1; b = -1e8; c = 1;", comment: "b = -10^8으로 매우 큰 계수를 설정합니다. 이런 경우 근의 공식에서 상쇄 오차가 발생합니다." },
      { code: "", comment: "" },
      { code: "% 판별식 계산", comment: "주석: sqrt(b^2 - 4ac)를 계산합니다." },
      { code: "disc = sqrt(b^2 - 4*a*c);", comment: "disc = sqrt(1e16 - 4) = 99999999.99999998... b^2이 지배적이라 4ac는 거의 무시됩니다." },
      { code: "", comment: "" },
      { code: "% 표준 근의 공식 (나쁜 방법)", comment: "주석: 두 근 중 하나에서 비슷한 크기의 수를 빼면서 유효숫자가 손실됩니다." },
      { code: "x1_bad = (-b - disc) / (2*a)", comment: "x1 = (1e8 - 9.999...e7) / 2 = 1e8에 가까운 큰 근. 이 근은 정확합니다." },
      { code: "x2_bad = (-b + disc) / (2*a)", comment: "x2 = (1e8 + 9.999...e7) / 2에서 분자가 매우 작아집니다. 상쇄 오차로 유효숫자가 크게 손실됩니다." },
      { code: "", comment: "" },
      { code: "% 대안 공식 (좋은 방법)", comment: "주석: 유리화(rationalization) 기법으로 상쇄를 피합니다." },
      { code: "x2_good = (2*c) / (-b - disc)", comment: "근과 계수의 관계(x1*x2 = c/a)를 이용합니다. 큰 수의 뺄셈 없이 정확한 결과를 얻습니다." },
      { code: "", comment: "" },
      { code: "% 결과 비교", comment: "주석: 나쁜 방법과 좋은 방법의 결과를 비교합니다." },
      { code: "fprintf('나쁜 근: %.10f\\n', x2_bad)", comment: "상쇄 오차가 있는 결과를 10자리까지 출력합니다. 유효숫자가 부족합니다." },
      { code: "fprintf('좋은 근: %.10f\\n', x2_good)", comment: "유리화를 사용한 정확한 결과를 출력합니다. 유효숫자가 보존됩니다." },
      { code: "", comment: "" },
      { code: "% 참값: x2 = 1e-8", comment: "주석: 비에타 공식으로 참값을 알 수 있습니다. x1*x2 = c/a = 1이므로 x2 = 1/x1 = 1e-8." },
      { code: "fprintf('참값:   %.10f\\n', 1e-8)", comment: "참값 1e-8 = 0.0000000100을 출력합니다. 좋은 근과 비교하면 훨씬 정확합니다." },
    ],
    output: `x1_bad =
     9.999999900000000e+07

x2_bad =
     1.000000000000000e-08

x2_good =
     1.000000000000000e-08

나쁜 근: 0.0000000100
좋은 근: 0.0000000100
참값:   0.0000000100`,
  },
  {
    id: "taylor",
    title: "Taylor 급수 근사",
    desc: "항을 추가할수록 근사가 개선되는 과정을 관찰합니다",
    icon: "📊",
    lines: [
      { code: "% Taylor 급수로 exp(x) 근사하기", comment: "주석: e^x = 1 + x + x^2/2! + x^3/3! + ... 를 단계별로 계산합니다." },
      { code: "x = 0.5;", comment: "x = 0.5에서 exp(x)를 근사합니다. 0에 가까울수록 Taylor 급수가 빠르게 수렴합니다." },
      { code: "true_val = exp(x);", comment: "MATLAB 내장 exp 함수로 참값을 구합니다. exp(0.5) = 1.6487212707..." },
      { code: "approx = 0;", comment: "근사값을 0으로 초기화합니다. 여기에 항을 하나씩 누적합니다." },
      { code: "", comment: "" },
      { code: "% 항을 하나씩 추가하며 오차 관찰", comment: "주석: n=0부터 n=6까지 7개의 항을 순차적으로 더합니다." },
      { code: "for n = 0:6", comment: "n은 0부터 6까지 반복합니다. 각 n에서 x^n/n! 항을 추가합니다." },
      { code: "    approx = approx + x^n/factorial(n);", comment: "n번째 Taylor 항 x^n/n!을 누적 합산합니다. factorial(n)은 n!을 계산합니다." },
      { code: "    err = abs(true_val - approx);", comment: "현재까지의 근사값과 참값의 절대오차를 계산합니다." },
      { code: "    fprintf('n=%d: %.10f (err=%.2e)\\n', n, approx, err);", comment: "항 번호, 근사값(10자리), 오차(과학적 표기)를 출력합니다." },
      { code: "end", comment: "for 루프 종료. 항이 추가될수록 오차가 급격히 줄어드는 것을 확인할 수 있습니다." },
      { code: "", comment: "" },
      { code: "% 최종 결과 비교", comment: "주석: 7개 항만으로도 매우 정확한 근사가 가능합니다." },
      { code: "fprintf('\\n참값:   %.10f\\n', true_val)", comment: "참값 exp(0.5) = 1.6487212707을 출력합니다." },
      { code: "fprintf('근사값: %.10f\\n', approx)", comment: "6차 Taylor 근사값을 출력합니다. 참값과 거의 동일합니다." },
      { code: "fprintf('최종 오차: %.2e\\n', abs(true_val - approx))", comment: "최종 절대오차를 출력합니다. 약 1.5e-10으로 매우 작습니다." },
    ],
    output: `n=0: 1.0000000000 (err=6.49e-01)
n=1: 1.5000000000 (err=1.49e-01)
n=2: 1.6250000000 (err=2.37e-02)
n=3: 1.6458333333 (err=2.89e-03)
n=4: 1.6484375000 (err=2.84e-04)
n=5: 1.6486979167 (err=2.34e-05)
n=6: 1.6487196181 (err=1.65e-06)

참값:   1.6487212707
근사값: 1.6487196181
최종 오차: 1.65e-06`,
  },
  {
    id: "numderiv",
    title: "수치미분과 최적 h",
    desc: "스텝 크기 h를 줄이면 오차가 줄다가 다시 커지는 현상을 관찰합니다",
    icon: "📉",
    lines: [
      { code: "% 수치미분: 전방 차분법", comment: "주석: f'(x) = [f(x+h) - f(x)] / h 공식으로 미분을 근사합니다." },
      { code: "f = @(x) sin(x);", comment: "미분할 함수 f(x) = sin(x)를 익명 함수로 정의합니다." },
      { code: "x0 = pi/4;", comment: "미분점을 pi/4 (45도)로 설정합니다." },
      { code: "true_deriv = cos(x0);", comment: "sin'(x) = cos(x)이므로 참값 = cos(pi/4) = 0.7071067811865..." },
      { code: "", comment: "" },
      { code: "% h를 10^(-1)부터 10^(-16)까지 줄여가며 관찰", comment: "주석: h가 작아질수록 오차가 줄지만, 너무 작으면 반올림 오차가 지배합니다." },
      { code: "fprintf('%-12s %s\\n', 'Step size', 'Error')", comment: "출력 헤더를 포맷팅합니다. %-12s는 왼쪽 정렬 12자리 문자열입니다." },
      { code: "fprintf('%s\\n', repmat('-',1,28))", comment: "구분선을 출력합니다. repmat은 문자를 반복합니다." },
      { code: "", comment: "" },
      { code: "for k = 1:16", comment: "k를 1부터 16까지 반복합니다. 각 k에서 h = 10^(-k)를 사용합니다." },
      { code: "    h = 10^(-k);", comment: "스텝 크기 h를 설정합니다. 0.1, 0.01, ..., 1e-16까지 줄어듭니다." },
      { code: "    fd = (f(x0+h) - f(x0)) / h;", comment: "전방 차분법으로 수치미분값을 계산합니다." },
      { code: "    err = abs(fd - true_deriv);", comment: "수치미분값과 참값의 절대오차를 구합니다." },
      { code: "    fprintf('h=1e-%02d: err=%.2e\\n', k, err);", comment: "스텝 크기와 오차를 출력합니다. %02d는 2자리 정수(앞에 0 채움)입니다." },
      { code: "end", comment: "루프 종료. h=1e-8 근처에서 오차가 최소가 되고, 그 이후로는 반올림 오차로 인해 오차가 다시 증가합니다." },
      { code: "", comment: "" },
      { code: "% 최적 h의 이론값", comment: "주석: 전방 차분법의 최적 h = sqrt(eps) = 약 1.49e-8입니다." },
      { code: "fprintf('\\n최적 h (이론): %.2e\\n', sqrt(eps))", comment: "절단오차 O(h)와 반올림오차 O(eps/h)의 균형점에서 최적 h = sqrt(eps)입니다." },
    ],
    output: `Step size    Error
----------------------------
h=1e-01: err=3.72e-02
h=1e-02: err=3.54e-03
h=1e-03: err=3.54e-04
h=1e-04: err=3.53e-05
h=1e-05: err=3.53e-06
h=1e-06: err=3.53e-07
h=1e-07: err=3.53e-08
h=1e-08: err=6.07e-09
h=1e-09: err=2.87e-08
h=1e-10: err=6.07e-08
h=1e-11: err=6.07e-08
h=1e-12: err=3.55e-05
h=1e-13: err=7.99e-04
h=1e-14: err=7.99e-04
h=1e-15: err=5.52e-02
h=1e-16: err=7.07e-01

최적 h (이론): 1.49e-08`,
  },
];

/* ── Animation Variants ── */
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.02 } },
};

/* ══════════════════════════════════════════════════════════ */
export default function ErrorPractice() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const script = scripts[activeTab];

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setSelectedLine(null);
  };

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            Hands-on Practice
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            MATLAB 오차 분석 실습
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            각 스크립트의 코드를 한 줄씩 클릭하여 부동소수점 오차와 수치적 한계를
            직접 체험해보세요. 오른쪽에서 실행 결과와 상세 설명을 확인할 수
            있습니다.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {scripts.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleTabChange(idx)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === idx
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">#{idx + 1}</span>
            </button>
          ))}
        </motion.div>

        {/* Script Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={script.id + "-desc"}
            className="mb-6 text-center"
            {...fadeIn}
          >
            <h3 className="text-xl font-semibold text-white mb-1">
              {script.icon} {script.title}
            </h3>
            <p className="text-slate-500 text-sm">{script.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Main Content: Code + Output */}
        <AnimatePresence mode="wait">
          <motion.div
            key={script.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left: Code Editor */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60">
              {/* Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-500 text-xs font-mono ml-2">
                  error_{script.id}.m
                </span>
              </div>

              {/* Code Lines */}
              <div className="p-4 overflow-x-auto max-h-[520px] overflow-y-auto">
                <motion.div variants={stagger} initial="initial" animate="animate">
                  {script.lines.map((line, idx) => {
                    const isEmpty = line.code.trim() === "";
                    const isComment = line.code.trim().startsWith("%");
                    const isSelected = selectedLine === idx;

                    return (
                      <motion.div
                        key={idx}
                        variants={{
                          initial: { opacity: 0, x: -8 },
                          animate: { opacity: 1, x: 0 },
                        }}
                        onClick={() => {
                          if (!isEmpty) setSelectedLine(isSelected ? null : idx);
                        }}
                        className={`flex font-mono text-sm leading-6 rounded-md transition-colors duration-150 ${
                          isEmpty
                            ? ""
                            : "cursor-pointer hover:bg-slate-800/60"
                        } ${isSelected ? "bg-amber-500/10 ring-1 ring-amber-500/30" : ""}`}
                      >
                        {/* Line Number */}
                        <span className="select-none text-slate-600 w-10 shrink-0 text-right pr-4">
                          {idx + 1}
                        </span>
                        {/* Code */}
                        <span
                          className={
                            isComment
                              ? "text-slate-500"
                              : isSelected
                              ? "text-amber-300"
                              : "text-slate-300"
                          }
                        >
                          {line.code || "\u00A0"}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Selected Line Explanation (below code) */}
              <AnimatePresence>
                {selectedLine !== null && script.lines[selectedLine]?.comment && (
                  <motion.div
                    key={"explain-" + selectedLine}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-slate-800"
                  >
                    <div className="px-4 py-3 bg-amber-950/30">
                      <div className="flex items-start gap-3">
                        <span className="text-amber-400 text-xs font-mono bg-amber-500/10 px-2 py-0.5 rounded shrink-0">
                          Line {selectedLine + 1}
                        </span>
                        <p className="text-amber-200 text-sm leading-relaxed">
                          {script.lines[selectedLine].comment}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Output + Explanation List */}
            <div className="flex flex-col gap-4">
              {/* Command Window */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-orange-400/80" />
                  <span className="text-slate-500 text-xs font-mono">
                    Command Window
                  </span>
                </div>
                <div className="p-4 max-h-[260px] overflow-y-auto">
                  <pre className="text-amber-300/90 text-xs font-mono whitespace-pre-wrap leading-5">
                    {script.output}
                  </pre>
                </div>
              </div>

              {/* Line-by-line Explanation List */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 flex-1">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                  <span className="text-slate-500 text-xs font-mono">
                    Line-by-Line Explanation
                  </span>
                </div>
                <div className="p-3 max-h-[260px] overflow-y-auto space-y-1">
                  {script.lines
                    .map((line, idx) => ({ ...line, idx }))
                    .filter((l) => l.comment && l.code.trim() !== "")
                    .map((line) => (
                      <button
                        key={line.idx}
                        onClick={() =>
                          setSelectedLine(
                            selectedLine === line.idx ? null : line.idx
                          )
                        }
                        className={`w-full text-left flex items-start gap-2 px-3 py-2 rounded-lg text-xs transition-colors duration-150 ${
                          selectedLine === line.idx
                            ? "bg-amber-500/10 ring-1 ring-amber-500/20"
                            : "hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-slate-600 font-mono shrink-0 w-6 text-right">
                          {line.idx + 1}
                        </span>
                        <span
                          className={`${
                            selectedLine === line.idx
                              ? "text-amber-300"
                              : "text-slate-400"
                          } leading-relaxed`}
                        >
                          {line.comment}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tip */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-slate-600 text-sm">
            <span className="text-slate-500">Tip:</span> 코드의 각 줄을
            클릭하면 해당 줄의 동작 원리를 확인할 수 있습니다. 특히{" "}
            <span className="text-amber-400/70">수치미분과 최적 h</span>{" "}
            스크립트에서 오차가 줄었다 다시 커지는 현상을 주목하세요.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
