import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, ADMIN_COOKIE } from "@/lib/supabase";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

// 성찰 탭 열람 시 전체 읽음 처리(P6) — 대화(생각:* 아님)는 건드리지 않음.
export async function POST() {
  const authed = TOKEN && (await cookies()).get(ADMIN_COOKIE)?.value === TOKEN;
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });

  const { error } = await supabase().rpc("na_admin_mark_all_reflections_read", { p_token: TOKEN });
  if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
