"use client";

import { revoTypes, type RevoTypeKey } from "@/data/revotypes";
import type { DiagnosisResult } from "@/lib/calculateResult";
import { getComboDescription } from "@/lib/calculateResult";
import ActivitySuggestion from "./ActivitySuggestion";
import ShareButton from "./ShareButton";

interface Props {
  result: DiagnosisResult;
}

const RANK_LABELS = [
  {
    rank: "メインタイプ",
    sublabel: "今、最も強く使っている役割",
    size: "large",
  },
  {
    rank: "サブタイプ",
    sublabel: "あなたの魅力を支えている役割",
    size: "medium",
  },
  {
    rank: "補助タイプ",
    sublabel: "これからさらに育つ可能性のある役割",
    size: "small",
  },
] as const;

export default function ResultCard({ result }: Props) {
  const topThree = [result.main, result.sub, result.auxiliary];
  const mainType = revoTypes[result.main.key];
  const subType = revoTypes[result.sub.key];
  const auxType = revoTypes[result.auxiliary.key];

  const comboTitle = `${mainType.name} × ${subType.name} × ${auxType.name}`;
  const comboDesc = getComboDescription(result.main.key, result.sub.key);

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">
          Your Result
        </p>
        <h1 className="text-xl font-bold text-black mb-2 leading-snug">
          あなたの現在地は、
        </h1>
        <h2 className="text-lg font-bold text-red-600 leading-snug mb-6">
          「{comboTitle}」型
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{comboDesc}</p>
        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
          あなたの中には、まだ眠っている力もあります。
          それは、誰かと出会い、活動を重ねることで少しずつ育っていきます。
        </p>
      </div>

      {/* Top 3 types */}
      <div className="space-y-4 mb-12">
        {topThree.map((ts, i) => {
          const type = revoTypes[ts.key];
          const label = RANK_LABELS[i];
          return (
            <div
              key={ts.key}
              className={`
                rounded-2xl border p-5
                ${i === 0 ? "border-black bg-black text-white" : "border-gray-200 bg-white text-black"}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p
                    className={`text-xs tracking-widest uppercase mb-1 ${i === 0 ? "text-gray-400" : "text-gray-400"}`}
                  >
                    {label.rank}
                  </p>
                  <p
                    className={`text-xs mb-1 ${i === 0 ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {label.sublabel}
                  </p>
                </div>
                <span
                  className={`text-2xl font-bold ${i === 0 ? "text-white" : "text-gray-200"}`}
                >
                  0{i + 1}
                </span>
              </div>
              <h3
                className={`text-2xl font-bold mb-1 ${i === 0 ? "text-white" : "text-black"}`}
              >
                {type.name}
              </h3>
              <p
                className={`text-xs mb-3 ${i === 0 ? "text-gray-300" : "text-gray-500"}`}
              >
                {type.catchcopy}
              </p>
              {/* Score bar */}
              <div className={`h-1 rounded-full overflow-hidden ${i === 0 ? "bg-gray-700" : "bg-gray-100"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-white" : "bg-black"}`}
                  style={{ width: `${ts.percentage}%` }}
                />
              </div>
              <p className={`text-xs mt-1 text-right ${i === 0 ? "text-gray-400" : "text-gray-400"}`}>
                {ts.percentage}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Gives */}
      <Section title="あなたが自然に渡しているもの">
        <div className="flex flex-wrap gap-2">
          {mainType.gives.map((g) => (
            <Tag key={g} label={g} />
          ))}
        </div>
      </Section>

      {/* Receives */}
      <Section title="あなたが受け取ると潤うもの">
        <div className="flex flex-wrap gap-2">
          {mainType.receives.map((r) => (
            <Tag key={r} label={r} />
          ))}
        </div>
      </Section>

      {/* Good With */}
      <Section title="あなたをさらに輝かせる存在">
        <div className="space-y-2">
          {mainType.goodWith.map((key) => {
            const t = revoTypes[key as RevoTypeKey];
            return (
              <div
                key={key}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                <div>
                  <p className="text-sm font-medium text-black">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.catchcopy}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          これらは「相性が良い」というよりも、あなたの力をさらに引き出してくれる存在です。
          違いは欠点ではなく、組み合わせるためにある。
        </p>
      </Section>

      {/* Potential */}
      <Section title="あなたの眠っている可能性">
        <div className="space-y-2">
          {mainType.potential.map((p) => (
            <div key={p} className="flex gap-2 items-start">
              <span className="text-red-500 mt-0.5 shrink-0">✦</span>
              <p className="text-sm text-gray-700 leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Environment */}
      <Section title="心地よい環境">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {mainType.receives.join("、")}があるとき、あなたは最もいきいきと動けます。
          </p>
        </div>
      </Section>

      {/* Activities */}
      <Section title="向いている活動">
        <ActivitySuggestion
          activities={result.suggestedActivities}
          topTypes={[result.main.key, result.sub.key, result.auxiliary.key]}
        />
      </Section>

      {/* Share */}
      <div className="my-10">
        <ShareButton comboTitle={comboTitle} />
      </div>

      {/* Community CTA */}
      <CommunitySection />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700 font-medium">
      {label}
    </span>
  );
}

function CommunitySection() {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 text-center">
      <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
        Next Stage
      </p>
      <h3 className="text-lg font-bold text-black mb-4 leading-snug">
        ライト診断では、
        <br />
        あなたの現在地の一部が見えました。
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        レボリスト診断は、ここで終わりではありません。
        活動や出会いによって、あなたの役割は育っていきます。
        <br />
        <br />
        次のステージでは、111問のフル診断を通して、
        あなたに合う仲間、あなたを成長させる存在、
        あなたが潤う環境、向いている活動、
        生み出せる循環をさらに深く見つけていきます。
      </p>
      {/* 将来拡張: コミュニティ登録 / 111問フル診断 */}
      <button
        disabled
        className="w-full mb-3 py-4 rounded-2xl bg-black text-white font-medium text-sm opacity-40 cursor-not-allowed"
      >
        コミュニティで続きを見る
        <span className="ml-2 text-xs text-gray-400">（準備中）</span>
      </button>
      <button
        disabled
        className="w-full py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm opacity-40 cursor-not-allowed"
      >
        111問フル診断の案内を受け取る
        <span className="ml-2 text-xs text-gray-400">（準備中）</span>
      </button>
    </div>
  );
}
