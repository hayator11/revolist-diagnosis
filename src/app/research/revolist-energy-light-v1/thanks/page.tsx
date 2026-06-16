import type { Metadata } from "next";
import Link from "next/link";
import { ENERGY_LIGHT_META } from "@/data/researchProjects";

export const metadata: Metadata = {
  title: "送信完了 | レボリスト診断 ライト版",
  description: "レボリスト診断 ライト版の感想送信完了ページです。",
};

export default function EnergyLightThanksPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">Thank you</p>
        <h1 className="mb-4 text-3xl font-bold text-black">感想を受け取りました</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          回答はレボリスト診断ライト版の研究に活用します。
        </p>
        <Link
          href={`/research/${ENERGY_LIGHT_META.slug}`}
          className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          もう一度見る
        </Link>
      </div>
    </div>
  );
}
