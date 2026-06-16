"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ENERGY_LIGHT_META, getEnergyLightVersionFields } from "@/data/researchProjects";
import {
  calculateEnergyLightResult,
  createEnergyLightAnswerColumns,
  createEnergyLightScoreColumns,
  decodeEnergyLightDiagnosisId,
  isValidEnergyLightPayload,
} from "@/lib/calculateEnergyLightResult";
import { createResearchEventFields } from "@/lib/researchTracking";

const RATING_OPTIONS = [1, 2, 3, 4, 5];
const COMMUNITY_OPTIONS = [
  { value: "join", label: "参加してみたい" },
  { value: "look", label: "まず見てみたい" },
  { value: "hear", label: "説明を聞きたい" },
  { value: "later", label: "今は様子見" },
];

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black">{label}</label>
      <div className="grid grid-cols-5 gap-2">
        {RATING_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border py-3 text-sm font-medium transition-colors ${
              value === option
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

export default function EnergyLightFeedbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encoded = searchParams.get("id");
  const [fitRating, setFitRating] = useState(0);
  const [communityInterest, setCommunityInterest] = useState("");
  const [adjustText, setAdjustText] = useState("");
  const [freeText, setFreeText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const resultState = useMemo(() => {
    if (!encoded) return null;
    const payload = decodeEnergyLightDiagnosisId(encoded);
    if (!isValidEnergyLightPayload(payload)) return null;
    const result = calculateEnergyLightResult(payload);
    return { payload, result };
  }, [encoded]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resultState || !encoded) return;
    if (!fitRating || !communityInterest) {
      setError("結果のしっくり度と、コミュニティについての回答を選んでください。");
      return;
    }

    setSending(true);
    setError("");

    const createdAt = new Date().toISOString();
    const resultUrl =
      typeof window === "undefined"
        ? ""
        : `${window.location.origin}/research/${ENERGY_LIGHT_META.slug}/result/${encoded}`;

    const payload = {
      type: "energy_light_feedback",
      formType: "energy_light_feedback",
      ...createResearchEventFields("energy_light_feedback"),
      ...getEnergyLightVersionFields(),
      diagnosisId: encoded,
      createdAt,
      timestamp: createdAt,
      resultUrl,
      answers: resultState.payload.values,
      sceneChoice: resultState.payload.sceneChoice,
      ...createEnergyLightAnswerColumns(resultState.payload),
      ...createEnergyLightScoreColumns(resultState.result),
      resultTypeId: resultState.result.typeId,
      resultTypeName: resultState.result.type.name,
      primaryEnergy: resultState.result.primaryEnergy,
      secondaryEnergy: resultState.result.secondaryEnergy,
      isPure: resultState.result.isPure,
      gap: resultState.result.gap,
      fitScore: fitRating,
      communityInterest,
      adjustText,
      freeText,
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError(`送信が完了しませんでした（${response.status}）。もう一度お試しください。`);
        return;
      }

      router.push(`/research/${ENERGY_LIGHT_META.slug}/thanks`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`送信エラー: ${message}`);
    } finally {
      setSending(false);
    }
  };

  if (!resultState || !encoded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm text-gray-500">感想を送る診断結果が見つかりませんでした。</p>
        <Link
          href={`/research/${ENERGY_LIGHT_META.slug}`}
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          診断からはじめる
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          Energy Light Feedback
        </p>
        <h1 className="mb-3 text-3xl font-bold leading-tight text-black">感想フォーム</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          結果は「{resultState.result.type.name}型」でした。しっくりきた点や、もう少し調整したい表現を教えてください。
        </p>

        <div className="space-y-7">
          <RatingInput label="結果のしっくり度" value={fitRating} onChange={setFitRating} />
          <TextAreaInput
            label="もう少し調整したいところ 任意"
            value={adjustText}
            onChange={setAdjustText}
            placeholder="言葉を変えたい、説明を増やしたいなど"
          />
          <div>
            <p className="mb-3 text-sm font-medium text-black">コミュニティについて</p>
            <div className="grid gap-2">
              {COMMUNITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCommunityInterest(option.value)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    communityInterest === option.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <details className="rounded-lg border border-gray-200 p-5">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              もっと詳しく答える（任意）
            </summary>
            <div className="mt-6">
              <TextAreaInput
                label="自由記入"
                value={freeText}
                onChange={setFreeText}
                placeholder="改善案や追加してほしいことがあれば"
              />
            </div>
          </details>
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="mt-8 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {sending ? "送信中..." : "感想を送信する"}
        </button>
      </form>
    </div>
  );
}
