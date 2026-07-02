"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import LinearSystemsIntro from "@/components/sections/week6/LinearSystemsIntro";
import GaussElimination from "@/components/sections/week6/GaussElimination";
import PartialPivoting from "@/components/sections/week6/PartialPivoting";
import LUDecomposition from "@/components/sections/week6/LUDecomposition";
import Week6Practice from "@/components/sections/week6/Week6Practice";
import Week6Python from "@/components/sections/week6/Week6Python";

export default function Lecture6() {
  return (
    <LectureGuard>
      <Lecture
        week={6}
        components={[LinearSystemsIntro, GaussElimination, PartialPivoting, LUDecomposition, Week6Practice, Week6Python]}
      />
    </LectureGuard>
  );
}
