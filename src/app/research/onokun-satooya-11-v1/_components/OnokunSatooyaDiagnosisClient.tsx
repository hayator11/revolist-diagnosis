"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ONOKUN_SATOOYA_TOTAL_QUESTIONS,
  onokunSatooyaQuestions,
  type OnokunAnswerValue,
} from "../_data/onokunSatooyaQuestions";
import { onokunSatooyaTypes } from "../_data/onokunSatooyaTypes";
import { encodeOnokunSatooyaAnswers } from "../_lib/calculateOnokunSatooyaResult";

const ONOKUN_CHILD_NAME_SESSION_KEY = "onokun-satooya-child-name";

export default function OnokunSatooyaDiagnosisClient() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [childName, setChildName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const currentQuestion = onokunSatooyaQuestions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / ONOKUN_SATOOYA_TOTAL_QUESTIONS) * 100);

  useOnokunShell();

  const handleChildNameChange = useCallback((value: string) => {
    setChildName(value.replace(/\s+/g, " ").slice(0, 24));
  }, []);

  const handleStart = useCallback(() => {
    const normalizedName = childName.trim();

    if (normalizedName) {
      window.sessionStorage.setItem(ONOKUN_CHILD_NAME_SESSION_KEY, normalizedName);
    } else {
      window.sessionStorage.removeItem(ONOKUN_CHILD_NAME_SESSION_KEY);
    }

    setStarted(true);
  }, [childName]);

  const handleAnswer = useCallback(
    (value: OnokunAnswerValue) => {
      if (isAdvancing) return;
      setIsAdvancing(true);

      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = value;
      setAnswers(nextAnswers);

      if (currentIndex < onokunSatooyaQuestions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((index) => index + 1);
          setIsAdvancing(false);
        }, 140);
        return;
      }

      const encoded = encodeOnokunSatooyaAnswers(nextAnswers);
      router.push(`/research/onokun-satooya-11-v1/result?answers=${encoded}`);
    },
    [answers, currentIndex, isAdvancing, router],
  );

  if (!started) {
    return (
      <main className="min-h-screen bg-[#FFF8EA] text-[#3A2A1E]">
        <HeroSection
          childName={childName}
          onChildNameChange={handleChildNameChange}
          onStart={handleStart}
        />
        <LandingStory
          childName={childName}
          onChildNameChange={handleChildNameChange}
          onStart={handleStart}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8EA] px-4 py-6 text-[#3A2A1E] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <div className="mb-3 flex items-center justify-between text-xs font-black text-[#3A2A1E]/55">
            <span>
              Q{currentIndex + 1} / {ONOKUN_SATOOYA_TOTAL_QUESTIONS}
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
        <ChapterTrail currentIndex={currentIndex} />

        <section className="rounded-[8px] bg-white p-5 shadow-[0_18px_50px_rgba(58,42,30,0.10)] sm:p-8">
          <div className="mb-6 flex items-start gap-3 border-b border-[#E8DCC4] pb-5">
            <OnokunFace />
            <p className="pt-1 text-sm font-bold leading-relaxed text-[#3A2A1E]/70">
              正解を当てる診断ではありません。うちの子との場面を思い浮かべて、近いものを選んでください。
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

function HeroSection({
  childName,
  onChildNameChange,
  onStart,
}: {
  childName: string;
  onChildNameChange: (value: string) => void;
  onStart: () => void;
}) {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#164F9E]">
      <Image
        src="/onokun-satooya/photos/onokun-family-display.jpeg"
        alt="たくさんのおのくんが並んでいる様子"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_38%]"
      />
      <div className="absolute inset-0 bg-[#1F160F]/42" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1F160F]/88 via-[#1F160F]/52 to-transparent" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pb-8 pt-10 sm:px-8 sm:pb-12">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-[4px] bg-white px-4 py-2 text-xs font-black text-[#164F9E] shadow-sm">
            おのくん里親さん 11ご縁タイプ診断
          </span>
          <span className="rounded-[4px] border border-white/50 px-4 py-2 text-xs font-black text-white">
            11問 / 選択式
          </span>
        </div>

        <div className="max-w-4xl text-white">
          <h1 className="mb-5 text-[38px] font-black leading-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-7xl">
            みんな違って
            <br />
            みんないい。
          </h1>
          <p className="mb-6 max-w-2xl text-xl font-black leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-3xl">
            あなたとおのくんのご縁も、きっと世界にひとつ。
          </p>
          <div className="mb-7 grid max-w-2xl gap-1 text-base font-bold leading-relaxed text-white/88 sm:grid-cols-2 sm:text-lg">
            <p>写真を撮る人。</p>
            <p>里帰りしたくなる人。</p>
            <p>誰かに紹介したくなる人。</p>
            <p>集まりをつくりたくなる人。</p>
          </div>
          <p className="mb-8 text-lg font-black text-[#F7D35B] sm:text-2xl">
            あなたは、どんなご縁を育てる里親さん？
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full rounded-[8px] bg-white/94 p-4 text-[#3A2A1E] shadow-sm sm:max-w-md">
            <label className="mb-2 block text-xs font-black text-[#164F9E]">
              うちの子のお名前・ニックネーム 任意
            </label>
            <input
              type="text"
              value={childName}
              onChange={(event) => onChildNameChange(event.target.value)}
              maxLength={24}
              placeholder="例: まめお / おのちゃん"
              className="mb-2 w-full rounded-[8px] border border-[#E8DCC4] bg-[#FFF8EA] px-4 py-3 text-sm font-bold outline-none focus:border-[#164F9E]"
            />
            <p className="mb-4 text-xs font-bold leading-relaxed text-[#3A2A1E]/65">
              空欄でも診断できます。ライト診断では保存せず、結果表示とシェア文だけに使います。
            </p>
            <button
              type="button"
              onClick={onStart}
              className="w-full rounded-[8px] bg-[#F06F8F] px-7 py-4 text-base font-black text-white shadow-[0_8px_0_#B84E68] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#B84E68]"
            >
              ちょっと診断してみる
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-[8px] bg-white/92 p-3 text-[#3A2A1E] shadow-sm sm:max-w-md">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[6px] bg-white">
              <Image
                src="/onokun-satooya/illustrations/onokun-guide.jpeg"
                alt="案内役のおのくん"
                width={64}
                height={64}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <p className="text-sm font-black leading-relaxed">
              正解じゃなくて、うちの子とのご縁を見つける診断です。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingStory({
  childName,
  onChildNameChange,
  onStart,
}: {
  childName: string;
  onChildNameChange: (value: string) => void;
  onStart: () => void;
}) {
  return (
    <div className="pb-16">
      <section className="border-b border-[#E8DCC4] bg-[#FFF8EA] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-[4px] border border-[#F6A04D] bg-white px-3 py-1.5 text-xs font-black text-[#F06F8F]">
              みんな違ってみんないい
            </p>
            <h2 className="mb-5 text-3xl font-black leading-tight sm:text-5xl">
              おのくんが一体一体違うように、
              <br />
              ご縁の育て方も一人ひとり違っていい。
            </h2>
            <p className="text-base font-bold leading-relaxed text-[#3A2A1E]/72">
              この診断は、里親さんを分類したり評価したりするものではありません。
              選んだ場面の積み重ねから、うちの子との楽しみ方を話すための小さな名札を見つけます。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {["写真", "里帰り", "紹介", "集まり"].map((label) => (
              <div
                key={label}
                className="rounded-[8px] border border-[#E8DCC4] bg-white px-4 py-6 text-center text-xl font-black text-[#164F9E] shadow-sm"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
                11 QUESTION QUEST
              </p>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                うちの子と進む、11の小さなクエスト。
              </h2>
            </div>
            <p className="text-sm font-black text-[#3A2A1E]/60">11問 / すべて選択式</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <QuestCard
              label="第1章"
              title="うちの子と出発"
              body="写真、声をかけられた場面、里帰り。うちの子と一緒に動くイメージで選びます。"
            />
            <QuestCard
              label="第2章"
              title="親バカサロンの入口"
              body="投稿、うちの子カード、ほかの里親さんとの反応から、会話の始まり方を見ます。"
            />
            <QuestCard
              label="第3章"
              title="ご縁クエスト"
              body="集まり、協力、今日のおの活へ。楽しいから集まり、つながりが備えになる流れへ進みます。"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8EA] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9">
            <p className="mb-3 text-xs font-black tracking-[0.16em] text-[#F06F8F]">
              11 GOEN TYPES
            </p>
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">
              結果は、うちの子とのご縁を話すための名札。
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {onokunSatooyaTypes.map((type) => (
              <article
                key={type.key}
                className="rounded-[8px] border border-[#E8DCC4] bg-white p-4 shadow-sm"
              >
                <div className={`mb-3 h-2 w-14 rounded-full ${type.colorClass}`} />
                <h3 className="mb-2 text-base font-black leading-snug text-[#164F9E]">
                  {type.name}
                </h3>
                <p className="text-xs font-bold leading-relaxed text-[#3A2A1E]/70">
                  {type.oneLine}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#164F9E] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <h2 className="mb-3 text-3xl font-black leading-tight">楽しいから集まる。</h2>
            <p className="text-base font-bold leading-relaxed text-white/86">
              集まるからつながる。つながるから備えになる。
              防災は怖がらせるものではなく、顔が見えるご縁から育つものとして扱います。
            </p>
          </div>
          <div className="w-full rounded-[8px] bg-white p-4 text-[#3A2A1E] shadow-sm sm:max-w-sm">
            <label className="mb-2 block text-xs font-black text-[#164F9E]">
              うちの子のお名前 任意
            </label>
            <input
              type="text"
              value={childName}
              onChange={(event) => onChildNameChange(event.target.value)}
              maxLength={24}
              placeholder="空欄でもOK"
              className="mb-3 w-full rounded-[8px] border border-[#E8DCC4] bg-[#FFF8EA] px-4 py-3 text-sm font-bold outline-none focus:border-[#164F9E]"
            />
            <button
              type="button"
              onClick={onStart}
              className="w-full rounded-[8px] bg-[#F06F8F] px-6 py-4 text-sm font-black text-white shadow-[0_7px_0_#B84E68] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#B84E68]"
            >
              ちょっと診断してみる
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChapterTrail({ currentIndex }: { currentIndex: number }) {
  const chapterNumber = currentIndex < 3 ? 1 : currentIndex < 6 ? 2 : 3;

  return (
    <div className="mb-5 grid grid-cols-3 gap-2">
      {[
        { number: 1, label: "出発" },
        { number: 2, label: "サロン" },
        { number: 3, label: "クエスト" },
      ].map((chapter) => {
        const active = chapter.number === chapterNumber;

        return (
          <div
            key={chapter.number}
            className={`rounded-[8px] border px-3 py-2 text-center text-xs font-black ${
              active
                ? "border-[#164F9E] bg-[#164F9E] text-white"
                : "border-[#E8DCC4] bg-white text-[#3A2A1E]/45"
            }`}
          >
            <span className="block">第{chapter.number}章</span>
            <span className="block">{chapter.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function QuestCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <article className="rounded-[8px] border border-[#E8DCC4] bg-[#FFF8EA] p-5 shadow-sm">
      <p className="mb-4 inline-flex rounded-[4px] bg-white px-3 py-1 text-xs font-black text-[#F06F8F]">
        {label}
      </p>
      <h3 className="mb-3 text-xl font-black text-[#164F9E]">{title}</h3>
      <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/70">{body}</p>
    </article>
  );
}

function OnokunFace() {
  return (
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
      <Image
        src="/onokun-satooya/illustrations/onokun-guide.jpeg"
        alt="案内役のおのくん"
        width={56}
        height={56}
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}
