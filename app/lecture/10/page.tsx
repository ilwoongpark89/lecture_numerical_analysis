"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import LagrangeInterpolation from "@/components/sections/week10/LagrangeInterpolation";
import NewtonInterpolation from "@/components/sections/week10/NewtonInterpolation";
import RungePhenomenon from "@/components/sections/week10/RungePhenomenon";
import CubicSpline from "@/components/sections/week10/CubicSpline";
import Week10Practice from "@/components/sections/week10/Week10Practice";
import Week10Python from "@/components/sections/week10/Week10Python";

export default function Lecture10() {
  return (
    <LectureGuard>
      <Lecture
        week={10}
        components={[LagrangeInterpolation, NewtonInterpolation, RungePhenomenon, CubicSpline, Week10Practice, Week10Python]}
      />
    </LectureGuard>
  );
}
