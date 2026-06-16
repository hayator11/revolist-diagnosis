import type { Metadata } from "next";
import Link from "next/link";
import { ICEBREAK_11_META } from "@/data/researchProjects";

const DEFAULT_ICEBREAK_OPENCHAT_URL =
  "https://line.me/ti/g2/b26E1JogLaVG_XwQwgsCMfC7HWrD8VW5EkyOUQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

export const metadata: Metadata = {
  title: "送信ありがとうございました | Icebreak 11",
  description: "Icebreak 11 のアンケート送信完了ページです。",
};

export default function IcebreakThanksPage() {
  const openChatUrl = process.env.NEXT_PUBLIC_ICEBREAK_OPENCHAT_URL ?? DEFAULT_ICEBREAK_OPENCHAT_URL;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-14">
      <div className="max-w-lg text-center">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
          Thank you
        </p>
        <h1 className="mb-4 text-3xl font-bold text-black">送信ありがとうございました</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          いただいた回答は、Icebreak 11 を「その場で人とつながる診断」として育てるために活用します。
        </p>

        <div className="rounded-lg border border-gray-200 p-5 text-left">
          <h2 className="mb-2 text-lg font-bold text-black">続きはオープンチャットへ</h2>
          <p className="mb-3 text-sm font-bold text-black">
            孤独な挑戦者を、減らしたい
          </p>
          <p className="mb-5 text-sm leading-relaxed text-gray-600">
            結果を見て感じたこと、話してみたいタイプ、イベントで試したい使い方をそのまま持ち寄れます。
          </p>
          <a
            href={openChatUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white"
          >
            オープンチャットへ進む
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/research/${ICEBREAK_11_META.slug}`}
            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700"
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
