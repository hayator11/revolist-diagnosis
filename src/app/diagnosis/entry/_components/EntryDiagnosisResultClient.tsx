"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OpenChatInvite from "@/components/OpenChatInvite";
import { selectEntryOpenChatInviteCopy } from "@/data/entryOpenChatInviteCopy";
import { entryDiagnosisResultCopy } from "@/data/entryDiagnosisResultCopy";
import { selectEntryShareCopy } from "@/data/entryDiagnosisShareCopy";
import {
  calculateEntryDiagnosisResult,
  decodeEntryAnswers,
  getEntryResultNudge,
  isValidEntryAnswers,
} from "@/lib/calculateEntryDiagnosisResult";
import { revoTypes } from "@/data/revotypes";

function percentBar(value: number) {
  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-black" style={{ width: `${value}%` }} />
    </div>
  );
}

const FEEDBACK_FIT_OPTIONS = [
  "当たってる",
  "少し違う",
  "このタイプじゃない気がする",
];

const FEEDBACK_QUESTION_OPTIONS = [
  "迷った",
  "意味がわからなかった",
  "選択肢が似ていた",
];

const FEEDBACK_RESULT_COPY_OPTIONS = [
  "言葉が刺さった",
  "説明が抽象的",
  "もっと具体例がほしい",
];

const FEEDBACK_NEXT_INTEREST_OPTIONS = [
  "誰と組むといいか",
  "仕事でどう使うか",
  "深掘り診断がほしい",
];

function FeedbackChoiceButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-left text-xs font-medium transition-colors ${
        selected
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

export default function EntryDiagnosisResultClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers") ?? "";
  const [copied, setCopied] = useState(false);
  const [feedbackFit, setFeedbackFit] = useState("");
  const [feedbackQuestionIssues, setFeedbackQuestionIssues] = useState<string[]>([]);
  const [feedbackResultCopyIssues, setFeedbackResultCopyIssues] = useState<string[]>([]);
  const [feedbackNextInterests, setFeedbackNextInterests] = useState<string[]>([]);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const resultState = useMemo(() => {
    const answers = decodeEntryAnswers(encoded);
    if (!isValidEntryAnswers(answers)) return null;
    return {
      answers,
      result: calculateEntryDiagnosisResult(answers),
    };
  }, [encoded]);

  useEffect(() => {
    if (!resultState || !encoded) return;
    const storageKey = `entry-diagnosis-saved:${encoded}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    const mainType = revoTypes[resultState.result.main.key];
    const subType = revoTypes[resultState.result.sub.key];
    const auxiliaryType = revoTypes[resultState.result.auxiliary.key];

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "entry_diagnosis",
        formType: "entry_diagnosis",
        timestamp: new Date().toISOString(),
        diagnosisType: "entry_11",
        diagnosisId: encoded,
        answers: resultState.answers,
        resultTitle: `${mainType.name} × ${subType.name} × ${auxiliaryType.name}`,
        resultSummary: mainType.catchcopy,
        mainRoleKey: mainType.key,
        mainRoleName: mainType.name,
        subRoleKey: subType.key,
        subRoleName: subType.name,
        supportRoleKey: auxiliaryType.key,
        supportRoleName: auxiliaryType.name,
        pagePath: window.location.pathname,
      }),
    })
      .then(() => {
        window.sessionStorage.setItem(storageKey, "true");
      })
      .catch(() => {
        // Result display should not depend on logging.
      });
  }, [encoded, resultState]);

  if (!resultState) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm text-gray-500">診断データが見つかりませんでした。</p>
        <Link
          href="/diagnosis/entry"
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          入口診断をはじめる
        </Link>
      </main>
    );
  }

  const { result } = resultState;
  const mainType = revoTypes[result.main.key];
  const subType = revoTypes[result.sub.key];
  const auxiliaryType = revoTypes[result.auxiliary.key];
  const partnerTypes = result.partnerTypes.map((key) => revoTypes[key]);
  const resultCopy = entryDiagnosisResultCopy[mainType.key];
  const shareCopy = selectEntryShareCopy(encoded, mainType.key);
  const openChatCopy = selectEntryOpenChatInviteCopy(encoded);
  const partnerNamesText = partnerTypes.map((type) => `「${type.name}」`).join("と");
  const shareText = [
    shareCopy.intro.text,
    "",
    `今の私は「${mainType.name}」タイプでした。`,
    "",
    "可能性が動き出しやすい相手は",
    `${partnerNamesText}でした。`,
    "",
    shareCopy.callout.text,
    "",
    "あなたは何タイプ？",
    "#レボリスト診断",
  ].join("\n");
  const shareUrl = `https://revo.onokun.com/diagnosis/entry/result?answers=${encodeURIComponent(encoded)}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sharing should not block result display.
    }
  };

  const handleSubmitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const comment = feedbackComment.trim();
    const selectedFeedbackItems = [
      feedbackFit,
      ...feedbackQuestionIssues,
      ...feedbackResultCopyIssues,
      ...feedbackNextInterests,
    ].filter(Boolean);

    if (selectedFeedbackItems.length === 0 && !comment) {
      setFeedbackError("どれか一つだけでも選ぶか、コメントを書いてください。");
      return;
    }

    setFeedbackSending(true);
    setFeedbackError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "entry_diagnosis_feedback",
          formType: "entry_diagnosis_feedback",
          timestamp: new Date().toISOString(),
          diagnosisType: "entry_11",
          diagnosisId: encoded,
          answers: resultState.answers,
          mainRoleKey: mainType.key,
          mainRoleName: mainType.name,
          subRoleKey: subType.key,
          subRoleName: subType.name,
          supportRoleKey: auxiliaryType.key,
          supportRoleName: auxiliaryType.name,
          fitAnswer: feedbackFit,
          questionIssueAnswers: feedbackQuestionIssues,
          resultCopyAnswers: feedbackResultCopyIssues,
          nextInterestAnswers: feedbackNextInterests,
          freeComment: comment,
          impressionText: [feedbackFit, ...feedbackResultCopyIssues].filter(Boolean).join(" / "),
          discomfortText: feedbackQuestionIssues.join(" / "),
          improvementRequestText: feedbackNextInterests.join(" / "),
          freeText: [
            feedbackFit && `結果の納得感: ${feedbackFit}`,
            feedbackQuestionIssues.length > 0 &&
              `質問の答えやすさ: ${feedbackQuestionIssues.join(" / ")}`,
            feedbackResultCopyIssues.length > 0 &&
              `役割名・結果文: ${feedbackResultCopyIssues.join(" / ")}`,
            feedbackNextInterests.length > 0 &&
              `次に知りたいこと: ${feedbackNextInterests.join(" / ")}`,
            comment && `コメント: ${comment}`,
          ]
            .filter(Boolean)
            .join("\n"),
          pagePath: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("feedback failed");
      }

      setFeedbackSubmitted(true);
      setFeedbackFit("");
      setFeedbackQuestionIssues([]);
      setFeedbackResultCopyIssues([]);
      setFeedbackNextInterests([]);
      setFeedbackComment("");
    } catch {
      setFeedbackError("送信できませんでした。時間をおいてもう一度お試しください。");
    } finally {
      setFeedbackSending(false);
    }
  };

  const toggleFeedbackSelection = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
  ) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((selectedValue) => selectedValue !== value)
        : [...selectedValues, value],
    );
  };

  return (
    <main className="bg-white px-6 py-12">
      <div className="mx-auto max-w-lg">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-gray-400">
          Entry Result
        </p>

        <section className="mb-6 rounded-[28px] bg-black p-7 text-white">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            今のあなたは
          </p>
          <h1 className="mb-3 text-4xl font-bold leading-tight">
            {mainType.name}
          </h1>
          <p className="mb-4 text-xl font-bold leading-snug text-white">
            {resultCopy.title}
          </p>
          <p className="mb-5 text-sm leading-relaxed text-gray-300">
            {resultCopy.oneLiner}
          </p>
          <div className="h-px bg-gray-800" />
          <p className="mt-5 text-sm leading-relaxed text-gray-300">
            {getEntryResultNudge(mainType.key)}
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Your scene
          </p>
          <h2 className="mb-3 text-xl font-bold text-black">
            こんな場面で出てきやすい役割です
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            {resultCopy.scene}
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Your moves
          </p>
          <h2 className="mb-3 text-xl font-bold text-black">
            ついやりがちなムーブ
          </h2>
          <div className="space-y-3">
            {resultCopy.moves.map((move, index) => (
              <p key={move} className="rounded-2xl bg-gray-50 p-4 text-sm font-medium leading-relaxed text-black">
                {index + 1}. {move}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            From others
          </p>
          <h2 className="mb-3 text-xl font-bold text-black">
            周りから見ると
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {resultCopy.seenAs}
          </p>
          <div className="flex flex-wrap gap-2">
            {mainType.gives.map((value) => (
              <span key={value} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
                {value}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            With whom
          </p>
          <h2 className="mb-3 text-xl font-bold text-black">
            可能性を引き出し合いやすい相手
          </h2>
          <div className="space-y-3">
            {partnerTypes.map((type) => (
              <div key={type.key} className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-bold text-black">{type.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{type.catchcopy}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-400">
            これは「合う・合わない」を決めるものではなく、会話やチームづくりの入口です。
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 bg-black p-6 text-white">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
            Share
          </p>
          <h2 className="mb-3 text-xl font-bold text-white">
            この結果、誰かに見せてみる？
          </h2>
          <p className="mb-5 whitespace-pre-line rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-gray-200">
            {shareText}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100"
            >
              {copied ? "コピー済み" : "コピー"}
            </button>
            <a
              href={xShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Xでシェア
            </a>
            <a
              href={lineShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              LINE
            </a>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Your mix
          </p>
          <h2 className="mb-4 text-xl font-bold text-black">
            もう少し詳しく見ると
          </h2>
          <div className="space-y-4">
            {[
              { label: "強く出ている役割", type: mainType, score: result.main.percentage },
              { label: "一緒に出ている役割", type: subType, score: result.sub.percentage },
              { label: "これから育ちやすい役割", type: auxiliaryType, score: result.auxiliary.percentage },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="mt-1 text-sm font-bold text-black">{item.type.name}</p>
                  </div>
                  <p className="text-xs text-gray-400">{item.score}%</p>
                </div>
                {percentBar(item.score)}
              </div>
            ))}
          </div>
        </section>

        <div className="mb-6">
          <OpenChatInvite context="diagnosis" copy={openChatCopy} />
        </div>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Feedback
          </p>
          <h2 className="mb-3 text-xl font-bold text-black">
            やってみた感想を教えてください
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-gray-600">
            近いものをタップするだけで大丈夫です。いただいた反応をもとに、
            質問や結果文をもっとしっくりくる診断へ育てます。
          </p>

          {feedbackSubmitted ? (
            <div className="rounded-2xl bg-gray-50 p-5 text-center">
              <p className="mb-2 text-sm font-bold text-black">ありがとうございます。</p>
              <p className="text-xs leading-relaxed text-gray-500">
                いただいた感想は、質問や結果文の改善に活かします。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-3 text-xs font-bold text-gray-500">
                  A. 結果の納得感
                </p>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_FIT_OPTIONS.map((option) => (
                    <FeedbackChoiceButton
                      key={option}
                      label={option}
                      selected={feedbackFit === option}
                      onClick={() => setFeedbackFit(feedbackFit === option ? "" : option)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-1 text-xs font-bold text-gray-500">
                  B. 質問の答えやすさ
                </p>
                <p className="mb-3 text-xs text-gray-400">複数選べます</p>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_QUESTION_OPTIONS.map((option) => (
                    <FeedbackChoiceButton
                      key={option}
                      label={option}
                      selected={feedbackQuestionIssues.includes(option)}
                      onClick={() =>
                        toggleFeedbackSelection(
                          option,
                          feedbackQuestionIssues,
                          setFeedbackQuestionIssues,
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-1 text-xs font-bold text-gray-500">
                  C. 役割名・結果文の伝わり方
                </p>
                <p className="mb-3 text-xs text-gray-400">複数選べます</p>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_RESULT_COPY_OPTIONS.map((option) => (
                    <FeedbackChoiceButton
                      key={option}
                      label={option}
                      selected={feedbackResultCopyIssues.includes(option)}
                      onClick={() =>
                        toggleFeedbackSelection(
                          option,
                          feedbackResultCopyIssues,
                          setFeedbackResultCopyIssues,
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="mb-1 text-xs font-bold text-gray-500">
                  D. 次に知りたいこと
                </p>
                <p className="mb-3 text-xs text-gray-400">複数選べます</p>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_NEXT_INTEREST_OPTIONS.map((option) => (
                    <FeedbackChoiceButton
                      key={option}
                      label={option}
                      selected={feedbackNextInterests.includes(option)}
                      onClick={() =>
                        toggleFeedbackSelection(
                          option,
                          feedbackNextInterests,
                          setFeedbackNextInterests,
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-gray-500">
                  ひとことあれば教えてください（任意）
                </span>
                <textarea
                  value={feedbackComment}
                  onChange={(event) => setFeedbackComment(event.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-relaxed text-black outline-none transition-colors placeholder:text-gray-300 focus:border-black"
                  placeholder="例: この質問で迷った、結果のこの言葉がよかった など"
                />
              </label>

              {feedbackError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-xs text-red-600">
                  {feedbackError}
                </p>
              )}

              <button
                type="submit"
                disabled={feedbackSending}
                className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {feedbackSending ? "送信中..." : "感想を送る"}
              </button>
            </form>
          )}
        </section>

        <div className="space-y-3">
          <Link
            href="/diagnosis/entry"
            className="block rounded-2xl border border-gray-200 px-6 py-4 text-center text-sm font-medium text-gray-700"
          >
            もう一度11問で試す
          </Link>
        </div>
      </div>
    </main>
  );
}
