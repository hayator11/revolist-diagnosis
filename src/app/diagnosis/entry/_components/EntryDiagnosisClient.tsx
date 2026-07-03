"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import DiagnosisQuestion from "@/components/DiagnosisQuestion";
import { entryDiagnosisQuestions } from "@/data/entryDiagnosisQuestions";
import { encodeEntryAnswers } from "@/lib/calculateEntryDiagnosisResult";

export default function EntryDiagnosisClient() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

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
            11問で、
            <br />
            役割の入口を見つける。
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-600">
            深く考えなくて大丈夫です。
            <br />
            場面を想像して、つい自分がやりそうな動きを選んでください。
          </p>

          <section className="mb-5 rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <p className="mb-3 text-sm font-bold leading-relaxed text-black">
              これは、性格を決めつける診断ではありません。
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              あなたが何を持ち寄る人なのか。誰と組むと可能性が動きやすいのか。
              その入口を、楽しく軽く見つけるための診断です。
            </p>
          </section>

          <section className="mb-8 rounded-3xl border border-gray-200 p-6">
            <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
              What you find
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-700">
              <li>・今のあなたに出やすい11役割</li>
              <li>・自然に人へ渡しているもの</li>
              <li>・可能性を引き出し合いやすい相手</li>
              <li>・もっと詳しく知るための次の入口</li>
            </ul>
          </section>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800"
          >
            11問ではじめる
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
