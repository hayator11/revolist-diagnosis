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

const DIAGNOSIS_PATH = "/research/onokun-satooya-11-v1";
const ONOKUN_OPEN_CHAT_URL =
  "https://line.me/ti/g2/l_r88aCvFnX6D6JqjLQBnIi1zhEatqT-tk2c4Q?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

export default function OnokunSatooyaResultClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers") ?? "";
  const [copied, setCopied] = useState(false);
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

  const shareText = resultState
    ? [
        `私のご縁タイプは「${resultState.mainType.name}」でした。`,
        resultState.mainType.oneLine,
        resultUrl,
      ].join("\n")
    : "";

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

  return (
    <main className="min-h-screen bg-[#FFF8EA] px-5 py-8 text-[#3A2A1E]">
      <div className="mx-auto max-w-3xl">
        <section className="mb-6 rounded-[8px] border-4 border-white bg-white p-5 shadow-[0_18px_50px_rgba(58,42,30,0.14)] sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-[4px] border-2 border-dashed border-white bg-[#164F9E] px-4 py-2 text-xs font-black text-white shadow-sm">
              あなたのご縁タイプ
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
                <h1 className="mb-3 text-3xl font-black leading-tight sm:text-4xl">
                  {mainType.name}
                </h1>
                <p className="mb-5 text-lg font-bold text-[#164F9E]">{mainType.oneLine}</p>
                <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/80">
                  {mainType.shortDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ResultBlock title="ご縁クラスター" body={cluster.description} />
            <ResultBlock title="うちの子が連れてくるご縁" body={mainType.broughtBond} />
          </div>
        </section>

        <section className="mb-6 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            READING
          </p>
          <h2 className="mb-4 text-xl font-black">回答から見えたご縁の重なり</h2>
          <p className="mb-5 text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
            {resultState.evidenceText}
          </p>
          <div className="mb-5 space-y-3">
            {resultState.readingPoints.map((point) => (
              <p
                key={point}
                className="rounded-[8px] border-l-4 border-[#F6A04D] bg-[#FFF8EA] px-4 py-3 text-sm font-bold leading-relaxed text-[#3A2A1E]/80"
              >
                {point}
              </p>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <TypeChip label="メイン" typeName={mainType.name} />
            <TypeChip label="サブ" typeName={subType.name} />
            <TypeChip label="補助" typeName={supportType.name} />
          </div>
        </section>

        <section className="mb-6 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            BALANCE
          </p>
          <h2 className="mb-4 text-xl font-black">ご縁バランス</h2>
          <div className="space-y-4">
            {resultState.topTypes.map((type) => (
              <ScoreBar
                key={type.key}
                name={type.name}
                score={resultState.scores[type.key]}
                maxScore={resultState.maxScore}
              />
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            EVIDENCE
          </p>
          <h2 className="mb-4 text-xl font-black">この結果につながった選択</h2>
          <div className="grid gap-3">
            {resultState.evidenceHighlights.map((highlight) => (
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
              PARTNER
            </p>
            <h2 className="mb-3 text-xl font-black">ご縁が広がりやすい相棒里親さん</h2>
            <p className="mb-4 text-lg font-black text-[#164F9E]">{partnerType.name}</p>
            <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {partnerType.oneLine}
            </p>
          </article>

          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
              TODAY
            </p>
            <h2 className="mb-3 text-xl font-black">今日の里親ミッション</h2>
            <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {mainType.mission}
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
            <h2 className="mb-3 text-xl font-black">気軽に話すなら</h2>
            <p className="mb-5 text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              うちの子自慢や今日の里親ミッションは、オープンチャット「おのくん親バカサロン」で話しやすい入口です。
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
              NEXT QUEST
            </p>
            <h2 className="mb-3 text-xl font-black">もう少し関わるなら</h2>
            <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {resultState.questBridge}
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
                <h3 className="text-2xl font-black leading-tight text-[#164F9E]">
                  {mainType.name}
                </h3>
              </div>
            </div>
            <p className="mb-4 text-sm font-bold leading-relaxed text-[#3A2A1E]/75">
              {mainType.oneLine}
            </p>
            <div className="grid gap-2 text-xs font-black text-[#3A2A1E]/70 sm:grid-cols-3">
              <span className="rounded-full bg-white px-3 py-2 text-center">{cluster.name}</span>
              <span className="rounded-full bg-white px-3 py-2 text-center">
                相棒: {partnerType.name}
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-center">33問RPG</span>
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

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-[#F06F8F] px-6 py-4 text-sm font-black text-white shadow-[0_7px_0_#c95773] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#c95773]"
          >
            {copied ? "コピーしました" : "結果をシェアする"}
          </button>
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

function TypeChip({ label, typeName }: { label: string; typeName: string }) {
  return (
    <div className="rounded-[8px] bg-[#FFF8EA] p-4">
      <p className="mb-1 text-xs font-black text-[#F06F8F]">{label}</p>
      <p className="text-sm font-black leading-relaxed text-[#164F9E]">{typeName}</p>
    </div>
  );
}

function ScoreBar({
  name,
  score,
  maxScore,
}: {
  name: string;
  score: number;
  maxScore: number;
}) {
  const width = maxScore === 0 ? 0 : Math.max(18, Math.round((score / maxScore) * 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
        <span>{name}</span>
        <span className="text-[#164F9E]">{score}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#FFF8EA]">
        <div className="h-full rounded-full bg-[#F06F8F]" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
