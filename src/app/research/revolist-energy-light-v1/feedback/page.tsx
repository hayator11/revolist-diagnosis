import type { Metadata } from "next";
import { Suspense } from "react";
import EnergyLightFeedbackClient from "../_components/EnergyLightFeedbackClient";

export const metadata: Metadata = {
  title: "感想フォーム | レボリスト診断 ライト版",
  description: "レボリスト診断 ライト版の感想フォームです。",
};

export default function EnergyLightFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          フォームを読み込んでいます...
        </div>
      }
    >
      <EnergyLightFeedbackClient />
    </Suspense>
  );
}
