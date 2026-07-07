import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, ADMIN_COOKIE } from "@/lib/supabase";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

// 우수답변 ☆ 토글(P7) — 클래스 익명 공유 대상 지정.
export async function POST(req: NextRequest) {
  const authed = TOKEN && (await cookies()).get(ADMIN_COOKIE)?.value === TOKEN;
  if (!authed) return NextResponse.json({ ok: false }, { status: 401 });

  let body: { id?: number; on?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const id = Number(body?.id);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });

  const { error } = await supabase().rpc("na_admin_feature_note", {
    p_token: TOKEN,
    p_note_id: id,
    p_on: body?.on === true,
  });
  if (error) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
