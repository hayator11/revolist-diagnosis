import TypeCard from "@/components/TypeCard";
import { revoTypeList } from "@/data/revotypes";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "11タイプ一覧 | レボリスト診断",
  description: "レボリスト診断の11タイプを紹介。どのタイプも欠けているものではなく、独自の力を持つ存在です。",
};

export default function TypesPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">
          11 Types
        </p>
        <h1 className="text-4xl font-bold text-black mb-4">
          11のタイプ
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
          どのタイプも、欠けているものではなく、独自の力を持つ存在です。
          あなたの中には、複数のタイプが眠っています。
        </p>
      </div>

      {/* Type list */}
      <div className="space-y-6 mb-12">
        {revoTypeList.map((type, i) => (
          <div key={type.key}>
            <p className="text-xs text-gray-400 mb-2 tracking-wider">
              Type {String(i + 1).padStart(2, "0")}
            </p>
            <TypeCard type={type} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center border-t border-gray-100 pt-12">
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          どのタイプが今のあなたに近いか、
          <br />
          診断で確かめてみましょう。
        </p>
        <Link
          href="/diagnosis"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
        >
          レボリスト診断をはじめる →
        </Link>
      </div>
    </div>
  );
}
