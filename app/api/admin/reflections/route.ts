import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, ADMIN_COOKIE } from "@/lib/supabase";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

// 교수 전용: 성찰(생각:*) 답변 전수 — 문항별×학생별 집계용.
export async function GET() {
  const authed = TOKEN && (await cookies()).get(ADMIN_COOKIE)?.value === TOKEN;
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });

  const db = supabase();
  const { data, error } = await db.rpc("na_admin_reflections", { p_token: TOKEN });
  if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  return NextResponse.json({ ok: true, reflections: data ?? [] });
}
