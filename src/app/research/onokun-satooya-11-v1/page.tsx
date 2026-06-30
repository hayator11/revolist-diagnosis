import type { Metadata } from "next";
import { Suspense } from "react";
import OnokunSatooyaDiagnosisClient from "./_components/OnokunSatooyaDiagnosisClient";

export const metadata: Metadata = {
  title: "おのくん里親さん 11ご縁タイプ診断",
  description:
    "おのくんとのご縁の育て方を楽しく見える化する、里親さん向けの11タイプ診断です。",
};

export default function OnokunSatooyaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 text-sm text-[#3A2A1E]">
          診断を読み込んでいます...
        </div>
      }
    >
      <OnokunSatooyaDiagnosisClient />
    </Suspense>
  );
}

