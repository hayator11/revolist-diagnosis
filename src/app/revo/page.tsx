import Link from "next/link";
import type { Metadata } from "next";
import FadeInSection from "@/components/FadeInSection";

export const metadata: Metadata = {
  title: "Revo | レボリスト診断",
  description:
    "違いを持ち寄り、循環によって未来を育てる。Revoは、役割と感情が循環する共創文化です。レボリストLab、レボファンディング、レボアート、レボリンク、レボソングなどの活動がつながります。",
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

const revoProjects = [
  {
    label: "CENTER",
    title: "レボファンディング",
    body: "応援者・ファン・商品・活動レポートを循環させる中心の仕組み。",
    href: "https://revofunding.onokun.com/",
  },
  {
    label: "LAB",
    title: "レボリストLab",
    body: "すべての企画を小さく試し、実際の活動へ育てる実験場。",
    href: "https://revolist.earth/revolist-lab",
  },
  {
    label: "PROJECT",
    title: "レボアート",
    body: "地域・企業・行政・学校・アーティストが参加し、想いを形に残す活動。",
    href: "https://revofunding.onokun.com/revo-art.html",
  },
  {
    label: "REVO SERIES",
    title: "レボソング",
    body: "活動の背景や想いを、歌や音楽として広げる表現の入口。",
    href: "https://revosong.onokun.com/",
  },
  {
    label: "REVO SERIES",
    title: "レボリンク",
    body: "企業協賛や広告を、地域・防災・アートを支える流れへ変える仕組み。",
    href: "https://revofunding.onokun.com/project-revolinks.html",
  },
  {
    label: "REVO SERIES",
    title: "レボハット",
    body: "帽子文化を入口に、ものづくり・表現・防災体験をつなげる活動。",
    href: "https://revofunding.onokun.com/shop.html",
  },
  {
    label: "SUPPORT",
    title: "認定アーティスト",
    body: "想いを伝わる形へ整え、活動が届きやすくなる表現を支える存在。",
    href: "https://revofunding.onokun.com/designers.html",
  },
  {
    label: "FOUNDATION",
    title: "おのくん",
    body: "持ち寄り文化と地域のつながりを育ててきた、Revo構想の大切な土台。",
    href: "https://onokun.com/",
  },
  {
    label: "FOUNDATION",
    title: "防災×帽祭",
    body: "防災を身近に、楽しく、話しやすいものとして届ける活動。",
    href: "https://revolist.earth/bosai-bosai",
  },
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

      {/* ── Section: Revo全体の構成図 ── */}
      <section className="px-6 py-20 border-b border-gray-100">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Revo Map</p>
          <h2 className="text-2xl font-bold text-black mb-5 leading-snug">
            Revoは、活動がつながる<br />共創循環です。
          </h2>
          <p className="text-sm text-gray-600 leading-[2] mb-10">
            レボリストLabから生まれた企画が、レボファンディング、アート、音楽、企業協賛、防災、持ち寄り文化へ広がっていきます。
          </p>
        </FadeInSection>

        <FadeInSection delay={80}>
          <div className="-mx-6 overflow-x-auto px-6 pb-4">
            <div className="min-w-[680px] rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <svg viewBox="0 0 680 520" role="img" aria-labelledby="revo-map-title revo-map-desc" className="h-auto w-full">
                <title id="revo-map-title">Revoの活動構成図</title>
                <desc id="revo-map-desc">
                  レボリストLabを中心に、レボファンディング、レボアート、レボソング、レボリンク、レボハット、認定アーティスト、おのくん、防災×帽祭がつながる図。
                </desc>
                <defs>
                  <marker id="revoArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                    <path d="M0,0 L8,4 L0,8 z" fill="#9ca3af" />
                  </marker>
                  <linearGradient id="fundingGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                  <linearGradient id="labGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  <linearGradient id="artGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#db2777" />
                  </linearGradient>
                </defs>

                <text x="340" y="34" textAnchor="middle" fontSize="22" fontWeight="800" fill="#111827">
                  レボファンディングを中心に広がる社会貢献型の活動
                </text>
                <text x="340" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6b7280">
                  応援、アート、音楽、企業協賛、防災、持ち寄り文化がひとつの流れでつながる
                </text>

                <path d="M340 196 L340 132" stroke="#8b5cf6" strokeWidth="4" markerEnd="url(#revoArrow)" />
                <path d="M340 284 L340 344" stroke="#ec4899" strokeWidth="4" markerEnd="url(#revoArrow)" />
                <path d="M260 240 L142 194" stroke="#06b6d4" strokeWidth="3" markerEnd="url(#revoArrow)" />
                <path d="M420 240 L538 194" stroke="#22c55e" strokeWidth="3" markerEnd="url(#revoArrow)" />
                <path d="M260 270 L142 344" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#revoArrow)" />
                <path d="M420 270 L538 344" stroke="#eab308" strokeWidth="3" markerEnd="url(#revoArrow)" />
                <path d="M318 432 C278 454 244 462 198 468" stroke="#ec4899" strokeWidth="3" markerEnd="url(#revoArrow)" />
                <path d="M362 432 C402 454 436 462 482 468" stroke="#eab308" strokeWidth="3" markerEnd="url(#revoArrow)" />
                <path d="M242 480 C286 500 394 500 438 480" stroke="#6b7280" strokeWidth="3" markerEnd="url(#revoArrow)" />

                <g>
                  <rect x="210" y="80" width="260" height="68" rx="20" fill="url(#fundingGradient)" />
                  <text x="340" y="105" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ede9fe">CENTER</text>
                  <text x="340" y="130" textAnchor="middle" fontSize="24" fontWeight="900" fill="#ffffff">レボファンディング</text>
                  <text x="340" y="144" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ddd6fe">応援者・ファン・商品・活動レポートを循環</text>
                </g>

                <g>
                  <rect x="220" y="196" width="240" height="88" rx="20" fill="url(#labGradient)" />
                  <text x="340" y="226" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fee2e2">LAB</text>
                  <text x="340" y="258" textAnchor="middle" fontSize="30" fontWeight="900" fill="#ffffff">レボリストLab</text>
                  <text x="340" y="276" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fee2e2">すべての企画を生む実験場</text>
                </g>

                <g>
                  <rect x="218" y="344" width="244" height="70" rx="18" fill="url(#artGradient)" />
                  <text x="340" y="370" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fce7f3">PROJECT</text>
                  <text x="340" y="400" textAnchor="middle" fontSize="26" fontWeight="900" fill="#ffffff">レボアート</text>
                </g>

                <g>
                  <rect x="36" y="154" width="164" height="64" rx="18" fill="#ecfeff" stroke="#06b6d4" strokeWidth="2" />
                  <text x="118" y="180" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">REVO SERIES</text>
                  <text x="118" y="204" textAnchor="middle" fontSize="19" fontWeight="900" fill="#111827">レボソング</text>
                </g>

                <g>
                  <rect x="480" y="154" width="164" height="64" rx="18" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                  <text x="562" y="180" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">REVO SERIES</text>
                  <text x="562" y="204" textAnchor="middle" fontSize="19" fontWeight="900" fill="#111827">レボリンク</text>
                </g>

                <g>
                  <rect x="40" y="322" width="174" height="64" rx="18" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="127" y="348" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">REVO SERIES</text>
                  <text x="127" y="372" textAnchor="middle" fontSize="19" fontWeight="900" fill="#111827">レボハット</text>
                </g>

                <g>
                  <rect x="466" y="322" width="174" height="64" rx="18" fill="#fffbeb" stroke="#eab308" strokeWidth="2" />
                  <text x="553" y="348" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">SUPPORT</text>
                  <text x="553" y="372" textAnchor="middle" fontSize="18" fontWeight="900" fill="#111827">認定アーティスト</text>
                </g>

                <g>
                  <rect x="98" y="448" width="188" height="54" rx="18" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2" />
                  <text x="192" y="470" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">FOUNDATION</text>
                  <text x="192" y="494" textAnchor="middle" fontSize="20" fontWeight="900" fill="#111827">おのくん</text>
                </g>

                <g>
                  <rect x="394" y="448" width="188" height="54" rx="18" fill="#fffbeb" stroke="#eab308" strokeWidth="2" />
                  <text x="488" y="470" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b">FOUNDATION</text>
                  <text x="488" y="494" textAnchor="middle" fontSize="20" fontWeight="900" fill="#111827">防災×帽祭</text>
                </g>
              </svg>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400 leading-relaxed">
            横に動かすと全体図を確認できます。
          </p>
        </FadeInSection>

        <div className="mt-10 space-y-3">
          {revoProjects.map((project, i) => (
            <FadeInSection key={project.title} delay={i * 45}>
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-gray-100 bg-white p-5 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-300"
              >
                <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2">
                  {project.label}
                </p>
                <h3 className="text-base font-bold text-black mb-2">{project.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{project.body}</p>
              </a>
            </FadeInSection>
          ))}
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
