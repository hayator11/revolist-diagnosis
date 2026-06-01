"use client";

import { Suspense } from "react";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DiagnosisQuestion from "@/components/DiagnosisQuestion";
import { questions } from "@/data/questions";
import { encodeAnswers } from "@/lib/calculateResult";
import {
  discoveryChannelOptions,
  getTrackingParams,
  referredOptions,
} from "@/data/revoResearch";

function DiagnosisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [discoveryChannel, setDiscoveryChannel] = useState("");
  const [isReferred, setIsReferred] = useState("");

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = value;
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        // 短いディレイで次の質問へ
        setTimeout(() => setCurrentIndex((i) => i + 1), 250);
      } else {
        // 全問回答完了 → 結果ページへ
        const encoded = encodeAnswers(newAnswers);
        const params = new URLSearchParams({
          answers: encoded,
        });
        const tracking = getTrackingParams(searchParams);

        if (discoveryChannel) params.set("discoveryChannel", discoveryChannel);
        if (isReferred) params.set("isReferred", isReferred);
        if (tracking.referrerSlug) params.set("ref", tracking.referrerSlug);
        if (tracking.utmSource) params.set("utm_source", tracking.utmSource);
        if (tracking.utmMedium) params.set("utm_medium", tracking.utmMedium);
        if (tracking.utmCampaign) params.set("utm_campaign", tracking.utmCampaign);

        router.push(`/result?${params.toString()}`);
      }
    },
    [answers, currentIndex, discoveryChannel, isReferred, router, searchParams]
  );

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
          Light Diagnosis
        </p>
        <h1 className="text-3xl font-bold text-black mb-4 leading-snug">
          ライト診断
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-xs">
          21問・約3分の診断です。
          <br />
          直感で答えてください。
        </p>
        <ul className="text-xs text-gray-500 mb-10 space-y-1 text-left">
          <li>・ 正解も不正解もありません</li>
          <li>・ 今の自分に当てはまるかで答えてください</li>
          <li>・ 途中でやり直すこともできます</li>
        </ul>
        <div className="w-full max-w-xs space-y-4 mb-8 text-left">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Revo111をどこで知りましたか？ 任意
            </label>
            <select
              value={discoveryChannel}
              onChange={(event) => setDiscoveryChannel(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
            >
              <option value="">未回答</option>
              {discoveryChannelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              誰かの紹介で知りましたか？ 任意
            </label>
            <select
              value={isReferred}
              onChange={(event) => setIsReferred(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
            >
              <option value="">未回答</option>
              {referredOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
        >
          はじめる
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <DiagnosisQuestion
        question={questions[currentIndex]}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentIndex]}
      />
      {/* Back button */}
      {currentIndex > 0 && (
        <div className="px-6 pb-8 text-center">
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="text-xs text-gray-400 hover:text-black transition-colors"
          >
            ← 前の質問に戻る
          </button>
        </div>
      )}
    </div>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-6">
          <p className="text-sm text-gray-500">診断を読み込んでいます...</p>
        </div>
      }
    >
      <DiagnosisContent />
    </Suspense>
  );
}
