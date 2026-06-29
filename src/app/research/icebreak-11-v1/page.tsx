import type { Metadata } from "next";
import { Suspense } from "react";
import IcebreakDiagnosisClient from "./_components/IcebreakDiagnosisClient";

export const metadata: Metadata = {
  title: "Icebreak 33 | レボリスト診断",
  description: "33問で自分の11役割、持ち寄り方、可能性を引き出し合いやすい相手を見つける診断です。",
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
