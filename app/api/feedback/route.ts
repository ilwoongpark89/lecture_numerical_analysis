import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, SESSION_COOKIE } from "@/lib/supabase";
import { verifySession } from "@/lib/student-auth";
import { SID_MAX } from "@/lib/validation";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

// 학생 본인 피드백(교수 읽음·회신·우수 플래그) + 클래스 우수답변(익명). 학생→교수 단방향의 반대 방향 채널(P3).
export async function GET(req: NextRequest) {
  const sid = verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!sid || sid.length > SID_MAX) return NextResponse.json({ ok: false, error: "no_student" }, { status: 401 });

  const week = Number(req.nextUrl.searchParams.get("week")) || 0;
  const db = supabase();
  const { data: mine, error } = await db.rpc("na_student_feedback", { p_token: TOKEN, p_id: sid, p_week: week });
  if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  const { data: featured } = await db.rpc("na_class_featured", { p_token: TOKEN, p_week: week });
  return NextResponse.json({ ok: true, mine: mine ?? [], featured: featured ?? [] });
}
