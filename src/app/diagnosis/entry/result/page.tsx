import { Suspense } from "react";
import type { Metadata } from "next";
import EntryDiagnosisResultClient from "../_components/EntryDiagnosisResultClient";

export const metadata: Metadata = {
  title: "入口診断の結果 | レボリスト診断",
  description:
    "11問入口診断の結果です。あなたに出やすい役割と、可能性を引き出し合いやすい相手を表示します。",
};

export default function EntryDiagnosisResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="text-sm text-gray-500">結果を読み込んでいます...</p>
        </div>
      }
    >
      <EntryDiagnosisResultClient />
    </Suspense>
  );
}
