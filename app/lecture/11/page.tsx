"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import TrapezoidalRule from "@/components/sections/week11/TrapezoidalRule";
import SimpsonRule from "@/components/sections/week11/SimpsonRule";
import CompositeFormulas from "@/components/sections/week11/CompositeFormulas";
import GaussQuadrature from "@/components/sections/week11/GaussQuadrature";
import Week11Practice from "@/components/sections/week11/Week11Practice";
import Week11Python from "@/components/sections/week11/Week11Python";

export default function Lecture11() {
  return (
    <LectureGuard>
      <Lecture
        week={11}
        components={[TrapezoidalRule, SimpsonRule, CompositeFormulas, GaussQuadrature, Week11Practice, Week11Python]}
      />
    </LectureGuard>
  );
}
