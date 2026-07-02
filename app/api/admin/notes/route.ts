import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, ADMIN_COOKIE } from "@/lib/supabase";
import { SID_RE } from "@/lib/validation";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

// 교수 전용: 한 학생의 대화 스레드(챕터 태그) + 열람 시 읽음 처리.
export async function GET(req: NextRequest) {
  const authed = TOKEN && (await cookies()).get(ADMIN_COOKIE)?.value === TOKEN;
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });

  const sid = (req.nextUrl.searchParams.get("sid") ?? "").trim();
  if (!SID_RE.test(sid)) return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });

  const db = supabase();
  const { data, error } = await db.rpc("admin_student_notes", { p_token: TOKEN, p_id: sid });
  if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  await db.rpc("admin_mark_notes_read", { p_token: TOKEN, p_id: sid });
  return NextResponse.json({ ok: true, notes: data ?? [] });
}
