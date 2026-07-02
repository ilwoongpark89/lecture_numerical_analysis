"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import FloatingPoint from "@/components/sections/week3/FloatingPoint";
import MachineEpsilon from "@/components/sections/week3/MachineEpsilon";
import TaylorSeries from "@/components/sections/week3/TaylorSeries";
import ErrorPropagation from "@/components/sections/week3/ErrorPropagation";
import ErrorPractice from "@/components/sections/week3/ErrorPractice";
import ErrorPythonComparison from "@/components/sections/week3/ErrorPythonComparison";

export default function Lecture3() {
  return (
    <LectureGuard>
      <Lecture
        week={3}
        components={[FloatingPoint, MachineEpsilon, TaylorSeries, ErrorPropagation, ErrorPractice, ErrorPythonComparison]}
      />
    </LectureGuard>
  );
}
