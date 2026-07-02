// 커리큘럼 단일 SoT — 홈 그리드 / 강의 셸(섹션 추적) / 어드민 커버리지 맵이 모두 여기서 파생.
// (No hardcoding: 주차·섹션 목록을 각 소비처가 따로 나열하지 않는다.)

export const STAGES = ["학습", "점검"] as const;

// 체류시간 임계 (열람 판정 = 시간 기반, 화살표 연타/스크롤 ≠ 학습).
export const DWELL_SKIM_MS = 5000; // <5s = 연타/스킴
export const DWELL_STUDY_MS = 30000; // ≥30s = 실제 학습

export type Section = { id: string; title: string };
export type Week = {
  week: number;
  title: string; // 한글 짧은 제목
  topic: string; // English topic
  desc: string; // 한 줄 설명
  ready: boolean; // 강의 페이지 완성 여부
  exam?: boolean;
  sections: Section[]; // 추적 단위 (시험/미완성 주차는 [])
};

const S = (week: number, titles: string[]): Section[] =>
  titles.map((title, i) => ({ id: `${week}-${i + 1}`, title }));

export const WEEKS: Week[] = [
  {
    week: 1, title: "수치해석 개요", topic: "Introduction", desc: "수치해석 개론", ready: true,
    sections: S(1, ["수치해석이란", "해석해 vs 수치해", "수치해석 절차", "해석·수치 비교", "MATLAB 맛보기", "공학 응용 사례", "강의 로드맵"]),
  },
  {
    week: 2, title: "MATLAB 기초", topic: "MATLAB Fundamentals", desc: "MATLAB 환경·문법·시각화", ready: true,
    sections: S(2, ["MATLAB 개요", "기본 문법", "벡터·행렬", "제어 흐름", "함수 작성", "그래프", "실습", "Python 비교"]),
  },
  {
    week: 3, title: "오차", topic: "Errors", desc: "반올림 오차와 절단 오차", ready: true,
    sections: S(3, ["부동소수점", "머신 엡실론", "Taylor 급수", "오차 전파", "실습", "Python 비교"]),
  },
  {
    week: 4, title: "비선형 방정식 I", topic: "Nonlinear Equations I", desc: "이분법 & Newton-Raphson", ready: true,
    sections: S(4, ["근의 존재성", "이분법", "Newton-Raphson", "수렴 비교", "실습", "Python"]),
  },
  {
    week: 5, title: "비선형 방정식 II", topic: "Nonlinear Equations II", desc: "Secant Method 및 응용", ready: true,
    sections: S(5, ["Secant Method", "수정 기법", "다중근", "비선형 연립", "실습", "Python"]),
  },
  {
    week: 6, title: "가우스 소거법", topic: "Gauss Elimination", desc: "가우스 소거법과 LU 분해", ready: true,
    sections: S(6, ["연립방정식 개요", "가우스 소거법", "부분 피벗팅", "LU 분해", "실습", "Python"]),
  },
  {
    week: 7, title: "반복법", topic: "Iterative Methods", desc: "연립방정식의 반복 해법", ready: true,
    sections: S(7, ["Jacobi 반복법", "Gauss-Seidel", "수렴 조건", "SOR", "실습", "Python"]),
  },
  {
    week: 8, title: "중간고사", topic: "Mid-term Exam", desc: "중간고사 (Weeks 1–7)", ready: false, exam: true,
    sections: [],
  },
  {
    week: 9, title: "곡선 적합", topic: "Curve Fitting", desc: "최소자승법과 회귀 분석", ready: true,
    sections: S(9, ["최소자승 원리", "선형 회귀", "비선형 선형화", "결정계수 R²", "실습", "Python"]),
  },
  {
    week: 10, title: "보간법", topic: "Interpolation", desc: "Lagrange·Newton·Spline 보간", ready: true,
    sections: S(10, ["Lagrange 보간", "Newton 차분 보간", "Runge 현상", "Cubic Spline", "실습", "Python"]),
  },
  {
    week: 11, title: "수치적분", topic: "Numerical Integration", desc: "사다리꼴·Simpson·Gauss 구적", ready: true,
    sections: S(11, ["사다리꼴 공식", "Simpson 공식", "복합 공식", "Gauss Quadrature", "실습", "Python"]),
  },
  {
    week: 12, title: "수치미분", topic: "Numerical Differentiation", desc: "유한차분과 Richardson 외삽", ready: false,
    sections: [],
  },
  {
    week: 13, title: "상미분방정식", topic: "ODE", desc: "Euler·Heun·Runge-Kutta", ready: false,
    sections: [],
  },
  {
    week: 14, title: "편미분·고유값", topic: "PDE & Eigenvalues", desc: "유한차분과 Power Method", ready: false,
    sections: [],
  },
  {
    week: 15, title: "기말고사", topic: "Final Exam", desc: "기말고사 (Weeks 9–14)", ready: false, exam: true,
    sections: [],
  },
];

export const weekOf = (week: number): Week | undefined => WEEKS.find((w) => w.week === week);

// 어드민 커버리지 맵: 추적 섹션이 있는(=완성된) 주차만.
export type WeekDef = { week: number; title: string; chapters: string[] };
export const CURRICULUM: WeekDef[] = WEEKS.filter((w) => w.sections.length > 0).map((w) => ({
  week: w.week,
  title: w.title,
  chapters: w.sections.map((s) => s.id),
}));
