"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ICEBREAK_11_META } from "@/data/researchProjects";

const RATING_OPTIONS = [1, 2, 3, 4, 5];
const MATCHING_RESISTANCE_OPTIONS = [
  "抵抗はない",
  "少し気になる",
  "かなり抵抗がある",
  "内容による",
  "わからない",
];

function isUrlLike(value: string) {
  return /^https?:\/\//.test(value) || value.includes("/research/");
}

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
  helper,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helper?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">{label}</label>
      {helper && <p className="mb-2 text-xs leading-relaxed text-gray-500">{helper}</p>}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        required={required}
        maxLength={2000}
        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

export default function IcebreakValidationClient() {
  const [reference, setReference] = useState("");
  const [fitScore, setFitScore] = useState(0);
  const [selfLikeText, setSelfLikeText] = useState("");
  const [discomfortText, setDiscomfortText] = useState("");
  const [conversationUseScore, setConversationUseScore] = useState(0);
  const [matchingUseScore, setMatchingUseScore] = useState(0);
  const [wantToKnowText, setWantToKnowText] = useState("");
  const [freeComment, setFreeComment] = useState("");
  const [selfTypeText, setSelfTypeText] = useState("");
  const [othersSayText, setOthersSayText] = useState("");
  const [hardQuestionText, setHardQuestionText] = useState("");
  const [neutralReasonText, setNeutralReasonText] = useState("");
  const [matchingResistance, setMatchingResistance] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedReference = reference.trim();
    if (!trimmedReference) {
      setError("診断IDまたは結果URLを入力してください。");
      return;
    }

    if (!fitScore || !conversationUseScore || !matchingUseScore) {
      setError("3つのスコア項目を選んでください。");
      return;
    }

    if (!selfLikeText.trim() || !discomfortText.trim()) {
      setError("自分らしい点と、違和感があった部分を入力してください。");
      return;
    }

    setSending(true);
    setError("");

    const payload = {
      diagnosis_id: isUrlLike(trimmedReference) ? undefined : trimmedReference,
      result_url: isUrlLike(trimmedReference) ? trimmedReference : undefined,
      fit_score: fitScore,
      self_like_text: selfLikeText,
      discomfort_text: discomfortText,
      conversation_use_score: conversationUseScore,
      matching_use_score: matchingUseScore,
      want_to_know_text: wantToKnowText,
      free_comment: freeComment,
      self_type_text: selfTypeText,
      others_say_text: othersSayText,
      hard_question_text: hardQuestionText,
      neutral_reason_text: neutralReasonText,
      matching_resistance: matchingResistance,
    };

    try {
      const response = await fetch("/api/icebreak/centered-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError("送信できませんでした。少し時間をおいて、もう一度お試しください。");
        return;
      }

      setSent(true);
    } catch {
      setError("送信できませんでした。通信環境を確認して、もう一度お試しください。");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-14">
        <div className="max-w-lg text-center">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
            Validation Feedback
          </p>
          <h1 className="mb-4 text-3xl font-bold text-black">送信ありがとうございました</h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-600">
            いただいた回答は、Icebreak 33 の診断結果が人の感覚に近づいているかを確かめるために使います。
          </p>
          <Link
            href={`/research/${ICEBREAK_11_META.slug}`}
            className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
          >
            診断ページへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          Icebreak 33 Validation
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-black">
          診断結果の検証アンケート
        </h1>
        <div className="mb-8 space-y-3 text-sm leading-relaxed text-gray-600">
          <p>Icebreak 33 の診断結果をよりよくするための検証アンケートです。</p>
          <p>個人を評価するものではありません。本名や個人情報の入力は不要です。</p>
          <p>所要時間は3〜5分ほどです。診断結果を見たあとに答えてください。</p>
        </div>

        <div className="space-y-7">
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              診断IDまたは結果URL
            </label>
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              required
              maxLength={1000}
              placeholder="結果URL、または診断ID"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:border-gray-400 focus:outline-none"
            />
          </div>

          <RatingInput
            label="診断結果のしっくり度"
            value={fitScore}
            onChange={setFitScore}
          />

          <TextAreaInput
            label="自分らしいと感じた部分"
            value={selfLikeText}
            onChange={setSelfLikeText}
            placeholder="結果の中で、近いと感じた言葉や要素"
            required
          />

          <TextAreaInput
            label="違和感があった部分"
            value={discomfortText}
            onChange={setDiscomfortText}
            placeholder="違和感がなければ「特になし」でOK"
            helper="違和感がなければ「特になし」でOKです。"
            required
          />

          <RatingInput
            label="自己紹介や会話のきっかけに使えそうか"
            value={conversationUseScore}
            onChange={setConversationUseScore}
          />

          <RatingInput
            label="オフ会で人とつながるきっかけになりそうか"
            value={matchingUseScore}
            onChange={setMatchingUseScore}
          />

          <details className="rounded-lg border border-gray-200 p-5">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              任意でくわしく書く
            </summary>
            <div className="mt-6 space-y-6">
              <TextAreaInput
                label="もう少し知りたい要素"
                value={wantToKnowText}
                onChange={setWantToKnowText}
                placeholder="相性、席順、タイプ説明など"
              />
              <TextAreaInput
                label="自由コメント"
                value={freeComment}
                onChange={setFreeComment}
                placeholder="感じたことを自由に書いてください"
              />
              <TextAreaInput
                label="自分ではどんなタイプだと思うか"
                value={selfTypeText}
                onChange={setSelfTypeText}
                placeholder="自分で思う特徴や役割"
              />
              <TextAreaInput
                label="人からよく言われる特徴"
                value={othersSayText}
                onChange={setOthersSayText}
                placeholder="よく言われる言葉や印象"
              />
              <TextAreaInput
                label="答えにくかった設問"
                value={hardQuestionText}
                onChange={setHardQuestionText}
                placeholder="迷った設問や、言葉が難しかった設問"
              />
              <TextAreaInput
                label="「どちらでもない」を選んだ理由"
                value={neutralReasonText}
                onChange={setNeutralReasonText}
                placeholder="迷った理由、場面によって変わるなど"
              />
              <div>
                <p className="mb-3 text-sm font-medium text-black">
                  マッチングや席替えに使われることへの抵抗感
                </p>
                <div className="grid gap-2">
                  {MATCHING_RESISTANCE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMatchingResistance(option)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                        matchingResistance === option
                          ? "border-black bg-black text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="mt-8 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {sending ? "送信中..." : "検証アンケートを送信する"}
        </button>
      </form>
    </div>
  );
}
