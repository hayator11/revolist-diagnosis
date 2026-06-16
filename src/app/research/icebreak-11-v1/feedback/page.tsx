import type { Metadata } from "next";
import { Suspense } from "react";
import IcebreakFeedbackClient from "../_components/IcebreakFeedbackClient";

export const metadata: Metadata = {
  title: "アンケート | Icebreak 11",
  description: "Icebreak 11 の体験アンケートです。",
};

export default function IcebreakFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          アンケートを読み込んでいます...
        </div>
      }
    >
      <IcebreakFeedbackClient />
    </Suspense>
  );
}
