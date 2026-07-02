"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) window.location.reload();
    else setErr("비밀번호가 올바르지 않습니다");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-[#e4e4e7] bg-white p-8 shadow-sm">
        <div className="mb-1 text-xs font-bold tracking-widest text-accent">ADMIN</div>
        <h1 className="mb-1 text-xl font-bold text-[#18181b]">교수 열람 · 학습 기록</h1>
        <p className="mb-6 text-sm text-[#71717a]">교수 비밀번호를 입력하세요.</p>
        <input
          autoFocus
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호"
          className="mb-4 w-full rounded-lg border border-[#e4e4e7] px-4 py-3 text-[#18181b] outline-none focus:border-accent"
        />
        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
        <button disabled={busy} className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60">
          {busy ? "확인 중…" : "열람"}
        </button>
      </form>
    </main>
  );
}
