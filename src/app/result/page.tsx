import { Suspense } from "react";
import type { Metadata } from "next";
import ResultContent from "./ResultContent";

interface Props {
  searchParams: Promise<{ answers?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { answers } = await searchParams;
  const ogImageUrl = answers
    ? `/api/og?answers=${answers}`
    : undefined;

  return {
    title: "あなたの診断結果 | レボリスト診断",
    description:
      "あなたの役割は、まだ完成していません。出会いと環境によって、役割は育っていく。",
    openGraph: {
      title: "あなたの診断結果 | レボリスト診断",
      description: "役割が違うから、人は支え合える。",
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: "あなたの診断結果 | レボリスト診断",
      description: "役割が違うから、人は支え合える。",
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">結果を計算中...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
