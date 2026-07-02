"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import RootFindingIntro from "@/components/sections/week4/RootFindingIntro";
import BisectionMethod from "@/components/sections/week4/BisectionMethod";
import NewtonRaphson from "@/components/sections/week4/NewtonRaphson";
import ConvergenceComparison from "@/components/sections/week4/ConvergenceComparison";
import RootFindingPractice from "@/components/sections/week4/RootFindingPractice";
import RootFindingPython from "@/components/sections/week4/RootFindingPython";

export default function Lecture4() {
  return (
    <LectureGuard>
      <Lecture
        week={4}
        components={[RootFindingIntro, BisectionMethod, NewtonRaphson, ConvergenceComparison, RootFindingPractice, RootFindingPython]}
      />
    </LectureGuard>
  );
}
