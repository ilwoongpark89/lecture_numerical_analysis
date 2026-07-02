// 쿠키 이름 + 세션 판정 SoT (client·server 공용, 의존성 0).
export const STUDENT_COOKIE = "na_sid"; // 비-httpOnly: 클라가 학번 표시/게이트에 읽음 (위조 가능 → 식별 아님)
export const SESSION_COOKIE = "na_session"; // httpOnly 서명 세션: /api/track 가 신뢰하는 식별원본
export const ADMIN_COOKIE = "na_admin";
export const PROF_SID = "__prof__"; // 교수 열람 세션 = 추적 0

// 클라이언트 "로그인 상태" 판정 단일 함수 (홈/가드/셸 공용). na_sid 존재만으로 판정 (열람용 soft 게이트).
export function hasStudentSession(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(STUDENT_COOKIE + "="));
}

// 표시용 학번 (헤더 칩). 없으면 null. 교수 세션은 "__prof__".
export function readStudentId(): string | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(STUDENT_COOKIE + "="));
  if (!hit) return null;
  return decodeURIComponent(hit.slice(STUDENT_COOKIE.length + 1)) || null;
}
