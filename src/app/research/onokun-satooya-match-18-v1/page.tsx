import type { Metadata } from "next";
import { Suspense } from "react";
import OnokunSatooyaMatchDiagnosisClient from "./_components/OnokunSatooyaMatchDiagnosisClient";

export const metadata: Metadata = {
  title: "おのくん里親さん 相棒マッチ診断",
  description:
    "自分のご縁タイプと、気になる相棒タイプを両方向で見る、おのくん里親さん向けの18問診断です。",
};

export default function OnokunSatooyaMatchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 text-sm text-[#3A2A1E]">
          相棒マッチ診断を読み込んでいます...
        </div>
      }
    >
      <OnokunSatooyaMatchDiagnosisClient />
    </Suspense>
  );
}
