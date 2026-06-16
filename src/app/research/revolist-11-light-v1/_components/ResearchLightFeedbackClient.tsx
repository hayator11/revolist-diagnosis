"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getResearchVersionFields, REVOLIST_11_LIGHT_META } from "@/data/researchProjects";
import { researchLightQuestions } from "@/data/researchLightQuestions";
import {
  calculateResearchLightResult,
  createResearchLightAnswerColumns,
  createResearchLightForceColumns,
  createResearchLightRoleColumns,
  decodeResearchLightAnswers,
  getResearchLightResultDetails,
  isValidResearchLightAnswers,
} from "@/lib/calculateResearchLightResult";
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

function TextInput({
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
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

export default function ResearchLightFeedbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encoded = searchParams.get("id");
  const [fitRating, setFitRating] = useState(0);
  const [clarityRating, setClarityRating] = useState(0);
  const [workUseRating, setWorkUseRating] = useState(0);
  const [communityRating, setCommunityRating] = useState(0);
  const [shareRating, setShareRating] = useState(0);
  const [communityInterest, setCommunityInterest] = useState("");
  const [goodPointText, setGoodPointText] = useState("");
  const [discomfortText, setDiscomfortText] = useState("");
  const [freeText, setFreeText] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const resultState = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeResearchLightAnswers(encoded);
    if (!isValidResearchLightAnswers(answers)) return null;
    const result = calculateResearchLightResult(answers);
    const details = getResearchLightResultDetails(result);
    return { answers, result, details };
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
        : `${window.location.origin}/research/${REVOLIST_11_LIGHT_META.slug}/result/${encoded}`;

    const payload = {
      type: "research_light_feedback",
      formType: "research_light_feedback",
      ...createResearchEventFields("research_light_feedback"),
      ...getResearchVersionFields(),
      diagnosisId: encoded,
      createdAt,
      timestamp: createdAt,
      resultUrl,
      answers: resultState.answers,
      ...createResearchLightAnswerColumns(resultState.answers),
      answerDetails: researchLightQuestions.map((question, index) => ({
        questionId: question.id,
        questionVersion: getResearchVersionFields().questionVersion,
        order: index + 1,
        questionText: question.text,
        answerValue: resultState.answers[index],
        forceKey: question.force,
        roleKey: question.role,
      })),
      personalMean: resultState.result.personalMean,
      ...createResearchLightForceColumns(resultState.result),
      centerForce: resultState.result.centerForce,
      subForce: resultState.result.subForce,
      slotForce: resultState.result.slotForce,
      judgmentMode: resultState.result.mode,
      mainTypeKey: resultState.result.mainType.key,
      mainTypeName: resultState.details.mainRole.name,
      dualTypeKey: resultState.result.dualType?.key ?? null,
      dualTypeName: resultState.details.dualRole?.name ?? null,
      partnerSlotTypeKey: resultState.result.partnerSlotTypeKey,
      familyDetail: resultState.result.familyDetail,
      mainRoleKey: resultState.result.mainType.key,
      mainRoleName: resultState.details.mainRole.name,
      forceScores: resultState.result.forceScores,
      ...createResearchLightRoleColumns(resultState.result),
      fitScore: fitRating || null,
      communityInterest,
      clarityScore: clarityRating || null,
      usefulForWorkScore: workUseRating || null,
      communityTryScore: communityRating || null,
      shareWillingnessScore: shareRating || null,
      goodPointText,
      discomfortText,
      freeText,
      name: name || null,
      contact: contact || null,
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

      router.push(`/research/${REVOLIST_11_LIGHT_META.slug}/thanks`);
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
          href={`/research/${REVOLIST_11_LIGHT_META.slug}`}
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
          Research Feedback
        </p>
        <h1 className="mb-3 text-3xl font-bold leading-tight text-black">感想フォーム</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          結果は「{resultState.details.mainRole.name}型」でした。しっくりきた点や、もう少し調整したい表現を教えてください。
        </p>

        <div className="space-y-7">
          <RatingInput label="結果のしっくり度" value={fitRating} onChange={setFitRating} />
          <TextAreaInput
            label="もう少し調整したいところ"
            value={discomfortText}
            onChange={setDiscomfortText}
            placeholder="言葉が強い、ピンとこない、別タイプに見えるなど"
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
            <div className="mt-6 space-y-7">
              <RatingInput label="結果原稿のわかりやすさ" value={clarityRating} onChange={setClarityRating} />
              <RatingInput label="仕事や活動に活かせそう度" value={workUseRating} onChange={setWorkUseRating} />
              <RatingInput label="コミュニティで試してみたい度" value={communityRating} onChange={setCommunityRating} />
              <RatingInput label="誰かに紹介したい度" value={shareRating} onChange={setShareRating} />
              <TextAreaInput
                label="しっくりきたところ"
                value={goodPointText}
                onChange={setGoodPointText}
                placeholder="当たっている、使えそう、言葉がよかったなど"
              />
              <TextAreaInput
                label="自由記入"
                value={freeText}
                onChange={setFreeText}
                placeholder="改善案や追加してほしいことがあれば"
              />
              <TextInput label="お名前・ニックネーム 任意" value={name} onChange={setName} placeholder="任意" />
              <TextInput label="連絡先 任意" value={contact} onChange={setContact} placeholder="メール、SNSなど" />
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
