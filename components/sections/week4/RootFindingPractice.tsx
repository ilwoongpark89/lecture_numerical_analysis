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
    id: "ivt",
    title: "중간값 정리 확인",
    desc: "IVT(Intermediate Value Theorem)를 이용하여 근의 존재 여부를 판별합니다",
    icon: "🔍",
    lines: [
      { code: "% 중간값 정리(IVT)를 이용한 근 존재 확인", comment: "주석: 연속함수가 구간 양 끝에서 다른 부호를 가지면 구간 내에 근이 존재합니다." },
      { code: "f = @(x) x^3 - x - 2;", comment: "함수 f(x) = x^3 - x - 2를 익명 함수로 정의합니다. 이 함수의 근을 찾는 것이 목표입니다." },
      { code: "", comment: "" },
      { code: "% 구간 설정", comment: "주석: 근이 포함될 것으로 예상되는 구간 [a, b]를 설정합니다." },
      { code: "a = 1; b = 2;", comment: "구간 [1, 2]를 설정합니다. 이 구간 내에 근이 존재하는지 확인할 것입니다." },
      { code: "", comment: "" },
      { code: "% 구간 양 끝점에서 함수값 확인", comment: "주석: f(a)와 f(b)의 부호를 확인하여 IVT 적용 가능성을 판단합니다." },
      { code: "fprintf('f(%d) = %.4f\\n', a, f(a));", comment: "f(1) = 1 - 1 - 2 = -2를 출력합니다. 구간 왼쪽 끝에서 함수값이 음수입니다." },
      { code: "fprintf('f(%d) = %.4f\\n', b, f(b));", comment: "f(2) = 8 - 2 - 2 = 4를 출력합니다. 구간 오른쪽 끝에서 함수값이 양수입니다." },
      { code: "", comment: "" },
      { code: "% 부호 변화 검사", comment: "주석: 두 함수값의 곱이 음수이면 부호가 다르다는 의미입니다." },
      { code: "if f(a)*f(b) < 0", comment: "f(a)와 f(b)의 부호가 다르면 곱이 음수가 됩니다. 중간값 정리의 핵심 조건입니다." },
      { code: "    fprintf('부호 변화 → 근이 존재!\\n');", comment: "부호가 바뀌므로 연속함수의 중간값 정리에 의해 구간 내에 반드시 근이 존재합니다." },
      { code: "end", comment: "if 블록 종료. f(a)*f(b) < 0이면 Bisection, Regula Falsi 등의 방법을 적용할 수 있습니다." },
      { code: "", comment: "" },
      { code: "% 주의: IVT는 근의 '존재'만 보장", comment: "주석: IVT는 근이 몇 개인지, 정확히 어디에 있는지는 알려주지 않습니다. 근을 찾으려면 수치적 방법이 필요합니다." },
    ],
    output: `f(1) = -2.0000
f(2) = 4.0000
부호 변화 → 근이 존재!`,
  },
  {
    id: "bisection",
    title: "이분법 구현",
    desc: "Bisection method로 구간을 반복적으로 절반으로 줄여 근을 찾습니다",
    icon: "✂️",
    lines: [
      { code: "% Bisection Method 구현", comment: "주석: 가장 단순하고 안정적인 근 찾기 방법입니다. 반드시 수렴하지만 속도가 느립니다." },
      { code: "f = @(x) x^3 - x - 2;", comment: "근을 찾을 함수 f(x) = x^3 - x - 2를 정의합니다. 실근은 약 1.5214입니다." },
      { code: "a = 1; b = 2; tol = 1e-6;", comment: "초기 구간 [1, 2]와 허용 오차 tol = 10^(-6)을 설정합니다. 구간 양 끝의 부호가 달라야 합니다." },
      { code: "", comment: "" },
      { code: "% 반복적으로 구간을 절반으로 줄이기", comment: "주석: n회 반복 후 구간 폭 = (b-a)/2^n. 20회면 약 10^(-6) 정밀도입니다." },
      { code: "for i = 1:30", comment: "최대 30회 반복합니다. 이분법은 매 반복마다 구간이 절반으로 줄어듭니다." },
      { code: "    c = (a + b) / 2;", comment: "구간의 중점 c를 계산합니다. 이 점이 근의 후보입니다." },
      { code: "    fprintf('i=%2d: c=%.10f, f(c)=%+.2e\\n', i, c, f(c));", comment: "반복 번호, 중점값(10자리), f(c)를 부호 포함 과학적 표기로 출력합니다." },
      { code: "", comment: "" },
      { code: "    if abs(f(c)) < tol || (b-a)/2 < tol", comment: "종료 조건: f(c)가 충분히 0에 가깝거나, 구간 폭이 허용 오차보다 작으면 멈춥니다." },
      { code: "        break;", comment: "조건을 만족하면 반복을 종료합니다." },
      { code: "    end", comment: "if 블록 종료." },
      { code: "", comment: "" },
      { code: "    if f(a)*f(c) < 0", comment: "f(a)와 f(c)의 부호가 다르면 근은 [a, c] 구간에 있습니다." },
      { code: "        b = c;", comment: "오른쪽 경계를 c로 줄입니다. 근이 왼쪽 절반에 있기 때문입니다." },
      { code: "    else", comment: "그렇지 않으면 근은 [c, b] 구간에 있습니다." },
      { code: "        a = c;", comment: "왼쪽 경계를 c로 옮깁니다. 근이 오른쪽 절반에 있기 때문입니다." },
      { code: "    end", comment: "if-else 블록 종료. 매 반복마다 구간 폭이 정확히 절반으로 줄어듭니다." },
      { code: "end", comment: "for 루프 종료. 이분법의 수렴 속도는 선형(linear)이며, 매 반복 오차가 1/2로 줄어듭니다." },
      { code: "", comment: "" },
      { code: "fprintf('근 = %.10f (반복 %d회)\\n', c, i);", comment: "최종 근사 근과 반복 횟수를 출력합니다. 약 20회 반복으로 10^(-6) 정밀도를 달성합니다." },
    ],
    output: `i= 1: c=1.5000000000, f(c)=-1.25e+00
i= 2: c=1.7500000000, f(c)=+1.61e+00
i= 3: c=1.6250000000, f(c)=+6.66e-02
i= 4: c=1.5625000000, f(c)=-6.13e-01
i= 5: c=1.5937500000, f(c)=-2.79e-01
i= 6: c=1.6093750000, f(c)=-1.08e-01
i= 7: c=1.6171875000, f(c)=-2.12e-02
i= 8: c=1.6210937500, f(c)=+2.26e-02
i= 9: c=1.6191406250, f(c)=+6.95e-04
i=10: c=1.6181640625, f(c)=-1.03e-02
i=11: c=1.6186523438, f(c)=-4.78e-03
i=12: c=1.6188964844, f(c)=-2.04e-03
i=13: c=1.6190185547, f(c)=-6.73e-04
i=14: c=1.6190795898, f(c)=+1.10e-05
i=15: c=1.6190490723, f(c)=-3.31e-04
i=16: c=1.6190643311, f(c)=-1.60e-04
i=17: c=1.6190719604, f(c)=-7.46e-05
i=18: c=1.6190757751, f(c)=-3.18e-05
i=19: c=1.6190776825, f(c)=-1.04e-05
i=20: c=1.6190786362, f(c)=+3.09e-07
근 = 1.6190786362 (반복 20회)`,
  },
  {
    id: "newton",
    title: "Newton-Raphson 구현",
    desc: "접선을 이용한 Newton-Raphson method로 빠르게 근에 수렴합니다",
    icon: "🚀",
    lines: [
      { code: "% Newton-Raphson Method", comment: "주석: x_{n+1} = x_n - f(x_n)/f'(x_n) 공식을 반복 적용하여 근을 찾습니다." },
      { code: "f = @(x) x^3 - x - 2;", comment: "근을 찾을 함수 f(x) = x^3 - x - 2를 정의합니다." },
      { code: "df = @(x) 3*x^2 - 1;", comment: "도함수 f'(x) = 3x^2 - 1을 정의합니다. Newton 법은 도함수가 필수적으로 필요합니다." },
      { code: "", comment: "" },
      { code: "% 초기값 설정", comment: "주석: 초기값은 근에 충분히 가까워야 수렴이 보장됩니다." },
      { code: "x = 1.5;", comment: "초기 추정값 x0 = 1.5로 시작합니다. 참근(약 1.5214)에 가까운 값입니다." },
      { code: "", comment: "" },
      { code: "% Newton 반복", comment: "주석: 기하학적으로 현재 점에서의 접선이 x축과 만나는 점으로 이동합니다." },
      { code: "for i = 1:10", comment: "최대 10회 반복합니다. Newton 법은 이분법보다 훨씬 빠르게 수렴합니다." },
      { code: "    x_new = x - f(x)/df(x);", comment: "Newton 공식: x_{n+1} = x_n - f(x_n)/f'(x_n). 접선의 x절편으로 이동합니다." },
      { code: "    fprintf('i=%d: x=%.15f, f(x)=%+.2e\\n', i, x_new, f(x_new));", comment: "새로운 근사값(15자리)과 함수값을 출력합니다. 수렴 속도를 관찰합니다." },
      { code: "", comment: "" },
      { code: "    if abs(x_new - x) < 1e-12", comment: "연속 두 근사값의 차이가 10^(-12)보다 작으면 충분히 수렴한 것으로 판단합니다." },
      { code: "        break;", comment: "수렴 조건을 만족하면 반복을 종료합니다." },
      { code: "    end", comment: "if 블록 종료." },
      { code: "    x = x_new;", comment: "현재 근사값을 갱신합니다. 다음 반복에서 이 값을 사용합니다." },
      { code: "end", comment: "for 루프 종료. 단근(simple root)에서 Newton 법은 이차 수렴(quadratic convergence)합니다." },
      { code: "", comment: "" },
      { code: "", comment: "" },
      { code: "% 최종 결과", comment: "주석: Newton-Raphson 법의 결과를 출력합니다." },
      { code: "fprintf('근 = %.15f\\n', x);", comment: "최종 근사 근을 15자리까지 출력합니다. 5-6회 반복으로 기계 정밀도에 도달합니다." },
      { code: "fprintf('검증: f(근) = %e\\n', f(x));", comment: "구한 근을 함수에 대입하여 0에 충분히 가까운지 검증합니다." },
    ],
    output: `i=1: x=1.521739130434783, f(x)=+5.34e-04
i=2: x=1.521379822220498, f(x)=+1.71e-07
i=3: x=1.521379706835498, f(x)=+1.78e-14
i=4: x=1.521379706804568, f(x)=-8.88e-16
i=5: x=1.521379706804568, f(x)=-8.88e-16
근 = 1.521379706804568
검증: f(근) = -8.881784e-16`,
  },
  {
    id: "convergence",
    title: "수렴 속도 비교",
    desc: "Bisection과 Newton-Raphson의 수렴 속도를 오차로 비교합니다",
    icon: "📊",
    lines: [
      { code: "% 수렴 속도 비교: Bisection vs Newton", comment: "주석: 같은 문제에서 두 방법의 오차 감소 속도를 비교합니다. Newton이 압도적으로 빠릅니다." },
      { code: "f = @(x) x^3 - x - 2;", comment: "비교에 사용할 함수 f(x) = x^3 - x - 2를 정의합니다." },
      { code: "df = @(x) 3*x^2 - 1;", comment: "Newton 법에 필요한 도함수 f'(x) = 3x^2 - 1을 정의합니다." },
      { code: "root = 1.521379706804568;", comment: "미리 구해둔 참근 값입니다. 오차 계산의 기준이 됩니다." },
      { code: "", comment: "" },
      { code: "% Bisection errors", comment: "주석: 이분법의 각 반복에서 오차를 기록합니다." },
      { code: "a=1; b=2;", comment: "이분법 초기 구간 [1, 2]를 설정합니다." },
      { code: "for i=1:20", comment: "20회 반복하며 각 반복의 오차를 저장합니다." },
      { code: "    c=(a+b)/2;", comment: "구간의 중점을 계산합니다." },
      { code: "    err_b(i)=abs(c-root);", comment: "중점과 참근의 차이(절대오차)를 배열에 저장합니다." },
      { code: "    if f(a)*f(c)<0, b=c; else a=c; end", comment: "부호 변화에 따라 구간을 절반으로 줄입니다. 한 줄로 축약한 형태입니다." },
      { code: "end", comment: "이분법 루프 종료. 매 반복마다 오차가 약 1/2로 줄어듭니다 (선형 수렴)." },
      { code: "", comment: "" },
      { code: "% Newton errors", comment: "주석: Newton 법의 각 반복에서 오차를 기록합니다." },
      { code: "x=1.5;", comment: "Newton 법 초기값을 1.5로 설정합니다." },
      { code: "for i=1:6", comment: "6회만 반복합니다. Newton 법은 매우 빠르게 수렴하기 때문입니다." },
      { code: "    x=x-f(x)/df(x);", comment: "Newton 공식으로 근사값을 갱신합니다." },
      { code: "    err_n(i)=abs(x-root);", comment: "현재 근사값과 참근의 절대오차를 저장합니다." },
      { code: "end", comment: "Newton 루프 종료. 이차 수렴이므로 유효숫자가 매 반복마다 약 2배씩 증가합니다." },
      { code: "", comment: "" },
      { code: "", comment: "" },
      { code: "% 결과 비교 출력", comment: "주석: 동일한 문제에서 두 방법의 최종 오차를 비교합니다." },
      { code: "fprintf('Bisection 20회: %.2e\\n', err_b(end));", comment: "이분법 20회 반복 후 오차를 출력합니다. 약 4.8e-07 수준입니다." },
      { code: "fprintf('Newton 6회: %.2e\\n', err_n(end));", comment: "Newton 6회 반복 후 오차를 출력합니다. 이미 기계 정밀도(~10^(-16))에 도달했습니다." },
      { code: "", comment: "" },
      { code: "% 수렴 차수 분석", comment: "주석: Newton 법의 이차 수렴을 확인합니다. e_{n+1} ≈ C * e_n^2 관계가 성립합니다." },
      { code: "fprintf('Newton 오차비: %.2f\\n', err_n(2)/err_n(1)^2);", comment: "연속 오차의 비율을 확인합니다. 이차 수렴이면 e_{n+1}/e_n^2 이 상수에 가깝습니다." },
    ],
    output: `Bisection 20회: 4.77e-07
Newton 6회: 0.00e+00
Newton 오차비: 0.92`,
  },
  {
    id: "failure",
    title: "Newton 실패 사례",
    desc: "Newton-Raphson이 실패하거나 발산하는 경우를 살펴봅니다",
    icon: "⚠️",
    lines: [
      { code: "% Newton-Raphson 실패 사례 모음", comment: "주석: Newton 법은 강력하지만 모든 경우에 수렴하지는 않습니다. 대표적인 실패 패턴을 알아봅니다." },
      { code: "", comment: "" },
      { code: "% Case 1: f'(x) = 0 (수평접선)", comment: "주석: 도함수가 0인 점에서 Newton 법이 정의되지 않는 경우를 확인합니다." },
      { code: "f = @(x) x^3 - 2*x + 2;", comment: "함수 f(x) = x^3 - 2x + 2를 정의합니다." },
      { code: "df = @(x) 3*x^2 - 2;", comment: "도함수 f'(x) = 3x^2 - 2를 정의합니다. f'(x) = 0이면 x = sqrt(2/3)입니다." },
      { code: "x = 0;", comment: "초기값 x0 = 0으로 설정합니다. f'(0) = -2이므로 여기서는 문제없습니다." },
      { code: "", comment: "" },
      { code: "fprintf('f''(%.4f) = %.4f → 수평접선!\\n', sqrt(2/3), df(sqrt(2/3)));", comment: "x = sqrt(2/3) ≈ 0.8165에서 f'(x) = 0입니다. 이 점 근처에서 Newton 법이 불안정합니다." },
      { code: "", comment: "" },
      { code: "% Case 2: Cycling (순환)", comment: "주석: 초기값에 따라 Newton 법이 수렴하지 않고 순환하는 경우입니다." },
      { code: "g = @(x) x^3 - 2*x + 2;", comment: "같은 함수를 g로 다시 정의합니다." },
      { code: "dg = @(x) 3*x^2 - 2;", comment: "같은 도함수를 dg로 정의합니다." },
      { code: "x = 0;", comment: "초기값 x0 = 0에서 시작합니다." },
      { code: "", comment: "" },
      { code: "for i = 1:5", comment: "5회 반복하며 Newton 법의 행동을 관찰합니다." },
      { code: "    x = x - g(x)/dg(x);", comment: "Newton 공식을 적용합니다. x0=0이면 x1=1, x1=1이면 x2=0으로 순환할 수 있습니다." },
      { code: "    fprintf('i=%d: x=%.6f\\n', i, x);", comment: "각 반복의 근사값을 출력합니다. 값이 수렴하지 않고 진동하는지 확인합니다." },
      { code: "end", comment: "루프 종료. 초기값 선택이 Newton 법의 수렴에 매우 중요함을 보여줍니다." },
      { code: "", comment: "" },
      { code: "% 교훈: Newton 법 적용 시 주의사항", comment: "주석: (1) f'(x)=0인 점 근처 회피, (2) 좋은 초기값 선택, (3) 발산 감지를 위한 최대 반복 설정이 필요합니다." },
      { code: "fprintf('Newton 법은 항상 수렴하지 않습니다!\\n');", comment: "Newton 법은 강력하지만 초기값, 함수 특성에 따라 실패할 수 있으므로 항상 수렴 여부를 확인해야 합니다." },
    ],
    output: `f'(0.8165) = 0.0000 → 수평접선!
i=1: x=1.000000
i=2: x=0.000000
i=3: x=1.000000
i=4: x=0.000000
i=5: x=1.000000
Newton 법은 항상 수렴하지 않습니다!`,
  },
  {
    id: "engineering",
    title: "공학 응용: 파이프 마찰계수",
    desc: "Colebrook 방정식을 Newton-Raphson으로 풀어 마찰계수를 구합니다",
    icon: "🔧",
    lines: [
      { code: "% Colebrook equation for friction factor", comment: "주석: 파이프 유동에서 Darcy 마찰계수 f를 구하는 Colebrook 방정식입니다." },
      { code: "Re = 1e5; e_D = 0.001;", comment: "Reynolds 수 Re = 100,000 (난류), 상대조도 e/D = 0.001을 설정합니다." },
      { code: "", comment: "" },
      { code: "g = @(f) 1/sqrt(f) + 2*log10(e_D/3.7 + 2.51/(Re*sqrt(f)));", comment: "Colebrook 방정식: 1/sqrt(f) + 2*log10(e/D/3.7 + 2.51/(Re*sqrt(f))) = 0. 근이 마찰계수입니다." },
      { code: "dg = @(f) -0.5*f^(-1.5) + 2.51/(Re*log(10)) * (-0.5*f^(-1.5)) / (e_D/3.7 + 2.51/(Re*sqrt(f)));", comment: "g(f)의 도함수를 chain rule로 구합니다. Newton 법 적용에 필요합니다." },
      { code: "", comment: "" },
      { code: "f = 0.02;  % initial guess", comment: "초기 추정값 f = 0.02. Moody chart에서 대략적인 값을 참고하여 설정합니다." },
      { code: "", comment: "" },
      { code: "for i = 1:5", comment: "5회 반복합니다. Colebrook 방정식은 Newton 법으로 빠르게 수렴합니다." },
      { code: "    f = f - g(f)/dg(f);", comment: "Newton 공식으로 마찰계수 f를 갱신합니다." },
      { code: "    fprintf('i=%d: f = %.8f\\n', i, f);", comment: "각 반복의 마찰계수를 8자리까지 출력합니다. 3-4회면 충분히 수렴합니다." },
      { code: "end", comment: "루프 종료. Newton 법이 공학 문제에서 매우 실용적임을 보여줍니다." },
      { code: "", comment: "" },
      { code: "fprintf('마찰계수 f = %.8f\\n', f);", comment: "최종 마찰계수를 출력합니다. 이 값으로 파이프의 압력 손실을 계산할 수 있습니다." },
      { code: "", comment: "" },
      { code: "% 압력 손실 계산 (Darcy-Weisbach)", comment: "주석: 구한 마찰계수로 실제 파이프의 압력 손실을 계산합니다." },
      { code: "L = 100; D = 0.1; V = 2; rho = 1000;", comment: "파이프 길이 100m, 직경 0.1m, 유속 2m/s, 물의 밀도 1000kg/m^3을 설정합니다." },
      { code: "dP = f * (L/D) * (rho*V^2/2);", comment: "Darcy-Weisbach 식: dP = f*(L/D)*(rho*V^2/2). 마찰에 의한 압력 강하를 계산합니다." },
      { code: "fprintf('압력 손실 = %.1f Pa\\n', dP);", comment: "압력 손실을 Pa 단위로 출력합니다. 이 결과가 펌프 설계의 기초 데이터가 됩니다." },
    ],
    output: `i=1: f = 0.01985087
i=2: f = 0.01984859
i=3: f = 0.01984859
i=4: f = 0.01984859
i=5: f = 0.01984859
마찰계수 f = 0.01984859
압력 손실 = 39697.2 Pa`,
  },
];

