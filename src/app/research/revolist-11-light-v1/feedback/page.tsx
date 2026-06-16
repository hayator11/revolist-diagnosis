import type { Metadata } from "next";
import { Suspense } from "react";
import ResearchLightFeedbackClient from "../_components/ResearchLightFeedbackClient";

export const metadata: Metadata = {
  title: "感想フォーム | レボリスト11 ライト版ベータ",
  description: "レボリスト11 ライト版ベータの感想フォームです。",
};

export default function ResearchLightFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          フォームを読み込んでいます...
        </div>
      }
    >
      <ResearchLightFeedbackClient />
    </Suspense>
  );
}
