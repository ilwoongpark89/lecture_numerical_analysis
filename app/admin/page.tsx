import { cookies } from "next/headers";
import { supabase, ADMIN_COOKIE } from "@/lib/supabase";
import AdminLogin from "./AdminLogin";
import Analytics, { type RosterRow, type InboxRow } from "./Analytics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TOKEN = process.env.NA_ADMIN_TOKEN ?? "";

export default async function AdminPage() {
  const authed = TOKEN && (await cookies()).get(ADMIN_COOKIE)?.value === TOKEN;
  if (!authed) return <AdminLogin />;

  let roster: RosterRow[] = [];
  let inbox: InboxRow[] = [];
  let err: string | null = null;
  try {
    const db = supabase();
    const [r, n] = await Promise.all([
      db.rpc("na_admin_roster", { p_token: TOKEN }),
      db.rpc("na_admin_note_inbox", { p_token: TOKEN }),
    ]);
    if (r.error) err = r.error.message;
    else roster = (r.data as RosterRow[]) ?? [];
    if (!n.error) inbox = (n.data as InboxRow[]) ?? [];
  } catch (e) {
    err = e instanceof Error ? e.message : "unknown";
  }

  const totMin = roster.reduce((a, r) => a + (r.study_min || 0), 0);
  const totGraded = roster.reduce((a, r) => a + (r.graded || 0), 0);
  const totNotes = inbox.reduce((a, n) => a + (n.total || 0), 0);

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-8 text-[#18181b]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-xs font-bold tracking-widest text-accent">수치해석 · ADMIN</div>
            <h1 className="text-2xl font-bold">학습 분석 — 교수 열람</h1>
            <p className="text-sm text-[#71717a]">학생별 섹션 커버리지(체류시간 기반) · 답안 정오 · 챕터 대화 · 구술 시험 추천</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-lg border border-[#e4e4e7] bg-white px-3 py-1.5 text-sm text-[#52525b] hover:bg-[#f4f4f5]">강의 홈</a>
            <a href="/admin" className="rounded-lg border border-[#e4e4e7] bg-white px-3 py-1.5 text-sm text-[#52525b] hover:bg-[#f4f4f5]">새로고침</a>
          </div>
        </div>

        {err && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            데이터 로드 실패: {err}
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { l: "학생 수", v: roster.length },
            { l: "누적 학습(분)", v: totMin },
            { l: "총 채점 답안", v: totGraded },
            { l: "챕터 대화", v: totNotes },
          ].map((c) => (
            <div key={c.l} className="rounded-xl border border-[#e4e4e7] bg-white p-5">
              <div className="text-3xl font-bold">{c.v}</div>
              <div className="text-sm text-[#71717a]">{c.l}</div>
            </div>
          ))}
        </div>

        {roster.length === 0 ? (
          <div className="rounded-xl border border-[#e4e4e7] bg-white p-10 text-center text-[#71717a]">
            아직 기록이 없습니다. 학생이 학번으로 입장하면 여기에 표시됩니다.
          </div>
        ) : (
          <Analytics roster={roster} inbox={inbox} />
        )}
      </div>
    </main>
  );
}
