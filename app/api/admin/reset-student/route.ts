import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, ADMIN_COOKIE } from "@/lib/supabase";
import { SID_RE } from "@/lib/validation";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

// 교수 전용: 학번 비밀번호 초기화 (잘못 선점/분실 복구). 학생은 다음 입장 시 재등록.
export async function POST(req: NextRequest) {
  const authed = TOKEN && (await cookies()).get(ADMIN_COOKIE)?.value === TOKEN;
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const sid = String(body?.studentId ?? "").trim();
  if (!SID_RE.test(sid)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }
  const { error } = await supabase().rpc("student_reset", { p_token: TOKEN, p_id: sid });
  if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
