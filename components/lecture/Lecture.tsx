"use client";

import type { ComponentType } from "react";
import LectureShell from "./LectureShell";
import LectureHero from "./LectureHero";
import Section from "./Section";
import { weekOf, WEEKS } from "@/lib/curriculum";

// 강의 페이지 공통 뼈대 — 셸(추적/헤더/진도) + 히어로 + 섹션(추적 래핑) + 다음 주차.
// 각 페이지는 렌더 순서대로 components 만 넘기면 커리큘럼 SoT 가 섹션 id·제목을 매칭.
export default function Lecture({
  week,
  components,
}: {
  week: number;
  components: ComponentType[];
}) {
  const meta = weekOf(week);
  const sections = meta?.sections ?? [];
  const next = WEEKS.find((w) => w.week > week && w.ready && !w.exam);

  return (
    <LectureShell week={week}>
      <main className="min-h-screen bg-slate-950 text-white">
        <LectureHero week={week} />

        {components.map((C, i) => {
          const s = sections[i] ?? { id: `${week}-${i + 1}`, title: `섹션 ${i + 1}` };
          return (
            <Section key={s.id} id={s.id} title={s.title}>
              <C />
            </Section>
          );
        })}

        <section className="border-t border-slate-800 bg-slate-950 px-4 py-16 text-center">
          {next ? (
            <a href={`/lecture/${next.week}`} className="group inline-block">
              <p className="mb-2 text-sm text-gray-500">다음 주차</p>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                Week {next.week}:{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300">
                  {next.topic}
                </span>{" "}
                <span className="text-gray-500 transition group-hover:translate-x-1">→</span>
              </h3>
              <p className="mt-2 text-sm text-gray-500">{next.desc}</p>
            </a>
          ) : (
            <p className="text-sm text-gray-500">마지막 완성 주차입니다.</p>
          )}
          <div className="mt-8">
            <a href="/" className="text-sm text-gray-500 underline-offset-2 hover:text-blue-400 hover:underline">
              ← 전체 강의 목록
            </a>
          </div>
        </section>
      </main>
    </LectureShell>
  );
}
