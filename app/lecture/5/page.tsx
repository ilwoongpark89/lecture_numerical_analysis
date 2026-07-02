"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import SecantMethod from "@/components/sections/week5/SecantMethod";
import ModifiedMethods from "@/components/sections/week5/ModifiedMethods";
import MultipleRoots from "@/components/sections/week5/MultipleRoots";
import NonlinearSystems from "@/components/sections/week5/NonlinearSystems";
import Week5Practice from "@/components/sections/week5/Week5Practice";
import Week5Python from "@/components/sections/week5/Week5Python";

export default function Lecture5() {
  return (
    <LectureGuard>
      <Lecture
        week={5}
        components={[SecantMethod, ModifiedMethods, MultipleRoots, NonlinearSystems, Week5Practice, Week5Python]}
      />
    </LectureGuard>
  );
}
