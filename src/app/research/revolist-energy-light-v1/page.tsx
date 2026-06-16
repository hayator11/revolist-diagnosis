import type { Metadata } from "next";
import { Suspense } from "react";
import EnergyLightDiagnosisClient from "./_components/EnergyLightDiagnosisClient";

export const metadata: Metadata = {
  title: "レボリスト診断 ライト版 | リサーチ診断",
  description: "21問で5つのエネルギーと11タイプを見つける研究版診断です。",
};

export default function EnergyLightPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          診断を読み込んでいます...
        </div>
      }
    >
      <EnergyLightDiagnosisClient />
    </Suspense>
  );
}
