import type { Metadata } from "next";
import { Suspense } from "react";
import IcebreakResultClient from "../../_components/IcebreakResultClient";

export const metadata: Metadata = {
  title: "結果 | アイスブレイク11",
  description: "アイスブレイク11の結果ページです。",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IcebreakResultByIdPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          結果を読み込んでいます...
        </div>
      }
    >
      <IcebreakResultClient resultId={decodeURIComponent(id)} />
    </Suspense>
  );
}
