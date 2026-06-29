"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ICEBREAK_11_META, getIcebreak11VersionFields } from "@/data/researchProjects";
import { icebreakQuestions, ICEBREAK_TOTAL_QUESTIONS } from "@/data/icebreakQuestions";
import { getDeviceLabel, getTrackingParams } from "@/data/revoResearch";
import {
  calculateIcebreakResult,
  createIcebreakAnswerColumns,
  createIcebreakDiagnosisId,
  createIcebreakForceColumns,
} from "@/lib/calculateIcebreakResult";
import {
  DIAGNOSIS_CORE_PAYLOAD_SCHEMA_VERSION,
  DIAGNOSIS_SHELL_IDS,
} from "@/lib/diagnosisCore/logSchema";
import { createResearchEventFields } from "@/lib/researchTracking";

const CHOICES = [
  { value: 1, label: "今は違う" },
  { value: 2, label: "あまり当てはまらない" },
  { value: 3, label: "どちらとも言えない" },
  { value: 4, label: "わりと当てはまる" },
  { value: 5, label: "かなり自分らしい" },
];

function getQuestionChoices(question: typeof icebreakQuestions[number]) {
  return question.choices?.length ? question.choices : CHOICES;
}

function getAnswerLabel(question: typeof icebreakQuestions[number], value: number) {
  return getQuestionChoices(question).find((choice) => choice.value === value)?.label ?? "";
}

