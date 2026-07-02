import type { NextRequest } from "next/server";

// x-forwarded-for 첫 IP 단일 파싱 (auth / admin/login 공용 — 표현 통일).
export function ipFromRequest(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// 인스턴스-메모리 best-effort 레이트리밋.
// ⚠ Vercel 서버리스는 요청이 여러 인스턴스로 분산 → 전역 보장 아님 (drive-by friction 용).
// 식별 위조·로그인 무차별의 load-bearing 방어는 서명세션(verifySession) + DB 스로틀(auth_throttle_hit).
const buckets = new Map<string, { n: number; resetAt: number }>();

/** 현재 키가 한도 초과 상태면 true (차단). */
export function isRateLimited(key: string, max: number): boolean {
  const rec = buckets.get(key);
  return !!rec && rec.resetAt > Date.now() && rec.n >= max;
}

/** 시도 1회 기록 (윈도우 만료 시 리셋). */
export function noteAttempt(key: string, windowMs: number): void {
  const now = Date.now();
  const rec = buckets.get(key);
  const cur = rec && rec.resetAt > now ? rec : { n: 0, resetAt: now + windowMs };
  cur.n += 1;
  buckets.set(key, cur);
}

/** 성공 시 카운터 비움. */
export function clearRateLimit(key: string): void {
  buckets.delete(key);
}
