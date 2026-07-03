import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, SESSION_COOKIE } from "@/lib/supabase";
import { verifySession } from "@/lib/student-auth";
import { SID_MAX } from "@/lib/validation";

export const runtime = "nodejs";

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

type Body = {
  week?: number;
  kind?: "enter" | "answer" | "note" | "dwell";
  slide?: number;
  chapter?: string;
  stage?: string;
  section?: string;
  question?: string;
  prompt?: string;
  answer?: string;
  isCorrect?: boolean | null;
  ms?: number;
};

const KINDS = new Set(["enter", "answer", "note", "dwell"]);

export async function POST(req: NextRequest) {
  const db = supabase();

  // 식별 원본 = 서명 세션(httpOnly na_session)만. 평문 na_sid 는 위조 가능 → 신뢰하지 않는다.
  const sid = verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!sid || sid.length > SID_MAX) {
    return NextResponse.json({ ok: false, error: "no_student" }, { status: 401 });
  }
  // 서명이 유효해도 현재 등록 상태 아니면 거부 → 교수 리셋이 즉시 유효 + 미등록 학번 위조 차단.
  const { data: claimed, error: cErr } = await db.rpc("na_student_is_claimed", { p_token: TOKEN, p_id: sid });
  if (cErr) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  if (claimed !== true) {
    return NextResponse.json({ ok: false, error: "no_student" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const kind = body.kind;
  if (!kind || !KINDS.has(kind)) {
    return NextResponse.json({ ok: false, error: "bad_kind" }, { status: 400 });
  }

  const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : null);

  // dwell(체류시간): (학번,챕터,단계) 누적 UPSERT → 행 폭증 방지.
  if (kind === "dwell") {
    const ms = Number.isFinite(body.ms) ? Math.max(0, Math.floor(Number(body.ms))) : 0;
    if (ms <= 0) return NextResponse.json({ ok: true });
    const { error } = await db.rpc("na_record_dwell", {
      p_token: TOKEN,
      p_id: sid,
      p_week: Number.isFinite(body.week) ? Number(body.week) : 0,
      p_chapter: clip(body.chapter, 32),
      p_stage: clip(body.stage, 24),
      p_ms: ms,
    });
    if (error) {
      console.error("[track] dwell failed:", error.message);
      return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // note(챕터 대화): 전용 student_notes 로 (token RPC — 직접 REST 위조 차단).
  if (kind === "note") {
    const noteText = clip(body.answer, 2000);
    if (!noteText || !noteText.trim()) return NextResponse.json({ ok: true });
    const { error } = await db.rpc("na_record_note", {
      p_token: TOKEN,
      p_id: sid,
      p_week: Number.isFinite(body.week) ? Number(body.week) : 0,
      p_chapter: clip(body.chapter, 32),
      p_body: noteText,
    });
    if (error) {
      console.error("[track] note failed:", error.message);
      return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  const row = {
    student_id: sid,
    week: Number.isFinite(body.week) ? Number(body.week) : 1,
    kind,
    slide: Number.isFinite(body.slide) ? Number(body.slide) : null,
    chapter: clip(body.chapter, 32),
    section: clip(body.section, 32),
    question: clip(body.question, 64),
    prompt: clip(body.prompt, 500),
    answer: clip(body.answer, 2000),
    is_correct: typeof body.isCorrect === "boolean" ? body.isCorrect : null,
    user_agent: clip(req.headers.get("user-agent"), 300),
  };

  const { error } = await db.from("na_lecture_events").insert(row);
  if (error) {
    console.error("[track] insert failed:", error.message);
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
