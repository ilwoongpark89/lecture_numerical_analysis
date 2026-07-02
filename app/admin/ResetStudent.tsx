"use client";

import { useState } from "react";

// 교수 전용: 해당 학번 비밀번호 초기화 버튼 (분실/잘못 선점 복구).
export default function ResetStudent({ sid }: { sid: string }) {
  const [s, setS] = useState<"idle" | "busy" | "done" | "err">("idle");

  async function reset() {
    if (!confirm(`${sid} 의 비밀번호를 초기화할까요?\n학생은 다음 입장 때 새 비밀번호를 다시 설정합니다.`)) return;
    setS("busy");
    try {
      const r = await fetch("/api/admin/reset-student", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ studentId: sid }),
      });
      setS(r.ok ? "done" : "err");
    } catch {
      setS("err");
    }
  }

  return (
    <button
      onClick={reset}
      disabled={s === "busy" || s === "done"}
      className="rounded-md border border-[#e4e4e7] bg-white px-2.5 py-1 text-xs text-[#52525b] transition hover:text-accent disabled:opacity-50"
    >
      {s === "done" ? "초기화됨 ✓" : s === "busy" ? "초기화 중…" : s === "err" ? "실패 — 재시도" : "🔑 비밀번호 초기화"}
    </button>
  );
}
