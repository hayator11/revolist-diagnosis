import Link from "next/link";
import type { Metadata } from "next";
import FadeInSection from "@/components/FadeInSection";

export const metadata: Metadata = {
  title: "Revo | レボリスト診断",
  description:
    "違いを持ち寄り、循環によって未来を育てる。Revoは、役割と感情が循環する共創文化です。",
  openGraph: {
    title: "Revo",
    description: "違いを持ち寄り、循環によって未来を育てる。",
  },
};

const revoFeatures = [
  {
    title: "役割循環",
    body: "固定された役職ではなく、\n状況や成長によって役割は変化する。",
  },
  {
    title: "感情インフラ",
    body: "安心・応援・居場所も、\n大切な価値として扱う。",
  },
  {
    title: "持ち寄り文化",
    body: "足りないものを責めるのではなく、\n違いを持ち寄る。",
  },
  {
    title: "環境を育てる",
    body: "人は環境に影響されるだけでなく、\n自ら環境を作る存在でもある。",
  },
];

const revoCreates = [
  "挑戦しやすい空気",
  "安心して話せる関係",
  "応援が循環する環境",
  "自分の役割が見つかる",
  "仲間によって可能性が広がる",
  "「ひとりで頑張る」が減る",
];

const cycleRoles = [
  "火を灯す",
  "整える",
  "広げる",
  "支える",
  "受け止める",
];

export default function RevoPage() {
  return (
    <div className="max-w-lg mx-auto pb-24">

      {/* ── ファーストビュー ── */}
      <section className="min-h-[92vh] flex flex-col justify-center px-6 py-20 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">Revo</p>
        <h1 className="text-6xl font-bold text-black mb-6 tracking-tighter">Revo</h1>
        <p className="text-xl text-gray-500 mb-14 leading-relaxed font-light">
          違いを持ち寄り、<br />循環によって未来を育てる。
        </p>
        <div className="text-sm text-gray-600 leading-[2.2] space-y-4">
          <p>
            Revoは、<br />人を分類する場所ではありません。
          </p>
          <p>
            役割を持ち寄り、<br />循環を育てる共創文化です。
          </p>
          <div className="pl-5 border-l-2 border-gray-100 py-3 space-y-1 text-gray-400 italic">
            <p>挑戦する人。</p>
            <p>支える人。</p>
            <p>整える人。</p>
            <p>表現する人。</p>
            <p>寄り添う人。</p>
          </div>
          <p>
            違う役割が重なることで、<br />人も環境も少しずつ育っていきます。
          </p>
        </div>
      </section>

      {/* ── Section: Revoの特徴 ── */}
      <section className="px-6 py-20 border-b border-gray-100">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Revo Features</p>
          <h2 className="text-lg font-bold text-black mb-10">Revoの特徴</h2>
        </FadeInSection>
        <div className="grid grid-cols-2 gap-3">
          {revoFeatures.map((feature, i) => (
            <FadeInSection key={feature.title} delay={i * 70}>
              <div className="rounded-2xl bg-gray-50 p-5 h-full hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300">
                <p className="text-sm font-bold text-black mb-3">{feature.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{feature.body}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Section: 役割循環ビジュアル ── */}
      <section className="px-6 py-20 bg-black border-b border-gray-800">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-500 uppercase mb-12 text-center">The Cycle</p>

          {/* 役割循環図 */}
          <div className="flex flex-col items-center gap-8 mb-12">
            {/* 中央の循環マーク */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full border border-gray-700 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500 tracking-wide">循環</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 役割ラベル群 */}
            <div className="flex flex-wrap justify-center gap-2">
              {cycleRoles.map((role) => (
                <span
                  key={role}
                  className="text-xs text-gray-300 border border-gray-700 px-4 py-2 rounded-full"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-[2] text-center">
            ひとりひとりの役割が重なり、<br />
            止まっていた流れが動き始める。
          </p>
        </FadeInSection>
      </section>

      {/* ── Section: Revoで生まれること ── */}
      <section className="px-6 py-20 border-b border-gray-100">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">What Revo Creates</p>
          <h2 className="text-lg font-bold text-black mb-10">Revoで生まれること</h2>
          <div className="space-y-4">
            {revoCreates.map((item, i) => (
              <div key={item} className="flex items-center gap-4">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 font-medium">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* ── 最後の締め ── */}
      <section className="px-6 py-20 border-b border-gray-100 text-center">
        <FadeInSection>
          <div className="text-sm text-gray-600 leading-[2.4] space-y-5 max-w-xs mx-auto">
            <p>
              あなたに足りないものは、<br />
              誰かの才能かもしれません。
            </p>
            <p>
              そして、<br />
              あなたが自然に持っている力も、<br />
              誰かの未来を支える力になっています。
            </p>
            <div className="border-t border-gray-100 pt-6 space-y-2">
              <p className="font-semibold text-black text-base">
                違いがあるから、人は支え合える。
              </p>
              <p className="text-gray-400">
                Revoは、<br />その循環を育てていく場所です。
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-14">
        <FadeInSection>
          <div className="space-y-3">
            {/* 将来拡張: Revoコミュニティ登録 実装後に <Link href="/revo/join"> に変更 */}
            <div className="w-full rounded-2xl bg-black p-5 opacity-40 cursor-not-allowed select-none">
              <p className="text-white font-medium text-sm text-center">Revoコミュニティへ参加する</p>
              <p className="text-gray-500 text-xs text-center mt-1.5">（準備中）</p>
            </div>

            <Link
              href="/full-diagnosis"
              className="block w-full text-center py-4 rounded-2xl border border-gray-200 text-gray-600 text-sm hover:border-black hover:text-black transition-colors"
            >
              111問フル診断について見る
            </Link>

            <Link
              href="/diagnosis"
              className="block w-full text-center py-4 rounded-2xl border border-gray-200 text-gray-600 text-sm hover:border-black hover:text-black transition-colors"
            >
              ライト診断をする
            </Link>
          </div>
        </FadeInSection>

        {/*
          将来拡張:
          - Revoコミュニティ登録・ログイン
          - Revoマップ（役割分布の可視化）
          - 仲間マッチング機能
          - 活動募集・参加申込
          - 成長履歴・活動履歴の記録
        */}
      </section>
    </div>
  );
}
