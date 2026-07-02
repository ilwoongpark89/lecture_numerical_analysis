"use client";

import LectureGuard from "@/components/LectureGuard";
import Lecture from "@/components/lecture/Lecture";
import WhatIsNumericalAnalysis from "@/components/sections/WhatIsNumericalAnalysis";
import AnalyticalVsNumericalTabs from "@/components/sections/AnalyticalVsNumericalTabs";
import NumericalProcessSteps from "@/components/sections/NumericalProcessSteps";
import AnalyticalVsNumerical from "@/components/sections/AnalyticalVsNumerical";
import MatlabPractice from "@/components/sections/MatlabPractice";
import EngineeringApplicationCards from "@/components/sections/EngineeringApplicationCards";
import CourseRoadmap from "@/components/sections/CourseRoadmap";

export default function Lecture1() {
  return (
    <LectureGuard>
      <Lecture
        week={1}
        components={[
          WhatIsNumericalAnalysis,
          AnalyticalVsNumericalTabs,
          NumericalProcessSteps,
          AnalyticalVsNumerical,
          MatlabPractice,
          EngineeringApplicationCards,
          CourseRoadmap,
        ]}
      />
    </LectureGuard>
  );
}
