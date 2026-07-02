"use client";

import { useEffect, useRef, useState } from "react";
import { weekOf } from "@/lib/curriculum";
import { readStudentId, PROF_SID } from "@/lib/cookies";
import { postTrack } from "@/lib/track";

const now = () =>
  typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();

// 강의 셸 — 헤더(학번 칩·진도바)·목차·질문 위젯 + 섹션별 체류시간(dwell) 추적.
// 현재 강의 콘텐츠는 다크 테마 → 셸도 다크로 통일(라이트 전환은 콘텐츠와 함께 후속).
export default function LectureShell({
  week,
  children,
}: {
  week: number;
  children: React.ReactNode;
}) {
  const meta = weekOf(week);
  const sections = meta?.sections ?? [];

  const [sid, setSid] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteOk, setNoteOk] = useState(false);

  const activeRef = useRef<string | null>(null);
  const segStart = useRef(0);
  const banked = useRef(0);
  const seenRef = useRef<Set<string>>(new Set());

  const isProf = sid === PROF_SID;
  const PKEY = `na_prog_w${week}`;

  // ── 학번 + 진도 복원 + 접속(enter) 1회 ──
  useEffect(() => {
    setSid(readStudentId());
    try {
      const raw = JSON.parse(localStorage.getItem(PKEY) || "null");
      if (raw?.seen) {
        seenRef.current = new Set(raw.seen);
        setSeen(new Set(raw.seen));
      }
    } catch {
      /* ignore */
    }
    try {
      if (!sessionStorage.getItem(`na_entered_w${week}`)) {
        sessionStorage.setItem(`na_entered_w${week}`, "1");
        postTrack({ week, kind: "enter" });
      }
    } catch {
      postTrack({ week, kind: "enter" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week]);

  function markSeen(id: string) {
    if (seenRef.current.has(id)) return;
    seenRef.current.add(id);
    const next = new Set(seenRef.current);
    setSeen(next);
    try {
      localStorage.setItem(PKEY, JSON.stringify({ seen: Array.from(next), last: id }));
    } catch {
      /* ignore */
    }
  }

  // ── 체류시간(dwell) 추적: 화살표 연타/스크롤이 아니라 실제 머문 시간을 측정 ──
  useEffect(() => {
    const bank = () => {
      if (activeRef.current && segStart.current && document.visibilityState === "visible") {
        banked.current += now() - segStart.current;
      }
      segStart.current = document.visibilityState === "visible" ? now() : 0;
    };
    const flush = () => {
      bank();
      const id = activeRef.current;
      if (id && banked.current >= 1000) {
        postTrack({ week, kind: "dwell", chapter: id, stage: "학습", ms: Math.round(banked.current) });
        banked.current = 0;
      }
    };
    const switchTo = (id: string) => {
      if (id === activeRef.current) return;
      flush();
      activeRef.current = id;
      setActive(id);
      segStart.current = document.visibilityState === "visible" ? now() : 0;
      banked.current = 0;
      markSeen(id);
    };

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-na-section]"));
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.naSection;
          if (id) ratios.set(id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let best: string | null = null;
        let bestR = 0;
        ratios.forEach((r, id) => {
          if (r > bestR) {
            bestR = r;
            best = id;
          }
        });
        if (best && bestR > 0) switchTo(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-56px 0px 0px 0px" }
    );
    els.forEach((el) => io.observe(el));

    const onVis = () => {
      if (document.visibilityState === "hidden") flush();
      else segStart.current = now();
    };
    const iv = setInterval(flush, 15000);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      io.disconnect();
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week]);

  function jump(id: string) {
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  }

  async function logout() {
    if (isProf) return;
    if (!confirm(`${sid} — 로그아웃할까요? (다음 입장은 학번·비밀번호 필요)`)) return;
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    window.location.href = "/enter";
  }

  function sendNote() {
    const v = note.trim();
    if (!v) return;
    postTrack({ week, kind: "note", chapter: active ?? undefined, answer: v.slice(0, 2000) });
    setNote("");
    setNoteOk(true);
    setTimeout(() => {
      setNoteOk(false);
      setNoteOpen(false);
    }, 1500);
  }

  const total = sections.length || 1;
  const pct = Math.round((seen.size / total) * 100);

  return (
    <div className="dark-lecture">
      {/* ── 헤더 ── */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-3 px-4">
          <a href="/" className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">강의 목록</span>
          </a>
          <div className="min-w-0 flex-1 truncate text-sm text-gray-300">
            <span className="font-semibold text-white">Week {week}</span>
            <span className="mx-1.5 text-slate-600">·</span>
            <span className="text-gray-400">{meta?.topic}</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
              <span className="block h-full rounded-full bg-blue-500 transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-gray-500">{seen.size}/{total}</span>
          </div>
          {sid && (
            <button
              onClick={logout}
              title={isProf ? "" : "클릭하면 로그아웃"}
              className="flex-shrink-0 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-300 transition hover:bg-blue-500/20"
            >
              👤 {isProf ? "교수 열람" : sid}
            </button>
          )}
        </div>
      </header>

      <div className="pt-14">{children}</div>

      {/* ── 목차 (좌하단) ── */}
      {sections.length > 1 && (
        <>
          <button
            onClick={() => setTocOpen((v) => !v)}
            className="fixed bottom-5 left-5 z-[60] flex items-center gap-1.5 rounded-full bg-slate-800 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-slate-700"
          >
            ☰ 목차
          </button>
          {tocOpen && (
            <div className="fixed bottom-20 left-5 z-[60] max-h-[60vh] w-[min(288px,84vw)] overflow-auto rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-[13.5px] transition ${
                    active === s.id ? "bg-blue-500/15 font-bold text-blue-300" : "text-gray-300 hover:bg-slate-800"
                  }`}
                >
                  <b className="mr-2 font-mono text-xs tabular-nums text-slate-500">{s.id}</b>
                  {s.title}
                  {seen.has(s.id) && <span className="ml-1.5 text-emerald-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── 질문·메모 (우하단, 교수만 열람) ── */}
      {!isProf && (
        <>
          <button
            onClick={() => setNoteOpen((v) => !v)}
            className="fixed bottom-5 right-5 z-[60] flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500"
          >
            💬 질문·메모
          </button>
          {noteOpen && (
            <div className="fixed bottom-20 right-5 z-[60] w-[min(320px,86vw)] rounded-2xl border border-slate-700 bg-slate-900 p-3.5 shadow-2xl">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-400">
                이 섹션 한 줄 메모
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-300">🔒 교수님만 봅니다</span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={2000}
                placeholder="여기서 막혔어요 / 이게 궁금해요…"
                className="min-h-[56px] w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-blue-500"
              />
              <button onClick={sendNote} className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-[13px] font-bold text-white transition hover:bg-blue-500">
                전송
              </button>
              {noteOk && <div className="mt-2 text-center text-xs font-semibold text-emerald-400">교수님께 전달됨 ✓</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
