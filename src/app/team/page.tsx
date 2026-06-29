"use client";

import { useState } from "react";
import Link from "next/link";
import { revoTypes, revoTypeList } from "@/data/revotypes";
import {
  getPartnersByTier,
  tierLabel,
  type CompatibilityTier,
} from "@/data/teamCompatibility";

const TIER_BG: Record<CompatibilityTier, string> = {
  best: "bg-black text-white",
  good: "bg-gray-100 text-gray-800",
  bridge: "bg-white border border-gray-200 text-gray-600",
};

const TIER_BADGE: Record<CompatibilityTier, string> = {
  best: "bg-white text-black",
  good: "bg-gray-800 text-white",
  bridge: "bg-gray-200 text-gray-600",
};

export default function TeamPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const selected = selectedType ? revoTypes[selectedType as keyof typeof revoTypes] : null;
  const partners = selectedType
    ? getPartnersByTier(selectedType as Parameters<typeof getPartnersByTier>[0])
    : [];

  const bestPartners = partners.filter((p) => p.compat.tier === "best");
  const goodPartners = partners.filter((p) => p.compat.tier === "good");
  const bridgePartners = partners.filter((p) => p.compat.tier === "bridge");

  return (
    <main className="min-h-screen bg-white">
      {/* ヘッダー */}
      <section className="px-6 pt-16 pb-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Team Design</p>
          <h1 className="text-3xl font-bold text-black mb-3 leading-snug">
            チーム設計表
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            「誰が優れているか」ではなく、「誰と組むと力が発揮されるか」。
            <br />
            あなたのタイプを選んで、相性とチーム設計を確認しましょう。
          </p>
        </div>
      </section>

      {/* タイプ選択 */}
      <section className="px-6 py-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-5">
            あなたのタイプを選ぶ
          </p>
          <div className="flex flex-wrap gap-2">
            {revoTypeList.map((type) => {
              const isSelected = selectedType === type.key;
              return (
                <button
                  key={type.key}
                  onClick={() =>
                    setSelectedType(isSelected ? null : type.key)
                  }
                  className={`text-sm px-4 py-2.5 rounded-full border transition-all duration-200 font-medium ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black"
                  }`}
                >
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 未選択時のガイド */}
      {!selected && (
        <section className="px-6 py-16">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm text-gray-400 leading-relaxed">
                タイプを選ぶと、相性と推奨チーム設計が表示されます。
              </p>
            </div>

            {/* チーム人数の考え方 */}
            <div className="space-y-4 mb-12">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-5">
                チーム人数の考え方
              </p>
              {[
                { n: "2人", desc: "相性が良ければ強い。詰まりやすいときは3人目を探す。", badge: "" },
                { n: "3人", desc: "奇数でまとまりやすい。役割が分散して動きやすくなる。", badge: "推奨" },
                { n: "4人", desc: "対立しやすい構造になりやすい。3＋1の関係性で動かす。", badge: "" },
                { n: "5人", desc: "役割が十分に分散し、チームとして機能し始める。", badge: "" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                  <span className="text-sm font-bold text-black bg-gray-200 px-3 py-1 rounded-full shrink-0">
                    {item.n}
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
                    {item.badge && (
                      <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 凡例 */}
            <div className="space-y-3">
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">相性の見方</p>
              {(["best", "good", "bridge"] as CompatibilityTier[]).map((tier) => (
                <div key={tier} className={`p-4 rounded-2xl ${TIER_BG[tier]}`}>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TIER_BADGE[tier]}`}>
                    {tierLabel[tier].split(" ")[0]}
                  </span>
                  <p className={`text-sm mt-2 ${tier === "best" ? "text-gray-300" : "text-gray-600"}`}>
                    {tierLabel[tier].slice(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 選択済み：相性一覧 */}
      {selected && (
        <section className="px-6 py-10">
          <div className="max-w-lg mx-auto">

            {/* 選択タイプ表示 */}
            <div className="bg-black text-white rounded-3xl p-7 mb-10">
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">選択中のタイプ</p>
              <p className="text-3xl font-bold mb-1">{selected.name}</p>
              <p className="text-sm text-gray-400">{selected.catchcopy}</p>
            </div>

            {/* ◎ best */}
            {bestPartners.length > 0 && (
              <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
                  ◎ 力が最大化される相手
                </p>
                <div className="space-y-4">
                  {bestPartners.map(({ partnerKey, compat }) => {
                    const partner = revoTypes[partnerKey];
                    return (
                      <div key={partnerKey} className="bg-black text-white rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-lg font-bold">{partner.name}</p>
                            <p className="text-xs text-gray-400">{partner.catchcopy}</p>
                          </div>
                          <span className="text-xs font-bold bg-white text-black px-2.5 py-1 rounded-full shrink-0">
                            {compat.dynamic}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                          {compat.teamNote}
                        </p>
                        <div className="border-t border-gray-800 pt-4 space-y-2">
                          <p className="text-xs text-gray-500">{selected.name} → {partner.name}</p>
                          <p className="text-sm text-gray-300">{compat.fromNote}</p>
                          <p className="text-xs text-gray-500 mt-2">{partner.name} → {selected.name}</p>
                          <p className="text-sm text-gray-300">{compat.toNote}</p>
                        </div>
                        <div className="border-t border-gray-800 pt-4 mt-4">
                          <p className="text-xs text-gray-500 mb-1">3人目に足すといいタイプ</p>
                          <p className="text-sm font-medium text-white">
                            {revoTypes[compat.thirdPerson].name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ○ good */}
            {goodPartners.length > 0 && (
              <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
                  ○ 自然に補い合える相手
                </p>
                <div className="space-y-3">
                  {goodPartners.map(({ partnerKey, compat }) => {
                    const partner = revoTypes[partnerKey];
                    return (
                      <div key={partnerKey} className="border border-gray-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-base font-bold text-black">{partner.name}</p>
                            <p className="text-xs text-gray-400">{partner.catchcopy}</p>
                          </div>
                          <span className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full shrink-0">
                            {compat.dynamic}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{compat.teamNote}</p>
                        <p className="text-xs text-gray-400">
                          3人目 → <span className="font-medium text-gray-600">{revoTypes[compat.thirdPerson].name}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* △ bridge */}
            {bridgePartners.length > 0 && (
              <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">
                  △ 違いが大きい — 橋渡しで輝く
                </p>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  違いがあるからこそ、間に橋渡し役が入ると大きな化学反応が起きます。
                </p>
                <div className="space-y-2">
                  {bridgePartners.map(({ partnerKey, compat }) => {
                    const partner = revoTypes[partnerKey];
                    return (
                      <div key={partnerKey} className="border border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{partner.name}</p>
                          <p className="text-xs text-gray-400">{compat.dynamic}</p>
                        </div>
                        <p className="text-xs text-gray-400 shrink-0 ml-4">
                          橋渡し → <span className="font-medium">{revoTypes[compat.thirdPerson].name}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 診断への誘導 */}
            <div className="border-t border-gray-100 pt-10 text-center space-y-3">
              <p className="text-xs text-gray-400 mb-4">
                自分のタイプがまだわからない方は
              </p>
              <Link
                href="/diagnosis"
                className="block w-full py-4 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                レボリスト診断でタイプを調べる
              </Link>
              <Link
                href="/monitor"
                className="block w-full py-4 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-black hover:text-black transition-colors"
              >
                Revo OS β版（4診断）を試す
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
