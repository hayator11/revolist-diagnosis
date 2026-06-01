"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import MonitorQuestion from "@/components/MonitorQuestion";
import {
  REVO111_TOTAL_QUESTIONS,
  revo111Questions,
} from "@/data/revo111Questions";
import { encodeRevo111Answers } from "@/lib/calculateRevo111Result";

export default function Revo111DiagnosisClient() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = value;
      setAnswers(newAnswers);

      if (currentIndex < revo111Questions.length - 1) {
        setTimeout(() => setCurrentIndex((index) => index + 1), 180);
      } else {
        router.push(`/revo111/result/${encodeRevo111Answers(newAnswers)}`);
      }
    },
    [answers, currentIndex, router]
  );

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
          Revo111 Sprint 1
        </p>
        <h1 className="text-3xl font-bold text-black mb-4 leading-snug">
          Revo111 44問診断
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
          役割・成長・仲間・活動の循環を見つけるための診断です。
        </p>
        <ul className="text-xs text-gray-500 mb-10 space-y-1 text-left">
          <li>・ 44問・約5分の診断です</li>
          <li>・ 正解も不正解もありません</li>
          <li>・ 今の自分に近い感覚で答えてください</li>
          <li>・ 役割は固定ではなく、育っていくものです</li>
        </ul>
        <button
          onClick={() => setStarted(true)}
          className="bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
        >
          44問診断をはじめる
        </button>
        <Link href="/full-diagnosis" className="text-xs text-gray-400 hover:text-black transition-colors mt-6">
          111問フル診断ページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <MonitorQuestion
        question={revo111Questions[currentIndex]}
        totalQuestions={REVO111_TOTAL_QUESTIONS}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentIndex]}
        accentColor="#111111"
      />
      {currentIndex > 0 && (
        <div className="px-6 pb-8 text-center">
          <button
            onClick={() => setCurrentIndex((index) => index - 1)}
            className="text-xs text-gray-400 hover:text-black transition-colors"
          >
            ← 前の質問に戻る
          </button>
        </div>
      )}
    </div>
  );
}
