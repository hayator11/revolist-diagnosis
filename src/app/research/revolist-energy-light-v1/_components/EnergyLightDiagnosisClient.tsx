"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getEnergyLightVersionFields, ENERGY_LIGHT_META } from "@/data/researchProjects";
import { getDeviceLabel, getTrackingParams } from "@/data/revoResearch";
import {
  ENERGY_LIGHT_TOTAL_QUESTIONS,
  energyLabels,
  energyLightQuestions,
  energyLightSceneChoices,
  type EnergyKey,
} from "@/data/energyLightQuestions";
import {
  calculateEnergyLightResult,
  createEnergyLightAnswerColumns,
  createEnergyLightDiagnosisId,
  createEnergyLightScoreColumns,
} from "@/lib/calculateEnergyLightResult";
import { createResearchEventFields } from "@/lib/researchTracking";

const CHOICES = [
  { value: 1, label: "あてはまらない" },
  { value: 2, label: "あまりあてはまらない" },
  { value: 3, label: "どちらともいえない" },
  { value: 4, label: "ややあてはまる" },
  { value: 5, label: "あてはまる" },
];

function getAnswerLabel(value: number) {
  return CHOICES.find((choice) => choice.value === value)?.label ?? "";
}

export default function EnergyLightDiagnosisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const isSceneQuestion = currentIndex === energyLightQuestions.length;
  const progress = Math.round(((currentIndex + 1) / ENERGY_LIGHT_TOTAL_QUESTIONS) * 100);

  const finish = useCallback(
    (nextAnswers: number[], sceneChoice: EnergyKey) => {
      const payload = { values: nextAnswers, sceneChoice };
      const diagnosisId = createEnergyLightDiagnosisId(payload);
      const result = calculateEnergyLightResult(payload);
      const tracking = getTrackingParams(searchParams);
      const createdAt = new Date().toISOString();
      const trackingFields = {
        referrerSlug: tracking.referrerSlug,
        utmSource: tracking.utmSource,
        utmMedium: tracking.utmMedium,
        utmCampaign: tracking.utmCampaign,
        pagePath: window.location.pathname,
        device: getDeviceLabel(),
        ctaClicked: "energy_light_start",
      };

      window.sessionStorage.setItem(`energy-light:${diagnosisId}`, JSON.stringify(trackingFields));
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          type: "energy_light_answer",
          formType: "energy_light_answer",
          ...createResearchEventFields("energy_light_answer"),
          ...getEnergyLightVersionFields(),
          diagnosisId,
          createdAt,
          timestamp: createdAt,
          answers: nextAnswers,
          sceneChoice,
          answerCount: ENERGY_LIGHT_TOTAL_QUESTIONS,
          ...createEnergyLightAnswerColumns(payload),
          ...createEnergyLightScoreColumns(result),
          resultTypeId: result.typeId,
          resultTypeName: result.type.name,
          primaryEnergy: result.primaryEnergy,
          secondaryEnergy: result.secondaryEnergy,
          isPure: result.isPure,
          gap: result.gap,
          answerDetails: [
            ...energyLightQuestions.map((question, index) => ({
              questionId: question.id,
              questionVersion: getEnergyLightVersionFields().questionVersion,
              order: index + 1,
              questionText: question.text,
              answerValue: nextAnswers[index],
              answerLabel: getAnswerLabel(nextAnswers[index]),
              energyKey: question.energy,
            })),
            {
              questionId: "q21",
              questionVersion: getEnergyLightVersionFields().questionVersion,
              order: 21,
              questionText: "オフ会やイベントの打ち上げ。あなたが自然とやっているのは？",
              answerValue: sceneChoice,
              answerLabel: energyLabels[sceneChoice],
              energyKey: sceneChoice,
            },
          ],
          ...trackingFields,
        }),
      }).catch(() => {
        // Research logging must not block navigation.
      });
      router.push(`/research/${ENERGY_LIGHT_META.slug}/result/${diagnosisId}`);
    },
    [router, searchParams],
  );

  const handleAnswer = useCallback(
    (value: number) => {
      if (isAdvancing || isSceneQuestion) return;
      setIsAdvancing(true);

      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = value;
      setAnswers(nextAnswers);

      setTimeout(() => {
        setCurrentIndex((index) => index + 1);
        setIsAdvancing(false);
      }, 120);
    },
    [answers, currentIndex, isAdvancing, isSceneQuestion],
  );

  if (!started) {
    return (
      <div className="min-h-screen bg-white px-6 py-14">
        <div className="mx-auto max-w-lg">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
            {ENERGY_LIGHT_META.shortTitle}
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-black">
            あなたは、欠けているのではない。
            <br />
            配置が違っただけ。
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-600">
            21問・約3分。あなたの5つのエネルギーと、11タイプのどれかがわかります。
          </p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            診断をはじめる
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
              Q{currentIndex + 1} / {ENERGY_LIGHT_TOTAL_QUESTIONS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-black" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="mb-10">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
            {isSceneQuestion ? "Scene Question" : "Energy Question"}
          </p>
          <h2 className="text-2xl font-bold leading-relaxed text-black">
            {isSceneQuestion
              ? "オフ会やイベントの打ち上げ。あなたが自然とやっているのは？"
              : energyLightQuestions[currentIndex].text}
          </h2>
        </section>

        {isSceneQuestion ? (
          <div className="grid gap-3">
            {energyLightSceneChoices.map((choice) => (
              <button
                key={choice.key}
                type="button"
                disabled={isAdvancing}
                onClick={() => finish(answers, choice.key)}
                className="rounded-lg border border-gray-200 px-5 py-4 text-left text-sm text-gray-700 transition-colors hover:border-black hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="mb-2 block text-xs font-bold text-gray-400">{choice.label}</span>
                <span>{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
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
        )}

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
