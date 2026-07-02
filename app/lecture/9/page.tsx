"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import LeastSquaresPrinciple from "@/components/sections/week9/LeastSquaresPrinciple";
import LinearRegression from "@/components/sections/week9/LinearRegression";
import NonlinearLinearization from "@/components/sections/week9/NonlinearLinearization";
import RSquared from "@/components/sections/week9/RSquared";
import Week9Practice from "@/components/sections/week9/Week9Practice";
import Week9Python from "@/components/sections/week9/Week9Python";

export default function Lecture9() {
  return (
    <LectureGuard>
      <Lecture
        week={9}
        components={[LeastSquaresPrinciple, LinearRegression, NonlinearLinearization, RSquared, Week9Practice, Week9Python]}
      />
    </LectureGuard>
  );
}
