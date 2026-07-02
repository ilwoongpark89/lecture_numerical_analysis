"use client";
// 강의 학습 추적 클라이언트 — /api/track 로 enter/dwell/note/answer 전송.
// 서버는 서명 세션(httpOnly na_session)으로 식별을 강제 → 여기 payload 의 학번 위조는 무의미.
import { PROF_SID, readStudentId } from "./cookies";

export type TrackKind = "enter" | "dwell" | "note" | "answer";
export type TrackBody = {
  week: number;
  kind: TrackKind;
  chapter?: string;
  stage?: string;
  section?: string;
  question?: string;
  prompt?: string;
  answer?: string;
  isCorrect?: boolean | null;
  ms?: number;
  slide?: number;
};

export function isProf(): boolean {
  return readStudentId() === PROF_SID;
}

export function postTrack(body: TrackBody): void {
  if (isProf()) return; // 교수 열람 = 추적 0
  try {
    const json = JSON.stringify(body);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([json], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: json,
        keepalive: true,
      });
    }
  } catch {
    /* 추적 실패는 학습 흐름을 막지 않음 */
  }
}

// 답안 추적: 문항당 첫 제출만 (리로드 재제출 중복 차단, localStorage 영속).
export function trackAnswerOnce(week: number, key: string, body: Omit<TrackBody, "week" | "kind">): void {
  const K = `na_ans_w${week}`;
  let done: Set<string>;
  try {
    done = new Set(JSON.parse(localStorage.getItem(K) || "[]"));
  } catch {
    done = new Set();
  }
  if (done.has(key)) return;
  done.add(key);
  try {
    localStorage.setItem(K, JSON.stringify(Array.from(done)));
  } catch {
    /* ignore */
  }
  postTrack({ week, kind: "answer", ...body });
}
