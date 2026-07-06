import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import { ADMIN_COOKIE, STUDENT_COOKIE, PROF_SID, supabase } from "@/lib/supabase";
import { ipFromRequest, isRateLimited, noteAttempt, clearRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 10;
// durable(서버리스 cross-instance) 백스톱 — 인메모리는 인스턴스별이라 콜드스타트마다 리셋.
const DB_THROTTLE_MAX = 30;
const DB_THROTTLE_WINDOW_SEC = 600;

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(req: NextRequest) {
  // 로그인 비밀번호(교수 입력) — 강한 DB 토큰과 분리.
  const pwExpected = process.env.NA_ADMIN_PASSWORD;
  const tokenForCookie = process.env.NA_ADMIN_TOKEN;
  const ip = "admin:" + ipFromRequest(req);

  if (isRateLimited(ip, MAX_FAILS)) {
    return NextResponse.json({ ok: false, error: "locked" }, { status: 429 });
  }

  // durable DB 스로틀 — 인메모리 리셋을 우회하는 무차별 방어(강한 토큰 없으면 skip).
  if (tokenForCookie) {
    const { data: over, error: thrErr } = await supabase().rpc("na_auth_throttle_hit", {
      p_token: tokenForCookie,
      p_ip: ip,
      p_max: DB_THROTTLE_MAX,
      p_window_sec: DB_THROTTLE_WINDOW_SEC,
    });
    if (thrErr) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
    if (over === true) return NextResponse.json({ ok: false, error: "locked" }, { status: 429 });
  }

  let pw = "";
  try {
    pw = (await req.json())?.password ?? "";
  } catch {
    /* ignore */
  }

  if (!pwExpected || !tokenForCookie || typeof pw !== "string" || !safeEqual(pw, pwExpected)) {
    noteAttempt(ip, WINDOW_MS);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  clearRateLimit(ip);
  const jar = await cookies();
  const opts = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  };
  jar.set(ADMIN_COOKIE, tokenForCookie, { ...opts, httpOnly: true });
  // 교수 세션: na_sid=__prof__ (non-httpOnly → 강의 게이트 통과 + 추적 skip).
  jar.set(STUDENT_COOKIE, PROF_SID, { ...opts, httpOnly: false });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  jar.delete(STUDENT_COOKIE);
  return NextResponse.json({ ok: true });
}
