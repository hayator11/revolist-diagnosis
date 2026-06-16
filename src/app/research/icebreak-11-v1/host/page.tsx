import type { Metadata } from "next";
import { Suspense } from "react";
import IcebreakHostClient from "./IcebreakHostClient";

export const metadata: Metadata = {
  title: "主催者ダッシュボード | アイスブレイク11",
  description: "Icebreak 11 のイベント作成・参加者確認・席順生成画面です。",
};

export default function IcebreakHostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-gray-500">
          ダッシュボードを読み込んでいます...
        </div>
      }
    >
      <IcebreakHostClient />
    </Suspense>
  );
}
