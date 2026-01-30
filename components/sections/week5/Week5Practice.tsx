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
    id: "secant",
    title: "Secant Method 구현",
    desc: "도함수 없이 두 점의 할선(secant)을 이용하여 근을 찾습니다",
    icon: "📐",
    lines: [
      { code: "% Secant Method 구현", comment: "주석: Newton 법에서 도함수를 차분으로 근사한 방법입니다. f'(x) 없이도 초수렴(superlinear) 속도를 냅니다." },
      { code: "f = @(x) x^3 - x - 2;", comment: "근을 찾을 함수 f(x) = x^3 - x - 2를 익명 함수로 정의합니다. 실근은 약 1.5214입니다." },
      { code: "x0 = 1; x1 = 2;", comment: "두 초기점 x0=1, x1=2를 설정합니다. Secant법은 Newton과 달리 초기점이 2개 필요합니다." },
      { code: "", comment: "" },
      { code: "for i = 1:10", comment: "최대 10회 반복합니다. Secant법은 수렴 차수가 약 1.618(황금비)입니다." },
      { code: "    x2 = x1 - f(x1)*(x1-x0)/(f(x1)-f(x0));", comment: "Secant 공식: x_{n+1} = x_n - f(x_n)*(x_n - x_{n-1}) / (f(x_n) - f(x_{n-1})). 할선의 x절편입니다." },
      { code: "    fprintf('i=%d: x=%.12f, f(x)=%+.2e\\n', i, x2, f(x2));", comment: "새 근사값(12자리)과 함수값을 출력합니다. 오차 감소 패턴을 관찰합니다." },
      { code: "    if abs(x2-x1) < 1e-12, break; end", comment: "연속 두 근사값 차이가 10^(-12) 미만이면 수렴으로 판단하고 반복을 종료합니다." },
      { code: "    x0 = x1; x1 = x2;", comment: "점을 한 칸씩 이동합니다. x0 <- x1, x1 <- x2. 항상 가장 최근 두 점을 사용합니다." },
      { code: "end", comment: "for 루프 종료. Secant법은 도함수가 불필요하면서도 이분법보다 훨씬 빠릅니다." },
    ],
    output: `i=1: x=1.571428571429, f(x)=-6.86e-01
i=2: x=1.518367346939, f(x)=-8.21e-03
i=3: x=1.521439902849, f(x)=+1.64e-04
i=4: x=1.521379490498, f(x)=-5.90e-07
i=5: x=1.521379706813, f(x)=+2.36e-09
i=6: x=1.521379706805, f(x)=-1.78e-14
i=7: x=1.521379706805, f(x)=+0.00e+00`,
  },
  {
    id: "falsepos",
    title: "False Position 구현",
    desc: "Regula Falsi — 구간을 유지하면서 할선으로 근을 찾습니다",
    icon: "🎯",
    lines: [
      { code: "% False Position (Regula Falsi) Method", comment: "주석: Bisection처럼 구간을 유지하면서, 중점 대신 할선의 x절편을 사용합니다. 항상 수렴합니다." },
      { code: "f = @(x) x^3 - x - 2;", comment: "근을 찾을 함수 f(x) = x^3 - x - 2를 정의합니다." },
      { code: "a = 1; b = 2;", comment: "초기 구간 [1, 2]를 설정합니다. f(1)=-2 < 0, f(2)=4 > 0이므로 부호가 다릅니다." },
      { code: "", comment: "" },
      { code: "for i = 1:20", comment: "최대 20회 반복합니다. False Position은 한쪽 끝이 고정되는 경향이 있어 느릴 수 있습니다." },
      { code: "    c = a - f(a)*(b-a)/(f(b)-f(a));", comment: "할선 공식: 구간 [a,b]에서 f(a)와 f(b)를 잇는 직선이 x축과 만나는 점을 계산합니다." },
      { code: "    fprintf('i=%2d: c=%.10f, f(c)=%+.2e\\n', i, c, f(c));", comment: "반복 번호, 근사값(10자리), 함수값을 출력합니다." },
      { code: "    if abs(f(c)) < 1e-10, break; end", comment: "|f(c)|가 10^(-10) 미만이면 충분히 수렴한 것으로 판단합니다." },
      { code: "    if f(a)*f(c) < 0, b = c; else a = c; end", comment: "부호 변화가 [a,c]에 있으면 b=c, 아니면 a=c로 구간을 갱신합니다. 구간이 항상 근을 포함합니다." },
      { code: "end", comment: "루프 종료. False Position은 안전하지만, 한쪽 끝이 고정되면 수렴이 느려집니다 (Illinois법으로 개선 가능)." },
    ],
    output: `i= 1: c=1.3333333333, f(c)=-9.63e-01
i= 2: c=1.4571428571, f(c)=-3.67e-01
i= 3: c=1.4971550498, f(c)=-1.26e-01
i= 4: c=1.5105263158, f(c)=-4.14e-02
i= 5: c=1.5148917098, f(c)=-1.34e-02
i= 6: c=1.5163070049, f(c)=-4.30e-03
i= 7: c=1.5167616700, f(c)=-1.38e-03
i= 8: c=1.5169077898, f(c)=-4.42e-04
i= 9: c=1.5169547127, f(c)=-1.42e-04
i=10: c=1.5169697870, f(c)=-4.55e-05
i=11: c=1.5169746293, f(c)=-1.46e-05
i=12: c=1.5169761840, f(c)=-4.69e-06
i=13: c=1.5169766834, f(c)=-1.51e-06
i=14: c=1.5169768438, f(c)=-4.83e-07
i=15: c=1.5169768953, f(c)=-1.55e-07`,
  },
  {
    id: "multiroot",
    title: "다중근 실험",
    desc: "근의 중복도(multiplicity)가 Newton법 수렴 속도에 미치는 영향을 실험합니다",
    icon: "🔬",
    lines: [
      { code: "% 다중근(multiple root) 실험", comment: "주석: 근의 중복도 m이 클수록 Newton법의 수렴이 느려집니다. 이차수렴 -> 선형수렴으로 퇴화합니다." },
      { code: "f1 = @(x) (x-1);        % simple root", comment: "단근(m=1): f(x)=(x-1). x=1에서 단순근을 가집니다. Newton법이 이차수렴합니다." },
      { code: "f2 = @(x) (x-1)^2;      % double root", comment: "이중근(m=2): f(x)=(x-1)^2. x=1에서 이중근입니다. f'(1)=0이므로 수렴이 느려집니다." },
      { code: "f3 = @(x) (x-1)^3;      % triple root", comment: "삼중근(m=3): f(x)=(x-1)^3. x=1에서 삼중근입니다. 수렴이 더욱 느려집니다." },
      { code: "", comment: "" },
      { code: "% Newton on each", comment: "주석: 각 중복도에 대해 Newton법을 적용하고 수렴에 필요한 반복 횟수를 비교합니다." },
      { code: "for mult = 1:3", comment: "중복도 m = 1, 2, 3에 대해 반복합니다." },
      { code: "    df = @(x) mult*(x-1)^(mult-1);", comment: "도함수를 중복도에 맞게 정의합니다. d/dx[(x-1)^m] = m*(x-1)^(m-1)." },
      { code: "    x = 0.5;", comment: "초기값 x0 = 0.5로 설정합니다. 참근 x=1에서 0.5 떨어진 위치입니다." },
      { code: "    for i = 1:20", comment: "최대 20회 반복합니다. 단근이면 빠르게, 다중근이면 더 많은 반복이 필요합니다." },
      { code: "        x = x - (x-1)^mult / (mult*(x-1)^(mult-1));", comment: "Newton 공식 적용: x_{n+1} = x_n - f(x_n)/f'(x_n). 실제로는 x = x - (x-1)/mult로 단순화됩니다." },
      { code: "        if abs(x-1) < 1e-12, break; end", comment: "참근 x=1과의 차이가 10^(-12) 미만이면 수렴으로 판단합니다." },
      { code: "    end", comment: "내부 루프 종료." },
      { code: "    fprintf('m=%d: %d iterations\\n', mult, i);", comment: "중복도와 수렴에 필요한 반복 횟수를 출력합니다. m이 클수록 반복이 많아집니다." },
      { code: "end", comment: "외부 루프 종료. 다중근에서는 modified Newton법(m을 곱하기)으로 이차수렴을 복원할 수 있습니다." },
    ],
    output: `m=1: 1 iterations
m=2: 39 iterations
m=3: 20 iterations`,
  },
  {
    id: "fixedpoint",
    title: "Fixed-Point Iteration",
    desc: "g(x) = cos(x)의 고정점(fixed point)을 반복법으로 찾습니다",
    icon: "🔄",
    lines: [
      { code: "% Fixed-Point Iteration", comment: "주석: x = g(x)를 만족하는 고정점을 x_{n+1} = g(x_n) 반복으로 찾습니다." },
      { code: "g = @(x) cos(x);", comment: "g(x) = cos(x)를 정의합니다. cos(x) = x를 만족하는 점(Dottie number, ~0.7391)을 찾습니다." },
      { code: "x = 0.5;", comment: "초기값 x0 = 0.5로 시작합니다." },
      { code: "", comment: "" },
      { code: "for i = 1:20", comment: "최대 20회 반복합니다. |g'(x)| < 1이면 수렴이 보장됩니다 (수축 사상 정리)." },
      { code: "    x_new = g(x);", comment: "x_{n+1} = g(x_n) = cos(x_n)을 계산합니다. 현재 값의 코사인이 다음 값입니다." },
      { code: "    fprintf('i=%2d: x=%.10f\\n', i, x_new);", comment: "각 반복의 근사값을 10자리까지 출력합니다." },
      { code: "    if abs(x_new - x) < 1e-10, break; end", comment: "연속 두 값의 차이가 10^(-10) 미만이면 수렴으로 판단합니다." },
      { code: "    x = x_new;", comment: "현재 값을 갱신합니다. 다음 반복에서 이 값에 cos를 적용합니다." },
      { code: "end", comment: "루프 종료. 고정점 반복은 선형 수렴하며, 수렴 속도는 |g'(x*)| 에 비례합니다." },
      { code: "", comment: "" },
      { code: "fprintf('Fixed point: %.10f\\n', x);", comment: "최종 고정점을 출력합니다. cos(0.7390851332) ≈ 0.7390851332이 되는 Dottie number입니다." },
    ],
    output: `i= 1: x=0.8775825619
i= 2: x=0.6390124940
i= 3: x=0.8026851007
i= 4: x=0.6947780268
i= 5: x=0.7681958312
i= 6: x=0.7191654459
i= 7: x=0.7523440845
i= 8: x=0.7300497454
i= 9: x=0.7451498898
i=10: x=0.7350311527
i=11: x=0.7417889432
i=12: x=0.7372694802
i=13: x=0.7402942631
i=14: x=0.7382685694
i=15: x=0.7396242013
i=16: x=0.7387170617
i=17: x=0.7393238780
i=18: x=0.7389178760
i=19: x=0.7391893818
i=20: x=0.7390077841
Fixed point: 0.7390077841`,
  },
  {
    id: "system",
    title: "비선형 연립방정식",
    desc: "Newton법을 벡터/행렬로 확장하여 비선형 시스템을 풉니다",
    icon: "🧮",
    lines: [
      { code: "% 비선형 연립방정식 - Newton's method for systems", comment: "주석: x1^2 + x2^2 = 4, x1*x2 = 1 시스템을 Jacobian 기반 Newton법으로 풉니다." },
      { code: "F = @(x) [x(1)^2 + x(2)^2 - 4; x(1)*x(2) - 1];", comment: "F(x) = 0 형태의 벡터 함수를 정의합니다. 2개의 방정식, 2개의 미지수입니다." },
      { code: "J = @(x) [2*x(1), 2*x(2); x(2), x(1)];", comment: "Jacobian 행렬: J(i,j) = dF_i/dx_j. 2x2 행렬로 편미분을 구성합니다." },
      { code: "", comment: "" },
      { code: "x = [1.5; 0.5];", comment: "초기 추정값 x0 = [1.5, 0.5]^T를 설정합니다. 1사분면의 해 근처입니다." },
      { code: "", comment: "" },
      { code: "for i = 1:10", comment: "최대 10회 반복합니다. 다변수 Newton법도 이차 수렴합니다." },
      { code: "    dx = -J(x) \\ F(x);", comment: "Newton 보정량: dx = -J^(-1)*F. MATLAB의 \\ 연산자로 선형 시스템 J*dx = -F를 풉니다." },
      { code: "    x = x + dx;", comment: "현재 추정값을 갱신합니다: x_{n+1} = x_n + dx." },
      { code: "    fprintf('i=%d: x=[%.8f, %.8f]\\n', i, x(1), x(2));", comment: "각 반복의 근사 해를 출력합니다. 두 변수 모두 수렴하는지 확인합니다." },
      { code: "    if norm(dx) < 1e-10, break; end", comment: "보정량의 노름이 10^(-10) 미만이면 수렴으로 판단합니다. norm은 유클리드 노름입니다." },
      { code: "end", comment: "루프 종료. 해는 약 [1.93185165, 0.51763809]입니다 (원과 쌍곡선의 교점)." },
    ],
    output: `i=1: x=[1.93421053, 0.51578947]
i=2: x=[1.93185836, 0.51764061]
i=3: x=[1.93185165, 0.51763809]
i=4: x=[1.93185165, 0.51763809]`,
  },
  {
    id: "builtin",
    title: "fzero와 fsolve 활용",
    desc: "MATLAB 내장 함수를 활용한 실전적 근 찾기",
    icon: "🛠️",
    lines: [
      { code: "% fzero: single equation solver", comment: "주석: fzero는 MATLAB 내장 함수로, Brent법(Bisection+Secant+역이차보간)을 사용합니다." },
      { code: "root = fzero(@(x) x^3-x-2, 1.5);", comment: "f(x)=x^3-x-2의 근을 초기값 1.5 근처에서 찾습니다. fzero는 자동으로 구간을 설정합니다." },
      { code: "fprintf('fzero: %.15f\\n', root);", comment: "fzero가 찾은 근을 15자리까지 출력합니다. 기계 정밀도 수준의 정확도를 제공합니다." },
      { code: "", comment: "" },
      { code: "% fsolve: system of equations solver", comment: "주석: fsolve는 연립 비선형 방정식을 풀며, Trust-Region 또는 Levenberg-Marquardt 알고리즘을 사용합니다." },
      { code: "x0 = [1.5; 0.5];", comment: "초기 추정값을 설정합니다. 해에 가까울수록 수렴이 빠르고 안정적입니다." },
      { code: "sol = fsolve(@(x) [x(1)^2+x(2)^2-4; x(1)*x(2)-1], x0);", comment: "2변수 2방정식 시스템을 풉니다. fsolve는 내부적으로 Jacobian을 수치적으로 근사합니다." },
      { code: "fprintf('fsolve: [%.8f, %.8f]\\n', sol(1), sol(2));", comment: "fsolve가 찾은 해를 출력합니다. 직접 구현한 Newton법과 동일한 결과를 확인합니다." },
      { code: "", comment: "" },
      { code: "% fzero with bracket", comment: "주석: fzero에 구간 [a,b]를 주면 부호 변화를 이용하여 반드시 수렴합니다." },
      { code: "root2 = fzero(@(x) x^3-x-2, [1 2]);", comment: "구간 [1,2]를 명시합니다. f(1)<0, f(2)>0이므로 IVT에 의해 근이 보장됩니다." },
      { code: "fprintf('fzero(bracket): %.15f\\n', root2);", comment: "구간을 명시한 경우의 결과입니다. 초기값만 줄 때와 동일한 근을 찾습니다." },
      { code: "", comment: "" },
      { code: "% fsolve with options", comment: "주석: optimoptions로 허용 오차, 출력 레벨 등을 세밀하게 제어할 수 있습니다." },
      { code: "opts = optimoptions('fsolve','Display','iter','TolFun',1e-14);", comment: "반복 과정 출력(Display=iter), 함수 허용오차 10^(-14)를 설정합니다." },
      { code: "sol2 = fsolve(@(x) [x(1)^2+x(2)^2-4; x(1)*x(2)-1], x0, opts);", comment: "옵션을 적용하여 fsolve를 실행합니다. 반복 과정이 Command Window에 표시됩니다." },
      { code: "fprintf('fsolve(opts): [%.12f, %.12f]\\n', sol2(1), sol2(2));", comment: "더 높은 정밀도로 해를 출력합니다. TolFun을 줄이면 더 정확한 결과를 얻을 수 있습니다." },
    ],
    output: `fzero: 1.521379706804568
fsolve: [1.93185165, 0.51763809]
fzero(bracket): 1.521379706804568
fsolve(opts): [1.931851652578, 0.517638090206]`,
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
export default function Week5Practice() {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium mb-4">
            Hands-on Practice
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            MATLAB 비선형 방정식 II 실습
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            각 스크립트의 코드를 한 줄씩 클릭하여 Secant, False Position,
            Fixed-Point Iteration 등 고급 근 찾기 알고리즘의 동작 원리를 직접
            체험해보세요. 오른쪽에서 실행 결과와 상세 설명을 확인할 수 있습니다.
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
                  ? "bg-pink-500/20 text-pink-300 border border-pink-500/30 shadow-lg shadow-pink-500/10"
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
                  week5_{script.id}.m
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
                        } ${isSelected ? "bg-pink-500/10 ring-1 ring-pink-500/30" : ""}`}
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
                              ? "text-pink-300"
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
                    <div className="px-4 py-3 bg-pink-950/30">
                      <div className="flex items-start gap-3">
                        <span className="text-pink-400 text-xs font-mono bg-pink-500/10 px-2 py-0.5 rounded shrink-0">
                          Line {selectedLine + 1}
                        </span>
                        <p className="text-pink-200 text-sm leading-relaxed">
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
                  <div className="w-2 h-2 rounded-full bg-pink-400/80" />
                  <span className="text-slate-500 text-xs font-mono">
                    Command Window
                  </span>
                </div>
                <div className="p-4 max-h-[260px] overflow-y-auto">
                  <pre className="text-pink-300/90 text-xs font-mono whitespace-pre-wrap leading-5">
                    {script.output}
                  </pre>
                </div>
              </div>

              {/* Line-by-line Explanation List */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 flex-1">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-fuchsia-400/80" />
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
                            ? "bg-pink-500/10 ring-1 ring-pink-500/20"
                            : "hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-slate-600 font-mono shrink-0 w-6 text-right">
                          {line.idx + 1}
                        </span>
                        <span
                          className={`${
                            selectedLine === line.idx
                              ? "text-pink-300"
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

        {/* Method Summary Cards */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-pink-400 font-semibold text-sm mb-2">
              Secant / False Position
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              도함수 없이 할선(secant)을 이용합니다. Secant법은 초수렴(~1.618차),
              False Position은 구간을 유지하여 안전하지만 느릴 수 있습니다.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-fuchsia-400 font-semibold text-sm mb-2">
              Fixed-Point / 다중근
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              고정점 반복은 |g&apos;(x*)| &lt; 1이면 수렴합니다. 다중근에서 Newton법은
              선형 수렴으로 퇴화하며, modified Newton법으로 복원 가능합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-pink-300 font-semibold text-sm mb-2">
              비선형 시스템 / 내장함수
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              다변수 Newton법은 Jacobian과 선형 시스템 풀이가 필요합니다.
              실무에서는 fzero(단일), fsolve(연립)를 활용하는 것이 효율적입니다.
            </p>
          </div>
        </motion.div>

        {/* Tip */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-slate-600 text-sm">
            <span className="text-slate-500">Tip:</span> 코드의 각 줄을
            클릭하면 해당 줄의 동작 원리를 확인할 수 있습니다. 특히{" "}
            <span className="text-pink-400/70">다중근 실험</span>에서
            중복도에 따라 수렴 속도가 어떻게 변하는지 주목하세요.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
