"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SID_RE, PW_MIN } from "@/lib/validation";
import { weekOf } from "@/lib/curriculum";

// 목적지 = 강의(/lecture/1..15)만 허용 (open-redirect·프로토콜상대 차단).
const NEXT_OK = /^\/lecture\/(1[0-5]|[1-9])(\/|$|\?)/;

type Step = "id" | "register" | "login" | "admin";

const card =
  "w-full rounded-lg border border-[#e4e4e7] bg-white px-4 py-3 text-[#18181b] outline-none focus:border-accent";

function EnterForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/lecture/1";
  const wk = (() => {
    const m = next.match(/^\/lecture\/(\d+)/);
    return m ? Number(m[1]) : 1;
  })();
  const dest = NEXT_OK.test(next) ? next : "/lecture/1";
  const weekTitle = weekOf(wk)?.title ?? "강의실 입장";

  const [step, setStep] = useState<Step>("id");
  const [sid, setSidVal] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [classCode, setClassCode] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);

  function fail(msg: string) {
    setErr(msg);
    setShake(true);
    setTimeout(() => setShake(false), 450);
  }
  function reset(to: Step) {
    setErr("");
    setPw("");
    setPw2("");
    setClassCode("");
    setStep(to);
  }

  async function submitId(e: React.FormEvent) {
    e.preventDefault();
    const id = sid.trim();
    if (id.toLowerCase() === "admin") return reset("admin");
    if (!SID_RE.test(id)) return fail("학번 형식을 확인하세요 (4–32자, 숫자·영문)");
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "status", studentId: id }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) return fail("일시적 오류입니다. 다시 시도하세요");
      reset(j.claimed ? "login" : "register");
    } catch {
      fail("네트워크 오류입니다. 다시 시도하세요");
    } finally {
      setBusy(false);
    }
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < PW_MIN) return fail(`비밀번호는 ${PW_MIN}자 이상으로 설정하세요`);
    if (pw !== pw2) return fail("비밀번호가 일치하지 않습니다");
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "register", studentId: sid.trim(), password: pw, classCode }),
      });
      const j = await res.json();
      if (res.ok && j.ok) return go(dest);
      if (res.status === 403) return fail("반 인증코드가 올바르지 않습니다");
      if (res.status === 409) return fail("이미 등록된 학번입니다. 비밀번호로 로그인하세요");
      fail("등록에 실패했습니다. 다시 시도하세요");
    } catch {
      fail("네트워크 오류입니다. 다시 시도하세요");
    } finally {
      setBusy(false);
    }
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "login", studentId: sid.trim(), password: pw }),
      });
      const j = await res.json();
      if (res.ok && j.ok) return go(dest);
      fail("비밀번호가 올바르지 않습니다");
    } catch {
      fail("네트워크 오류입니다. 다시 시도하세요");
    } finally {
      setBusy(false);
    }
  }

  async function submitAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) return go("/admin");
      fail("관리자 비밀번호가 올바르지 않습니다");
    } catch {
      fail("네트워크 오류입니다. 다시 시도하세요");
    } finally {
      setBusy(false);
    }
  }

  function go(url: string) {
    window.location.assign(url);
  }

  const btn =
    "w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50";
  const back = (
    <button type="button" onClick={() => reset("id")} className="mt-4 block w-full text-center text-xs text-[#71717a] hover:text-accent">
      ← 학번 다시 입력
    </button>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-[#18181b]">
      <div className={`w-full max-w-sm rounded-2xl border border-[#e4e4e7] bg-white p-8 shadow-sm ${shake ? "animate-shake" : ""}`}>
        <div className="mb-1 text-sm font-semibold tracking-widest text-accent">수치해석 · WEEK {wk}</div>
        <h1 className="mb-1 text-2xl font-bold">{weekTitle}</h1>

        {step === "id" && (
          <form onSubmit={submitId}>
            <p className="mb-6 text-sm text-[#52525b]">학습 기록을 위해 <strong className="text-[#18181b]">학번</strong>을 입력하세요.</p>
            <label className="mb-1 block text-xs font-medium text-[#71717a]">학번</label>
            <input autoFocus value={sid} onChange={(e) => setSidVal(e.target.value)} inputMode="numeric" placeholder="예: 12231234" className={`mb-4 ${card}`} />
            {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
            <button type="submit" disabled={busy} className={btn}>{busy ? "확인 중…" : "다음"}</button>
            <p className="mt-4 text-center text-[11px] leading-relaxed text-[#71717a]">
              수집 항목: 학번 · 답안 · 접속/체류 기록 · 목적: 출석·학습 확인 · 보관: 학기 종료 후 삭제 · 담당 교수만 열람.
              <br />입장 시 위 수집·이용에 동의한 것으로 간주합니다.
            </p>
          </form>
        )}

        {step === "register" && (
          <form onSubmit={submitRegister}>
            <p className="mb-6 text-sm text-[#52525b]">
              <strong className="text-[#18181b]">{sid}</strong> 첫 입장입니다. 본인 확인용 <strong className="text-[#18181b]">비밀번호</strong>를 설정하세요. 이후엔 이 비밀번호로만 입장합니다.
            </p>
            <label className="mb-1 block text-xs font-medium text-[#71717a]">반 인증코드</label>
            <input autoFocus type="password" value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="교수님이 안내한 반 코드" className={`mb-4 ${card}`} />
            <label className="mb-1 block text-xs font-medium text-[#71717a]">비밀번호 설정 ({PW_MIN}자 이상)</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="나만 아는 비밀번호" className={`mb-4 ${card}`} />
            <label className="mb-1 block text-xs font-medium text-[#71717a]">비밀번호 확인</label>
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="한 번 더 입력" className={`mb-4 ${card}`} />
            {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
            <button type="submit" disabled={busy} className={btn}>{busy ? "등록 중…" : "등록하고 입장"}</button>
            {back}
          </form>
        )}

        {step === "login" && (
          <form onSubmit={submitLogin}>
            <p className="mb-6 text-sm text-[#52525b]">
              <strong className="text-[#18181b]">{sid}</strong> — 본인 <strong className="text-[#18181b]">비밀번호</strong>를 입력하세요.
            </p>
            <label className="mb-1 block text-xs font-medium text-[#71717a]">비밀번호</label>
            <input autoFocus type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="비밀번호" className={`mb-4 ${card}`} />
            {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
            <button type="submit" disabled={busy} className={btn}>{busy ? "확인 중…" : "입장하기"}</button>
            <p className="mt-3 text-center text-[11px] text-[#a1a1aa]">비밀번호를 잊었다면 담당 교수에게 초기화를 요청하세요.</p>
            {back}
          </form>
        )}

        {step === "admin" && (
          <form onSubmit={submitAdmin}>
            <p className="mb-6 text-sm text-[#52525b]">교수 열람 — <strong className="text-[#18181b]">관리자 비밀번호</strong>를 입력하세요.</p>
            <label className="mb-1 block text-xs font-medium text-[#71717a]">관리자 비밀번호</label>
            <input autoFocus type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="관리자 비밀번호" className={`mb-4 ${card}`} />
            {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
            <button type="submit" disabled={busy} className={btn}>{busy ? "확인 중…" : "관리자 입장"}</button>
            {back}
          </form>
        )}
      </div>
    </main>
  );
}

export default function EnterPage() {
  return (
    <Suspense fallback={null}>
      <EnterForm />
    </Suspense>
  );
}
