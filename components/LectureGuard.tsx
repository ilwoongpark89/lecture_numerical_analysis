"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LectureGuard({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isUnlocked = sessionStorage.getItem("mftel-unlocked") === "true";
    setUnlocked(isUnlocked);
    if (!isUnlocked) {
      router.replace("/");
    }
  }, [router]);

  if (unlocked === null) return null;
  if (!unlocked) return null;

  return <>{children}</>;
}
