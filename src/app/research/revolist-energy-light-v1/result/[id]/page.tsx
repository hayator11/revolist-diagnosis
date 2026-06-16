import type { Metadata } from "next";
import { Suspense } from "react";
import EnergyLightResultClient from "../../_components/EnergyLightResultClient";

export const metadata: Metadata = {
  title: "診断結果 | レボリスト診断 ライト版",
  description: "レボリスト診断 ライト版の結果ページです。",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EnergyLightResultByIdPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          結果を読み込んでいます...
        </div>
      }
    >
      <EnergyLightResultClient resultId={decodeURIComponent(id)} />
    </Suspense>
  );
}
