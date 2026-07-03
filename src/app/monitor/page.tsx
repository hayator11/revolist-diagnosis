import Link from "next/link";
import type { Metadata } from "next";
import FadeInSection from "@/components/FadeInSection";

export const metadata: Metadata = {
  title: "Revo OS β版 | モニター募集",
  description:
    "性格診断ではありません。役割でチームを作るための、新しい共創OSの実験です。111問フル診断の開発に参加してください。",
};

const diagCards = [
  {
    key: "role",
    title: "Revo Role",
    desc: "場面を選びながら、あなたが何を持ち寄る人なのか。\n11役割と、可能性を引き出し合いやすい相手を見つけます。",
    accent: "#dc2626",
    label: "Role",
    badge: "01",
    questions: 44,
  },
  {
    key: "team",
    title: "Revo Team",
    desc: "あなたはどんなチームで力を発揮しやすいのか。\nプロジェクト内での立ち位置を見つけます。",
    accent: "#2563eb",
    label: "Team",
    badge: "02",
    questions: 18,
  },
  {
    key: "match",
    title: "Revo Match",
    desc: "あなたは誰と組むと可能性が広がるのか。\nあなたを開花させる存在、あなたが開花させる存在を見つけます。",
    accent: "#16a34a",
    label: "Match",
    badge: "03",
    questions: 18,
  },
  {
    key: "growth",
    title: "Revo Growth",
    desc: "あなたは次にどんな力を育てると未来が広がるのか。\n眠っている役割と成長ルートを見つけます。",
    accent: "#9333ea",
    label: "Growth",
    badge: "04",
    questions: 18,
  },
];

export default function MonitorPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="bg-black text-white px-6 pt-20 pb-16">
        <FadeInSection>
          <div className="max-w-lg mx-auto text-center">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-6">
              Revo OS β — Monitor Program
            </p>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Revo OS β版
              <br />
              <span className="text-3xl font-medium text-gray-300">モニター募集</span>
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed mb-10 max-w-sm mx-auto">
              これは、性格診断ではありません。<br />
              役割でチームを作るための、<br />新しい共創OSの実験です。
            </p>
            <a
              href="#diagnoses"
              className="inline-block bg-white text-black px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              4つの診断を試してみる
            </a>
          </div>
        </FadeInSection>
      </section>

      {/* ── 説明 ─────────────────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">About</p>
          <div className="text-sm text-gray-700 leading-relaxed space-y-5">
            <p>
              「あなたは何者か」で終わる診断は、もうたくさんあります。
            </p>
            <p className="leading-[1.9]">
              このβ版が問うのは、その先です。<br />
              あなたはどう動くか。<br />
              誰と組むと力が出るか。<br />
              どんなチームを作れるか。
            </p>
            <p>
              4つの視点からあなたの役割と可能性を試しながら、
              「誰が優れているか」ではなく、
              「誰と組むと力が発揮されるか」を一緒に探ります。
            </p>
            <p className="text-gray-500 italic">
              率直な感想をもとに、111問フル診断の実装モデルを育てていきます。
            </p>
            <p className="text-gray-500">
              何かしたいことを発見したいというあなたにも、<br />
              きっと何かが見つかる。
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* ── 4診断カード ────────────────────────────────────────────── */}
      <section id="diagnoses" className="px-6 pb-20 max-w-lg mx-auto">
        <FadeInSection>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-8 text-center">
            4 Diagnoses
          </p>
        </FadeInSection>
        <div className="space-y-4">
          {diagCards.map((card, i) => (
            <FadeInSection key={card.key} delay={i * 80}>
              <div className="border border-gray-200 rounded-3xl p-6 hover:border-gray-400 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: card.accent }}
                    >
                      {card.badge}
                    </span>
                    <h2 className="text-xl font-bold text-black mt-1">{card.title}</h2>
                  </div>
                  <span className="text-xs text-gray-300 font-light tracking-widest uppercase">
                    {card.questions} Questions
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                  {card.desc}
                </p>
                <Link
                  href={`/monitor/${card.key}`}
                  className="inline-block px-6 py-3 rounded-full text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: card.accent }}
                >
                  {card.label}を試す
                </Link>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── フィードバック案内 ─────────────────────────────────────── */}
      <section className="bg-gray-50 px-6 py-16">
        <FadeInSection>
          <div className="max-w-lg mx-auto text-center">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Feedback</p>
            <h2 className="text-xl font-bold text-black mb-3">
              あなたの感想が、111問版を育てます。
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              診断を試したら、率直な感想を教えてください。
              <br />
              どの診断が刺さったか、どの言葉が残ったか。
              <br />
              その声が、次のRevo OSの設計に直接反映されます。
            </p>
            <Link
              href="/monitor/feedback"
              className="inline-block px-8 py-4 rounded-full border-2 border-black text-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
            >
              感想を送る
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* ── フッター案内 ──────────────────────────────────────────── */}
      <section className="px-6 py-10 text-center">
        <p className="text-xs text-gray-400">
          まず軽く試せる11問入口診断は
          <Link href="/diagnosis/entry" className="underline hover:text-black transition-colors ml-1">
            こちら
          </Link>
          から。
        </p>
      </section>
    </main>
  );
}
