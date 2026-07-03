"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  calculateOnokunSatooyaResult,
  decodeOnokunSatooyaAnswers,
  isValidOnokunSatooyaAnswers,
} from "../_lib/calculateOnokunSatooyaResult";
import {
  createOnokunSatooyaEventFields,
  getOnokunSatooyaDeviceLabel,
} from "../_lib/onokunSatooyaTracking";
import { revo111Roles, matchRules } from "@/data/revo111Roles";

const DIAGNOSIS_PATH = "/research/onokun-satooya-11-v1";
const ONOKUN_CHILD_NAME_SESSION_KEY = "onokun-satooya-child-name";
const ONOKUN_OPEN_CHAT_URL =
  "https://line.me/ti/g2/l_r88aCvFnX6D6JqjLQBnIi1zhEatqT-tk2c4Q?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

export default function OnokunSatooyaResultClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers") ?? "";
  const [copied, setCopied] = useState(false);
  const [childName] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (window.sessionStorage.getItem(ONOKUN_CHILD_NAME_SESSION_KEY)?.trim() ?? ""),
  );
  const [totalDiagnosisCount, setTotalDiagnosisCount] = useState<number | null>(null);

  const answers = useMemo(() => decodeOnokunSatooyaAnswers(encoded), [encoded]);

  const resultState = useMemo(() => {
    if (!isValidOnokunSatooyaAnswers(answers)) return null;
    return calculateOnokunSatooyaResult(answers);
  }, [answers]);

  useOnokunShell();

  const resultUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}${DIAGNOSIS_PATH}/result?answers=${encoded}`;

  const childLabel = childName || "うちの子";

  const shareText = resultState
    ? [
        `${childLabel}とのご縁タイプは「${resultState.mainType.name}」でした。`,
        resultState.mainType.shareCatch,
        `親バカあるある: ${resultState.mainType.parentBakaLine}`,
        "おのくん里親さん 11ご縁タイプ診断",
        resultUrl,
      ].join("\n")
    : "";
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareUrl = encodeURIComponent(resultUrl);
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedShareText}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedShareUrl}`;

  useEffect(() => {
    if (!resultState || !isValidOnokunSatooyaAnswers(answers)) return;

    const storageKey = `onokun-satooya-result-saved:${encoded}`;
    const countStorageKey = `onokun-satooya-result-count:${encoded}`;

    if (window.sessionStorage.getItem(storageKey)) return;

    const createdAt = new Date().toISOString();
    fetch("/api/onokun-satooya/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...createOnokunSatooyaEventFields("onokun_satooya_result"),
        diagnosisId: encoded,
        createdAt,
        timestamp: createdAt,
        answers,
        answerCount: answers.length,
        resultUrl,
        pagePath: window.location.pathname,
        device: getOnokunSatooyaDeviceLabel(),
      }),
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as {
          saved?: boolean;
          totalDiagnosisCount?: number;
        } | null;

        if (response.ok) {
          window.sessionStorage.setItem(storageKey, "true");
        }

        if (data?.saved && typeof data.totalDiagnosisCount === "number") {
          setTotalDiagnosisCount(data.totalDiagnosisCount);
          window.sessionStorage.setItem(countStorageKey, String(data.totalDiagnosisCount));
        }
      })
      .catch(() => {
        // Database logging must not block result display.
      });
  }, [answers, encoded, resultState, resultUrl]);

  const handleShare = async () => {
    if (!resultState) return;

    if (navigator.share) {
      await navigator.share({
        title: "おのくん里親さん 11ご縁タイプ診断",
        text: shareText,
        url: resultUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (!resultState) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8EA] px-6 text-center text-[#3A2A1E]">
        <p className="mb-6 text-sm font-bold">診断結果を表示できませんでした。</p>
        <Link
          href={DIAGNOSIS_PATH}
          className="rounded-full bg-[#164F9E] px-6 py-3 text-sm font-bold text-white"
        >
          もう一度診断する
        </Link>
      </main>
    );
  }

  const { mainType, subType, supportType, partnerType, cluster } = resultState;
  const mainRevoRole = revo111Roles[mainType.revoTypeKey];
  const subRevoRole = revo111Roles[subType.revoTypeKey];
  const supportRevoRole = revo111Roles[supportType.revoTypeKey];
  const partnerRevoRole = revo111Roles[partnerType.revoTypeKey];
  const revoMatchRule = matchRules[mainType.revoTypeKey]?.find(
    (rule) => rule.partner === partnerType.revoTypeKey,
  );
  const futurePartnerRoles = mainRevoRole.futurePartners
    .map((key) => revo111Roles[key])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#FFF8EA] px-5 py-8 text-[#3A2A1E]">
      <div className="mx-auto max-w-3xl">
        <section className="mb-6 rounded-[8px] border-4 border-white bg-white p-5 shadow-[0_18px_50px_rgba(58,42,30,0.14)] sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-[4px] border-2 border-dashed border-white bg-[#164F9E] px-4 py-2 text-xs font-black text-white shadow-sm">
              {childLabel}のご縁タイプ
            </span>
            <span className="rounded-[4px] border-2 border-dashed border-[#F6A04D] px-4 py-2 text-xs font-bold text-[#3A2A1E]/70">
              {cluster.name}
            </span>
            {totalDiagnosisCount !== null && (
              <span className="rounded-[4px] bg-[#FFF8EA] px-4 py-2 text-xs font-black text-[#164F9E]">
                診断回数 {totalDiagnosisCount.toLocaleString("ja-JP")} 回目
              </span>
            )}
          </div>

          <div className="mb-7 rounded-[8px] border-2 border-dashed border-[#F6A04D] bg-[#FFF8EA] p-5">
            <div className="grid gap-5 sm:grid-cols-[112px_1fr]">
              <div className="rounded-[8px] bg-white p-2 shadow-sm">
                <Image
                  src="/onokun-satooya/illustrations/onokun-guide.jpeg"
                  alt="里親カードの案内役おのくん"
                  width={112}
                  height={144}
                  className="h-36 w-full rounded-[4px] object-cover object-top"
                />
              </div>
              <div>
                <div className={`mb-4 h-3 w-28 rounded-full ${mainType.colorClass}`} />
                <p className="mb-2 text-xs font-black tracking-[0.14em] text-[#F06F8F]">
                  おのくん版 {mainRevoRole.name}
                </p>
                <h1 className="mb-3 text-3xl font-black leading-tight sm:text-4xl">
                  {mainType.name}
                </h1>
                <p className="mb-3 rounded-[8px] bg-white px-4 py-3 text-base font-black leading-relaxed text-[#F06F8F] shadow-sm">
                  {mainType.funnyTitle}
                </p>
                <p className="mb-3 text-lg font-black text-[#164F9E]">
                  {mainRevoRole.catchCopy}
                </p>
                <p className="mb-5 text-base font-black text-[#3A2A1E]">
                  {mainType.oneLine}
                </p>
                <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/80">
                  {mainType.shortDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ResultBlock title="レボリスト11タイプ" body={`${mainRevoRole.name}：${mainRevoRole.mission}`} />
            <ResultBlock title="ご縁クラスター" body={cluster.description} />
            <ResultBlock title={`${childLabel}が連れてくるご縁`} body={mainType.broughtBond} />
          </div>
        </section>

        <section className="mb-6 rounded-[8px] border-2 border-dashed border-[#F06F8F] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            OYABAKA ARUARU
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight">親バカあるある</h2>
          <p className="mb-4 rounded-[8px] bg-[#FFF8EA] p-5 text-lg font-black leading-relaxed text-[#3A2A1E]">
            {mainType.parentBakaLine}
          </p>
          <div className="rounded-[8px] bg-[#164F9E] p-4 text-white">
            <p className="mb-1 text-xs font-black text-[#F7D35B]">サロンで名乗るなら</p>
            <p className="text-sm font-black leading-relaxed">
              「{mainType.salonPostLine}」
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-[8px] bg-[#164F9E] p-6 text-white shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F7D35B]">
            MATCHING HOOK
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight">
            {childLabel}の相棒は、{partnerType.name}かも。
          </h2>
          <p className="mb-4 text-sm font-bold leading-relaxed text-white/86">
            レボリスト11タイプでは「{partnerRevoRole.name}」。{partnerType.oneLine}
            {revoMatchRule ? ` ${revoMatchRule.description}` : ""}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[8px] bg-white p-4 text-[#3A2A1E]">
              <p className="mb-1 text-xs font-black text-[#F06F8F]">相棒に聞いてみたいこと</p>
              <p className="text-sm font-black leading-relaxed">
                「{partnerType.conversationStarter}」
              </p>
            </div>
            <div className="rounded-[8px] bg-white p-4 text-[#3A2A1E]">
              <p className="mb-1 text-xs font-black text-[#F06F8F]">親バカサロンで探すなら</p>
              <p className="text-sm font-black leading-relaxed">
                同じタイプの里親さん、相棒タイプの里親さん、どちらも見つけたくなる組み合わせです。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            YOUR 3 COLORS
          </p>
          <h2 className="mb-4 text-xl font-black">あなたの中に見えた3つの色</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <TypeChip label="メイン" typeName={mainType.name} revoName={mainRevoRole.name} />
            <TypeChip label="サブ" typeName={subType.name} revoName={subRevoRole.name} />
            <TypeChip
              label="隠し味"
              typeName={supportType.name}
              revoName={supportRevoRole.name}
            />
          </div>
        </section>

        <section className="mb-6 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            PARTNER MAP
          </p>
          <h2 className="mb-4 text-xl font-black">もっと相性が気になる里親さん</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {futurePartnerRoles.map((role) => (
              <div key={role.key} className="rounded-[8px] bg-[#FFF8EA] p-4">
                <p className="mb-2 text-base font-black text-[#164F9E]">{role.name}</p>
                <p className="text-xs font-bold leading-relaxed text-[#3A2A1E]/70">
                  {role.catchCopy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            WHY
          </p>
          <h2 className="mb-3 text-xl font-black">このタイプになった理由</h2>
          <p className="mb-5 text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
            {resultState.evidenceText}
          </p>
          <div className="grid gap-3">
            {resultState.evidenceHighlights.slice(0, 3).map((highlight) => (
              <article
                key={`${highlight.questionId}-${highlight.typeName}`}
                className="rounded-[8px] border-2 border-[#FFF8EA] p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#FFF8EA] px-3 py-1 text-xs font-black text-[#164F9E]">
                    {highlight.chapterTitle}
                  </span>
                  <span className="rounded-full bg-[#FFF8EA] px-3 py-1 text-xs font-bold text-[#3A2A1E]/70">
                    {highlight.scene}
                  </span>
                </div>
                <p className="mb-2 text-sm font-black leading-relaxed text-[#3A2A1E]">
                  「{highlight.choiceLabel}」
                </p>
                <p className="text-xs font-bold leading-relaxed text-[#3A2A1E]/65">
                  この選択は「{highlight.typeName}」の手がかりとして読まれています。
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
              MAIN PARTNER
            </p>
            <h2 className="mb-3 text-xl font-black">ご縁が広がりやすい相棒里親さん</h2>
            <p className="mb-4 text-lg font-black text-[#164F9E]">{partnerType.name}</p>
            <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {partnerRevoRole.name}の力を持つ、{partnerType.oneLine}
            </p>
          </article>

          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
              TODAY
            </p>
            <h2 className="mb-3 text-xl font-black">今日の里親ミッション</h2>
            <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {mainType.mission.replaceAll("うちの子", childLabel)}
            </p>
          </article>
        </section>

        <section className="mb-8 rounded-[8px] border-2 border-dashed border-[#F6A04D] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            TALK
          </p>
          <h2 className="mb-3 text-xl font-black">話しかけるきっかけ</h2>
          <p className="rounded-[8px] bg-[#FFF8EA] p-5 text-base font-black leading-relaxed">
            「{mainType.conversationStarter}」
          </p>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
              LINE
            </p>
            <h2 className="mb-3 text-xl font-black">同じタイプや相棒を探すなら</h2>
            <p className="mb-5 text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {childLabel}自慢と一緒に「{mainType.name}でした」と投稿すると、同じタイプや相棒タイプの里親さんと話すきっかけになります。
            </p>
            <a
              href={ONOKUN_OPEN_CHAT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[#164F9E] px-5 py-3 text-sm font-black text-white shadow-[0_5px_0_#0d3670] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#0d3670]"
            >
              親バカサロンを開く
            </a>
          </article>
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
              COOPERATION
            </p>
            <h2 className="mb-3 text-xl font-black">協力してみたくなったら</h2>
            <p className="mb-3 text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {resultState.questBridge}
            </p>
            <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              企画や準備にもう少し関わってみたい方は、まず親バカサロン内で声をかけてください。ほかの里親さんとの交流から、希望者向けの協力の場へつないでいきます。
            </p>
          </article>
        </section>

        <section className="mb-8 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            SHARE CARD
          </p>
          <h2 className="mb-4 text-xl font-black">見せたくなる里親カード</h2>
          <div className="rounded-[8px] border-2 border-dashed border-[#F6A04D] bg-[#FFF8EA] p-5">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                <Image
                  src="/onokun-satooya/illustrations/onokun-guide.jpeg"
                  alt="おのくん"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-xs font-black text-[#F06F8F]">おのくん里親さん診断</p>
                {childName && (
                  <p className="text-sm font-black leading-tight text-[#3A2A1E]">
                    {childName}
                  </p>
                )}
                <h3 className="text-2xl font-black leading-tight text-[#164F9E]">
                  {mainType.name}
                </h3>
                <p className="mt-1 text-sm font-black leading-tight text-[#F06F8F]">
                  {mainType.shareCatch}
                </p>
              </div>
            </div>
            <p className="mb-4 text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {mainType.parentBakaLine}
            </p>
            <div className="grid gap-2 text-xs font-black text-[#3A2A1E]/70 sm:grid-cols-3">
              <span className="rounded-full bg-white px-3 py-2 text-center">{cluster.name}</span>
              <span className="rounded-full bg-white px-3 py-2 text-center">
                相棒: {partnerType.name}
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-center">11問クエスト</span>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[8px] bg-[#164F9E] p-6 text-white shadow-sm">
          <div className="flex gap-4">
            <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white sm:block">
              <Image
                src="/onokun-satooya/illustrations/onokun-guide.jpeg"
                alt="おのくん"
                width={80}
                height={80}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <p className="text-sm font-bold leading-relaxed">
                おのくんが一体一体違うように、
                <br />
                里親さんのご縁の育て方も一人ひとり違っていい。
              </p>
              <p className="mt-4 text-sm font-bold leading-relaxed text-white/85">
                このタイプは、あなたを決めつけるものではなく、
                うちの子とのご縁を楽しく話すための小さな名札です。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            SHARE
          </p>
          <h2 className="mb-4 text-xl font-black">結果をシェアする</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={xShareUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#111111] px-6 py-4 text-center text-sm font-black text-white shadow-sm"
            >
              Xでシェア
            </a>
            <a
              href={lineShareUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#06C755] px-6 py-4 text-center text-sm font-black text-white shadow-sm"
            >
              LINEでシェア
            </a>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full bg-[#F06F8F] px-6 py-4 text-sm font-black text-white shadow-[0_7px_0_#c95773] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#c95773]"
            >
              端末の共有を開く
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full bg-[#164F9E] px-6 py-4 text-sm font-black text-white shadow-sm"
            >
              {copied ? "コピーしました" : "文面をコピー"}
            </button>
          </div>
        </section>

        <div className="grid gap-3">
          <Link
            href={DIAGNOSIS_PATH}
            className="rounded-full bg-white px-6 py-4 text-center text-sm font-black text-[#164F9E] shadow-sm"
          >
            もう一度診断する
          </Link>
        </div>
      </div>
    </main>
  );
}

function useOnokunShell() {
  useEffect(() => {
    const nav = document.body.querySelector(":scope > nav") as HTMLElement | null;
    const rootMain = document.body.querySelector(":scope > main") as HTMLElement | null;
    const previousNavDisplay = nav?.style.display ?? "";
    const previousMainPaddingTop = rootMain?.style.paddingTop ?? "";

    if (nav) nav.style.display = "none";
    if (rootMain) rootMain.style.paddingTop = "0";

    return () => {
      if (nav) nav.style.display = previousNavDisplay;
      if (rootMain) rootMain.style.paddingTop = previousMainPaddingTop;
    };
  }, []);
}

function ResultBlock({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-[8px] border-2 border-[#FFF8EA] p-5">
      <h2 className="mb-2 text-sm font-black text-[#F06F8F]">{title}</h2>
      <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/75">{body}</p>
    </article>
  );
}

function TypeChip({
  label,
  typeName,
  revoName,
}: {
  label: string;
  typeName: string;
  revoName: string;
}) {
  return (
    <div className="rounded-[8px] bg-[#FFF8EA] p-4">
      <p className="mb-1 text-xs font-black text-[#F06F8F]">{label}</p>
      <p className="text-sm font-black leading-relaxed text-[#164F9E]">{typeName}</p>
      <p className="mt-2 text-xs font-black leading-relaxed text-[#3A2A1E]/65">
        レボリスト11タイプ: {revoName}
      </p>
    </div>
  );
}
