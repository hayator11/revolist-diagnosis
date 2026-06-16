import type { Metadata } from "next";
import { Suspense } from "react";
import ResearchLightDiagnosisClient from "./_components/ResearchLightDiagnosisClient";

export const metadata: Metadata = {
  title: "レボリスト11 ライト版ベータ | リサーチ診断",
  description: "21問で5つの力スコアと11タイプ判定を行う研究版診断です。",
};

export default function ResearchLightPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          診断を読み込んでいます...
        </div>
      }
    >
      <ResearchLightDiagnosisClient />
    </Suspense>
  );
}