export default function IcebreakDiagnosisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventCode = searchParams.get("event")?.toUpperCase() ?? "";
  const [started, setStarted] = useState(false);
  const [eventName, setEventName] = useState("");
  const [nickname, setNickname] = useState("");
  const [eventError, setEventError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const currentQuestion = icebreakQuestions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / ICEBREAK_TOTAL_QUESTIONS) * 100);

  useEffect(() => {
    if (!eventCode) return;

    fetch(`/api/icebreak/public/${encodeURIComponent(eventCode)}`)
      .then((response) => {
        if (!response.ok) throw new Error("event not found");
        return response.json();
      })
      .then((data) => {
        setEventName(data.event.eventName);
      })
      .catch(() => {
        setEventError("イベントが見つかりませんでした。主催者に参加用URLを確認してください。");
      });
  }, [eventCode]);

  const handleAnswer = useCallback(
    (value: number) => {
      if (isAdvancing) return;
      setIsAdvancing(true);

      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = value;
      setAnswers(nextAnswers);

      if (currentIndex < icebreakQuestions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((index) => index + 1);
          setIsAdvancing(false);
        }, 120);
        return;
      }

      const diagnosisId = createIcebreakDiagnosisId(nextAnswers);
      const result = calculateIcebreakResult(nextAnswers);
      const tracking = getTrackingParams(searchParams);
      const createdAt = new Date().toISOString();

      if (eventCode && nickname.trim()) {
        fetch("/api/icebreak/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            eventCode,
            nickname,
            answers: nextAnswers,
          }),
        }).catch(() => {
          // Event join must not block the personal result page.
        });
      }

      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          type: "icebreak_answer",
          formType: "icebreak_answer",
          ...createResearchEventFields("diagnosis_complete"),
          ...getIcebreak11VersionFields(),
          payloadSchemaVersion: DIAGNOSIS_CORE_PAYLOAD_SCHEMA_VERSION,
          shellId: DIAGNOSIS_SHELL_IDS["icebreak-11-v1"],
          projectSlug: "icebreak-11-v1",
          diagnosisId,
          createdAt,
          timestamp: createdAt,
          answers: nextAnswers,
          answerCount: nextAnswers.length,
          ...createIcebreakAnswerColumns(nextAnswers),
          ...createIcebreakForceColumns(result),
          centerForce: result.centerForce,
          slotForce: result.slotForce,
          mainTypeKey: result.mainTypeKey,
          partnerTypeKey: result.partnerTypeKey,
          referrerSlug: tracking.referrerSlug,
          utmSource: tracking.utmSource,
          utmMedium: tracking.utmMedium,
          utmCampaign: tracking.utmCampaign,
          pagePath: window.location.pathname,
          device: getDeviceLabel(),
          answerDetails: icebreakQuestions.map((question, index) => ({
            questionId: question.id,
            questionVersion: getIcebreak11VersionFields().questionVersion,
            order: index + 1,
            questionText: question.text,
            answerValue: nextAnswers[index],
            answerLabel: getAnswerLabel(question, nextAnswers[index]),
            forceKey: question.force,
            roleKey: question.role,
          })),
        }),
      }).catch(() => {
        // Icebreak logging must not block navigation.
      });

      const resultParams = new URLSearchParams();
      if (eventCode) resultParams.set("event", eventCode);
      router.push(
        `/research/${ICEBREAK_11_META.slug}/result/${diagnosisId}${resultParams.size ? `?${resultParams.toString()}` : ""}`,
      );
    },
    [answers, currentIndex, eventCode, isAdvancing, nickname, router, searchParams],
  );

  if (!started) {
    return (
      <div className="min-h-screen bg-white px-6 py-14">
        <div className="mx-auto max-w-lg">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
            {ICEBREAK_11_META.shortTitle}
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-black">
            今日、誰と話すと
            <br />
            可能性が広がるか。
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-600">
            33問で、今の入り口になる力・動き方・会場で話してみたい相手を見つけます。
          </p>
          <section className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="mb-3 text-sm font-semibold leading-relaxed text-black">
              自分の得意なことのはずなのに、なぜかうまく伝わらない。
            </p>
            <div className="space-y-2 text-sm leading-relaxed text-gray-600">
              <p>人のことを考えているのに、自分だけが疲れてしまう。</p>
              <p>やりたいことはあるのに、誰と組めば形になるのかわからない。</p>
              <p className="pt-2 text-black">
                それは、あなたに力がないからではありません。あなたの力が、まだ“役割”として見えていないだけかもしれません。
              </p>
            </div>
          </section>

          <section className="mb-6 rounded-2xl border border-gray-200 p-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">What you find</p>
            <h2 className="mb-3 text-xl font-bold leading-snug text-black">
              すべての人は、自分の役割に出逢ったとき天才になる。
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              まだない未来を生み出す人。それを言葉にする人。動く形にする人。安心と循環をつくる人。
            </p>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              レボリスト診断では、あなたの天才がどんな持ち寄り方で現れるのかを、11役割で見ていきます。
            </p>
            <ul className="space-y-2 text-sm leading-relaxed text-gray-700">
              <li>・自分が何を持ち寄る人なのか</li>
              <li>・なぜ得意が伝わりにくかったのか</li>
              <li>・どんな場で力を発揮しやすいのか</li>
              <li>・誰と組むと可能性が広がりやすいのか</li>
            </ul>
          </section>

          {!eventCode && (
            <section className="mb-8 rounded-2xl border border-gray-200 p-5">
              <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">Next step</p>
              <h2 className="mb-3 text-lg font-bold leading-snug text-black">
                ひとりで背負うものから、持ち寄れる未来へ。
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                診断結果では「あなたの11役割」と「可能性を引き出し合いやすい相手」を表示します。自分の力を知るだけでなく、誰と話し、どんな場で活かしやすいかを見つける入口です。
              </p>
            </section>
          )}
          {eventCode && (
            <div className="mb-6 rounded-lg border border-gray-200 p-5">
              <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">Event</p>
              <p className="mb-3 text-sm font-bold text-black">
                {eventName || eventCode}
              </p>
              <p className="mb-4 text-xs leading-relaxed text-gray-500">
                この結果は席決めに使われます。イベント後は匿名化して診断改善に活用し、運営用データは削除されます。
              </p>
              <p className="mb-4 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
                オフ会では、結果を自己紹介の名札のように使えます。誰が何を持ち寄る人なのかを見ながら、話す相手や席順のきっかけにします。
              </p>
              <label className="mb-2 block text-sm font-medium text-black">
                ニックネーム
              </label>
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="本名でなくてOK"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:border-gray-400 focus:outline-none"
              />
              {eventError && <p className="mt-3 text-xs text-red-600">{eventError}</p>}
            </div>
          )}
          <button
            type="button"
            disabled={!!eventError || (!!eventCode && !nickname.trim())}
            onClick={() => setStarted(true)}
            className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            33問ではじめる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
            <span>
              Q{currentIndex + 1} / {ICEBREAK_TOTAL_QUESTIONS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-black" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="mb-10">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">Icebreak Question</p>
          <h2 className="text-2xl font-bold leading-relaxed text-black">{currentQuestion.text}</h2>
        </section>

        <div className="grid gap-3">
          {getQuestionChoices(currentQuestion).map((choice, choiceIndex) => (
            <button
              key={choice.value}
              type="button"
              disabled={isAdvancing}
              onClick={() => handleAnswer(choice.value)}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-5 py-4 text-left text-sm text-gray-700 transition-colors hover:border-black hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{choice.label}</span>
              <span className="text-xs text-gray-400">{String.fromCharCode(65 + choiceIndex)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
