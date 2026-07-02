import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, STUDENT_COOKIE, SESSION_COOKIE } from "@/lib/supabase";
import { newSalt, buildHash, signSession } from "@/lib/student-auth";
import { ipFromRequest } from "@/lib/rate-limit";
import { SID_RE, PW_MIN, PW_MAX } from "@/lib/validation";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";
const CLASS_PW = process.env.NEXT_PUBLIC_NA_CLASS_PASSWORD ?? "NA2026";
// durable 스로틀: (IP+학번) 당 10분 15회. 무차별(공격IP+피해학번)만 조이고, 공유 학교 IP 오탐 0.
const THROTTLE_MAX = 15;
const THROTTLE_WINDOW_SEC = 600;

type Body = { action?: string; studentId?: string; password?: string; classCode?: string };

// 세션 발급: 표시용 na_sid(non-httpOnly) + 신뢰용 서명 na_session(httpOnly).
async function setSession(sid: string) {
  const jar = await cookies();
  const base = { secure: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 90 };
  jar.set(STUDENT_COOKIE, sid, { ...base, httpOnly: false });
  jar.set(SESSION_COOKIE, signSession(sid), { ...base, httpOnly: true });
}

export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ ok: false, error: "server_unconfigured" }, { status: 500 });
  }
  const db = supabase();

  let body: Body | null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const action = body?.action;
  const sid = String(body?.studentId ?? "").trim();
  if (!SID_RE.test(sid)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }

  // durable 스로틀 (키 = IP+학번 → 무차별만 조임, 피해자 잠금 0).
  const ip = ipFromRequest(req);
  const { data: over, error: thrErr } = await db.rpc("auth_throttle_hit", {
    p_token: TOKEN,
    p_ip: ip + ":" + sid,
    p_max: THROTTLE_MAX,
    p_window_sec: THROTTLE_WINDOW_SEC,
  });
  if (thrErr) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  if (over === true) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  // 1) 등록 여부 조회 (UI 가 등록/로그인 분기)
  if (action === "status") {
    const { data, error } = await db.rpc("student_is_claimed", { p_token: TOKEN, p_id: sid });
    if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
    return NextResponse.json({ ok: true, claimed: data === true });
  }

  const pw = String(body?.password ?? "");
  if (pw.length < PW_MIN || pw.length > PW_MAX) {
    return NextResponse.json({ ok: false, error: "bad_pw" }, { status: 400 });
  }

  // 2) 첫 등록 (반코드 + 비번 설정 → 그 학번 = 본인 소유)
  if (action === "register") {
    if (String(body?.classCode ?? "") !== CLASS_PW) {
      return NextResponse.json({ ok: false, error: "bad_class" }, { status: 403 });
    }
    const salt = newSalt();
    const full = buildHash(pw, salt);
    const { data, error } = await db.rpc("student_register", { p_token: TOKEN, p_id: sid, p_hash: full });
    if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
    if (data !== true) return NextResponse.json({ ok: false, error: "already" }, { status: 409 });
    await setSession(sid);
    return NextResponse.json({ ok: true });
  }

  // 3) 로그인 (본인 비번 검증)
  if (action === "login") {
    const { data: salt, error: e1 } = await db.rpc("student_get_salt", { p_token: TOKEN, p_id: sid });
    if (e1) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
    if (!salt) return NextResponse.json({ ok: false, error: "not_registered" }, { status: 404 });
    const full = buildHash(pw, String(salt));
    const { data: res, error: e2 } = await db.rpc("student_verify", { p_token: TOKEN, p_id: sid, p_full: full });
    if (e2) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
    if (res !== "ok") return NextResponse.json({ ok: false, error: "bad_login" }, { status: 401 });
    await setSession(sid);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "bad_action" }, { status: 400 });
}

// 로그아웃: httpOnly 서명 세션은 서버만 제거 가능.
export async function DELETE() {
  const jar = await cookies();
  jar.delete(STUDENT_COOKIE);
  jar.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
