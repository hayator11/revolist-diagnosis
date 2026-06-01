import type { Metadata } from "next";
import { Suspense } from "react";
import Revo111DiagnosisClient from "./_components/Revo111DiagnosisClient";

export const metadata: Metadata = {
  title: "Revo111 44問モニター診断 | レボリスト診断",
  description:
    "感想提供と改善協力を前提に、役割・成長・仲間・活動の循環を見える形にするRevo111 44問モニター診断です。",
};

export default function Revo111Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-6">
          <p className="text-sm text-gray-500">診断を読み込んでいます...</p>
        </div>
      }
    >
      <Revo111DiagnosisClient />
    </Suspense>
  );
}
