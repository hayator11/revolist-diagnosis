import TypeCard from "@/components/TypeCard";
import { revo111Roles } from "@/data/revo111Roles";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "11タイプ一覧 | レボリスト診断",
  description: "レボリスト診断の11役割を紹介。あなたが何を持ち寄り、誰と可能性を引き出し合いやすいかを見ていきます。",
};

const roleList = Object.values(revo111Roles);

export default function TypesPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">
          11 Roles
        </p>
        <h1 className="text-4xl font-bold text-black mb-4">
          11の役割
        </h1>
        <div className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto space-y-3">
          <p>
            すべての人は、自分の役割に出逢ったとき天才になる。
          </p>
          <p>
            11役割は優劣ではなく、何を持ち寄り、誰と可能性を引き出し合いやすいかを見るための地図です。
          </p>
        </div>
      </div>

      {/* Type list */}
      <div className="space-y-6 mb-12">
        {roleList.map((type, i) => (
          <div key={type.key}>
            <p className="text-xs text-gray-400 mb-2 tracking-wider">
              Role {String(i + 1).padStart(2, "0")}
            </p>
            <TypeCard type={type} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center border-t border-gray-100 pt-12">
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          今のあなたは、どんな役割を持ち寄りやすいか。
          <br />
          診断で確かめてみましょう。
        </p>
        <Link
          href="/diagnosis/entry"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
        >
          11問入口診断をはじめる →
        </Link>
      </div>
    </div>
  );
}
