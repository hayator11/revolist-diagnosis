"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getResearchVersionFields,
  REVOLIST_11_LIGHT_META,
} from "@/data/researchProjects";
import {
  RESEARCH_LIGHT_TOTAL_QUESTIONS,
  researchLightQuestions,
} from "@/data/researchLightQuestions";
import { getDeviceLabel, getTrackingParams } from "@/data/revoResearch";
import {
  calculateResearchLightResult,
  createResearchLightAnswerColumns,
  createResearchLightDiagnosisId,
  createResearchLightForceColumns,
  createResearchLightRoleColumns,
} from "@/lib/calculateResearchLightResult";
import { createResearchEventFields } from "@/lib/researchTracking";

const CHOICES = [
  { value: 1, label: "ちがう" },
  { value: 2, label: "ややちがう" },
  { value: 3, label: "どちらでも" },
  { value: 4, label: "やや近い" },
  { value: 5, label: "近い" },
];

function getAnswerLabel(value: number) {
  return CHOICES.find((choice) => choice.value === value)?.label ?? "";
}

export default function ResearchLightDiagnosisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const currentQuestion = researchLightQuestions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / RESEARCH_LIGHT_TOTAL_QUESTIONS) * 100);

  const handleAnswer = useCallback(
    (value: number) => {
      if (isAdvancing) return;
      setIsAdvancing(true);

      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = value;
      setAnswers(nextAnswers);

      if (currentIndex < researchLightQuestions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((index) => index + 1);
          setIsAdvancing(false);
        }, 150);
        return;
      }

      const diagnosisId = createResearchLightDiagnosisId(nextAnswers);
      const result = calculateResearchLightResult(nextAnswers);
      const tracking = getTrackingParams(searchParams);
      const createdAt = new Date().toISOString();
      const trackingFields = {
        referrerSlug: tracking.referrerSlug,
        utmSource: tracking.utmSource,
        utmMedium: tracking.utmMedium,
        utmCampaign: tracking.utmCampaign,
        pagePath: window.location.pathname,
        device: getDeviceLabel(),
        ctaClicked: "research_light_start",
      };

      window.sessionStorage.setItem(
        `research-light:${diagnosisId}`,
        JSON.stringify(trackingFields),
      );
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          type: "research_light_answer",
          formType: "research_light_answer",
          ...createResearchEventFields("research_light_answer"),
          ...getResearchVersionFields(),
          diagnosisId,
          createdAt,
          timestamp: createdAt,
          answers: nextAnswers,
          answerCount: nextAnswers.length,
          ...createResearchLightAnswerColumns(nextAnswers),
          personalMean: result.personalMean,
          ...createResearchLightForceColumns(result),
          centerForce: result.centerForce,
          subForce: result.subForce,
          slotForce: result.slotForce,
          judgmentMode: result.mode,
          mainTypeKey: result.mainType.key,
          dualTypeKey: result.dualType?.key ?? null,
          partnerSlotTypeKey: result.partnerSlotTypeKey,
          familyDetail: result.familyDetail,
          ...createResearchLightRoleColumns(result),
          answerDetails: researchLightQuestions.map((question, index) => ({
            questionId: question.id,
            questionVersion: getResearchVersionFields().questionVersion,
            order: index + 1,
            questionText: question.text,
            answerValue: nextAnswers[index],
            answerLabel: getAnswerLabel(nextAnswers[index]),
            forceKey: question.force,
            roleKey: question.role,
          })),
          ...trackingFields,
        }),
      }).catch(() => {
        // Answer logging must not block navigation to the result page.
      });
      router.push(`/research/${REVOLIST_11_LIGHT_META.slug}/result/${diagnosisId}`);
    },
    [answers, currentIndex, isAdvancing, router, searchParams],
  );

  if (!started) {
    return (
      <div className="min-h-screen bg-white px-6 py-14">
        <div className="mx-auto max-w-lg">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
            {REVOLIST_11_LIGHT_META.shortTitle}
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-black">
            レボリスト11
            <br />
            ライト版ベータ
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-600">
            21問に答えると、5つの力スコアと11タイプの傾向が表示されます。
            研究版のため、最後に感想の協力をお願いします。
          </p>
          <div className="mb-8 rounded-lg border border-gray-200 p-5 text-sm leading-relaxed text-gray-600">
            <p>所要時間は約3分です。</p>
            <p>今の自分に近い感覚で選んでください。</p>
            <p>結果は研究データとして Google Sheets に蓄積されます。</p>
          </div>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            21問診断をはじめる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
            <span>
              Q{currentIndex + 1} / {RESEARCH_LIGHT_TOTAL_QUESTIONS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-black" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="mb-10">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
            Research Question
          </p>
          <h2 className="text-2xl font-bold leading-relaxed text-black">
            {currentQuestion.text}
          </h2>
        </section>

        <div className="grid gap-3">
          {CHOICES.map((choice) => (
            <button
              key={choice.value}
              type="button"
              disabled={isAdvancing}
              onClick={() => handleAnswer(choice.value)}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-5 py-4 text-left text-sm text-gray-700 transition-colors hover:border-black hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{choice.label}</span>
              <span className="text-xs text-gray-400">{choice.value}</span>
            </button>
          ))}
        </div>

        {currentIndex > 0 && (
          <button
            type="button"
            disabled={isAdvancing}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            className="mt-8 text-xs text-gray-400 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ひとつ前に戻る
          </button>
        )}
      </div>
    </div>
  );
}
