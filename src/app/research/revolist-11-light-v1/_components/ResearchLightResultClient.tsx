"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getResearchVersionFields, REVOLIST_11_LIGHT_META } from "@/data/researchProjects";
import { getDeviceLabel } from "@/data/revoResearch";
import { researchForceLabels, researchLightQuestions } from "@/data/researchLightQuestions";
import {
  FORCE_ORDER,
  calculateResearchLightResult,
  createResearchLightAnswerColumns,
  createResearchLightForceColumns,
  createResearchLightRoleColumns,
  decodeResearchLightAnswers,
  getResearchLightResultDetails,
  isValidResearchLightAnswers,
} from "@/lib/calculateResearchLightResult";
import { createResearchEventFields } from "@/lib/researchTracking";
import ForcePentagonChart from "./ForcePentagonChart";

const PARTNER_SECTION_ID = "research-light-partners";

interface Props {
  resultId?: string;
}

function loadStoredTracking(encoded: string | null) {
  if (!encoded || typeof window === "undefined") return {};
  const raw = window.sessionStorage.getItem(`research-light:${encoded}`);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function ResearchLightResultClient({ resultId }: Props) {
  const searchParams = useSearchParams();
  const encoded = resultId ?? searchParams.get("answers");
  const [copied, setCopied] = useState(false);

  const resultState = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeResearchLightAnswers(encoded);
    if (!isValidResearchLightAnswers(answers)) return null;
    const result = calculateResearchLightResult(answers);
    const details = getResearchLightResultDetails(result);
    return { answers, result, details };
  }, [encoded]);

  const resultUrl =
    typeof window === "undefined" || !encoded
      ? ""
      : `${window.location.origin}/research/${REVOLIST_11_LIGHT_META.slug}/result/${encoded}`;

  const shareText = useMemo(() => {
    if (!resultState) return "";
    return [
      `私は${resultState.details.mainRole.name}型。中心の力は「${resultState.details.centerForceLabel}」。`,
      `いま「${resultState.details.slotForceLabel}」の人を探しています。`,
      resultUrl,
    ].join("\n");
  }, [resultState, resultUrl]);

  const resultLogPayload = useMemo(() => {
    if (!resultState || !encoded) return null;

    const createdAt = new Date().toISOString();
    const tracking = loadStoredTracking(encoded);
    const { answers, result, details } = resultState;

    return {
      type: "research_light_result",
      formType: "research_light_result",
      ...createResearchEventFields("research_light_result"),
      ...getResearchVersionFields(),
      diagnosisId: encoded,
      createdAt,
      timestamp: createdAt,
      answers,
      answerCount: answers.length,
      ...createResearchLightAnswerColumns(answers),
      answerDetails: researchLightQuestions.map((question, index) => ({
        questionId: question.id,
        questionVersion: getResearchVersionFields().questionVersion,
        order: index + 1,
        questionText: question.text,
        answerValue: answers[index],
        forceKey: question.force,
        roleKey: question.role,
      })),
      resultUrl,
      personalMean: result.personalMean,
      ...createResearchLightForceColumns(result),
      centerForce: result.centerForce,
      subForce: result.subForce,
      slotForce: result.slotForce,
      judgmentMode: result.mode,
      mainTypeKey: result.mainType.key,
      mainTypeName: details.mainRole.name,
      dualTypeKey: result.dualType?.key ?? null,
      dualTypeName: details.dualRole?.name ?? null,
      partnerSlotTypeKey: result.partnerSlotTypeKey,
      familyDetail: result.familyDetail,
      forceScores: result.forceScores,
      ...createResearchLightRoleColumns(result),
      resultTitle: details.title,
      resultLead: details.lead,
      resultBody: details.body,
      workSuggestion: details.workSuggestion,
      communitySuggestion: details.communitySuggestion,
      nextAction: details.nextAction,
      partnerHints: result.partnerHints,
      referrerSlug: tracking.referrerSlug ?? searchParams.get("ref") ?? "",
      utmSource: tracking.utmSource ?? searchParams.get("utm_source") ?? "",
      utmMedium: tracking.utmMedium ?? searchParams.get("utm_medium") ?? "",
      utmCampaign: tracking.utmCampaign ?? searchParams.get("utm_campaign") ?? "",
      pagePath: tracking.pagePath ?? (typeof window === "undefined" ? "" : window.location.pathname),
      device: tracking.device ?? getDeviceLabel(),
      ctaClicked: tracking.ctaClicked ?? "",
    };
  }, [encoded, resultState, resultUrl, searchParams]);

  useEffect(() => {
    if (!resultLogPayload) return;
    const storageKey = `research-light-result-saved:${resultLogPayload.diagnosisId}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultLogPayload),
    })
      .then(() => {
        window.sessionStorage.setItem(storageKey, "true");
      })
      .catch(() => {
        // Research logging must not block result display.
      });
  }, [resultLogPayload]);

  const logShare = (shareMethod: string) => {
    if (!resultState || !encoded) return;
    const createdAt = new Date().toISOString();
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "research_light_result",
        formType: "research_light_share",
        ...createResearchEventFields("research_light_share"),
        ...getResearchVersionFields(),
        diagnosisId: encoded,
        createdAt,
        timestamp: createdAt,
        shareClicked: true,
        shareMethod,
        resultUrl,
        centerForce: resultState.result.centerForce,
        slotForce: resultState.result.slotForce,
        judgmentMode: resultState.result.mode,
        mainTypeKey: resultState.result.mainType.key,
        mainTypeName: resultState.details.mainRole.name,
      }),
    }).catch(() => {
      // Sharing should not be blocked by logging.
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText, url: resultUrl });
      logShare("web_share");
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    logShare("copy");
    setTimeout(() => setCopied(false), 1800);
  };

  if (!resultState || !encoded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm text-gray-500">診断データが見つかりませんでした。</p>
        <Link
          href={`/research/${REVOLIST_11_LIGHT_META.slug}`}
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          もう一度診断する
        </Link>
      </div>
    );
  }

  const { result, details } = resultState;

  return (
    <div className="min-h-screen bg-white pb-16">
      <section className="mx-auto max-w-lg px-6 py-10">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          {REVOLIST_11_LIGHT_META.shortTitle} Result
        </p>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">
          {details.modeLabel}
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-black">{details.lead}</h1>
        <ForcePentagonChart
          centerForce={result.centerForce}
          dev={result.dev}
          mode={result.mode}
          slotForce={result.slotForce}
          partnerTargetId={PARTNER_SECTION_ID}
        />
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">経験で広がる力</h2>
        <p className="text-sm leading-relaxed text-gray-600">{details.experienceText}</p>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">Type Story</p>
        <h2 className="mb-3 text-2xl font-bold text-black">{details.title}</h2>
        <p className="mb-4 text-sm font-bold leading-relaxed text-black">
          あなたの形は、ひとりで完成させるものではありません。
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-gray-600">
          {details.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 grid gap-4">
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">Work</p>
            <p className="text-sm leading-relaxed text-gray-700">{details.workSuggestion}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">Community</p>
            <p className="text-sm leading-relaxed text-gray-700">{details.communitySuggestion}</p>
          </div>
        </div>
      </section>

      <section id={PARTNER_SECTION_ID} className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">あなたの形を完成させる人</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          あなたの空きスロットは「{details.slotForceLabel}」。ここに入る仲間がいると、
          今の形がもっと円に近づきます。
        </p>
        <div className="space-y-4">
          {result.partnerHints.map((partner, index) => (
            <article
              key={`${partner.roleKey}-${index}`}
              className={`rounded-lg p-5 ${partner.isSlotPartner ? "bg-black text-white" : "bg-gray-50 text-black"}`}
            >
              <p className={`mb-2 text-xs uppercase tracking-widest ${partner.isSlotPartner ? "text-gray-400" : "text-gray-400"}`}>
                {partner.isSlotPartner
                  ? `あなたの空きスロット: ${researchForceLabels[partner.slotForce]}`
                  : "Partner Hint"}
              </p>
              <h3 className="mb-3 text-2xl font-bold leading-snug">
                {partner.creates.join(" × ")} → 「{partner.creates.join("が、")}になる」
              </h3>
              <ForcePentagonChart
                compact
                centerForce={result.centerForce}
                dev={result.dev}
                partnerForce={partner.slotForce}
              />
              <p className={`mt-3 text-xs ${partner.isSlotPartner ? "text-gray-300" : "text-gray-500"}`}>
                重なると、形が円に近づきます
              </p>
              <p className="mt-4 text-lg font-bold">{partner.roleName}</p>
              <p className={`mt-1 text-sm font-medium ${partner.isSlotPartner ? "text-gray-300" : "text-gray-700"}`}>
                {partner.publicLabel}
              </p>
              <p className={`mt-3 text-sm leading-relaxed ${partner.isSlotPartner ? "text-gray-300" : "text-gray-500"}`}>
                {partner.description}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-6 rounded-lg border border-gray-200 p-5 text-sm font-medium leading-relaxed text-black">
          あなたのスロットに合う人が、ここにいます。
        </p>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">仲間募集カードとして共有する</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          「{details.slotForceLabel}」の人を探している、という形で共有できます。
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
          >
            {copied ? "コピー済み" : "共有 / コピー"}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            onClick={() => logShare("x")}
            className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700"
          >
            X
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(resultUrl)}&text=${encodeURIComponent(shareText)}`}
            onClick={() => logShare("line")}
            className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700"
          >
            LINE
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <p className="mb-5 text-sm leading-relaxed text-gray-600">{details.feedbackHint}</p>
        <Link
          href={`/research/${REVOLIST_11_LIGHT_META.slug}/feedback?id=${encodeURIComponent(encoded)}`}
          className="block w-full rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          感想を送る
        </Link>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <details className="rounded-lg border border-gray-200 p-5">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            研究用の詳細スコアを見る
          </summary>
          <div className="mt-5 space-y-5">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">Force Pct</p>
              <div className="grid gap-2 text-sm">
                {FORCE_ORDER.map((force) => (
                  <div key={force} className="flex justify-between border-b border-gray-100 py-2">
                    <span>{researchForceLabels[force]}</span>
                    <span className="text-gray-400">
                      {formatScore(result.forcePct[force])}% / dev {formatScore(result.dev[force])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">Family Detail</p>
              <div className="space-y-3 text-xs text-gray-500">
                {FORCE_ORDER.map((force) => (
                  <div key={force} className="rounded-lg bg-gray-50 p-3">
                    <p className="mb-2 font-medium text-gray-700">{researchForceLabels[force]}</p>
                    {result.familyDetail[force].candidates.map((candidate) => (
                      <p key={candidate.roleKey}>
                        {details.allRoles[candidate.roleKey].name}: {formatScore(candidate.score)} /{" "}
                        {formatScore(candidate.maxScore)} ({formatScore(candidate.percentage)}%)
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
        <Link
          href={`/research/${REVOLIST_11_LIGHT_META.slug}`}
          className="mt-6 block text-center text-xs text-gray-400 underline underline-offset-4"
        >
          もう一度診断する
        </Link>
      </section>
    </div>
  );
}
