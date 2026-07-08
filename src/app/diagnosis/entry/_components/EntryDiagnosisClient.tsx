"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DiagnosisQuestion from "@/components/DiagnosisQuestion";
import { entryDiagnosisQuestions } from "@/data/entryDiagnosisQuestions";
import { encodeEntryAnswers } from "@/lib/calculateEntryDiagnosisResult";

export default function EntryDiagnosisClient() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    const storageKey = "entry-diagnosis-access-counted";
    if (window.sessionStorage.getItem(storageKey)) return;

    fetch("/api/diagnosis-run-counter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diagnosisKey: "entry_diagnosis_access",
        eventType: "page_view",
        source: "entry-diagnosis-page",
      }),
    })
      .then(() => {
        window.sessionStorage.setItem(storageKey, "true");
      })
      .catch(() => {
        // Access logging should not block the diagnosis.
      });
  }, []);

  const handleAnswer = useCallback(
    (value: number) => {
      const nextAnswers = [...answers];
      nextAnswers[currentIndex] = value;
      setAnswers(nextAnswers);

      if (currentIndex < entryDiagnosisQuestions.length - 1) {
        setTimeout(() => setCurrentIndex((index) => index + 1), 220);
        return;
      }

      const encoded = encodeEntryAnswers(nextAnswers);
      router.push(`/diagnosis/entry/result?answers=${encodeURIComponent(encoded)}`);
    },
    [answers, currentIndex, router]
  );

  if (!started) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg flex-col justify-center">
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-gray-400">
            Revolist Entry
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-black">
            あなたの“当たり前”は、
            <br />
            誰かの突破口かもしれない。
          </h1>

          <section className="mb-6 rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
              この診断で見えてくること
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700">
              <li>・自分では普通だと思っていた力が、誰かの役に立つ瞬間</li>
              <li>・なぜか人から頼られる理由</li>
              <li>・可能性を引き出し合いやすい相手</li>
            </ul>
          </section>

          <p className="mb-8 text-sm leading-relaxed text-gray-600">
            直感で選べます。
          </p>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800"
          >
            自分の役割を見つける
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg bg-white">
      <DiagnosisQuestion
        question={entryDiagnosisQuestions[currentIndex]}
        totalQuestions={entryDiagnosisQuestions.length}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentIndex]}
      />
      {currentIndex > 0 && (
        <div className="px-6 pb-8 text-center">
          <button
            type="button"
            onClick={() => setCurrentIndex((index) => index - 1)}
            className="text-xs text-gray-400 transition-colors hover:text-black"
          >
            ← 前の質問に戻る
          </button>
        </div>
      )}
    </main>
  );
}
