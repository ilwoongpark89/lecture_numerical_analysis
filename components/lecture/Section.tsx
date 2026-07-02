"use client";

// 추적 단위 래퍼 — LectureShell 의 IntersectionObserver 가 [data-na-section] 을 관찰해
// 섹션별 체류시간(dwell)·진도·목차 점프를 처리한다. 내용 컴포넌트는 그대로 children 으로.
export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={`sec-${id}`} data-na-section={id} data-na-title={title} className="scroll-mt-16">
      {children}
    </div>
  );
}
