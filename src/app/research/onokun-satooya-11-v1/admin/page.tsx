import type { Metadata } from "next";
import { Suspense } from "react";
import OnokunSatooyaAdminClient from "./OnokunSatooyaAdminClient";

export const metadata: Metadata = {
  title: "おのくん里親さん診断 運営管理",
  description: "おのくん里親さん 11ご縁タイプ診断の運営確認画面です。",
};

export default function OnokunSatooyaAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8EA] px-6 text-sm font-bold text-[#3A2A1E]">
          管理画面を読み込んでいます...
        </div>
      }
    >
      <OnokunSatooyaAdminClient />
    </Suspense>
  );
}
