import Link from "next/link";
import type { Metadata } from "next";
import FadeInSection from "@/components/FadeInSection";

export const metadata: Metadata = {
  title: "111問フル診断 | レボリスト診断",
  description:
    "111の問いの先に、まだ見えていない役割がある。あなたの可能性と役割循環を、より深く探っていきます。",
  openGraph: {
    title: "111問フル診断 | レボリスト診断",
    description: "111の問いの先に、まだ見えていない役割がある。",
  },
};

const whatYouFindCards = [
  {
    title: "あなたの眠っている役割",
    body: "今はまだ使われていない、\nこれから育つ可能性。",
  },
  {
    title: "あなたを輝かせる存在",
    body: "誰と組むことで、\nあなたの力が自然に広がるのか。",
  },
  {
    title: "あなたが潤う環境",
    body: "どんな空気の中で、\nあなたは本来の力を出しやすいのか。",
  },
  {
    title: "あなたが作っている循環",
    body: "あなたが自然に渡している価値。",
  },
  {
    title: "役割の成長ルート",
    body: "次に育てると、\nさらに未来が広がる力。",
  },
  {
    title: "あなたに合う活動",
    body: "能力を試す場所ではなく、\n役割が循環する場所。",
  },
];

const revoFeatureCards = [
  {
    title: "役割でつながる",
    body: "同じタイプを探すのではなく、\n違う役割と出会う。",
  },
  {
    title: "活動で成長する",
    body: "役割は固定ではない。\n活動や出会いによって育っていく。",
  },
  {
    title: "まだ出会っていない仲間を見つける",
    body: "あなたに足りないものは、\n誰かの才能かもしれない。",
  },
  {
    title: "自分の役割を社会へ循環させる",
    body: "あなたが自然に持っている力が、\n誰かの未来を支える。",
  },
];

