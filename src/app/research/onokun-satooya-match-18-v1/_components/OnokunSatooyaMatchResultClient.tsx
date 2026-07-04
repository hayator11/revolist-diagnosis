"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  calculateOnokunSatooyaMatchResult,
  decodeOnokunSatooyaMatchAnswers,
  isValidOnokunSatooyaBaseTypeKey,
  isValidOnokunSatooyaMatchAnswers,
} from "../_lib/calculateOnokunSatooyaMatchResult";
import { revo111Roles } from "@/data/revo111Roles";

const MATCH_PATH = "/research/onokun-satooya-match-18-v1";
const MATCH_CHILD_NAME_SESSION_KEY = "onokun-satooya-match-child-name";
const ONOKUN_OPEN_CHAT_URL =
  "https://line.me/ti/g2/l_r88aCvFnX6D6JqjLQBnIi1zhEatqT-tk2c4Q?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

export default function OnokunSatooyaMatchResultClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers") ?? "";
  const baseTypeKeyParam = searchParams.get("baseType");
  const baseTypeKey = isValidOnokunSatooyaBaseTypeKey(baseTypeKeyParam)
    ? baseTypeKeyParam
    : null;
  const [copied, setCopied] = useState(false);
  const [childName] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (window.sessionStorage.getItem(MATCH_CHILD_NAME_SESSION_KEY)?.trim() ?? ""),
  );

  const answers = useMemo(() => decodeOnokunSatooyaMatchAnswers(encoded), [encoded]);
  const resultState = useMemo(() => {
    if (!isValidOnokunSatooyaMatchAnswers(answers)) return null;
    return calculateOnokunSatooyaMatchResult(answers, baseTypeKey);
  }, [answers, baseTypeKey]);

  useOnokunShell();

  const resultUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}${MATCH_PATH}/result?answers=${encoded}${
          baseTypeKey ? `&baseType=${baseTypeKey}` : ""
        }`;
  const childLabel = childName || "うちの子";

  const shareText = resultState
    ? [
        `${childLabel}の相棒マッチ診断`,
        `私は「${resultState.mainType.name}」、気になる相棒は「${resultState.recommendedPartnerType.name}」でした。`,
        resultState.baseType
          ? `入力した11問タイプ「${resultState.baseType.name}」も参考にしています。`
          : "18問だけで相棒タイプを見ています。",
        resultState.postPrompt,
        "おのくん里親さん 相棒マッチ診断",
        resultUrl,
      ].join("\n")
    : "";
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    resultUrl,
  )}`;

  const handleShare = async () => {
    if (!resultState) return;

    if (navigator.share) {
      await navigator.share({
        title: "おのくん里親さん 相棒マッチ診断",
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
        <p className="mb-6 text-sm font-bold">相棒マッチ結果を表示できませんでした。</p>
        <Link
          href={MATCH_PATH}
          className="rounded-full bg-[#164F9E] px-6 py-3 text-sm font-bold text-white"
        >
          もう一度診断する
        </Link>
      </main>
    );
  }

  const {
    mainType,
    subType,
    desiredPartnerType,
    naturalPartnerType,
    recommendedPartnerType,
  } = resultState;
  const mainRevoRole = revo111Roles[mainType.revoTypeKey];
  const partnerRevoRole = revo111Roles[recommendedPartnerType.revoTypeKey];

  return (
    <main className="min-h-screen bg-[#FFF8EA] px-5 py-8 text-[#3A2A1E]">
      <div className="mx-auto max-w-3xl">
        <section className="mb-6 rounded-[8px] border-4 border-white bg-white p-5 shadow-[0_18px_50px_rgba(58,42,30,0.14)] sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-[4px] bg-[#164F9E] px-4 py-2 text-xs font-black text-white shadow-sm">
              相棒マッチ診断
            </span>
            <span className="rounded-[4px] border-2 border-dashed border-[#F6A04D] px-4 py-2 text-xs font-bold text-[#3A2A1E]/70">
              {resultState.matchTitle}
            </span>
          </div>

          <div className="mb-7 rounded-[8px] border-2 border-dashed border-[#F6A04D] bg-[#FFF8EA] p-5">
            <div className="grid gap-5 sm:grid-cols-[112px_1fr]">
              <div className="rounded-[8px] bg-white p-2 shadow-sm">
                <Image
                  src="/onokun-satooya/illustrations/onokun-guide.jpeg"
                  alt="案内役のおのくん"
                  width={112}
                  height={144}
                  className="h-36 w-full rounded-[4px] object-cover object-top"
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-black tracking-[0.14em] text-[#F06F8F]">
                  あなた側: おのくん版 {mainRevoRole.name}
                </p>
                <h1 className="mb-3 text-3xl font-black leading-tight sm:text-4xl">
                  {mainType.name}
                </h1>
                <p className="mb-4 rounded-[8px] bg-white px-4 py-3 text-base font-black leading-relaxed text-[#F06F8F] shadow-sm">
                  {mainType.funnyTitle}
                </p>
                <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/78">
                  {mainType.parentBakaLine}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[8px] bg-[#164F9E] p-5 text-white">
            <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F7D35B]">
              YOUR PARTNER
            </p>
            <h2 className="mb-3 text-2xl font-black leading-tight">
              {childLabel}の気になる相棒は、{recommendedPartnerType.name}
            </h2>
            <p className="mb-3 text-sm font-bold leading-relaxed text-white/86">
              レボリスト11タイプでは「{partnerRevoRole.name}」。{resultState.matchDescription}
            </p>
            <p className="rounded-[8px] bg-white p-4 text-sm font-black leading-relaxed text-[#3A2A1E]">
              「{recommendedPartnerType.salonPostLine}」と言っている里親さんを見つけたら、相棒候補かもしれません。
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-[8px] border-2 border-dashed border-[#F6A04D] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            LIGHT RESULT
          </p>
          <h2 className="mb-3 text-xl font-black">{resultState.baseComparisonTitle}</h2>
          <p className="mb-4 rounded-[8px] bg-[#FFF8EA] p-4 text-sm font-black leading-relaxed">
            {resultState.baseComparisonDescription}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <MatchMiniCard
              title="入力した11問タイプ"
              body={resultState.baseType?.name ?? "入力なし"}
              sub={resultState.baseType ? "自分で選んだ入口タイプ" : "18問単体で診断"}
            />
            <MatchMiniCard
              title="18問で強く出たタイプ"
              body={mainType.name}
              sub="相棒探しで出やすいご縁タイプ"
            />
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <MatchMiniCard title="自分の中心" body={mainType.name} sub={mainRevoRole.name} />
          <MatchMiniCard title="自分の隠し味" body={subType.name} sub="出やすいもう一つの色" />
          <MatchMiniCard title="求めている相棒" body={desiredPartnerType.name} sub="回答から見えた相手像" />
        </section>

        <section className="mb-6 rounded-[8px] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            BOTH SIDES
          </p>
          <h2 className="mb-4 text-xl font-black">両方向で見るとこうなります</h2>
          <div className="grid gap-3">
            <p className="rounded-[8px] bg-[#FFF8EA] p-4 text-sm font-black leading-relaxed">
              あなたは「{mainType.oneLine}」が出やすい里親さん。
            </p>
            <p className="rounded-[8px] bg-[#FFF8EA] p-4 text-sm font-black leading-relaxed">
              相棒には「{recommendedPartnerType.oneLine}」を求めている気配があります。
            </p>
            <p className="rounded-[8px] bg-[#FFF8EA] p-4 text-sm font-black leading-relaxed">
              もともとの自然相棒は「{naturalPartnerType.name}」。今気になっている相棒は「{recommendedPartnerType.name}」です。
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-[8px] border-2 border-dashed border-[#F06F8F] bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
            TALK STARTER
          </p>
          <h2 className="mb-4 text-xl font-black">親バカサロンで使える話題</h2>
          <div className="grid gap-3">
            {resultState.talkTopics.map((topic) => (
              <p
                key={topic}
                className="rounded-[8px] bg-[#FFF8EA] p-4 text-sm font-black leading-relaxed"
              >
                {topic}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-black">投稿するなら</h2>
            <p className="mb-5 rounded-[8px] bg-[#FFF8EA] p-4 text-sm font-black leading-relaxed">
              {resultState.postPrompt}
            </p>
            <a
              href={ONOKUN_OPEN_CHAT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[#164F9E] px-5 py-3 text-sm font-black text-white shadow-[0_5px_0_#0d3670]"
            >
              親バカサロンを開く
            </a>
          </article>

          <article className="rounded-[8px] bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-black">結果をシェアする</h2>
            <div className="grid gap-3">
              <a
                href={xShareUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#111111] px-5 py-3 text-center text-sm font-black text-white"
              >
                Xでシェア
              </a>
              <a
                href={lineShareUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#06C755] px-5 py-3 text-center text-sm font-black text-white"
              >
                LINEでシェア
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-[#F06F8F] px-5 py-3 text-sm font-black text-white"
              >
                端末の共有を開く
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full bg-[#164F9E] px-5 py-3 text-sm font-black text-white"
              >
                {copied ? "コピーしました" : "文面をコピー"}
              </button>
            </div>
          </article>
        </section>

        <Link
          href={MATCH_PATH}
          className="block rounded-full bg-white px-6 py-4 text-center text-sm font-black text-[#164F9E] shadow-sm"
        >
          もう一度マッチングする
        </Link>
      </div>
    </main>
  );
}

function MatchMiniCard({ title, body, sub }: { title: string; body: string; sub: string }) {
  return (
    <article className="rounded-[8px] bg-white p-5 shadow-sm">
      <p className="mb-2 text-xs font-black text-[#F06F8F]">{title}</p>
      <h2 className="mb-2 text-lg font-black leading-tight text-[#164F9E]">{body}</h2>
      <p className="text-xs font-bold leading-relaxed text-[#3A2A1E]/65">{sub}</p>
    </article>
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
