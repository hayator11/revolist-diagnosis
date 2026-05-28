"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ResultCard from "@/components/ResultCard";
import { calculateResult, decodeAnswers } from "@/lib/calculateResult";
import { questions } from "@/data/questions";
import Link from "next/link";

function ResultContent() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers");

  const result = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeAnswers(encoded);
    if (answers.length !== questions.length || answers.some(isNaN)) return null;
    return calculateResult(answers);
  }, [encoded]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-6 text-sm">診断データが見つかりませんでした。</p>
        <Link
          href="/diagnosis"
          className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          診断をはじめる
        </Link>
      </div>
    );
  }

  return <ResultCard result={result} />;
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">結果を計算中...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
