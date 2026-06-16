import type { Metadata } from "next";
import { Suspense } from "react";
import IcebreakDiagnosisClient from "./_components/IcebreakDiagnosisClient";

export const metadata: Metadata = {
  title: "アイスブレイク11 | レボリスト診断リサーチ",
  description: "11問で今の役割と話してみたい相手を見つける先行版です。",
};

export default function IcebreakPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          読み込んでいます...
        </div>
      }
    >
      <IcebreakDiagnosisClient />
    </Suspense>
  );
}
