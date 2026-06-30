"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MonitorResultCard from "@/components/MonitorResultCard";
import {
  decodeMonitorAnswers,
  calculateRoleResult,
  calculateTeamResult,
  calculateMatchResult,
  calculateGrowthResult,
} from "@/lib/calculateMonitorResult";
import type { MonitorDiagnosisKey } from "@/data/monitorQuestions";
import { MONITOR_SCENARIO_TOTAL_QUESTIONS } from "@/data/monitorScenarioQuestions";

const LEGACY_TOTAL_QUESTIONS = 18;

interface Props {
  diagKey: MonitorDiagnosisKey;
}

export default function ResultClient({ diagKey }: Props) {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers");

  const result = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeMonitorAnswers(encoded);
    const expectedQuestions = diagKey === "role"
      ? MONITOR_SCENARIO_TOTAL_QUESTIONS
      : LEGACY_TOTAL_QUESTIONS;
    if (
      answers.length !== expectedQuestions ||
      answers.some((answer) => Number.isNaN(answer) || answer < 1 || answer > 5)
    ) return null;

    switch (diagKey) {
      case "role":   return calculateRoleResult(answers);
      case "team":   return calculateTeamResult(answers);
      case "match":  return calculateMatchResult(answers);
      case "growth": return calculateGrowthResult(answers);
    }
  }, [encoded, diagKey]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-6 text-sm">診断データが見つかりませんでした。</p>
        <Link
          href={`/monitor/${diagKey}`}
          className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          診断をやり直す
        </Link>
      </div>
    );
  }

  return <MonitorResultCard result={result} />;
}
