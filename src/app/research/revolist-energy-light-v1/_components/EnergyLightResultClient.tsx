"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ENERGY_LIGHT_META, getEnergyLightVersionFields } from "@/data/researchProjects";
import { getDeviceLabel } from "@/data/revoResearch";
import { ENERGY_ORDER, energyLabels, energyLightQuestions } from "@/data/energyLightQuestions";
import { energyTypeContents, type EnergyTypeId } from "@/data/energyLightTypes";
import {
  calculateEnergyLightResult,
  createEnergyLightAnswerColumns,
  createEnergyLightScoreColumns,
  decodeEnergyLightDiagnosisId,
  isValidEnergyLightPayload,
} from "@/lib/calculateEnergyLightResult";
import { createResearchEventFields } from "@/lib/researchTracking";
import EnergyPentagonChart from "./EnergyPentagonChart";

interface Props {
  resultId?: string;
}

function loadStoredTracking(encoded: string | null) {
  if (!encoded || typeof window === "undefined") return {};
  const raw = window.sessionStorage.getItem(`energy-light:${encoded}`);
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

const PARTNER_BY_ENERGY: Record<
  string,
  {
    primary: EnergyTypeId;
    alternate: EnergyTypeId;
    phrase: string;
    headline: string;
    reason: string;
  }
> = {
  wood: {
    primary: "11",
    alternate: "02",
    phrase: "未来の種を持ってくる人",
    headline: "今の枠の外に、次の可能性を見せてくれる人",
    reason: "ひらく力の人がそばにいると、まだ言葉になっていない選択肢や、試してみたい方向が見えやすくなります。",
  },
  fire: {
    primary: "06",
    alternate: "01",
    phrase: "場に熱を灯す人",
    headline: "あなたの一歩に、熱量と勢いを足してくれる人",
    reason: "ともす力の人がそばにいると、考えていたことが人に伝わり、動き出すきっかけが生まれやすくなります。",
  },
  earth: {
    primary: "10",
    alternate: "04",
    phrase: "安心の土台をつくる人",
    headline: "安心して試せる土台を、一緒につくってくれる人",
    reason: "ささえる力の人がそばにいると、挑戦や企画が人の気持ちに届き、続けやすい場になります。",
  },
  metal: {
    primary: "08",
    alternate: "07",
    phrase: "形と仕組みにしてくれる人",
    headline: "思いや勢いを、続けられる形に整えてくれる人",
    reason: "かためる力の人がそばにいると、アイデアや関係性が手順・役割・仕組みになり、次の人へ渡しやすくなります。",
  },
  water: {
    primary: "05",
    alternate: "02",
    phrase: "流れを読み解く人",
    headline: "今どこへ進むとよいか、見通しをくれる人",
    reason: "よみとく力の人がそばにいると、情報や場の流れが整理され、無理のない進み方を選びやすくなります。",
  },
};

function getNeededEnergy(result: ReturnType<typeof calculateEnergyLightResult>) {
  return [...ENERGY_ORDER].sort((a, b) => {
    const scoreDiff = result.chartPercentages[a] - result.chartPercentages[b];
    if (scoreDiff !== 0) return scoreDiff;

    return ENERGY_ORDER.indexOf(a) - ENERGY_ORDER.indexOf(b);
  })[0];
}

function getNeededPartner(result: ReturnType<typeof calculateEnergyLightResult>) {
  const neededEnergy = getNeededEnergy(result);
  const partner = PARTNER_BY_ENERGY[neededEnergy];
  const typeId = partner.primary === result.typeId ? partner.alternate : partner.primary;

  return {
    neededEnergy,
    typeId,
    type: energyTypeContents[typeId],
    ...partner,
  };
}

export default function EnergyLightResultClient({ resultId }: Props) {
  const searchParams = useSearchParams();
  const encoded = resultId ?? searchParams.get("id");
  const [copied, setCopied] = useState(false);

  const resultState = useMemo(() => {
    if (!encoded) return null;
    const payload = decodeEnergyLightDiagnosisId(encoded);
    if (!isValidEnergyLightPayload(payload)) return null;
    const result = calculateEnergyLightResult(payload);
    return { payload, result };
  }, [encoded]);

  const resultUrl =
    typeof window === "undefined" || !encoded
      ? ""
      : `${window.location.origin}/research/${ENERGY_LIGHT_META.slug}/result/${encoded}`;

  const shareText = useMemo(() => {
    if (!resultState) return "";
    const neededPartner = getNeededPartner(resultState.result);
    return [
      `私は${resultState.result.type.name}型。`,
      `中心のエネルギーは「${energyLabels[resultState.result.primaryEnergy]}」。`,
      `いま必要なのは「${energyLabels[neededPartner.neededEnergy]}」を持つ${neededPartner.type.name}型の人。`,
      resultUrl,
    ].join("\n");
  }, [resultState, resultUrl]);

  const resultLogPayload = useMemo(() => {
    if (!resultState || !encoded) return null;
    const createdAt = new Date().toISOString();
    const tracking = loadStoredTracking(encoded);
    const { payload, result } = resultState;

    return {
      type: "energy_light_result",
      formType: "energy_light_result",
      ...createResearchEventFields("energy_light_result"),
      ...getEnergyLightVersionFields(),
      diagnosisId: encoded,
      createdAt,
      timestamp: createdAt,
      resultUrl,
      answers: payload.values,
      sceneChoice: payload.sceneChoice,
      ...createEnergyLightAnswerColumns(payload),
      ...createEnergyLightScoreColumns(result),
      resultTypeId: result.typeId,
      resultTypeName: result.type.name,
      primaryEnergy: result.primaryEnergy,
      secondaryEnergy: result.secondaryEnergy,
      isPure: result.isPure,
      gap: result.gap,
      answerDetails: energyLightQuestions.map((question, index) => ({
        questionId: question.id,
        questionVersion: getEnergyLightVersionFields().questionVersion,
        order: index + 1,
        questionText: question.text,
        answerValue: payload.values[index],
        energyKey: question.energy,
      })),
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
    const storageKey = `energy-light-result-saved:${resultLogPayload.diagnosisId}`;
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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText, url: resultUrl });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!resultState || !encoded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm text-gray-500">診断データが見つかりませんでした。</p>
        <Link
          href={`/research/${ENERGY_LIGHT_META.slug}`}
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          もう一度診断する
        </Link>
      </div>
    );
  }

  const { result } = resultState;
  const type = result.type;
  const neededPartner = getNeededPartner(result);
  const protectorTypeId = type.relations.protectors[0]?.typeIds[0];

  return (
    <div className="min-h-screen bg-white pb-16">
      <section className="mx-auto max-w-lg px-6 py-10">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          Energy Light Result
        </p>
        <h1 className="mb-2 text-4xl font-bold leading-tight text-black">{type.name}</h1>
        <p className="mb-6 text-lg font-medium text-gray-700">{type.catchcopy}</p>
        <EnergyPentagonChart
          percentages={result.chartPercentages}
          primaryEnergy={result.primaryEnergy}
        />
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <p className="mb-3 text-sm leading-relaxed text-gray-600">{type.essence}</p>
        <p className="rounded-lg border border-gray-200 p-5 text-sm font-bold leading-relaxed text-black">
          {type.salvationLine}
        </p>
        {result.secondEnergyNote && (
          <p className="mt-4 text-sm leading-relaxed text-gray-600">{result.secondEnergyNote}</p>
        )}
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-4 text-lg font-bold text-black">5つのエネルギー</h2>
        <div className="space-y-3">
          {ENERGY_ORDER.map((energy) => (
            <div key={energy} className="flex items-center justify-between border-b border-gray-100 py-2 text-sm">
              <span className="font-medium text-black">{energyLabels[energy]}</span>
              <span className="text-gray-400">{formatScore(result.chartPercentages[energy])}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-4 text-lg font-bold text-black">あなたが自然に渡しているもの</h2>
        <div className="grid gap-3">
          {type.giving.map((item) => (
            <p key={item} className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-4 text-lg font-bold text-black">受け取ると潤うもの</h2>
        <div className="grid gap-3">
          {type.receiving.map((item) => (
            <p key={item} className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      {protectorTypeId && (
        <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
          <h2 className="mb-3 text-lg font-bold text-black">あなたの形に必要な人</h2>
          <p className="mb-5 text-sm leading-relaxed text-gray-600">
            あなたの中で今いちばん余白があるのは「{energyLabels[neededPartner.neededEnergy]}」。
            ここに入る人がいると、今の力がひとりで抱えるものではなく、チームの流れになります。
          </p>
          <article className="rounded-lg bg-black p-5 text-white">
            <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
              Needed Partner
            </p>
            <h3 className="mb-3 text-2xl font-bold leading-snug">{neededPartner.headline}</h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-300">{neededPartner.reason}</p>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-xs text-gray-400">{neededPartner.phrase}</p>
              <p className="mt-1 text-xl font-bold">{neededPartner.type.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                {neededPartner.type.catchcopy}
              </p>
            </div>
          </article>
        </section>
      )}

      {protectorTypeId && (
        <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
          <h2 className="mb-3 text-lg font-bold text-black">一緒にいると育つ関係</h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {type.relations.protectors[0].text}
          </p>
          <p className="rounded-lg border border-gray-200 p-5 text-sm font-bold text-black">
            {energyTypeContents[protectorTypeId].name}
          </p>
        </section>
      )}

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">あなたのスロットに合う人が、ここにいます</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          {type.ctaText}
          今のあなたに必要な「{energyLabels[neededPartner.neededEnergy]}」を持つ人と出会うと、
          できることが少し広がります。
        </p>
        <Link
          href={`/research/${ENERGY_LIGHT_META.slug}/feedback?id=${encodeURIComponent(encoded)}`}
          className="block w-full rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          感想を送る
        </Link>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
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
            className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700"
          >
            X
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(resultUrl)}&text=${encodeURIComponent(shareText)}`}
            className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700"
          >
            LINE
          </a>
        </div>
        <Link
          href={`/research/${ENERGY_LIGHT_META.slug}`}
          className="mt-6 block text-center text-xs text-gray-400 underline underline-offset-4"
        >
          もう一度診断する
        </Link>
      </section>
    </div>
  );
}
