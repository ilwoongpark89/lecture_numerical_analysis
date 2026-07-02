// 커리큘럼 단일 SoT — 홈 그리드 / 정적 강의(public/week{N}) / 어드민 커버리지 맵이 파생.
// 16주 학기 구조. ready = 정적 강의 HTML(public/week{N}/index.html) 저작 완료 여부(= 클릭 가능).

// 수치해석 고유 단계 — "알고리즘을 직접 돌리고/계산하고/깨뜨려본다" (기존 자료에서 도출).
// 정적 강의의 data-stage + 어드민 맵 셀 + na-track dwell. (챕터 유형에 따라 부분집합 사용 가능.)
//   문제=동기 / 원리=아이디어+점화식 / 시연=반복 스테퍼 / 직접계산=한 스텝 손계산 채점
//   수렴=차수·정지조건 / 함정=발산·순환·조건수 / 코드=MATLAB / 연습=자동채점 / 정리=요약
export const STAGES = ["문제", "원리", "시연", "직접계산", "수렴", "함정", "코드", "연습", "정리"] as const;

// 체류시간 임계 (열람 판정 = 시간 기반).
export const DWELL_SKIM_MS = 5000;
export const DWELL_STUDY_MS = 30000;

export type Chapter = { id: string; title: string };
export type Week = {
  week: number;
  title: string;
  topic: string;
  desc: string;
  ready: boolean; // 정적 강의 저작 완료 = 클릭 가능
  exam?: boolean;
  chapters: Chapter[];
};

const C = (week: number, defs: [number, string][]): Chapter[] =>
  defs.map(([n, title]) => ({ id: `${week}-${n}`, title }));

export const WEEKS: Week[] = [
  { week: 1, title: "수치해석 개요", topic: "Introduction", desc: "수치해석 개론", ready: true,
    chapters: C(1, [[1, "수치해석이란"], [2, "해석해 vs 수치해"], [3, "오차와 근사"], [4, "수치해석 절차"]]) },
  { week: 2, title: "MATLAB 기초", topic: "MATLAB Fundamentals", desc: "MATLAB 환경·문법·시각화", ready: true,
    chapters: C(2, [[1, "환경과 문법"], [2, "벡터·행렬 연산"], [3, "제어 흐름과 함수"], [4, "그래프 시각화"]]) },
  { week: 3, title: "오차", topic: "Errors", desc: "반올림 오차와 절단 오차", ready: true,
    chapters: C(3, [[1, "부동소수점 표현"], [2, "머신 엡실론과 반올림"], [3, "Taylor 급수와 절단오차"], [4, "오차 전파와 수렴차수"]]) },
  { week: 4, title: "비선형 방정식 I", topic: "Nonlinear Equations I", desc: "이분법 & Newton-Raphson", ready: true,
    chapters: C(4, [[1, "근의 존재성"], [2, "이분법"], [3, "Newton-Raphson"], [4, "수렴 속도 비교"]]) },
  { week: 5, title: "비선형 방정식 II", topic: "Nonlinear Equations II", desc: "할선법 및 응용", ready: true,
    chapters: C(5, [[1, "할선법 (Secant)"], [2, "다중근과 수정 기법"], [3, "비선형 연립계"], [4, "방법 선택 전략"]]) },
  { week: 6, title: "가우스 소거법", topic: "Gauss Elimination", desc: "가우스 소거법과 LU 분해", ready: true,
    chapters: C(6, [[1, "가우스 소거법"], [2, "부분 피벗팅"], [3, "LU 분해"], [4, "조건수와 ill-conditioning"]]) },
  { week: 7, title: "반복법", topic: "Iterative Methods", desc: "연립방정식의 반복 해법", ready: true,
    chapters: C(7, [[1, "Jacobi 반복법"], [2, "Gauss-Seidel"], [3, "수렴 조건"], [4, "SOR와 완화"]]) },
  { week: 8, title: "중간고사", topic: "Mid-term Exam", desc: "중간고사 (Weeks 1–7)", ready: false, exam: true, chapters: [] },
  { week: 9, title: "곡선 적합", topic: "Curve Fitting", desc: "최소자승법과 회귀 분석", ready: true,
    chapters: C(9, [[1, "최소자승 원리"], [2, "선형·다항 회귀"], [3, "비선형 선형화"], [4, "결정계수 R²"]]) },
  { week: 10, title: "보간법", topic: "Interpolation", desc: "Lagrange·Newton·Spline 보간", ready: true,
    chapters: C(10, [[1, "Lagrange 보간"], [2, "Newton 차분 보간"], [3, "Runge 현상"], [4, "Cubic Spline"]]) },
  { week: 11, title: "수치적분", topic: "Numerical Integration", desc: "사다리꼴·Simpson·Gauss 구적", ready: true,
    chapters: C(11, [[1, "사다리꼴 공식"], [2, "Simpson 공식"], [3, "복합 공식"], [4, "Gauss Quadrature"]]) },
  { week: 12, title: "수치미분", topic: "Numerical Differentiation", desc: "유한차분과 Richardson 외삽", ready: true,
    chapters: C(12, [[1, "전·후·중앙 차분"], [2, "고차 정확도 공식"], [3, "Richardson 외삽"], [4, "편미분 근사"]]) },
  { week: 13, title: "상미분방정식", topic: "ODE", desc: "Euler·Heun·Runge-Kutta", ready: false,
    chapters: C(13, [[1, "Euler 방법"], [2, "개선 Euler (Heun)"], [3, "Runge-Kutta (RK4)"], [4, "연립·고차 ODE"]]) },
  { week: 14, title: "편미분방정식", topic: "PDE", desc: "유한차분: 열·라플라스·파동", ready: false,
    chapters: C(14, [[1, "유한차분 개요"], [2, "열전도 (포물형)"], [3, "라플라스 (타원형)"], [4, "파동 (쌍곡형)"]]) },
  { week: 15, title: "고유값 문제", topic: "Eigenvalue Problems", desc: "거듭제곱법과 QR", ready: false,
    chapters: C(15, [[1, "고유값 문제"], [2, "거듭제곱법 (Power)"], [3, "역·shift 거듭제곱"], [4, "QR 개요"]]) },
  { week: 16, title: "기말고사", topic: "Final Exam", desc: "기말고사 (Weeks 9–15)", ready: false, exam: true, chapters: [] },
];

export const weekOf = (week: number): Week | undefined => WEEKS.find((w) => w.week === week);
export const firstReady = (): Week | undefined => WEEKS.find((w) => w.ready && !w.exam);

// 어드민 커버리지 맵: 콘텐츠 챕터가 있는(=완성된) 주차만.
export type WeekDef = { week: number; title: string; chapters: string[] };
export const CURRICULUM: WeekDef[] = WEEKS.filter((w) => w.ready && w.chapters.length > 0).map((w) => ({
  week: w.week,
  title: w.title,
  chapters: w.chapters.map((c) => c.id),
}));
