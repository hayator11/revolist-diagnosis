import type { Metadata } from "next";
import { Suspense } from "react";
import OnokunSatooyaResultClient from "../_components/OnokunSatooyaResultClient";

export const metadata: Metadata = {
  title: "診断結果 | おのくん里親さん 11ご縁タイプ診断",
  description: "おのくん里親さん 11ご縁タイプ診断の結果ページです。",
};

export default function OnokunSatooyaResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 text-sm text-[#3A2A1E]">
          結果を読み込んでいます...
        </div>
      }
    >
      <OnokunSatooyaResultClient />
    </Suspense>
  );
}

