"use client";

import { useEffect, useMemo, useState } from "react";
import { CURRICULUM, STAGES, DWELL_SKIM_MS, DWELL_STUDY_MS } from "@/lib/curriculum";
import ResetStudent from "./ResetStudent";

export type RosterRow = {
  student_id: string;
  study_min: number;
  chapters: number;
  correct: number;
  graded: number;
  notes: number;
  last_active: string | null;
};
export type InboxRow = { student_id: string; total: number; unread: number; last_body: string; last_at: string | null };
type Step = { week: number; chapter: string; stage: string; dwell_ms: number; answer: string | null; is_correct: boolean | null };
type Note = { chapter: string; body: string; created_at: string };

const COLOR = { good: "#16a34a", bad: "#dc2626", gap: "#e5e7eb" } as const;
type CState = keyof typeof COLOR;
const TOTAL_STAGES = CURRICULUM.reduce((a, w) => a + w.chapters.length * STAGES.length, 0);

function fmtMs(ms: number) {
  const s = Math.round(ms / 1000);
  return s < 60 ? s + "초" : Math.floor(s / 60) + "분 " + (s % 60) + "초";
}
function fmtDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function hue(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ["#1e40af", "#0891b2", "#16a34a", "#7c3aed", "#db2777", "#ea580c"][h % 6];
}
function Av({ id, sz = 34 }: { id: string; sz?: number }) {
  return <span className="flex flex-shrink-0 items-center justify-center rounded-lg font-bold text-white" style={{ background: hue(id), width: sz, height: sz, fontSize: sz * 0.38 }}>{id.slice(-2)}</span>;
}

