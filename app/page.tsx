"use client";

import { useState, useEffect } from "react";
import { hasStudentSession } from "@/lib/cookies";
import { WEEKS, firstReady } from "@/lib/curriculum";

const career = [
  { year: "2008–2011", label: "B.S. 서울대학교" },
  { year: "2011–2013", label: "M.S. 서울대학교" },
  { year: "2014–2018", label: "Ph.D. NTNU (노르웨이)" },
  { year: "2018–2021", label: "연구교수, 제주대학교" },
  { year: "2022", label: "연구조교수, 서울대학교" },
  { year: "2022–현재", label: "조교수, 인하대학교" },
];

export default function Home() {
  // 로그인 세션 유무로만 판정 — 본인 인증은 /enter 단일 경로.
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => setHasSession(hasStudentSession()), []);

  // 세션 있으면 강의로 직접, 없으면 /enter(학번 등록/로그인) 경유. 강의 = 정적 슬라이드(/week{N}).
  const entryHref = (week: number) =>
    hasSession ? `/week${week}` : `/enter?next=/week${week}`;

  return (
    <main className="min-h-screen bg-white text-[#18181b]">
      {/* ───────── Hero ───────── */}
      <section className="relative flex min-h-[74vh] items-center justify-center overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-accent-soft [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-5 text-xs font-bold tracking-widest text-accent">
            NUMERICAL ANALYSIS · 2026 FALL SEMESTER
          </div>
          <h1 className="mb-4 text-6xl font-bold leading-[1.05] tracking-tight md:text-8xl">
            Numerical <span className="text-accent">Analysis</span>
          </h1>
          <p className="mx-auto mb-9 max-w-xl text-lg leading-relaxed text-[#52525b] md:text-xl">
            Mathematics wants the <em className="font-semibold not-italic text-[#18181b]">exact</em> answer.
            Engineering wants a <em className="font-semibold not-italic text-accent">usable</em> one.
            <br className="hidden sm:block" />
            손으로 못 푸는 방정식을 컴퓨터로 — 이분법부터 Runge–Kutta까지, 한 화면씩.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={entryHref((firstReady() ?? WEEKS[3]).week)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-accent-hover"
            >
              강의 입장
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#curriculum"
              className="inline-flex items-center gap-2 rounded-full border border-[#e4e4e7] bg-white px-7 py-4 text-lg font-semibold text-[#18181b] transition hover:bg-[#f4f4f5]"
            >
              전체 커리큘럼
            </a>
          </div>
        </div>
      </section>

      {/* ───────── Instructor ───────── */}
      <section className="border-t border-[#e4e4e7] bg-[#fafafa] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <div className="mb-2 text-xs font-bold tracking-widest text-accent">INSTRUCTOR</div>
            <h2 className="text-3xl font-bold md:text-4xl">강사 소개</h2>
          </div>
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="flex size-36 flex-shrink-0 items-center justify-center rounded-3xl bg-accent text-6xl font-bold text-white shadow-sm">
              P
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="mb-1 text-2xl font-bold">박일웅 (Il Woong Park)</h3>
              <p className="mb-4 font-medium text-accent">조교수, 인하대학교 기계공학과</p>
              <p className="mb-6 leading-relaxed text-[#52525b]">
                다상유동 및 열공학 연구실(MFTEL)을 이끌고 있으며, 열에너지 저장·비등 열전달·원자로 안전 등을
                연구합니다. 수치해석은 공학 연구의 핵심 도구입니다 — 이 강의에서 실제 공학 문제를 컴퓨터로 푸는
                능력을 함께 키웁니다.
              </p>
              <div className="space-y-2.5">
                {career.map((item) => (
                  <div key={item.year} className="flex items-center gap-3">
                    <span className="size-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span className="w-24 flex-shrink-0 font-mono text-sm text-[#71717a]">{item.year}</span>
                    <span className="text-sm text-[#3f3f46]">{item.label}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://mftel.inha.ac.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                MFTEL Lab
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Curriculum ───────── */}
      <section id="curriculum" className="border-t border-[#e4e4e7] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-9 text-center">
            <div className="mb-2 text-xs font-bold tracking-widest text-accent">CURRICULUM</div>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">16주 커리큘럼</h2>
            <p className="text-[#71717a]">
              강의는 <strong className="text-[#18181b]">학번</strong>으로 입장합니다. 첫 입장 때 본인 비밀번호를
              설정하면, 이후 그 비밀번호로 학습 기록이 이어집니다.
            </p>
            <p className="mt-2 text-xs text-[#a1a1aa]">학습 기록은 담당 교수만 열람합니다.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WEEKS.map((w) => {
              const open = w.ready && !w.exam;
              const tile = (
                <div className="flex items-start gap-4">
                  <span
                    className={`flex size-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      open ? "bg-accent text-white" : "bg-[#f4f4f5] text-[#a1a1aa]"
                    }`}
                  >
                    {w.exam ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      w.week
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className={`truncate font-semibold ${open ? "text-[#18181b]" : "text-[#71717a]"}`}>{w.topic}</h3>
                      <span className="flex-shrink-0 text-[11px] text-[#a1a1aa]">W{w.week}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-[#a1a1aa]">{w.desc}</p>
                    {w.exam && <p className="mt-1 text-xs text-[#a1a1aa]">시험 기간에 안내</p>}
                    {!w.exam && !w.ready && <p className="mt-1 text-xs text-[#a1a1aa]">준비 중</p>}
                    {open && !hasSession && <p className="mt-1 text-xs text-[#a1a1aa]">학번으로 입장 →</p>}
                  </div>
                </div>
              );
              return open ? (
                <a
                  key={w.week}
                  href={entryHref(w.week)}
                  className="group block rounded-2xl border border-[#e4e4e7] bg-white p-5 transition hover:border-accent/40 hover:shadow-sm"
                >
                  {tile}
                </a>
              ) : (
                <div key={w.week} className="cursor-not-allowed rounded-2xl border border-[#f4f4f5] bg-[#fafafa] p-5">
                  {tile}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e4e4e7] py-8 text-center">
        <p className="text-sm text-[#71717a]">
          2026 Fall Semester · Numerical Analysis · 인하대학교 기계공학과
          <span className="mx-1.5 text-[#d4d4d8]">·</span>
          <a href="/admin" className="text-[#a1a1aa] underline-offset-2 hover:text-accent hover:underline">교수 열람</a>
        </p>
      </footer>
    </main>
  );
}
