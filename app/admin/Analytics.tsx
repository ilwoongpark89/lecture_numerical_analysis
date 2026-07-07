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
// "생각:reflect-15-2" → "W15 · 생각 2"
function labelQid(q: string) {
  const m = q.replace(/^생각:/, "").match(/reflect-(\d+)-(\d+)/);
  return m ? `W${m[1]} · 생각 ${m[2]}` : q.replace(/^생각:/, "") || "(기타)";
}
type Refl = { id: number; student_id: string; chapter: string; body: string; created_at: string; read_at: string | null; reply_body: string | null; featured: boolean };
function Av({ id, sz = 34 }: { id: string; sz?: number }) {
  return <span className="flex flex-shrink-0 items-center justify-center rounded-lg font-bold text-white" style={{ background: hue(id), width: sz, height: sz, fontSize: sz * 0.38 }}>{id.slice(-2)}</span>;
}

export default function Analytics({ roster, inbox }: { roster: RosterRow[]; inbox: InboxRow[] }) {
  const [view, setView] = useState<"students" | "chat" | "reflect">("students");

  const [refl, setRefl] = useState<Refl[] | null>(null);

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

  const [reflUnread, setReflUnread] = useState(0);
  const applyReflPatch = (id: number, patch: Partial<Refl>) => setRefl((cur) => (cur ? cur.map((r) => (r.id === id ? { ...r, ...patch } : r)) : cur));
  useEffect(() => {
    // 성찰 탭 열람: 로드 + 미읽음이 있으면 전체 읽음 처리(P6) + 탭 배지 0
    if (view !== "reflect") return;
    let alive = true;
    fetch("/api/admin/reflections").then((r) => r.json()).then((j) => {
      if (!alive || !j.ok) return;
      setRefl(j.reflections as Refl[]);
      setReflUnread(0);
      if ((j.reflections as Refl[]).some((r) => !r.read_at)) fetch("/api/admin/reflect-read", { method: "POST" });
    });
    return () => { alive = false; };
  }, [view]);
  useEffect(() => {
    // 초기: 성찰 미읽음 수만 조회 → 탭 배지
    let alive = true;
    fetch("/api/admin/reflections").then((r) => r.json()).then((j) => { if (alive && j.ok) setReflUnread((j.reflections as Refl[]).filter((r) => !r.read_at).length); });
    return () => { alive = false; };
  }, []);
  const reflByQ = useMemo(() => {
    const g: Record<string, Refl[]> = {};
    (refl ?? []).forEach((r) => { (g[r.chapter] ||= []).push(r); });
    return Object.entries(g).sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));
  }, [refl]);

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
        <button onClick={() => setView("reflect")} className={`relative rounded-md px-3 py-1.5 text-sm font-semibold ${view === "reflect" ? "bg-accent text-white" : "text-[#52525b]"}`}>
          성찰
          {reflUnread > 0 && <span className="ml-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#dc2626] px-1 text-[11px] font-bold text-white">{reflUnread}</span>}
        </button>
      </div>

      {view === "reflect" ? (
        refl === null ? (
          <div className="rounded-xl border border-[#e4e4e7] bg-white p-10 text-center text-sm text-[#a1a1aa]">불러오는 중…</div>
        ) : reflByQ.length === 0 ? (
          <div className="rounded-xl border border-[#e4e4e7] bg-white p-10 text-center text-sm text-[#a1a1aa]">아직 성찰 답변이 없습니다.</div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[#a1a1aa]">학생들이 각 <b>생각(성찰)</b> 문항에 남긴 답변 — 문항별로 모아 봅니다. 대화·질문 메모는 &ldquo;대화&rdquo; 탭에 분리되어 있습니다.</p>
            {reflByQ.map(([qid, answers]) => (
              <div key={qid} className="rounded-xl border border-[#e4e4e7] bg-white p-4">
                <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-[#f4f4f5] pb-2">
                  <span className="text-sm font-bold text-accent">{labelQid(qid)}</span>
                  <span className="text-xs text-[#a1a1aa]">{answers.length}명 답변</span>
                </div>
                <div className="flex flex-col gap-3">
                  {answers.map((a) => <ReflectAnswer key={a.id} a={a} onPatch={applyReflPatch} />)}
                </div>
              </div>
            ))}
          </div>
        )
      ) : view === "chat" ? (
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

function ReflectAnswer({ a, onPatch }: { a: Refl; onPatch: (id: number, patch: Partial<Refl>) => void }) {
  const [reply, setReply] = useState(a.reply_body ?? "");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const saveReply = async () => {
    setSaving(true);
    const r = await fetch("/api/admin/reply", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: a.id, body: reply }) }).then((x) => x.json()).catch(() => ({ ok: false }));
    setSaving(false);
    if (r.ok) { onPatch(a.id, { reply_body: reply.trim() || null }); setOpen(false); }
  };
  const toggleFeature = async () => {
    const on = !a.featured;
    const r = await fetch("/api/admin/feature", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: a.id, on }) }).then((x) => x.json()).catch(() => ({ ok: false }));
    if (r.ok) onPatch(a.id, { featured: on });
  };
  return (
    <div className="flex items-start gap-2.5">
      <Av id={a.student_id} sz={30} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold">{a.student_id}</span>
          <span className="text-[10px] text-[#a1a1aa]">{fmtDate(a.created_at)}</span>
          <button onClick={toggleFeature} title="우수 답변 — 클래스에 익명 공유" className={`ml-auto text-[16px] leading-none ${a.featured ? "text-[#f59e0b]" : "text-[#d4d4d8] hover:text-[#f59e0b]"}`}>{a.featured ? "★" : "☆"}</button>
        </div>
        <div className="mt-0.5 whitespace-pre-wrap rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 text-[13px] leading-relaxed">{a.body}</div>
        {a.reply_body && !open ? (
          <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2 text-[13px]">
            <span className="flex-1"><b className="text-accent">교수 회신:</b> {a.reply_body}</span>
            <button onClick={() => setOpen(true)} className="text-[11px] text-[#71717a] underline hover:text-accent">수정</button>
          </div>
        ) : open ? (
          <div className="mt-1.5 flex gap-1.5">
            <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="회신 한 줄 (학생이 다음 접속 시 봅니다)" className="flex-1 rounded-md border border-[#e4e4e7] px-2.5 py-1.5 text-[13px]" onKeyDown={(e) => { if (e.key === "Enter") saveReply(); }} />
            <button onClick={saveReply} disabled={saving} className="rounded-md bg-accent px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50">저장</button>
            <button onClick={() => setOpen(false)} className="rounded-md border border-[#e4e4e7] px-2.5 py-1.5 text-[12px] text-[#71717a]">취소</button>
          </div>
        ) : (
          <button onClick={() => setOpen(true)} className="mt-1 text-[11px] text-[#71717a] underline hover:text-accent">↩ 회신 달기</button>
        )}
      </div>
    </div>
  );
}