export default function Analytics({ roster, inbox }: { roster: RosterRow[]; inbox: InboxRow[] }) {
  const [view, setView] = useState<"students" | "chat">("students");

  const [sel, setSel] = useState(0);
  const [detail, setDetail] = useState<{ steps: Step[]; notes: Note[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selCh, setSelCh] = useState<string | null>(null);
  const student = roster[sel];

  const [chatSel, setChatSel] = useState(0);
  const [thread, setThread] = useState<Note[] | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [read, setRead] = useState<Record<string, boolean>>({});
  const chatStudent = inbox[chatSel];

  useEffect(() => {
    if (view !== "students" || !student) return;
    let alive = true;
    setLoading(true); setSelCh(null); setDetail(null);
    fetch(`/api/admin/detail?sid=${encodeURIComponent(student.student_id)}`)
      .then((r) => r.json())
      .then((j) => { if (alive && j.ok) setDetail({ steps: j.steps, notes: j.notes }); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [student?.student_id, view]);

  useEffect(() => {
    if (view !== "chat" || !chatStudent) return;
    let alive = true;
    setThreadLoading(true); setThread(null);
    fetch(`/api/admin/notes?sid=${encodeURIComponent(chatStudent.student_id)}`)
      .then((r) => r.json())
      .then((j) => { if (alive && j.ok) { setThread(j.notes); setRead((m) => ({ ...m, [chatStudent.student_id]: true })); } })
      .finally(() => { if (alive) setThreadLoading(false); });
    return () => { alive = false; };
  }, [chatStudent?.student_id, view]);

  const map = useMemo(() => {
    const m = new Map<string, Step>();
    (detail?.steps ?? []).forEach((s) => m.set(s.chapter + "|" + s.stage, s));
    return m;
  }, [detail]);

  const cellState = (chapter: string, stage: string): CState => {
    const s = map.get(chapter + "|" + stage);
    if (!s) return "gap";
    if (s.is_correct === true) return "good";
    if (s.is_correct === false) return "bad";
    const graded = stage === "점검" || stage === "연습";
    if (graded) return "gap";
    return (s.dwell_ms || 0) >= DWELL_STUDY_MS ? "good" : "gap";
  };

  const visited = detail ? detail.steps.filter((s) => (s.dwell_ms || 0) > 0 || s.answer != null).length : 0;
  const coverage = Math.round((100 * visited) / TOTAL_STAGES);
  const gapCh: string[] = [], wrongCh: string[] = [];
  if (detail) {
    for (const w of CURRICULUM) for (const ch of w.chapters) {
      const states = STAGES.map((st) => cellState(ch, st));
      if (states.includes("bad")) wrongCh.push(ch);
      else if (states.every((x) => x === "gap")) gapCh.push(ch);
    }
  }
  const notesByCh = useMemo(() => {
    const g: Record<string, Note[]> = {};
    (detail?.notes ?? []).forEach((n) => { (g[n.chapter || "(기타)"] ||= []).push(n); });
    return g;
  }, [detail]);

  const totalUnread = inbox.reduce((a, n) => a + (read[n.student_id] ? 0 : n.unread || 0), 0);
  const legend: [string, CState][] = [["긍정(정답·학습)", "good"], ["부정(오답)", "bad"], ["미흡(미방문·연타)", "gap"]];

  return (
    <div>
      <div className="mb-4 inline-flex rounded-lg border border-[#e4e4e7] bg-white p-1">
        <button onClick={() => setView("students")} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${view === "students" ? "bg-accent text-white" : "text-[#52525b]"}`}>학생별 분석</button>
        <button onClick={() => setView("chat")} className={`relative rounded-md px-3 py-1.5 text-sm font-semibold ${view === "chat" ? "bg-accent text-white" : "text-[#52525b]"}`}>
          대화 {inbox.length}
          {totalUnread > 0 && <span className="ml-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#dc2626] px-1 text-[11px] font-bold text-white">{totalUnread}</span>}
        </button>
      </div>

      {view === "chat" ? (
        inbox.length === 0 ? (
          <div className="rounded-xl border border-[#e4e4e7] bg-white p-10 text-center text-sm text-[#a1a1aa]">아직 대화가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
            <aside className="rounded-xl border border-[#e4e4e7] bg-white p-2">
              <div className="mb-1 px-2 pt-1 text-xs font-bold uppercase tracking-wide text-[#71717a]">대화 · 최근순</div>
              <div className="max-h-[72vh] overflow-y-auto">
                {inbox.map((n, i) => {
                  const unread = read[n.student_id] ? 0 : n.unread || 0;
                  return (
                    <button key={n.student_id} onClick={() => setChatSel(i)}
                      className={`mb-1 flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left transition ${i === chatSel ? "border-accent/30 bg-accent-soft" : "border-transparent hover:bg-[#f4f4f5]"}`}>
                      <Av id={n.student_id} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-1">
                          <span className="truncate text-sm font-semibold">{n.student_id}</span>
                          <span className="flex-shrink-0 text-[10px] text-[#a1a1aa]">{fmtDate(n.last_at)}</span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5">
                          <span className="truncate text-xs text-[#71717a]">{n.last_body}</span>
                          {unread > 0 && <span className="flex-shrink-0 rounded-full bg-[#dc2626] px-1.5 text-[10px] font-bold text-white">{unread}</span>}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="rounded-xl border border-[#e4e4e7] bg-white p-4">
              {!chatStudent ? null : (
                <>
                  <div className="mb-3 flex items-center gap-2.5 border-b border-[#f4f4f5] pb-3">
                    <Av id={chatStudent.student_id} sz={40} />
                    <div>
                      <div className="text-base font-bold">{chatStudent.student_id}</div>
                      <div className="text-xs text-[#a1a1aa]">대화 {chatStudent.total}개 · 챕터는 각 메시지에 태그</div>
                    </div>
                  </div>
                  {threadLoading ? (
                    <div className="py-8 text-center text-sm text-[#a1a1aa]">불러오는 중…</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {(thread ?? []).map((m, i) => (
                        <div key={i} className="max-w-[85%] self-start">
                          {m.chapter && <span className="mb-1 inline-block rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">{m.chapter}</span>}
                          <div className="rounded-2xl rounded-tl-sm border border-[#e4e4e7] bg-[#fafafa] px-3.5 py-2.5 text-[14px] leading-relaxed">{m.body}</div>
                          <span className="ml-1 mt-0.5 block text-[10px] text-[#a1a1aa]">{fmtDate(m.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[240px_1fr]">
          <aside className="rounded-xl border border-[#e4e4e7] bg-white p-3">
            <div className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-[#71717a]">학생 {roster.length}명</div>
            <div className="max-h-[70vh] overflow-y-auto">
              {roster.map((r, i) => (
                <button key={r.student_id} onClick={() => setSel(i)}
                  className={`mb-1 flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition ${i === sel ? "border-accent/30 bg-accent-soft" : "border-transparent hover:bg-[#f4f4f5]"}`}>
                  <Av id={r.student_id} sz={32} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{r.student_id}</span>
                    <span className="block text-xs text-[#a1a1aa]">{r.study_min}분 · 정답 {r.correct}/{r.graded}{r.notes > 0 ? ` · 💬${r.notes}` : ""}</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div>
            {!student ? null : (
              <>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { l: "커버리지", v: coverage + "%" },
                    { l: "정답률", v: (student.graded ? Math.round((100 * student.correct) / student.graded) : 0) + "%" },
                    { l: "체류", v: student.study_min + "분" },
                    { l: "미흡 챕터", v: (loading ? "…" : gapCh.length) + "개" },
                  ].map((c) => (
                    <div key={c.l} className="rounded-xl border border-[#e4e4e7] bg-white p-3.5">
                      <div className="text-2xl font-bold">{c.v}</div>
                      <div className="text-xs text-[#71717a]">{c.l}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-sm font-bold">섹션 커버리지 맵 <span className="ml-1 text-xs font-normal text-[#a1a1aa]">{loading ? "불러오는 중…" : student.student_id}</span></h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#71717a]">
                    {legend.map(([label, k]) => <span key={k} className="inline-flex items-center gap-1.5"><i className="inline-block size-3 rounded" style={{ background: COLOR[k] }} />{label}</span>)}
                  </div>
                </div>
                <p className="mb-3 text-xs text-[#a1a1aa]">셀 = 주차×섹션별 단계(학습·점검). 초록=정답/충분히 학습, 빨강=오답, 회색=미방문·연타. 섹션 클릭 → 단계별 상세.</p>

                <div className="flex flex-col gap-1.5 overflow-x-auto rounded-xl border border-[#e4e4e7] bg-white p-3">
                  {CURRICULUM.map((w) => (
                    <div key={w.week} className="grid grid-cols-[92px_1fr] items-center gap-2">
                      <div className="truncate text-right text-xs font-medium text-[#52525b]">W{w.week} {w.title}</div>
                      <div className="flex flex-wrap gap-2.5">
                        {w.chapters.map((ch) => (
                          <button key={ch} onClick={() => setSelCh(ch === selCh ? null : ch)} className="flex flex-col gap-0.5" title={ch}>
                            <span className="flex gap-[3px]">{STAGES.map((st) => <i key={st} className="inline-block size-[13px] rounded-[3px]" style={{ background: COLOR[cellState(ch, st)] }} />)}</span>
                            <span className={`text-center text-[9px] ${ch === selCh ? "font-bold text-accent" : "text-[#a1a1aa]"}`}>{ch}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!loading && (
                  <div className="mt-4 rounded-xl border border-accent/20 bg-accent-soft p-4">
                    <div className="mb-1.5 text-sm font-bold text-accent">🎤 구술 시험 추천 질문 영역 — {student.student_id}</div>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-[#3f3f46]">
                      {gapCh.length > 0 && <li><b>미흡(안 봤거나 훑고 지나감):</b> {gapCh.slice(0, 10).join(", ")}{gapCh.length > 10 ? " …" : ""} → 개념 이해 자체 확인</li>}
                      {wrongCh.length > 0 && <li><b>오답 발생:</b> {wrongCh.slice(0, 10).join(", ")} → 어디서 틀렸는지 풀이 과정 질문</li>}
                      {gapCh.length === 0 && wrongCh.length === 0 && <li>전 범위 정답 커버 — 심화·응용 질문으로 변별</li>}
                    </ul>
                  </div>
                )}

                {selCh && detail && (
                  <div className="mt-4 rounded-xl border border-[#e4e4e7] bg-white p-4">
                    <div className="mb-2 text-sm font-bold">{selCh} 단계별 진행 & 답안</div>
                    {STAGES.map((st) => {
                      const s = map.get(selCh + "|" + st);
                      let txt = "미방문";
                      if (s) {
                        if (s.is_correct === true) txt = `제출: “${s.answer}” ✔ 정답 · 체류 ${fmtMs(s.dwell_ms)}`;
                        else if (s.is_correct === false) txt = `제출: “${s.answer}” ✘ 오답 · 체류 ${fmtMs(s.dwell_ms)}`;
                        else txt = `체류 ${fmtMs(s.dwell_ms)}${(s.dwell_ms || 0) < DWELL_SKIM_MS ? " (연타·스킴)" : ""}`;
                      }
                      return (
                        <div key={st} className="flex items-center gap-2.5 border-b border-[#f4f4f5] py-2 text-[13px]">
                          <span className="inline-block size-2.5 rounded-full" style={{ background: COLOR[cellState(selCh, st)] }} />
                          <span className="w-16 text-xs text-[#71717a]">{st}</span>
                          <span className="text-[#3f3f46]">{txt}</span>
                        </div>
                      );
                    })}
                    {notesByCh[selCh] && (
                      <div className="mt-3">
                        <div className="mb-1.5 text-xs font-bold text-[#52525b]">💬 이 챕터에 남긴 메모</div>
                        <div className="flex flex-col gap-2">
                          {notesByCh[selCh].map((n, i) => <div key={i} className="max-w-[80%] self-start rounded-2xl rounded-bl-sm border border-[#e4e4e7] bg-white px-3 py-2 text-[13px]">{n.body}</div>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-end"><ResetStudent sid={student.student_id} /></div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
