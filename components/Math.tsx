"use client";

import { InlineMath, BlockMath } from "react-katex";

// KaTeX 는 currentColor 를 상속 → 라이트(어두운 글자)·다크(밝은 글자) 컨텍스트 모두 자동.
export function M({ children }: { children: string }) {
  return <InlineMath math={children} />;
}

export function MBlock({ children }: { children: string }) {
  return <BlockMath math={children} />;
}
