import type { Metadata } from "next";
import { Suspense } from "react";
import Revo111ResultClient from "../_components/Revo111ResultClient";

export const metadata: Metadata = {
  title: "Revo111 診断結果 | レボリスト診断",
  description:
    "Revo111 44問診断の結果ページです。役割・成長・仲間・活動の循環を表示します。",
};

export default function Revo111ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-6 text-sm text-gray-500">
          結果を読み込んでいます...
        </div>
      }
    >
      <Revo111ResultClient />
    </Suspense>
  );
}
