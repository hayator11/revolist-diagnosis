"use client";

import { revoTypes, type RevoTypeKey } from "@/data/revotypes";
import type { DiagnosisResult } from "@/lib/calculateResult";
import {
  getComboDescription,
  getAwakeningDescription,
  getSleepingPotentialDescription,
} from "@/lib/calculateResult";
import ActivitySuggestion from "./ActivitySuggestion";
import ShareButton from "./ShareButton";
import Link from "next/link";

interface Props {
  result: DiagnosisResult;
}

export default function ResultCard({ result }: Props) {
  const mainType = revoTypes[result.main.key];
  const subType = revoTypes[result.sub.key];
  const auxType = revoTypes[result.auxiliary.key];

  const comboTitle = `${mainType.name} × ${subType.name} × ${auxType.name}`;
  const comboDesc = getComboDescription(result.main.key, result.sub.key, result.auxiliary.key);
  const awakeningDesc = getAwakeningDescription(result.main.key, result.sub.key, result.auxiliary.key);
  const sleepingDesc = getSleepingPotentialDescription(result.auxiliary.key);

  return (
    <div className="max-w-lg mx-auto pb-20">

      {/* ① 没入感のあるオープニング */}
      <section className="min-h-screen flex flex-col justify-center px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">Your Result</p>
        <p className="text-4xl font-bold text-black mb-10 leading-tight">
          わかる…
        </p>
        <div className="text-lg text-gray-700 leading-[1.9] whitespace-pre-line mb-12 font-light">
          {mainType.openingText}
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-gray-400">
          <span className="w-8 h-px bg-gray-300" />
          あなたの診断結果へ
          <span className="w-8 h-px bg-gray-300" />
        </div>
      </section>

      {/* ② メイン／サブ／補助タイプ */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-10">Your Types</p>

        {/* メインタイプ */}
        <div className="bg-black text-white rounded-3xl p-8 mb-4">
          <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">メインタイプ</p>
          <p className="text-xs text-gray-400 mb-5">今、最もつよく使っている役割</p>
          <p className="text-4xl font-bold mb-2">{mainType.name}</p>
          <p className="text-sm text-gray-400 mb-5">{mainType.catchcopy}</p>
          <div className="h-px bg-gray-800 mb-5" />
          <div className="flex flex-wrap gap-2">
            {mainType.strengths.map((s) => (
              <span key={s} className="text-xs border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-5 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${result.main.percentage}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{result.main.percentage}%</p>
        </div>

        {/* サブタイプ */}
        <div className="border border-gray-200 rounded-3xl p-6 mb-4">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">サブタイプ</p>
          <p className="text-xs text-gray-400 mb-4">あなたの魅力を支えている力</p>
          <p className="text-2xl font-bold text-black mb-1">{subType.name}</p>
          <p className="text-sm text-gray-500">{subType.catchcopy}</p>
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full" style={{ width: `${result.sub.percentage}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">{result.sub.percentage}%</p>
        </div>

        {/* 補助タイプ */}
        <div className="border border-dashed border-gray-200 rounded-3xl p-6">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">補助タイプ</p>
          <p className="text-xs text-gray-400 mb-4">これから育つ可能性のある、まだ眠っている役割</p>
          <p className="text-2xl font-bold text-black mb-1">{auxType.name}</p>
          <p className="text-sm text-gray-500">{auxType.catchcopy}</p>
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-400 rounded-full" style={{ width: `${result.auxiliary.percentage}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">{result.auxiliary.percentage}%</p>
        </div>
      </section>

      {/* ③ タイプ組み合わせ説明 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Your Combination</p>
        <h2 className="text-xl font-bold text-black mb-6 leading-snug">
          {comboTitle}
        </h2>
        <p className="text-sm text-gray-600 leading-[1.9]">{comboDesc}</p>
      </section>

      {/* ④ あなたが自然に渡しているもの */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">What You Give</p>
        <h2 className="text-lg font-bold text-black mb-6">あなたが自然に渡しているもの</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {mainType.gives.map((g) => (
            <span key={g} className="bg-black text-white text-xs px-4 py-2 rounded-full font-medium">
              {g}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-[1.9]">{mainType.givesDetail}</p>
      </section>

      {/* ⑤ 受け取ると潤うもの */}
      <section className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">What You Receive</p>
        <h2 className="text-lg font-bold text-black mb-6">あなたが受け取ると潤うもの</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {mainType.receives.map((r) => (
            <span key={r} className="bg-white border border-gray-200 text-gray-700 text-xs px-4 py-2 rounded-full">
              {r}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-[1.9]">{mainType.receivesDetail}</p>
      </section>

      {/* ⑥ あなたをさらに輝かせる存在 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Who Makes You Shine</p>
        <h2 className="text-lg font-bold text-black mb-8">あなたをさらに輝かせる存在</h2>
        <div className="space-y-5">
          {mainType.goodWith.map((key) => {
            const t = revoTypes[key as RevoTypeKey];
            const detail = mainType.goodWithDetail[key] ?? t.description;
            return (
              <div key={key} className="border border-gray-200 rounded-2xl p-5">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">{t.name}</p>
                <p className="text-sm font-bold text-black mb-3">{t.catchcopy}</p>
                <p className="text-sm text-gray-600 leading-[1.9]">{detail}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          これらは「相性が良い」ではなく、あなたの力をさらに引き出してくれる存在です。違いは欠点ではなく、組み合わせるためにある。
        </p>
      </section>

      {/* ⑦ 第三者で覚醒する組み合わせ */}
      <section className="px-6 py-16 bg-black border-b border-gray-800">
        <p className="text-xs tracking-widest text-gray-500 uppercase mb-6">Trio Awakening</p>
        <h2 className="text-lg font-bold text-white mb-6">3人が揃うと、循環が生まれる</h2>
        <p className="text-sm text-gray-300 leading-[1.9]">{awakeningDesc}</p>
      </section>

      {/* ⑧ 眠っている可能性 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Sleeping Potential</p>
        <h2 className="text-lg font-bold text-black mb-6">あなたの眠っている可能性</h2>
        <div className="border border-dashed border-gray-200 rounded-2xl p-5 mb-5">
          <p className="text-sm text-gray-600 leading-[1.9]">{sleepingDesc}</p>
        </div>
        <div className="space-y-2">
          {auxType.potential.map((p) => (
            <div key={p} className="flex gap-3 items-start">
              <span className="text-red-400 mt-0.5 shrink-0 text-lg leading-none">✦</span>
              <p className="text-sm text-gray-600 leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⑨ 心地よい環境 */}
      <section className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Your Environment</p>
        <h2 className="text-lg font-bold text-black mb-6">あなたが潤いやすい環境</h2>
        <ul className="space-y-3 mb-6">
          {mainType.environment.map((e) => (
            <li key={e} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </section>

      {/* ⑩ あなたが作れる環境 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">What You Create</p>
        <h2 className="text-lg font-bold text-black mb-4">あなたが自然に作っている環境</h2>
        <p className="text-sm text-gray-500 mb-6">あなたがいる場所では、</p>
        <ul className="space-y-3">
          {mainType.creates.map((c) => (
            <li key={c} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-red-500 shrink-0">→</span>
              {c}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500 mt-6 leading-relaxed">
          あなた自身が、環境を変える側の存在かもしれません。
        </p>
      </section>

      {/* ⑪ 向いている活動 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Your Activities</p>
        <h2 className="text-lg font-bold text-black mb-8">あなたに合う活動</h2>
        <ActivitySuggestion
          activities={result.suggestedActivities}
          topTypes={[result.main.key, result.sub.key, result.auxiliary.key]}
        />
      </section>

      {/* ⑫ 成長クエスト */}
      <section className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Growth Quest</p>
        <h2 className="text-lg font-bold text-black mb-4">次に育てると良い力</h2>
        <div className="border border-gray-200 bg-white rounded-2xl p-5 mb-5">
          <p className="text-xs text-gray-400 mb-2">育てたい役割</p>
          <p className="text-base font-bold text-black mb-3">
            {revoTypes[mainType.growthQuest.targetType].name}
          </p>
          <p className="text-sm text-gray-600 leading-[1.9]">{mainType.growthQuest.description}</p>
        </div>
        <p className="text-xs font-medium text-gray-500 tracking-wide mb-3">小さなクエスト</p>
        <ul className="space-y-2">
          {mainType.growthQuest.tasks.map((task, i) => (
            <li key={task} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 rounded-full border border-gray-300 text-xs flex items-center justify-center text-gray-400 shrink-0">
                {i + 1}
              </span>
              {task}
            </li>
          ))}
        </ul>
      </section>

      {/* ⑬ 応援され方 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">How To Cheer You</p>
        <h2 className="text-lg font-bold text-black mb-6">あなたが嬉しい応援</h2>
        <ul className="space-y-3">
          {mainType.howToCheer.map((h) => (
            <li key={h} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
              <span className="text-black mt-0.5 shrink-0">✓</span>
              {h}
            </li>
          ))}
        </ul>
      </section>

      {/* ⑭ 最後の締め */}
      <section className="px-6 py-16 border-b border-gray-100 text-center">
        <p className="text-sm text-gray-600 leading-[2] max-w-xs mx-auto">
          あなたに足りないものは、
          <br />
          誰かの才能かもしれません。
          <br />
          <br />
          そして、
          <br />
          あなたが自然に持っている力も、
          <br />
          誰かの未来を支える力になっています。
          <br />
          <br />
          役割が違うから、
          <br />
          人は支え合える。
          <br />
          <br />
          あなたの役割は、
          <br />
          これからの活動や出会いによって、
          <br />
          さらに育っていきます。
        </p>
      </section>

      {/* ⑮ SNSシェア */}
      <section className="px-6 pt-10 pb-6 border-b border-gray-100">
        <ShareButton comboTitle={comboTitle} />
      </section>

      {/* ⑮ CTA */}
      <section className="px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Next Stage</p>
          <h2 className="text-lg font-bold text-black mb-4 leading-snug">
            ライト診断では、
            <br />
            あなたの現在地の一部が見えました。
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            活動や出会いによって、あなたの役割は育っていきます。
          </p>
        </div>

        <div className="space-y-3">
          {/* 将来拡張: 111問フル診断 */}
          <button disabled className="w-full py-4 rounded-2xl bg-black text-white font-medium text-sm opacity-40 cursor-not-allowed">
            111問フル診断へ進む
            <span className="ml-2 text-xs text-gray-500">（準備中）</span>
          </button>

          {/* 将来拡張: コミュニティ登録 */}
          <button disabled className="w-full py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm opacity-40 cursor-not-allowed">
            Revoコミュニティへ参加する
            <span className="ml-2 text-xs text-gray-400">（準備中）</span>
          </button>

          {/* 将来拡張: 仲間を探す / レボマップ */}
          <button disabled className="w-full py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm opacity-40 cursor-not-allowed">
            あなたを輝かせる仲間を探す
            <span className="ml-2 text-xs text-gray-400">（準備中）</span>
          </button>

          <Link
            href="/diagnosis"
            className="block w-full text-center py-4 rounded-2xl border border-gray-200 text-gray-600 text-sm hover:border-black hover:text-black transition-colors"
          >
            もう一度診断する
          </Link>
        </div>
      </section>
    </div>
  );
}
