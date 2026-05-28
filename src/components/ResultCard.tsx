"use client";

import { revoTypes, type RevoTypeKey } from "@/data/revotypes";
import type { DiagnosisResult } from "@/lib/calculateResult";
import {
  getComboDescription,
  getAwakeningDescription,
  getSleepingPotentialDescription,
} from "@/lib/calculateResult";
import ActivitySuggestion from "./ActivitySuggestion";
import ShareButtons from "./ShareButtons";
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
          <p className="text-xs text-gray-400 mb-4">あなたの魅力を支えている役割</p>
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
        <h2 className="text-lg font-bold text-black mb-3">あなたが自然に渡しているもの</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          人は、自分が誰かに渡している価値に気づきにくいものです。<br />
          あなたは日常の中で、すでに誰かの力になっている可能性があります。
        </p>
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
        <h2 className="text-lg font-bold text-black mb-3">あなたが受け取ると潤うもの</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          人は、与えるだけでは続きません。<br />
          受け取ることで、自分の力をさらに自然に使えるようになります。
        </p>
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

      {/* ⑦ 組み合わせで広がる可能性（第三者効果） */}
      <section className="px-6 py-16 bg-black border-b border-gray-800">
        <p className="text-xs tracking-widest text-gray-500 uppercase mb-6">Trio Potential</p>
        <h2 className="text-lg font-bold text-white mb-8">組み合わせで広がる可能性</h2>
        <div className="text-sm text-gray-300 leading-[1.9] space-y-4 mb-8">
          <p>人と人は、1対1で向き合うと、時に視点の違いがぶつかることがあります。</p>
          <p>でも、そこに第三者の役割が加わることで、関係性は大きく変わります。</p>
          <div className="py-3 pl-4 border-l border-gray-700 space-y-1 text-gray-400 italic">
            <p>整える人。</p>
            <p>受け止める人。</p>
            <p>翻訳する人。</p>
            <p>背中を押す人。</p>
          </div>
          <p>誰かが加わることで、止まっていた関係に流れが生まれ、役割が循環し始めます。</p>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500 tracking-wide mb-3">あなたの組み合わせでは</p>
          <p className="text-sm text-gray-300 leading-[1.9]">{awakeningDesc}</p>
        </div>
      </section>

      {/* ⑧ 眠っている可能性 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Sleeping Potential</p>
        <h2 className="text-lg font-bold text-black mb-4">あなたの眠っている可能性</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          補助タイプは、今すぐ強く出ている力ではなく、これから活動や出会いによって育っていく可能性です。<br /><br />
          あなたの中には、まだ使われていない役割があります。<br />
          それは、誰かとの出会いや新しい経験によって、少しずつ開花していきます。
        </p>
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
        <ul className="space-y-3">
          {mainType.environment.map((e) => (
            <li key={e} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </section>

      {/* ⑩ あなたが自然に作っている環境 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">What You Create</p>
        <h2 className="text-lg font-bold text-black mb-4">あなたが自然に作っている環境</h2>
        <div className="text-sm text-gray-500 leading-relaxed mb-6 space-y-2">
          <p>あなたは、環境に影響されるだけの存在ではありません。</p>
          <p>あなた自身も、誰かにとっての環境です。</p>
        </div>
        <ul className="space-y-3 mb-6">
          {mainType.creates.map((c) => (
            <li key={c} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-red-500 shrink-0 font-bold">→</span>
              {c}
            </li>
          ))}
        </ul>
        <div className="text-sm text-gray-400 leading-[1.9] space-y-0.5">
          <p>あなたがいることで、挑戦しやすくなる人がいるかもしれません。</p>
          <p>安心して話せる人がいるかもしれません。</p>
          <p>新しい一歩を踏み出せる人がいるかもしれません。</p>
        </div>
      </section>

      {/* ⑪ 向いている活動 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Your Activities</p>
        <h2 className="text-lg font-bold text-black mb-3">あなたの役割が活きる活動</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          活動は、能力を試す場所ではありません。<br />
          あなたの役割が育ち、誰かの役割と循環する場所です。
        </p>

        {/* 一般的な向いている活動 */}
        <p className="text-xs font-medium text-gray-500 tracking-wide mb-4">
          一般的に、こんな活動で力を発揮しやすいタイプです
        </p>
        <ul className="space-y-3 mb-10">
          {mainType.generalActivities.map((a) => (
            <li key={a} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
              {a}
            </li>
          ))}
        </ul>

        {/* REVO活動の紹介 */}
        {result.suggestedActivities.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="flex-1 h-px bg-gray-100" />
              <p className="text-xs text-gray-400 whitespace-nowrap">REVOではこんな活動も</p>
              <span className="flex-1 h-px bg-gray-100" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-5">
              あなたの役割が活きそうな活動を、REVOの中からご紹介します。
              参加するもよし、眺めるだけでもよし。
              気になる活動があったら、のぞいてみてください。
            </p>
            <ActivitySuggestion
              activities={result.suggestedActivities}
              topTypes={[result.main.key, result.sub.key, result.auxiliary.key]}
            />
          </>
        )}
      </section>

      {/* ⑫ 成長クエスト */}
      <section className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Growth Quest</p>
        <h2 className="text-lg font-bold text-black mb-4">次に育てると良い小さな一歩</h2>
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

      {/* ⑭ 無限の可能性を感じる締め */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">Your Potential</p>
        <h2 className="text-2xl font-bold text-black mb-10 leading-snug text-center">
          あなたの役割は、<br />まだ完成していません。
        </h2>
        <div className="text-sm text-gray-600 leading-[2.2] space-y-5 text-center max-w-xs mx-auto">
          <p>人は、ひとつのタイプに固定されるものではありません。</p>
          <div className="text-gray-400 space-y-1 py-3">
            <p>誰と出会うか。</p>
            <p>どんな環境に身を置くか。</p>
            <p>どんな活動に参加するか。</p>
            <p>どんな役割を持ち寄るか。</p>
          </div>
          <p>
            その組み合わせによって、<br />
            あなたの可能性は何通りにも広がっていきます。
          </p>
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <p>
              あなたに足りないものは、<br />
              誰かの才能かもしれません。
            </p>
            <p>
              そして、<br />
              あなたが自然に持っている力も、<br />
              誰かの未来を支える力になっています。
            </p>
          </div>
          <div className="border-t border-gray-100 pt-5 space-y-1">
            <p className="font-semibold text-black">役割が違うから、人は支え合える。</p>
            <p className="font-semibold text-black">違いがあるから、未来は動き出します。</p>
          </div>
        </div>
      </section>

      {/* SNSシェア + 画像保存 */}
      <section className="px-6 pt-10 pb-6 border-b border-gray-100">
        <ShareButtons result={result} />
      </section>

      {/* ⑮ CTA */}
      <section className="px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Next Stage</p>
          <h2 className="text-lg font-bold text-black mb-4 leading-snug">
            ライト診断では、<br />
            あなたの現在地の一部が見えました。
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            活動や出会いによって、あなたの役割は育っていきます。
          </p>
        </div>

        <div className="space-y-3">
          {/* 111問フル診断 予告ページへ */}
          <Link
            href="/full-diagnosis"
            className="block w-full rounded-2xl bg-black p-5 hover:bg-gray-800 transition-colors"
          >
            <p className="text-white font-medium text-sm text-center">111問フル診断へ進む</p>
            <p className="text-gray-400 text-xs text-center mt-1.5">
              もっと深く、あなたの役割循環を知る。
            </p>
          </Link>

          {/* Revoコミュニティページへ */}
          <Link
            href="/revo"
            className="block w-full rounded-2xl border border-gray-200 p-5 hover:border-black transition-colors"
          >
            <p className="text-gray-700 font-medium text-sm text-center">Revoコミュニティへ参加する</p>
            <p className="text-gray-400 text-xs text-center mt-1.5">
              役割でつながる、新しい共創循環へ。
            </p>
          </Link>

          {/* 将来拡張: 仲間を探す / Revoマップ */}
          <div className="w-full rounded-2xl border border-gray-200 p-5 opacity-40 cursor-not-allowed select-none">
            <p className="text-gray-600 font-medium text-sm text-center">あなたを輝かせる仲間を探す</p>
            <p className="text-gray-400 text-xs text-center mt-1.5 leading-relaxed">
              まだ出会っていない存在が、<br />あなたの未来を変えるかもしれません。
            </p>
            <p className="text-gray-400 text-xs text-center mt-1">（準備中）</p>
          </div>

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
