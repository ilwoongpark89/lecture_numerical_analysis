"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { hasStudentSession } from "@/lib/cookies";

// 강의 열람 soft 게이트 — 학번 세션(na_sid) 없으면 /enter 로. (추적 신뢰는 서버가 서명세션으로 강제.)
export default function LectureGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (hasStudentSession()) {
      setOk(true);
    } else {
      setOk(false);
      router.replace(`/enter?next=${encodeURIComponent(path)}`);
    }
  }, [router, path]);

  if (ok === null) return null;
  if (!ok) return null;
  return <>{children}</>;
}
