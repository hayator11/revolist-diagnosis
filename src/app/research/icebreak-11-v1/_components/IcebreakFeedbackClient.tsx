"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ICEBREAK_11_META, getIcebreak11VersionFields } from "@/data/researchProjects";
import { icebreakQuestions } from "@/data/icebreakQuestions";
import {
  calculateIcebreakResult,
  createIcebreakAnswerColumns,
  createIcebreakForceColumns,
  decodeIcebreakAnswers,
  getIcebreakResultDetails,
  isValidIcebreakAnswers,
} from "@/lib/calculateIcebreakResult";
import {
  DIAGNOSIS_CORE_PAYLOAD_SCHEMA_VERSION,
  DIAGNOSIS_SHELL_IDS,
} from "@/lib/diagnosisCore/logSchema";
import { createResearchEventFields } from "@/lib/researchTracking";

const RATING_OPTIONS = [1, 2, 3, 4, 5];
const NEXT_OPTIONS = [
  { value: "openchat", label: "オープンチャットで続きがしたい" },
  { value: "event", label: "イベントでまた使いたい" },
  { value: "share", label: "誰かに紹介したい" },
  { value: "watch", label: "まず様子を見たい" },
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

export default function IcebreakFeedbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encoded = searchParams.get("id");
  const [connectionRating, setConnectionRating] = useState(0);
  const [conversationRating, setConversationRating] = useState(0);
  const [nextInterest, setNextInterest] = useState("");
  const [goodPointText, setGoodPointText] = useState("");
  const [wantMoreText, setWantMoreText] = useState("");
  const [freeText, setFreeText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const resultState = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeIcebreakAnswers(encoded);
    if (!isValidIcebreakAnswers(answers)) return null;
    const result = calculateIcebreakResult(answers);
    const details = getIcebreakResultDetails(result);
    return { answers, result, details };
  }, [encoded]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!resultState || !encoded) return;
    if (!connectionRating || !nextInterest) {
      setError("つながりの実感と、次にしてみたいことを選んでください。");
      return;
    }

    setSending(true);
    setError("");

    const createdAt = new Date().toISOString();
    const resultUrl =
      typeof window === "undefined"
        ? ""
        : `${window.location.origin}/research/${ICEBREAK_11_META.slug}/result/${encoded}`;

    const payload = {
      type: "icebreak_feedback",
      formType: "icebreak_feedback",
      ...createResearchEventFields("feedback_submit"),
      ...getIcebreak11VersionFields(),
      payloadSchemaVersion: DIAGNOSIS_CORE_PAYLOAD_SCHEMA_VERSION,
      shellId: DIAGNOSIS_SHELL_IDS["icebreak-11-v1"],
      projectSlug: "icebreak-11-v1",
      diagnosisId: encoded,
      createdAt,
      timestamp: createdAt,
      resultUrl,
      answers: resultState.answers,
      answerCount: resultState.answers.length,
      ...createIcebreakAnswerColumns(resultState.answers),
      ...createIcebreakForceColumns(resultState.result),
      centerForce: resultState.result.centerForce,
      subForce: resultState.result.subForce,
      slotForce: resultState.result.slotForce,
      mainTypeKey: resultState.result.mainTypeKey,
      mainTypeName: resultState.details.mainRole.name,
      partnerTypeKey: resultState.result.partnerTypeKey,
      partnerTypeName: resultState.details.partnerRole.name,
      thirdTypeKey: resultState.result.thirdTypeKey,
      thirdTypeName: resultState.details.thirdRole.name,
      answerDetails: icebreakQuestions.map((question, index) => ({
        questionId: question.id,
        questionVersion: getIcebreak11VersionFields().questionVersion,
        order: index + 1,
        questionText: question.text,
        answerValue: resultState.answers[index],
        forceKey: question.force,
        roleKey: question.role,
      })),
      connectionScore: connectionRating,
      conversationScore: conversationRating || null,
      nextInterest,
      goodPointText,
      wantMoreText,
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

      router.push(`/research/${ICEBREAK_11_META.slug}/thanks`);
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
          href={`/research/${ICEBREAK_11_META.slug}`}
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
          Icebreak Feedback
        </p>
        <h1 className="mb-3 text-3xl font-bold leading-tight text-black">今日のつながりアンケート</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          結果は「{resultState.details.mainRole.name}」でした。この結果が、誰かと話すきっかけになったか教えてください。
        </p>

        <div className="space-y-7">
          <RatingInput
            label="誰かとつながるきっかけになりそう度"
            value={connectionRating}
            onChange={setConnectionRating}
          />
          <RatingInput
            label="会話を始めやすくなりそう度"
            value={conversationRating}
            onChange={setConversationRating}
          />
          <div>
            <p className="mb-3 text-sm font-medium text-black">次にしてみたいこと</p>
            <div className="grid gap-2">
              {NEXT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setNextInterest(option.value)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    nextInterest === option.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <TextAreaInput
            label="よかったところ"
            value={goodPointText}
            onChange={setGoodPointText}
            placeholder="相手候補、会話メモ、席順の見え方など"
          />
          <TextAreaInput
            label="もっと欲しいもの"
            value={wantMoreText}
            onChange={setWantMoreText}
            placeholder="こういう案内があると話しかけやすい、など"
          />
          <details className="rounded-lg border border-gray-200 p-5">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              自由に書く（任意）
            </summary>
            <div className="mt-5">
              <TextAreaInput
                label="自由記入"
                value={freeText}
                onChange={setFreeText}
                placeholder="イベントで使うなら欲しい機能や、オープンチャットで話したいことなど"
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
          {sending ? "送信中..." : "送信して次へ"}
        </button>
      </form>
    </div>
  );
}