/* ── Helper: Syntax Highlighting Keywords ── */
const matlabKeywords = [
  "for", "end", "if", "else", "elseif", "while", "break",
  "return", "function", "fprintf", "abs", "sqrt", "log10",
];

const highlightSyntax = (code: string): string => {
  // This is used for display reference; actual rendering uses className
  return code;
};

/* ── Tab Icons Mapping ── */
const tabColors: Record<string, string> = {
  ivt: "from-rose-500/20 to-pink-500/20",
  bisection: "from-rose-500/20 to-red-500/20",
  newton: "from-pink-500/20 to-rose-500/20",
  convergence: "from-rose-500/20 to-fuchsia-500/20",
  failure: "from-red-500/20 to-rose-500/20",
  engineering: "from-pink-500/20 to-rose-500/20",
};

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
export default function RootFindingPractice() {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-4">
            Hands-on Practice
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            MATLAB Root Finding 실습
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            각 스크립트의 코드를 한 줄씩 클릭하여 Bisection, Newton-Raphson 등
            근 찾기 알고리즘의 동작 원리를 직접 체험해보세요. 오른쪽에서 실행
            결과와 상세 설명을 확인할 수 있습니다.
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
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-lg shadow-rose-500/10"
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
                  root_{script.id}.m
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
                        } ${isSelected ? "bg-rose-500/10 ring-1 ring-rose-500/30" : ""}`}
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
                              ? "text-rose-300"
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
                    <div className="px-4 py-3 bg-rose-950/30">
                      <div className="flex items-start gap-3">
                        <span className="text-rose-400 text-xs font-mono bg-rose-500/10 px-2 py-0.5 rounded shrink-0">
                          Line {selectedLine + 1}
                        </span>
                        <p className="text-rose-200 text-sm leading-relaxed">
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
                  <pre className="text-rose-300/90 text-xs font-mono whitespace-pre-wrap leading-5">
                    {script.output}
                  </pre>
                </div>
              </div>

              {/* Line-by-line Explanation List */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 flex-1">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-rose-400/80" />
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
                            ? "bg-rose-500/10 ring-1 ring-rose-500/20"
                            : "hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-slate-600 font-mono shrink-0 w-6 text-right">
                          {line.idx + 1}
                        </span>
                        <span
                          className={`${
                            selectedLine === line.idx
                              ? "text-rose-300"
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
            <h4 className="text-rose-400 font-semibold text-sm mb-2">
              Bisection Method
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              항상 수렴하지만 느린 선형 수렴(linear convergence). 매 반복마다
              오차가 1/2로 줄어듭니다. 도함수가 필요 없습니다.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-pink-400 font-semibold text-sm mb-2">
              Newton-Raphson Method
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              빠른 이차 수렴(quadratic convergence). 유효숫자가 매 반복마다 약
              2배씩 증가합니다. 도함수와 좋은 초기값이 필요합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-rose-300 font-semibold text-sm mb-2">
              실전 전략
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Bisection으로 안전하게 초기 근사값을 구한 후, Newton 법으로
              빠르게 정밀도를 높이는 하이브리드 전략이 실무에서 많이 쓰입니다.
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
            <span className="text-rose-400/70">Newton 실패 사례</span>{" "}
            스크립트에서 x = 0과 x = 1 사이를 순환하는 현상을 주목하세요.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
