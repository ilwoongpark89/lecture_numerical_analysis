import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, ADMIN_COOKIE } from "@/lib/supabase";
import { SID_RE } from "@/lib/validation";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

// 교수 전용: 학생 상세(단계별 체류·답안) + 대화.
export async function GET(req: NextRequest) {
  const authed = TOKEN && (await cookies()).get(ADMIN_COOKIE)?.value === TOKEN;
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });

  const sid = (req.nextUrl.searchParams.get("sid") ?? "").trim();
  if (!SID_RE.test(sid)) return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });

  const db = supabase();
  const [d, n] = await Promise.all([
    db.rpc("na_admin_student_detail", { p_token: TOKEN, p_id: sid }),
    db.rpc("na_admin_student_notes", { p_token: TOKEN, p_id: sid }),
  ]);
  if (d.error || n.error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  return NextResponse.json({ ok: true, steps: d.data ?? [], notes: n.data ?? [] });
}
