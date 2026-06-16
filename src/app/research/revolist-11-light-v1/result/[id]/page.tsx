import type { Metadata } from "next";
import { Suspense } from "react";
import ResearchLightResultClient from "../../_components/ResearchLightResultClient";

export const metadata: Metadata = {
  title: "診断結果 | レボリスト11 ライト版ベータ",
  description: "レボリスト11 ライト版ベータの共有結果ページです。",
};

export default async function ResearchLightSharedResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          結果を読み込んでいます...
        </div>
      }
    >
      <ResearchLightResultClient resultId={id} />
    </Suspense>
  );
}
