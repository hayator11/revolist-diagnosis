import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import OperationLinks from "@/components/OperationLinks";
import { revoTypeList } from "@/data/revotypes";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://revo.onokun.com/",
  },
};

export default function HomePage() {
  return (
    <>
      {/* ── ① ファーストビュー ── */}
      <Hero />

      {/* ── ② 成功はひとつじゃない ── */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <div className="rounded-[2rem] border border-gray-100 bg-white px-7 py-10 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">
              Next Choice
            </p>
            <h2 className="text-2xl font-bold text-black mb-8 leading-snug">
              成功は、ひとつじゃない。
            </h2>
            <div className="text-sm text-gray-600 leading-[2.1] space-y-5">
              <p>
                時間、人、もの、こと、心。<br />
                その人にとって大切なものは、それぞれ違います。
              </p>
              <p>
                お金を求める時期があってもいい。<br />
                肩書きを目指す時期があってもいい。<br />
                実績を積み上げる時期があってもいい。<br />
                人とのつながりを大切にする時期があってもいい。<br />
                心を整える時期があってもいい。
              </p>
              <p>
                大切なのは、他人が決めた成功ではなく、<br />
                今の自分にとって本当に必要なものに気づくこと。
              </p>
              <p className="font-medium text-black">
                Revo111は、その道標になります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ③ この診断でわかること ── */}
      <section className="px-6 py-20 max-w-lg mx-auto">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6 text-center">
          What You&apos;ll Find
        </p>
        <h2 className="text-2xl font-bold text-black mb-10 text-center leading-snug">
          3つのことが分かります
        </h2>

        <div className="space-y-5">
          {[
            {
              step: "01",
              title: "自分の役割を知る",
              desc: "11タイプのうち、今あなたが強く使っている役割。動き方の基準と行動指針が持てます。",
            },
            {
              step: "02",
              title: "誰と組むと力が出るかを知る",
              desc: "1対1のベストパートナー、3人目に足すといいタイプ。人数別のチーム設計まで分かります。",
            },
            {
              step: "03",
              title: "今いる環境でどう活かすかを知る",
              desc: "職場・学校・部活・家族。今ある場所で、すぐに試せる具体的な提案が得られます。",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 items-start">
              <span className="text-2xl font-bold text-gray-100 shrink-0 w-10 text-center leading-tight">
                {item.step}
              </span>
              <div>
                <p className="text-base font-bold text-black mb-1">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ④ どんな場面でも使える ── */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-6 text-center">
            Any Scene
          </p>
          <h2 className="text-2xl font-bold text-black mb-3 text-center leading-snug">
            人が集まって何かをする
            <br />
            場面すべてで使える
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 leading-relaxed">
            チームを「役割で設計する」という考え方は、<br />
            どんな場所でも機能します。
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { scene: "会社", desc: "チーム編成・採用後の配置" },
              { scene: "学校", desc: "グループワーク・部活・委員会" },
              { scene: "スポーツ", desc: "ポジション配置・チームの雰囲気設計" },
              { scene: "地域", desc: "ボランティア・イベント運営" },
              { scene: "家族", desc: "夫婦・親子の関係性" },
              { scene: "Revo", desc: "プロジェクトメンバー集め" },
            ].map((item) => (
              <div key={item.scene} className="bg-white rounded-2xl p-5 border border-gray-100">
                <p className="text-base font-bold text-black mb-1">{item.scene}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ⑤ 11タイプ ── */}
      <section className="px-6 py-20 bg-black">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-3">
              11 Types
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              役割は11種類ある
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              どのタイプも優劣はなく、<br />
              それぞれが独自の力を持つ存在です。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {revoTypeList.slice(0, 6).map((type) => (
              <div
                key={type.key}
                className="border border-gray-800 rounded-xl p-4"
              >
                <p className="text-white text-sm font-bold mb-1">{type.name}</p>
                <p className="text-gray-500 text-xs leading-snug">{type.catchcopy}</p>
              </div>
            ))}
          </div>
          <Link
            href="/types"
            className="block w-full text-center py-4 rounded-2xl border border-gray-700 text-gray-300 text-sm hover:border-white hover:text-white transition-colors"
          >
            11タイプをすべて見る →
          </Link>
        </div>
      </section>

      {/* ── ⑥ CTA ── */}
      <section className="px-6 py-24 max-w-lg mx-auto text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Start</p>
        <h2 className="text-3xl font-bold text-black mb-3 leading-snug">
          まず、あなたの
          <br />
          役割を知るところから。
        </h2>
        <p className="text-sm text-gray-500 mb-10 leading-relaxed">
          33問・約5分。場面ごとに、あなたに近い選択を直感で選んでください。
        </p>

        <div className="space-y-3">
          <Link
            href="/diagnosis"
            className="block w-full bg-black text-white py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            レボリスト診断をはじめる →
          </Link>
          <Link
            href="/team"
            className="block w-full border border-gray-200 text-gray-700 py-4 rounded-full text-sm font-medium hover:border-black hover:text-black transition-colors"
          >
            チーム設計表を見る
          </Link>
          <Link
            href="/monitor"
            className="block w-full border border-gray-200 text-gray-500 py-4 rounded-full text-sm hover:border-gray-400 hover:text-black transition-colors"
          >
            Revo OS β版（4診断）を試す
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8 leading-relaxed">
          正解も不正解もありません。
          <br />
          直感で答えてください。
        </p>
      </section>

      <OperationLinks />
    </>
  );
}
