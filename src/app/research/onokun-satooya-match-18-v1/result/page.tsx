import type { Metadata } from "next";
import { Suspense } from "react";
import OnokunSatooyaMatchResultClient from "../_components/OnokunSatooyaMatchResultClient";

export const metadata: Metadata = {
  title: "相棒マッチ結果 | おのくん里親さん 相棒マッチ診断",
  description: "おのくん里親さん 相棒マッチ診断の結果ページです。",
};

export default function OnokunSatooyaMatchResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 text-sm text-[#3A2A1E]">
          相棒マッチ結果を読み込んでいます...
        </div>
      }
    >
      <OnokunSatooyaMatchResultClient />
    </Suspense>
  );
}
