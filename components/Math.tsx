"use client";

import { InlineMath, BlockMath } from "react-katex";

const KATEX_COLOR = "#e2e8f0";

export function M({ children }: { children: string }) {
  const colored = `\\textcolor{${KATEX_COLOR}}{${children}}`;
  return <InlineMath math={colored} />;
}

export function MBlock({ children }: { children: string }) {
  const colored = `\\textcolor{${KATEX_COLOR}}{${children}}`;
  return <BlockMath math={colored} />;
}
