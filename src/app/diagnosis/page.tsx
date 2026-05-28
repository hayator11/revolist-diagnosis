"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DiagnosisQuestion from "@/components/DiagnosisQuestion";
import { questions } from "@/data/questions";
import { encodeAnswers } from "@/lib/calculateResult";

export default function DiagnosisPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);

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
        router.push(`/result?answers=${encoded}`);
      }
    },
    [answers, currentIndex, router]
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
