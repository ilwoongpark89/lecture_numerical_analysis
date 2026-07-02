"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import MatlabOverview from "@/components/sections/week2/MatlabOverview";
import MatlabBasics from "@/components/sections/week2/MatlabBasics";
import MatlabVectorMatrix from "@/components/sections/week2/MatlabVectorMatrix";
import MatlabControlFlow from "@/components/sections/week2/MatlabControlFlow";
import MatlabFunctions from "@/components/sections/week2/MatlabFunctions";
import MatlabPlotting from "@/components/sections/week2/MatlabPlotting";
import MatlabPracticeW2 from "@/components/sections/week2/MatlabPracticeW2";
import PythonComparison from "@/components/sections/week2/PythonComparison";

export default function Lecture2() {
  return (
    <LectureGuard>
      <Lecture
        week={2}
        components={[
          MatlabOverview,
          MatlabBasics,
          MatlabVectorMatrix,
          MatlabControlFlow,
          MatlabFunctions,
          MatlabPlotting,
          MatlabPracticeW2,
          PythonComparison,
        ]}
      />
    </LectureGuard>
  );
}
