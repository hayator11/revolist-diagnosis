"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import { calculateResult, decodeAnswers } from "@/lib/calculateResult";
import { questions } from "@/data/questions";
import { revoTypes } from "@/data/revotypes";
import { getDeviceLabel } from "@/data/revoResearch";
import Link from "next/link";

export default function ResultContent() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers");

  const result = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeAnswers(encoded);
    if (answers.length !== questions.length || answers.some(isNaN)) return null;
    return {
      answers,
      result: calculateResult(answers),
    };
  }, [encoded]);

  useEffect(() => {
    if (!encoded || !result) return;

    const storageKey = `light-diagnosis-saved:${encoded}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    const mainType = revoTypes[result.result.main.key];
    const subType = revoTypes[result.result.sub.key];
    const auxType = revoTypes[result.result.auxiliary.key];
    const payload = {
      type: "light_diagnosis",
      formType: "light_diagnosis",
      timestamp: new Date().toISOString(),
      diagnosisType: "light_21",
      diagnosisId: encoded,
      answers: result.answers,
      resultTitle: `${mainType.name} × ${subType.name} × ${auxType.name}`,
      resultSummary: mainType.catchcopy,
      mainRoleKey: result.result.main.key,
      mainRoleName: mainType.name,
      subRoleKey: result.result.sub.key,
      subRoleName: subType.name,
      supportRoleKey: result.result.auxiliary.key,
      supportRoleName: auxType.name,
      roleScores: result.result.allScores.map((score) => ({
        roleKey: score.key,
        roleName: revoTypes[score.key].name,
        score: score.score,
        percentage: score.percentage,
      })),
      discoveryChannel: searchParams.get("discoveryChannel") ?? "",
      discoveryDetail: "",
      joinMotivation: "",
      impressivePhrase: "",
      isReferred: searchParams.get("isReferred") ?? "",
      referrerName: "",
      referrerUrl: "",
      referrerSlug: searchParams.get("ref") ?? "",
      referralContext: "",
      referrerPublishConsent: "",
      currentInterest: "",
      interestedProjects: "",
      communityInterest: "",
      monitorInterest: "",
      possibleContribution: "",
      expectationText: "",
      utmSource: searchParams.get("utm_source") ?? "",
      utmMedium: searchParams.get("utm_medium") ?? "",
      utmCampaign: searchParams.get("utm_campaign") ?? "",
      pagePath: window.location.pathname,
      device: getDeviceLabel(),
      ctaClicked: "light_diagnosis_start",
      memo: "",
    };

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      window.sessionStorage.setItem(storageKey, "true");
    }).catch(() => {
      // Result display should not depend on logging.
    });
  }, [encoded, result, searchParams]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-6 text-sm">診断データが見つかりませんでした。</p>
        <Link
          href="/diagnosis"
          className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          診断をはじめる
        </Link>
      </div>
    );
  }

  return <ResultCard result={result.result} />;
}
