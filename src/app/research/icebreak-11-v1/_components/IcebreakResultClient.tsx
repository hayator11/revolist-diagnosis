"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import OpenChatInvite from "@/components/OpenChatInvite";
import { getIcebreakRoleResultCopy } from "@/data/icebreakRoleResultCopy";
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
  FORCE_DEFINITIONS,
  FORCE_LABELS,
} from "@/lib/diagnosisCore/forces";
import {
  DIAGNOSIS_CORE_PAYLOAD_SCHEMA_VERSION,
  DIAGNOSIS_SHELL_IDS,
} from "@/lib/diagnosisCore/logSchema";
import { createResearchEventFields } from "@/lib/researchTracking";

const PUBLIC_SHARE_ORIGIN = "https://revo.onokun.com";

interface Props {
  resultId?: string;
}

export default function IcebreakResultClient({ resultId }: Props) {
  const searchParams = useSearchParams();
  const encoded = resultId ?? searchParams.get("id");
  const [copied, setCopied] = useState(false);

  const resultState = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeIcebreakAnswers(encoded);
    if (!isValidIcebreakAnswers(answers)) return null;
    const result = calculateIcebreakResult(answers);
    const details = getIcebreakResultDetails(result);
    return { answers, result, details };
  }, [encoded]);

  const resultPath = encoded ? `/research/${ICEBREAK_11_META.slug}/result/${encoded}` : "";
  const resultUrl =
    typeof window === "undefined" || !encoded
      ? ""
      : `${window.location.origin}${resultPath}`;

  useEffect(() => {
    if (!resultState || !encoded) return;
    const storageKey = `icebreak-result-saved:${encoded}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    const createdAt = new Date().toISOString();

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "icebreak_result",
        formType: "icebreak_result",
        ...createResearchEventFields("result_view"),
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
        slotForce: resultState.result.slotForce,
        mainTypeKey: resultState.result.mainTypeKey,
        mainTypeName: resultState.details.mainRole.name,
        partnerTypeKey: resultState.result.partnerTypeKey,
        partnerTypeName: resultState.details.partnerRole.name,
        answerDetails: icebreakQuestions.map((question, index) => ({
          questionId: question.id,
          questionVersion: getIcebreak11VersionFields().questionVersion,
          order: index + 1,
          questionText: question.text,
          answerValue: resultState.answers[index],
          forceKey: question.force,
          roleKey: question.role,
        })),
      }),
    })
      .then(() => window.sessionStorage.setItem(storageKey, "true"))
      .catch(() => {
        // Logging must not block result display.
      });
  }, [encoded, resultState, resultUrl]);

  const fallbackShareResultUrl = resultPath ? `${PUBLIC_SHARE_ORIGIN}${resultPath}` : "";
  const shareResultUrl = resultUrl || fallbackShareResultUrl;

  const shareText = useMemo(() => {
    if (!resultState) return "";
    const shareRoleCopy = getIcebreakRoleResultCopy(resultState.result.mainTypeKey);
    const shareUrl = shareResultUrl;

    if (shareRoleCopy) {
      return [
        shareRoleCopy.shareCopy,
        "",
        "Icebreak 33で診断してみました。",
        "あなたはどんな役割が出る？",
        "",
        shareUrl,
      ].join("\n");
    }

    return [
      `私は今日、${resultState.details.mainRole.name}っぽく場に入れそう。`,
      `話してみたいのは${resultState.details.partnerRole.name}タイプ。`,
      shareUrl,
    ].join("\n");
  }, [resultState, shareResultUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText, url: shareResultUrl });
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
          href={`/research/${ICEBREAK_11_META.slug}`}
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          もう一度はじめる
        </Link>
      </div>
    );
  }

  const { result, details } = resultState;
  const centerForce = FORCE_DEFINITIONS[result.centerForce];
  const slotForce = FORCE_DEFINITIONS[result.slotForce];
  const roleCopy = getIcebreakRoleResultCopy(result.mainTypeKey);
  const validationHref = shareResultUrl
    ? `/research/${ICEBREAK_11_META.slug}/validation?result_url=${encodeURIComponent(shareResultUrl)}`
    : `/research/${ICEBREAK_11_META.slug}/validation`;

  return (
    <div className="min-h-screen bg-white pb-16">
      <section className="mx-auto max-w-lg px-6 py-10">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          Icebreak 33 Result
        </p>
        <h1 className="mb-3 text-3xl font-bold leading-tight text-black">あなたの11役割</h1>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          まずは今日の会話で使える役割名として見てみてください。
        </p>
        <article className="mb-6 rounded-lg border border-gray-200 bg-black p-5 text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Profile Card
          </p>
          <p className="text-2xl font-bold leading-snug">
            今日の私は、{details.mainRole.name}タイプ。
          </p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-gray-200">
            {roleCopy?.catchCopy ?? details.mainNavigation.publicLabel}
          </p>
          <div className="mt-5 rounded-lg bg-white/10 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              可能性を引き出し合いやすい相手
            </p>
            <p className="text-xl font-bold leading-snug">
              {details.partnerRole.name}タイプ / {details.thirdRole.name}タイプ
            </p>
          </div>
        </article>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">{details.lead}</p>
        {roleCopy && (
          <article className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <p className="text-xl font-bold leading-snug text-black">{roleCopy.workingCopy}</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-gray-700">{roleCopy.catchCopy}</p>
            <div className="mt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                こんなところありませんか？
              </p>
              <ul className="space-y-2">
                {roleCopy.selfCheckItems.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
        <div className="rounded-lg border border-gray-200 p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            補助情報：あなたの中心にある力
          </p>
          <p className="text-2xl font-bold" style={{ color: centerForce.color }}>
            {FORCE_LABELS[result.centerForce]}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{centerForce.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">今日の動き方</h2>
        <article className="rounded-lg border border-gray-200 p-5">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">Movement Style</p>
          <p className="text-2xl font-bold" style={{ color: result.movementStyle.primaryStyle.color }}>
            {details.movementHeadline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{details.movementReason}</p>
        </article>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">今日、つながると動き出す人</h2>
        <article className="rounded-lg bg-black p-5 text-white">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
            受け取りたい力: {slotForce.label}
          </p>
          <h3 className="mb-3 text-2xl font-bold leading-snug">{details.partnerHeadline}</h3>
          <p className="mb-5 text-sm leading-relaxed text-gray-300">{details.partnerReason}</p>
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xl font-bold">{details.partnerRole.name}</p>
            <p className="mt-1 text-sm text-gray-300">{details.partnerNavigation.publicLabel}</p>
          </div>
        </article>
        <p className="mt-5 rounded-lg border border-gray-200 p-5 text-sm font-bold leading-relaxed text-black">
          {details.nextAction}
        </p>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-4 text-lg font-bold text-black">この場で起きやすい組み合わせ</h2>
        <div className="grid gap-3">
          {details.connectionCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-gray-200 p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">{card.title}</p>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                  {card.forceLabel}
                </span>
                <span className="text-sm font-bold text-black">{card.roleName}</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-4 text-lg font-bold text-black">最初の会話メモ</h2>
        <div className="space-y-3">
          {details.conversationOpeners.map((opener, index) => (
            <p key={opener} className="rounded-lg bg-gray-50 p-4 text-sm font-medium leading-relaxed text-black">
              {index + 1}. {opener}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">結果を誰かに見せる</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          気になった人に送ったり、自己紹介のきっかけとして使ってみてください。
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
            className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700"
          >
            X
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareResultUrl)}&text=${encodeURIComponent(shareText)}`}
            className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700"
          >
            LINE
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <OpenChatInvite context="icebreak" />
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">この診断をよくするために感想を送る</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          しっくりきた部分や、違和感があった言葉を教えてください。本名や個人情報は不要です。
        </p>
        <Link
          href={validationHref}
          className="block w-full rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white"
        >
          検証フォームに回答する
        </Link>
      </section>

      <section className="mx-auto max-w-lg border-t border-gray-100 px-6 py-8">
        <h2 className="mb-3 text-lg font-bold text-black">簡易アンケート</h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          今日の結果が話しかけるきっかけになったか、短く残したい場合はこちらから送れます。
        </p>
        <Link
          href={`/research/${ICEBREAK_11_META.slug}/feedback?id=${encodeURIComponent(encoded)}`}
          className="block w-full rounded-full border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-700"
        >
          簡易アンケートに答える
        </Link>
      </section>
    </div>
  );
}
