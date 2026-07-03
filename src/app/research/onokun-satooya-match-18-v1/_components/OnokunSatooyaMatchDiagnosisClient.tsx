"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOnokunSatooyaType } from "../../onokun-satooya-11-v1/_data/onokunSatooyaTypes";
import {
  ONOKUN_SATOOYA_MATCH_TOTAL_QUESTIONS,
  onokunSatooyaMatchQuestions,
  type OnokunSatooyaMatchAnswerValue,
} from "../_data/onokunSatooyaMatchQuestions";
import {
  encodeOnokunSatooyaMatchAnswers,
  isValidOnokunSatooyaBaseTypeKey,
} from "../_lib/calculateOnokunSatooyaMatchResult";

const MATCH_PATH = "/research/onokun-satooya-match-18-v1";
const MATCH_CHILD_NAME_SESSION_KEY = "onokun-satooya-match-child-name";

export default function OnokunSatooyaMatchDiagnosisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const baseTypeKeyParam = searchParams.get("baseType");
  const baseTypeKey = isValidOnokunSatooyaBaseTypeKey(baseTypeKeyParam)
    ? baseTypeKeyParam
    : null;
  const baseType = baseTypeKey ? getOnokunSatooyaType(baseTypeKey) : null;
  const [started, setStarted] = useState(false);
  const [childName, setChildName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const currentQuestion = onokunSatooyaMatchQuestions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / ONOKUN_SATOOYA_MATCH_TOTAL_QUESTIONS) * 100);

  useOnokunShell();

  const handleChildNameChange = useCallback((value: string) => {
    setChildName(value.replace(/\s+/g, " ").slice(0, 24));
  }, []);

  const handleStart = useCallback(() => {
    const normalizedName = childName.trim();

    if (normalizedName) {
      window.sessionStorage.setItem(MATCH_CHILD_NAME_SESSION_KEY, normalizedName);
    } else {
      window.sessionStorage.removeItem(MATCH_CHILD_NAME_SESSION_KEY);
    }

    setStarted(true);
  }, [childName]);

  const handleAnswer = useCallback(
    (value: OnokunSatooyaMatchAnswerValue) => {
      if (isAdvancing) return;
      setIsAdvancing(true);

      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = value;
      setAnswers(nextAnswers);

      if (currentIndex < onokunSatooyaMatchQuestions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((index) => index + 1);
          setIsAdvancing(false);
        }, 120);
        return;
      }

      const encoded = encodeOnokunSatooyaMatchAnswers(nextAnswers);
      const baseTypeQuery = baseTypeKey ? `&baseType=${baseTypeKey}` : "";
      router.push(`${MATCH_PATH}/result?answers=${encoded}${baseTypeQuery}`);
    },
    [answers, baseTypeKey, currentIndex, isAdvancing, router],
  );

  if (!started) {
    return (
      <main className="min-h-screen bg-[#FFF8EA] text-[#3A2A1E]">
        <section className="relative min-h-[92vh] overflow-hidden bg-[#164F9E]">
          <Image
            src="/onokun-satooya/photos/onokun-family-display.jpeg"
            alt="たくさんのおのくんが並んでいる様子"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_38%]"
          />
          <div className="absolute inset-0 bg-[#1F160F]/50" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1F160F]/90 via-[#1F160F]/56 to-transparent" />

          <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pb-8 pt-10 sm:px-8 sm:pb-12">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-[4px] bg-white px-4 py-2 text-xs font-black text-[#164F9E] shadow-sm">
                おのくん里親さん 相棒マッチ診断
              </span>
              <span className="rounded-[4px] border border-white/50 px-4 py-2 text-xs font-black text-white">
                18問 / 両方向マッチング
              </span>
            </div>

            <div className="max-w-4xl text-white">
              <h1 className="mb-5 text-[38px] font-black leading-tight sm:text-6xl lg:text-7xl">
                うちの子と、
                <br />
                どんな里親さんに会いたい？
              </h1>
              <p className="mb-7 max-w-2xl text-lg font-black leading-relaxed text-white/88 sm:text-2xl">
                自分のご縁タイプと、気になる相棒タイプを別々に見るマッチング版です。
              </p>
            </div>

            <div className="w-full rounded-[8px] bg-white/94 p-4 text-[#3A2A1E] shadow-sm sm:max-w-md">
              {baseType && (
                <div className="mb-4 rounded-[8px] border-2 border-dashed border-[#F6A04D] bg-[#FFF8EA] p-4">
                  <p className="mb-1 text-xs font-black text-[#F06F8F]">
                    11問結果を引き継ぎ中
                  </p>
                  <p className="text-sm font-black leading-relaxed text-[#3A2A1E]">
                    「{baseType.name}」を少しだけ参考にして、相棒マッチを見ます。
                  </p>
                  <LinkLikeReset />
                </div>
              )}
              <label className="mb-2 block text-xs font-black text-[#164F9E]">
                うちの子のお名前・ニックネーム 任意
              </label>
              <input
                type="text"
                value={childName}
                onChange={(event) => handleChildNameChange(event.target.value)}
                maxLength={24}
                placeholder="例: まめお / おのちゃん"
                className="mb-2 w-full rounded-[8px] border border-[#E8DCC4] bg-[#FFF8EA] px-4 py-3 text-sm font-bold outline-none focus:border-[#164F9E]"
              />
              <p className="mb-4 text-xs font-bold leading-relaxed text-[#3A2A1E]/65">
                入力は結果表示とシェア文だけに使います。空欄でも進めます。
              </p>
              <button
                type="button"
                onClick={handleStart}
                className="w-full rounded-[8px] bg-[#F06F8F] px-7 py-4 text-base font-black text-white shadow-[0_8px_0_#B84E68] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#B84E68]"
              >
                相棒を探してみる
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8EA] px-4 py-6 text-[#3A2A1E] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <div className="mb-3 flex items-center justify-between text-xs font-black text-[#3A2A1E]/55">
            <span>
              Q{currentIndex + 1} / {ONOKUN_SATOOYA_MATCH_TOTAL_QUESTIONS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#164F9E] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <section className="rounded-[8px] bg-white p-5 shadow-[0_18px_50px_rgba(58,42,30,0.10)] sm:p-8">
          <div className="mb-6 flex items-start gap-3 border-b border-[#E8DCC4] pb-5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#FFF8EA]">
              <Image
                src="/onokun-satooya/illustrations/onokun-guide.jpeg"
                alt="案内役のおのくん"
                width={56}
                height={56}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <p className="pt-1 text-sm font-bold leading-relaxed text-[#3A2A1E]/70">
              前半はあなたの動き方、後半は相棒に求めるものを見ます。近いものを選んでください。
            </p>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="rounded-[4px] bg-[#164F9E] px-3 py-1.5 text-xs font-black text-white">
              {currentQuestion.chapterTitle}
            </p>
            <p className="rounded-[4px] bg-[#FFF8EA] px-3 py-1.5 text-xs font-bold text-[#3A2A1E]/70">
              {currentQuestion.scene}
            </p>
          </div>
          <h2 className="mb-8 text-[26px] font-black leading-relaxed sm:text-3xl">
            {currentQuestion.text}
          </h2>

          <div className="grid gap-3">
            {currentQuestion.choices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                disabled={isAdvancing}
                onClick={() => handleAnswer(choice.value)}
                className="group flex items-center justify-between gap-4 rounded-[8px] border border-[#E8DCC4] bg-[#FFF8EA] px-4 py-4 text-left text-sm font-bold leading-relaxed transition hover:border-[#F06F8F] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
              >
                <span>{choice.label}</span>
                <span className="shrink-0 rounded-[4px] bg-white px-3 py-1 text-[11px] font-black text-[#164F9E] transition group-hover:bg-[#F06F8F] group-hover:text-white">
                  選ぶ
                </span>
              </button>
            ))}
          </div>

          {currentIndex > 0 && (
            <button
              type="button"
              disabled={isAdvancing}
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              className="mt-7 text-sm font-bold text-[#3A2A1E]/55 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ひとつ前に戻る
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

function LinkLikeReset() {
  return (
    <a
      href={MATCH_PATH}
      className="mt-3 inline-flex text-xs font-black text-[#164F9E] underline underline-offset-4"
    >
      引き継がずに診断する
    </a>
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
