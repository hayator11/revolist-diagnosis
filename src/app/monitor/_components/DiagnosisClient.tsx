"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MonitorQuestion from "@/components/MonitorQuestion";
import type { MonitorDiagnosisKey } from "@/data/monitorQuestions";
import { monitorQuestionsMap } from "@/data/monitorQuestions";
import { monitorScenarioQuestions } from "@/data/monitorScenarioQuestions";
import { monitorDiagnosisMeta } from "@/data/monitorResults";
import { encodeMonitorAnswers } from "@/lib/calculateMonitorResult";
import Link from "next/link";

interface Props {
  diagKey: MonitorDiagnosisKey;
}

export default function DiagnosisClient({ diagKey }: Props) {
  const router = useRouter();
  const questions = diagKey === "role" ? monitorScenarioQuestions : monitorQuestionsMap[diagKey];
  const meta = monitorDiagnosisMeta[diagKey];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = value;
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setTimeout(() => setCurrentIndex((i) => i + 1), 250);
      } else {
        const encoded = encodeMonitorAnswers(newAnswers);
        router.push(`/monitor/${diagKey}/result?answers=${encoded}`);
      }
    },
    [answers, currentIndex, questions.length, diagKey, router]
  );

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* βバッジ */}
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: meta.accentColor }}>
          Revo OS β — {meta.title}
        </p>
        <h1 className="text-3xl font-bold text-black mb-3 leading-snug">{meta.title}</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-xs">{meta.subtitle}</p>

        {/* 説明 */}
        <ul className="text-xs text-gray-500 mb-10 space-y-1 text-left">
          <li>・ {questions.length}問・直感で進める診断です</li>
          <li>・ 正解も不正解もありません</li>
          <li>・ 場面を読んで、いちばん近い動きを選んでください</li>
          <li>・ どの選択肢にも、それぞれの持ち味があります</li>
        </ul>

        <button
          onClick={() => setStarted(true)}
          className="text-white px-8 py-4 rounded-full text-base font-medium transition-colors mb-6"
          style={{ backgroundColor: meta.accentColor }}
        >
          はじめる
        </button>

        <Link href="/monitor" className="text-xs text-gray-400 hover:text-black transition-colors">
          ← モニタートップに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <MonitorQuestion
        question={questions[currentIndex]}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentIndex]}
        accentColor={meta.accentColor}
      />
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
