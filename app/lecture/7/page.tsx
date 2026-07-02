"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import JacobiMethod from "@/components/sections/week7/JacobiMethod";
import GaussSeidelMethod from "@/components/sections/week7/GaussSeidelMethod";
import ConvergenceConditions from "@/components/sections/week7/ConvergenceConditions";
import SORMethod from "@/components/sections/week7/SORMethod";
import Week7Practice from "@/components/sections/week7/Week7Practice";
import Week7Python from "@/components/sections/week7/Week7Python";

export default function Lecture7() {
  return (
    <LectureGuard>
      <Lecture
        week={7}
        components={[JacobiMethod, GaussSeidelMethod, ConvergenceConditions, SORMethod, Week7Practice, Week7Python]}
      />
    </LectureGuard>
  );
}
