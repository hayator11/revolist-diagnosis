import { Suspense } from "react";
import type { Metadata } from "next";
import ResultClient from "../../_components/ResultClient";

export const metadata: Metadata = {
  title: "Revo Growth 結果 | Revo OS β",
  description: "あなたの次の成長ルートと眠っている力が明らかになりました。",
};

export default function GrowthResultPage() {
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
      <ResultClient diagKey="growth" />
    </Suspense>
  );
}
