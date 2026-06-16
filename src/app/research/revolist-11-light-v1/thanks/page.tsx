import type { Metadata } from "next";
import Link from "next/link";
import { REVOLIST_11_LIGHT_META } from "@/data/researchProjects";

export const metadata: Metadata = {
  title: "送信ありがとうございました | レボリスト11 ライト版ベータ",
  description: "レボリスト11 ライト版ベータの感想送信完了ページです。",
};

export default function ResearchLightThanksPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-14">
      <div className="max-w-lg text-center">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          Research Feedback
        </p>
        <h1 className="mb-4 text-3xl font-bold text-black">送信ありがとうございました</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          いただいた回答は、レボリスト11ライト版ベータの改善と
          リサーチ1000件取得プロジェクトに活用します。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/research/${REVOLIST_11_LIGHT_META.slug}`}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
          >
            もう一度診断する
          </Link>
          <Link
            href="/research"
            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700"
          >
            リサーチ一覧へ
          </Link>
        </div>
      </div>
    </div>
  );
}