export default function FullDiagnosisPage() {
  return (
    <div className="max-w-lg mx-auto pb-24">

      {/* ── ファーストビュー ── */}
      <section className="min-h-[92vh] flex flex-col justify-center px-6 py-20 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-10">Full Diagnosis</p>
        <h1 className="text-3xl font-bold text-black leading-[1.5] mb-12">
          111の問いの先に、<br />
          まだ見えていない<br />
          役割がある。
        </h1>
        <div className="text-sm text-gray-500 leading-[2.4] mb-14 space-y-px">
          <p>人は、ひとつのタイプでは終わりません。</p>
          <p className="py-1" />
          <p>誰と出会うか。</p>
          <p>どんな環境に身を置くか。</p>
          <p>どんな活動に参加するか。</p>
          <p className="py-1" />
          <p>その組み合わせによって、</p>
          <p>役割は変化し、</p>
          <p>眠っていた力が開花していきます。</p>
        </div>

        {/* 将来拡張: 111問フル診断 実装後に <Link href="/full-diagnosis/start"> に変更 */}
        <div className="w-full rounded-2xl bg-black p-5 opacity-40 cursor-not-allowed select-none mb-3">
          <p className="text-white font-medium text-sm text-center">111問フル診断へ進む</p>
          <p className="text-gray-500 text-xs text-center mt-1.5">（準備中）</p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="flex-1 h-px bg-gray-100" />
          <p className="text-xs text-gray-400 whitespace-nowrap">もっと詳しく</p>
          <span className="flex-1 h-px bg-gray-100" />
        </div>
      </section>

      {/* ── Section 1: なぜ111問なのか ── */}
      <section className="px-6 py-20 border-b border-gray-100">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">Why 111</p>
          <h2 className="text-2xl font-bold text-black mb-10 leading-snug">
            人は、21問では<br />測りきれない。
          </h2>
          <div className="text-sm text-gray-600 leading-[2.2] space-y-4">
            <p>
              ライト診断では、<br />今、強く出ている役割の一部が見えました。
            </p>
            <p>
              でも人は、<br />単純な性格だけでは動いていません。
            </p>
            <div className="pl-5 border-l-2 border-gray-100 py-3 space-y-1 text-gray-400">
              <p>感情。</p>
              <p>環境。</p>
              <p>仲間。</p>
              <p>挑戦。</p>
              <p>支え合い。</p>
              <p>過去の経験。</p>
            </div>
            <p>
              それらが重なり合って、<br />今のあなたが存在しています。
            </p>
            <p>
              111問フル診断では、<br />
              「あなたは何者か」ではなく、
            </p>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 leading-relaxed text-black font-medium">
              「どんな循環の中で、<br />あなたの力が開花するのか」
            </div>
            <p>を見つけていきます。</p>
          </div>
        </FadeInSection>
      </section>

      {/* ── Section 2: フル診断でわかること ── */}
      <section className="px-6 py-20 border-b border-gray-100">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">What You&apos;ll Find</p>
          <h2 className="text-lg font-bold text-black mb-10">フル診断でわかること</h2>
        </FadeInSection>
        <div className="grid grid-cols-2 gap-3">
          {whatYouFindCards.map((card, i) => (
            <FadeInSection key={card.title} delay={i * 70}>
              <div className="border border-gray-100 rounded-2xl p-5 h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
                <p className="text-sm font-bold text-black mb-3 leading-snug">{card.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{card.body}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Section 3: Revoとは何か ── */}
      <section className="px-6 py-20 bg-black border-b border-gray-800">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-500 uppercase mb-8">What is Revo</p>
          <h2 className="text-2xl font-bold text-white mb-12 leading-snug">
            DAOの次は、Revo。
          </h2>
          <div className="text-sm text-gray-300 leading-[2.2] space-y-4">
            <p>
              DAOは、<br />分散型組織という「構造」でした。
            </p>
            <p>
              Revoは、<br />役割と感情が循環する「文化」です。
            </p>
            <p>
              人は、<br />ひとりで完成するわけではありません。
            </p>
            <div className="pl-5 border-l border-gray-700 py-3 space-y-1 text-gray-400 italic">
              <p>火を灯す人。</p>
              <p>整える人。</p>
              <p>支える人。</p>
              <p>広げる人。</p>
              <p>受け止める人。</p>
            </div>
            <p className="text-white font-semibold text-base">
              違いがあるから、<br />人は支え合える。
            </p>
            <p>
              Revoは、<br />役割を持ち寄りながら、<br />人と環境を育てていく共創循環です。
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* ── Section 4: Revoコミュニティでできること ── */}
      <section className="px-6 py-20 border-b border-gray-100">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Revo Community</p>
          <h2 className="text-lg font-bold text-black mb-10">Revoコミュニティでできること</h2>
        </FadeInSection>
        <div className="space-y-3">
          {revoFeatureCards.map((card, i) => (
            <FadeInSection key={card.title} delay={i * 70}>
              <div className="border border-gray-100 rounded-2xl p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
                <p className="text-sm font-bold text-black mb-2">{card.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{card.body}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Section 5: あなたの未来は固定されていない ── */}
      <section className="px-6 py-20 border-b border-gray-100 text-center">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">Your Future</p>
          <h2 className="text-2xl font-bold text-black mb-12 leading-snug">
            あなたの役割は、<br />まだ完成していません。
          </h2>
          <div className="text-sm text-gray-600 leading-[2.4] space-y-4 max-w-xs mx-auto">
            <p>
              人は、<br />出会いによって変わります。
            </p>
            <p>環境によって変わります。</p>
            <p>挑戦によって変わります。</p>
            <p>
              今はまだ、<br />眠っている役割もあります。
            </p>
            <p>
              そして、<br />
              あなた自身も、<br />
              誰かの可能性を開花させる存在かもしれません。
            </p>
            <div className="border-t border-gray-100 pt-6 space-y-2">
              <p className="font-semibold text-black">役割が違うから、人は支え合える。</p>
              <p className="text-gray-400">
                その循環の中で、<br />未来は少しずつ形になっていきます。
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── Section 6: CTA ── */}
      <section className="px-6 py-14">
        <FadeInSection>
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-black mb-4 leading-snug">
              役割でつながる、<br />新しい共創循環へ。
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              まだ出会っていない存在が、<br />あなたの未来を変えるかもしれません。
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/revo"
              className="block w-full text-center py-4 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Revoコミュニティへ進む
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
          - 111問フル診断 実装後にボタン有効化
          - ログイン・成長履歴・活動履歴
          - チーム診断（複数人のタイプ分布を可視化）
          - Revoマップ（全国の役割分布図）
          - 仲間マッチング（相互補完タイプの検索）
          - 活動募集・参加申込機能
          - SNSシェア用OGP画像生成
          - AI役割分析（自然言語での詳細解説）
        */}
      </section>
    </div>
  );
}
