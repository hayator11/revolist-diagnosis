import { Suspense } from "react";
import type { Metadata } from "next";
import ResultClient from "../../_components/ResultClient";

interface Props {
  searchParams: Promise<{ answers?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { answers } = await searchParams;
  const ogUrl = answers
    ? `/api/og/monitor?type=role&answers=${answers}`
    : `/api/og/monitor?type=role`;
  return {
    title: "Revo Role 結果 | Revo OS β",
    description: "今、あなたが強く使っている役割が明らかになりました。",
    openGraph: {
      title: "Revo Role 結果 | Revo OS β",
      description: "役割でチームを作るための、新しい共創OSの実験。",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Revo Role 結果 | Revo OS β",
      description: "役割でチームを作るための、新しい共創OSの実験。",
      images: [ogUrl],
    },
  };
}

export default function RoleResultPage() {
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
      <ResultClient diagKey="role" />
    </Suspense>
  );
}
