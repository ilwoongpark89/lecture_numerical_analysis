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
    id: "vars",
    title: "변수와 연산",
    desc: "기본 변수 대입과 산술/데이터 타입",
    icon: "🔢",
    lines: [
      { code: "clc; clear;", comment: "명령창을 지우고 워크스페이스의 모든 변수를 삭제합니다." },
      { code: "", comment: "" },
      { code: "% 변수 대입", comment: "주석: 변수 대입 섹션 시작을 알립니다." },
      { code: "x = 10;", comment: "변수 x에 정수 10을 대입합니다. 세미콜론(;)으로 출력을 억제합니다." },
      { code: "y = 3;", comment: "변수 y에 정수 3을 대입합니다." },
      { code: "", comment: "" },
      { code: "% 산술 연산", comment: "주석: 산술 연산 섹션 시작을 알립니다." },
      { code: "a = x + y      % 덧셈", comment: "x + y = 13. 세미콜론이 없으므로 결과가 명령창에 출력됩니다." },
      { code: "b = x - y      % 뺄셈", comment: "x - y = 7. 뺄셈 연산 결과를 b에 저장합니다." },
      { code: "c = x * y      % 곱셈", comment: "x * y = 30. 스칼라 곱셈입니다." },
      { code: "d = x / y      % 나눗셈", comment: "x / y = 3.3333... 실수 나눗셈 결과입니다." },
      { code: "e = mod(x, y)  % 나머지", comment: "mod(10, 3) = 1. 나머지 연산(modulo)입니다." },
      { code: "", comment: "" },
      { code: "% 데이터 타입", comment: "주석: 다양한 데이터 타입을 살펴봅니다." },
      { code: "name = 'MATLAB';", comment: "문자열(char 배열)을 name에 저장합니다. 작은따옴표 사용." },
      { code: "flag = true;", comment: "논리형(logical) 변수. true(1) 또는 false(0)." },
      { code: "z = 3 + 4i;     % 복소수", comment: "복소수를 생성합니다. 실수부 3, 허수부 4." },
      { code: "", comment: "" },
      { code: "% 확인", comment: "주석: 워크스페이스 확인." },
      { code: "whos", comment: "현재 워크스페이스의 모든 변수 이름, 크기, 타입, 바이트를 표시합니다." },
    ],
    output: `a =
    13

b =
     7

c =
    30

d =
    3.3333

e =
     1

  Name      Size            Bytes  Class
  a         1x1                 8  double
  b         1x1                 8  double
  c         1x1                 8  double
  d         1x1                 8  double
  e         1x1                 8  double
  flag      1x1                 1  logical
  name      1x6                12  char
  x         1x1                 8  double
  y         1x1                 8  double
  z         1x1                16  double (complex)`,
  },
  {
    id: "vectors",
    title: "벡터 연산 마스터",
    desc: "벡터 산술, 내적, 함수, 논리 인덱싱",
    icon: "➡️",
    lines: [
      { code: "clc; clear;", comment: "명령창과 워크스페이스를 초기화합니다." },
      { code: "", comment: "" },
      { code: "v = [1 2 3 4 5];", comment: "1~5 원소를 갖는 행 벡터를 생성합니다." },
      { code: "u = [10 20 30 40 50];", comment: "10~50 원소를 갖는 행 벡터를 생성합니다." },
      { code: "", comment: "" },
      { code: "% 벡터 산술", comment: "주석: 벡터의 원소별 연산을 수행합니다." },
      { code: "sum_vu = v + u", comment: "원소별 덧셈: [11 22 33 44 55]. 같은 크기의 벡터끼리 +." },
      { code: "diff_vu = v - u", comment: "원소별 뺄셈: [-9 -18 -27 -36 -45]." },
      { code: "prod_vu = v .* u        % 원소별 곱", comment: ".* 연산자로 원소별 곱셈: [10 40 90 160 250]." },
      { code: "div_vu = u ./ v          % 원소별 나눗셈", comment: "./ 연산자로 원소별 나눗셈: [10 10 10 10 10]." },
      { code: "", comment: "" },
      { code: "% 내적 (dot product)", comment: "주석: 두 벡터의 내적을 계산합니다." },
      { code: "dot_result = dot(v, u)   % = sum(v .* u)", comment: "dot 함수로 내적: 1*10+2*20+3*30+4*40+5*50 = 550." },
      { code: "% 또는", comment: "주석: 내적을 수동으로 계산하는 방법." },
      { code: "dot_manual = sum(v .* u)", comment: "원소별 곱의 합으로 내적을 수동 계산: 550." },
      { code: "", comment: "" },
      { code: "% 벡터 함수", comment: "주석: 자주 쓰는 벡터 내장 함수들." },
      { code: "total = sum(v)", comment: "벡터 원소의 합: 1+2+3+4+5 = 15." },
      { code: "avg = mean(v)", comment: "벡터 원소의 평균: 15/5 = 3." },
      { code: "mx = max(v)", comment: "벡터의 최댓값: 5." },
      { code: "sorted = sort(u, 'descend')", comment: "내림차순 정렬: [50 40 30 20 10]." },
      { code: "", comment: "" },
      { code: "% 논리 인덱싱", comment: "주석: 조건에 맞는 원소만 추출하는 강력한 기법." },
      { code: "mask = v > 2             % [0 0 1 1 1]", comment: "각 원소가 2보다 큰지 논리 배열로 반환합니다." },
      { code: "filtered = v(mask)       % [3 4 5]", comment: "논리 인덱싱으로 true인 위치의 원소만 추출합니다." },
    ],
    output: `sum_vu =
    11    22    33    44    55

diff_vu =
    -9   -18   -27   -36   -45

prod_vu =
    10    40    90   160   250

div_vu =
    10    10    10    10    10

dot_result =
   550

dot_manual =
   550

total =
    15

avg =
     3

mx =
     5

sorted =
    50    40    30    20    10

mask =
  0  0  1  1  1

filtered =
     3     4     5`,
  },
  {
    id: "matrix",
    title: "행렬 마법",
    desc: "행렬 곱, 역행렬, 연립방정식",
    icon: "🧮",
    lines: [
      { code: "clc; clear;", comment: "명령창과 워크스페이스를 초기화합니다." },
      { code: "", comment: "" },
      { code: "A = [1 2; 3 4];", comment: "2x2 행렬 A를 생성합니다. 세미콜론으로 행을 구분합니다." },
      { code: "B = [5 6; 7 8];", comment: "2x2 행렬 B를 생성합니다." },
      { code: "", comment: "" },
      { code: "% 행렬 곱 vs 원소별 곱", comment: "주석: MATLAB에서 가장 중요한 구분 중 하나!" },
      { code: "C1 = A * B       % 행렬 곱셈", comment: "행렬 곱: [1*5+2*7, 1*6+2*8; 3*5+4*7, 3*6+4*8] = [19 22; 43 50]." },
      { code: "C2 = A .* B      % 원소별 곱셈", comment: "원소별 곱: [1*5 2*6; 3*7 4*8] = [5 12; 21 32]." },
      { code: "", comment: "" },
      { code: "% 전치, 역행렬, 행렬식", comment: "주석: 행렬의 주요 연산 3가지." },
      { code: "At = A'", comment: "전치행렬: 행과 열을 바꿉니다. [1 3; 2 4]." },
      { code: "Ainv = inv(A)", comment: "역행렬: A^(-1)을 계산합니다. [-2 1; 1.5 -0.5]." },
      { code: "d = det(A)", comment: "행렬식: det(A) = 1*4 - 2*3 = -2." },
      { code: "", comment: "" },
      { code: "% 검증: A * inv(A) = I", comment: "주석: 역행렬의 정의를 검증합니다." },
      { code: "check = A * Ainv", comment: "A * A^(-1) = 단위행렬 [1 0; 0 1] (부동소수점 오차 가능)." },
      { code: "", comment: "" },
      { code: "% 연립방정식 풀기: Ax = b", comment: "주석: 선형 연립방정식을 행렬로 표현합니다." },
      { code: "% 2x + 3y = 8", comment: "첫 번째 방정식." },
      { code: "% 4x + y  = 6", comment: "두 번째 방정식." },
      { code: "A_eq = [2 3; 4 1];", comment: "계수 행렬을 구성합니다." },
      { code: "b_eq = [8; 6];", comment: "우변 벡터(열 벡터)를 구성합니다." },
      { code: "x_sol = A_eq \\ b_eq     % backslash 연산자!", comment: "백슬래시(\\) 연산자로 Ax=b를 효율적으로 풉니다." },
      { code: "", comment: "" },
      { code: "fprintf('x = %.2f, y = %.2f\\n', x_sol(1), x_sol(2));", comment: "fprintf로 해를 포맷팅하여 출력합니다. x=1, y=2." },
    ],
    output: `C1 =
    19    22
    43    50

C2 =
     5    12
    21    32

At =
     1     3
     2     4

Ainv =
   -2.0000    1.0000
    1.5000   -0.5000

d =
    -2

check =
    1.0000         0
         0    1.0000

x_sol =
    1.0000
    2.0000

x = 1.00, y = 2.00`,
  },
  {
    id: "control",
    title: "제어문 연습",
    desc: "if-else, for, while 제어 구조",
    icon: "🔀",
    lines: [
      { code: "clc; clear;", comment: "명령창과 워크스페이스를 초기화합니다." },
      { code: "", comment: "" },
      { code: "% 1. if-elseif-else: 학점 판정", comment: "주석: 조건 분기문으로 학점을 결정합니다." },
      { code: "score = 85;", comment: "점수를 85로 설정합니다." },
      { code: "if score >= 90", comment: "점수가 90 이상이면 아래 블록을 실행합니다." },
      { code: "    grade = 'A';", comment: "90점 이상이면 학점 A." },
      { code: "elseif score >= 80", comment: "위 조건이 거짓이고, 80 이상이면 이 블록을 실행합니다." },
      { code: "    grade = 'B';", comment: "80~89점이면 학점 B. score=85이므로 여기에 해당됩니다." },
      { code: "elseif score >= 70", comment: "위 조건들이 모두 거짓이고, 70 이상이면 실행합니다." },
      { code: "    grade = 'C';", comment: "70~79점이면 학점 C." },
      { code: "else", comment: "위의 모든 조건이 거짓일 때 실행됩니다." },
      { code: "    grade = 'F';", comment: "70점 미만이면 학점 F." },
      { code: "end", comment: "if 블록의 끝을 나타냅니다." },
      { code: "fprintf('점수: %d → 학점: %s\\n', score, grade);", comment: "fprintf로 점수와 학점을 출력합니다. %d는 정수, %s는 문자열." },
      { code: "", comment: "" },
      { code: "% 2. for: 구구단 5단", comment: "주석: for 반복문으로 구구단을 출력합니다." },
      { code: "fprintf('\\n=== 구구단 5단 ===\\n');", comment: "섹션 제목을 출력합니다. \\n은 줄바꿈." },
      { code: "for i = 1:9", comment: "i가 1부터 9까지 1씩 증가하며 반복합니다." },
      { code: "    fprintf('5 x %d = %2d\\n', i, 5*i);", comment: "%2d는 2자리 정수로 출력. 5*i 결과를 계산합니다." },
      { code: "end", comment: "for 루프의 끝." },
      { code: "", comment: "" },
      { code: "% 3. while: 2^n > 1000 인 최소 n 찾기", comment: "주석: while 반복문으로 조건을 만족할 때까지 반복합니다." },
      { code: "n = 0;", comment: "n을 0으로 초기화합니다." },
      { code: "while 2^n <= 1000", comment: "2^n이 1000 이하인 동안 반복합니다." },
      { code: "    n = n + 1;", comment: "n을 1씩 증가시킵니다." },
      { code: "end", comment: "while 루프의 끝. 조건이 거짓이 되면 빠져나옵니다." },
      { code: "fprintf('\\n2^%d = %d > 1000\\n', n, 2^n);", comment: "n=10, 2^10=1024. 1000을 초과하는 최소 n입니다." },
    ],
    output: `점수: 85 → 학점: B

=== 구구단 5단 ===
5 x 1 =  5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
5 x 6 = 30
5 x 7 = 35
5 x 8 = 40
5 x 9 = 45

2^10 = 1024 > 1000`,
  },
  {
    id: "functions",
    title: "함수 만들기",
    desc: "사용자 정의 함수와 익명 함수",
    icon: "⚙️",
    lines: [
      { code: "% === myfunction.m ===", comment: "주석: MATLAB 함수는 별도의 .m 파일에 저장합니다." },
      { code: "% function 출력 = 함수이름(입력)", comment: "함수 선언 문법입니다. function 키워드로 시작합니다." },
      { code: "%   함수 본문", comment: "함수 내부에 실행할 코드를 작성합니다." },
      { code: "% end", comment: "함수 블록의 끝을 나타냅니다." },
      { code: "", comment: "" },
      { code: "% 예제 1: 화씨→섭씨 변환 함수", comment: "주석: 온도 변환 함수를 만들어봅니다." },
      { code: "% (파일명: f_to_c.m)", comment: "함수 이름과 파일 이름이 일치해야 합니다." },
      { code: "function c = f_to_c(f)", comment: "입력: 화씨 온도 f, 출력: 섭씨 온도 c." },
      { code: "    c = (f - 32) * 5/9;", comment: "화씨→섭씨 변환 공식: C = (F-32) x 5/9." },
      { code: "end", comment: "함수 끝." },
      { code: "", comment: "" },
      { code: "% 사용법:", comment: "주석: 명령창에서 함수를 호출합니다." },
      { code: "temp_c = f_to_c(212)    % → 100", comment: "물의 끓는점 212°F = 100°C." },
      { code: "temp_c2 = f_to_c(98.6)  % → 37", comment: "사람 체온 98.6°F = 37°C." },
      { code: "", comment: "" },
      { code: "% 예제 2: 벡터의 통계 요약 함수", comment: "주석: 다중 출력값을 반환하는 함수입니다." },
      { code: "function [avg, sd, mn, mx] = stats(x)", comment: "대괄호로 여러 출력값을 지정합니다." },
      { code: "    avg = mean(x);", comment: "평균을 계산합니다." },
      { code: "    sd = std(x);", comment: "표준편차를 계산합니다." },
      { code: "    mn = min(x);", comment: "최솟값을 구합니다." },
      { code: "    mx = max(x);", comment: "최댓값을 구합니다." },
      { code: "end", comment: "함수 끝." },
      { code: "", comment: "" },
      { code: "% 사용법:", comment: "주석: 다중 출력 함수 호출." },
      { code: "data = [85 90 78 92 88 95 70];", comment: "학생 점수 데이터 벡터를 생성합니다." },
      { code: "[a, s, lo, hi] = stats(data)", comment: "4개의 출력값을 한번에 받습니다." },
      { code: "", comment: "" },
      { code: "% 예제 3: 익명 함수 (Anonymous function)", comment: "주석: 파일 없이 간단한 함수를 즉석에서 만듭니다." },
      { code: "square = @(x) x.^2;", comment: "@(입력) 표현식 형태. .^2로 원소별 제곱." },
      { code: "result = square(5)       % → 25", comment: "스칼라 입력: 5^2 = 25." },
      { code: "result2 = square([1 2 3 4]) % → [1 4 9 16]", comment: "벡터 입력도 가능: 원소별 제곱." },
    ],
    output: `temp_c =
   100

temp_c2 =
   37.0000

a =
   85.4286

s =
    8.9974

lo =
    70

hi =
    95

result =
    25

result2 =
     1     4     9    16`,
  },
  {
    id: "projectile",
    title: "종합 실습: 포물선 운동",
    desc: "물리 시뮬레이션과 그래프 그리기",
    icon: "🎯",
    lines: [
      { code: "clc; clear;", comment: "명령창과 워크스페이스를 초기화합니다." },
      { code: "", comment: "" },
      { code: "% 매개변수", comment: "주석: 포물선 운동의 초기 조건을 설정합니다." },
      { code: "v0 = 30;          % 초기 속도 (m/s)", comment: "발사 초기 속도를 30 m/s로 설정합니다." },
      { code: "theta = 45;       % 발사 각도 (도)", comment: "발사 각도를 45도로 설정합니다 (최대 사거리 각도)." },
      { code: "g = 9.81;         % 중력가속도", comment: "중력가속도 g = 9.81 m/s^2 (지구 표면)." },
      { code: "", comment: "" },
      { code: "% 라디안 변환", comment: "주석: MATLAB 삼각함수는 라디안을 사용합니다." },
      { code: "theta_rad = theta * pi / 180;", comment: "45도를 라디안으로: 45 * pi/180 = pi/4 ≈ 0.7854." },
      { code: "", comment: "" },
      { code: "% 속도 성분", comment: "주석: 초기 속도를 수평/수직 성분으로 분해합니다." },
      { code: "vx = v0 * cos(theta_rad);", comment: "수평 속도: 30*cos(45°) ≈ 21.21 m/s." },
      { code: "vy = v0 * sin(theta_rad);", comment: "수직 속도: 30*sin(45°) ≈ 21.21 m/s." },
      { code: "", comment: "" },
      { code: "% 체공 시간, 최대 높이, 수평 거리", comment: "주석: 포물선 운동의 주요 물리량을 계산합니다." },
      { code: "t_flight = 2 * vy / g;", comment: "체공 시간: 2*vy/g ≈ 4.33초. 올라갔다 내려오는 시간." },
      { code: "h_max = vy^2 / (2*g);", comment: "최대 높이: vy^2/(2g) ≈ 22.94m. 꼭짓점 높이." },
      { code: "range = vx * t_flight;", comment: "수평 거리(사거리): vx*t ≈ 91.74m." },
      { code: "", comment: "" },
      { code: "fprintf('체공 시간: %.2f s\\n', t_flight);", comment: "체공 시간을 소수점 2자리로 출력합니다." },
      { code: "fprintf('최대 높이: %.2f m\\n', h_max);", comment: "최대 높이를 출력합니다." },
      { code: "fprintf('수평 거리: %.2f m\\n', range);", comment: "수평 사거리를 출력합니다." },
      { code: "", comment: "" },
      { code: "% 궤적 그리기", comment: "주석: 포물선 궤적을 시각화합니다." },
      { code: "t = linspace(0, t_flight, 100);", comment: "0~체공시간을 100등분한 시간 벡터를 생성합니다." },
      { code: "x = vx * t;", comment: "각 시간의 수평 위치: x = vx * t." },
      { code: "y = vy * t - 0.5*g*t.^2;", comment: "각 시간의 수직 위치: y = vy*t - (1/2)g*t^2." },
      { code: "", comment: "" },
      { code: "figure;", comment: "새 그래프 창을 엽니다." },
      { code: "plot(x, y, 'b-', 'LineWidth', 2);", comment: "파란 실선으로 궤적을 그립니다. 선 두께 2." },
      { code: "hold on;", comment: "현재 그래프 위에 추가로 그릴 수 있게 합니다." },
      { code: "plot(range/2, h_max, 'r*', 'MarkerSize', 15);", comment: "최고점에 빨간 별 마커를 표시합니다." },
      { code: "hold off;", comment: "추가 그리기 모드를 해제합니다." },
      { code: "xlabel('수평 거리 (m)');", comment: "x축 레이블을 설정합니다." },
      { code: "ylabel('높이 (m)');", comment: "y축 레이블을 설정합니다." },
      { code: "title(sprintf('포물선 운동 (v_0=%.0f m/s, θ=%.0f°)', v0, theta));", comment: "sprintf로 변수값을 포함한 제목을 생성합니다." },
      { code: "grid on;", comment: "격자를 표시합니다." },
      { code: "legend('궤적', '최고점');", comment: "범례를 추가합니다. 각 plot에 대응하는 이름." },
    ],
    output: `체공 시간: 4.33 s
최대 높이: 22.94 m
수평 거리: 91.74 m

(Figure 창에 포물선 궤적 그래프가 표시됩니다)
  - 파란 실선: 포물선 궤적
  - 빨간 별(*): 최고점 (45.87m, 22.94m)
  - x축: 수평 거리 (0 ~ 91.74m)
  - y축: 높이 (0 ~ 22.94m)`,
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
export default function MatlabPracticeW2() {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            Hands-on Practice
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            MATLAB 실습 스크립트
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            각 스크립트의 코드를 한 줄씩 클릭하여 동작 원리를 이해해보세요.
            오른쪽에서 실행 결과와 상세 설명을 확인할 수 있습니다.
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
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
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
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50">
              {/* Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-500 text-xs font-mono ml-2">
                  script_{script.id}.m
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
                        } ${isSelected ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : ""}`}
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
                              ? "text-emerald-300"
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
                    <div className="px-4 py-3 bg-emerald-950/30">
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-400 text-xs font-mono bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                          Line {selectedLine + 1}
                        </span>
                        <p className="text-emerald-200 text-sm leading-relaxed">
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
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-amber-400/80" />
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
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 flex-1">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
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
                            ? "bg-emerald-500/10 ring-1 ring-emerald-500/20"
                            : "hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-slate-600 font-mono shrink-0 w-6 text-right">
                          {line.idx + 1}
                        </span>
                        <span
                          className={`${
                            selectedLine === line.idx
                              ? "text-emerald-300"
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
            클릭하면 해당 줄의 동작 원리를 확인할 수 있습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
