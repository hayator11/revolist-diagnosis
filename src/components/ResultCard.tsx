"use client";

import { revoTypes, type RevoTypeKey } from "@/data/revotypes";
import type { DiagnosisResult } from "@/lib/calculateResult";
import {
  getComboDescription,
  getAwakeningDescription,
  getSleepingPotentialDescription,
} from "@/lib/calculateResult";
import ShareButtons from "./ShareButtons";
import Link from "next/link";
import OperationLinks from "./OperationLinks";
import OpenChatInvite from "./OpenChatInvite";

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

  // チーム設計データ
  const bestPairType = revoTypes[mainType.teamDesign.bestPair];
  const thirdPersonType = revoTypes[mainType.teamDesign.thirdPerson];
  const sameTypeExamples = [
    {
      title: "仕事や活動では",
      body: mainType.generalActivities[0],
    },
    {
      title: "チームの中では",
      body: mainType.creates[0],
    },
    {
      title: "最初の一歩は",
      body: mainType.currentEnvTips[0],
    },
  ];

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

      {/* 同タイプ事例 */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Same Type Examples</p>
        <h2 className="text-lg font-bold text-black mb-3">同じタイプの人に起こりやすい場面</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          タイプは肩書きではなく、日常や活動の中で自然に出ている役割です。
        </p>
        <div className="space-y-3">
          {sameTypeExamples.map((example) => (
            <div key={example.title} className="rounded-2xl border border-gray-100 p-5">
              <p className="text-xs text-gray-400 mb-2">{example.title}</p>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{example.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STEP 2: このタイプの動き方 ── */}
      <section className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">How You Move</p>
        <h2 className="text-lg font-bold text-black mb-2">このタイプの動き方</h2>
        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          特性を知るだけでは変わりません。<br />
          どう動くかを知ることで、自分の役割が力に変わります。
        </p>
        <div className="space-y-4">
          {mainType.actionPrinciples.map((principle, i) => (
            <div key={principle} className="flex items-start gap-4">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{principle}</p>
            </div>
          ))}
        </div>
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

      {/* ── STEP 3: 相性のいいタイプ（1人目） ── */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Best Partner</p>
        <h2 className="text-lg font-bold text-black mb-2">一緒に動くと力が出る存在</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          2人で始めるなら、この役割との相性が出やすいです。<br />
          違いがあるから、補い合えます。
        </p>

        {/* 1対1ベストパートナー（大きく表示） */}
        <div className="bg-black text-white rounded-3xl p-7 mb-6">
          <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">1対1のベストパートナー</p>
          <p className="text-2xl font-bold mb-1">{bestPairType.name}</p>
          <p className="text-sm text-gray-400 mb-5">{bestPairType.catchcopy}</p>
          <div className="h-px bg-gray-800 mb-5" />
          <p className="text-sm text-gray-300 leading-[1.9]">
            {mainType.goodWithDetail[mainType.teamDesign.bestPair] ?? bestPairType.description}
          </p>
        </div>

        {/* その他の相性 */}
        <div className="space-y-4">
          {mainType.goodWith
            .filter((key) => key !== mainType.teamDesign.bestPair)
            .map((key) => {
              const t = revoTypes[key as RevoTypeKey];
              const detail = mainType.goodWithDetail[key] ?? t.description;
              return (
                <div key={key} className="border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-bold text-black mb-1">{t.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{t.catchcopy}</p>
                  <p className="text-sm text-gray-600 leading-[1.9]">{detail}</p>
                </div>
              );
            })}
        </div>
        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          これらは優劣ではなく、あなたの力をさらに引き出してくれる存在です。違いは、組み合わせるためにあります。
        </p>
      </section>

      {/* ── STEP 4: チームに足すといいタイプ（3人目候補） ── */}
      <section className="px-6 py-16 bg-black border-b border-gray-800">
        <p className="text-xs tracking-widest text-gray-500 uppercase mb-3">Third Person</p>
        <h2 className="text-lg font-bold text-white mb-2">チームに足すと動き出す存在</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          2人で詰まったとき、3人目の役割が加わることで<br />
          チームに流れが生まれます。
        </p>

        {/* 3人目タイプ */}
        <div className="border border-gray-800 rounded-3xl p-6 mb-6">
          <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">3人目に足すといい役割</p>
          <p className="text-2xl font-bold text-white mb-1">{thirdPersonType.name}</p>
          <p className="text-sm text-gray-500 mb-5">{thirdPersonType.catchcopy}</p>
          <div className="h-px bg-gray-800 mb-5" />
          <p className="text-sm text-gray-300 leading-[1.9]">{mainType.teamDesign.teamNote}</p>
        </div>

        {/* チーム人数の考え方 */}
        <div className="space-y-4 mb-6">
          <p className="text-xs tracking-widest text-gray-500 uppercase">人数別チームの考え方</p>
          {[
            { n: "2人", desc: "相性が良ければ力強い。詰まりやすいときは3人目を探す。" },
            { n: "3人", desc: "奇数でまとまりやすい。役割が分散して動きやすくなる。（推奨）" },
            { n: "4人", desc: "対立しやすい構造になりやすい。3＋1の関係性で動きやすくなる。" },
            { n: "5人", desc: "役割が十分に分散し、チームとして機能し始める。" },
          ].map((item) => (
            <div key={item.n} className="flex gap-4 items-start">
              <span className="text-xs font-bold text-white bg-gray-800 px-3 py-1 rounded-full shrink-0 mt-0.5">
                {item.n}
              </span>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 哲学的なテキスト */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500 tracking-wide mb-3">あなたの組み合わせでは</p>
          <p className="text-sm text-gray-300 leading-[1.9]">{awakeningDesc}</p>
        </div>
      </section>

      {/* ── STEP 5: 今いる環境で試してみよう ── */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Try Now</p>
        <h2 className="text-lg font-bold text-black mb-2">まず今いる環境で試してみよう</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          特性は、特別な場所でしか使えないものではありません。<br />
          職場・学校・家族・友人グループ。今ある環境が、最初の練習台です。
        </p>
        <div className="space-y-4 mb-8">
          {mainType.currentEnvTips.map((tip, i) => (
            <div key={tip} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">
              <span className="w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 font-medium">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        {/* 心地よい環境 */}
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">あなたが潤いやすい環境</p>
        <ul className="space-y-2 mb-6">
          {mainType.environment.map((e) => (
            <li key={e} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              {e}
            </li>
          ))}
        </ul>

        {/* あなたが自然に作っている環境 */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <p className="text-xs text-gray-400 mb-3">あなたがいることで自然に生まれること</p>
          <ul className="space-y-2">
            {mainType.creates.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-black shrink-0 font-bold">→</span>
                {c}
              </li>
            ))}
          </ul>
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

      {/* ── STEP 6: 試せる環境を探している人へ（Revoは出口） ── */}
      <section className="px-6 py-16 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Find Your Stage</p>
        <h2 className="text-lg font-bold text-black mb-2">
          試せる環境を探している人へ
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          今ある環境で特性を活かしてみて、<br />
          「もっと大きな場所で試したい」と感じたなら——
        </p>

        {/* 一般的な向いている活動 */}
        <p className="text-xs font-medium text-gray-500 tracking-wide mb-4">
          このタイプが力を発揮しやすい活動
        </p>
        <ul className="space-y-3 mb-10">
          {mainType.generalActivities.map((a) => (
            <li key={a} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
              {a}
            </li>
          ))}
        </ul>

        {/* Revo紹介（出口として自然に） */}
        {result.suggestedActivities.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-1">あなたの役割を試せる場所として</p>
            <p className="text-sm font-bold text-black mb-4">Revoプロジェクトという選択肢</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Revoは、同じ場所にいる仲間ではなく、<br />
              役割でつながるプロジェクト型のコミュニティです。<br />
              あなたの特性が活きそうな活動があるかもしれません。
            </p>
            <div className="flex flex-wrap gap-2">
              {result.suggestedActivities.map((activity) => (
                <span
                  key={activity.id}
                  className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-full"
                >
                  {activity.name}
                </span>
              ))}
            </div>
          </div>
        )}
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

      <section className="px-6 py-12 border-b border-gray-100">
        <OpenChatInvite context="diagnosis" />
      </section>

      {/* ⑮ CTA */}
      <section className="px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Next Stage</p>
          <h2 className="text-lg font-bold text-black mb-4 leading-snug">
            レボリスト診断では、<br />
            あなたの現在地の一部が見えました。
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            活動や出会いによって、あなたの役割は育っていきます。
          </p>
        </div>

        <div className="space-y-3">
          {/* Revoコミュニティページへ */}
          <Link
            href="/revo"
            className="block w-full rounded-2xl bg-black p-5 hover:bg-gray-800 transition-colors"
          >
            <p className="text-white font-medium text-sm text-center">Revoコミュニティへ参加する</p>
            <p className="text-gray-400 text-xs text-center mt-1.5">
              役割を試せる活動と、仲間に出会う入口へ。
            </p>
          </Link>

          <Link
            href="/team"
            className="block w-full rounded-2xl border border-gray-200 p-5 hover:border-black transition-colors"
          >
            <p className="text-gray-700 font-medium text-sm text-center">仲間との組み方を見る</p>
            <p className="text-gray-400 text-xs text-center mt-1.5">
              2人・3人で力が伸びる組み合わせを知る。
            </p>
          </Link>

          <Link
            href="/full-diagnosis"
            className="block w-full rounded-2xl border border-gray-200 p-5 hover:border-black transition-colors"
          >
            <p className="text-gray-700 font-medium text-sm text-center">44問版モニター募集を見る</p>
            <p className="text-gray-400 text-xs text-center mt-1.5 leading-relaxed">
              感想提供・改善協力に参加できる方へ、別導線で案内します。
            </p>
          </Link>

          <Link
            href="/diagnosis"
            className="block w-full text-center py-4 rounded-2xl border border-gray-200 text-gray-600 text-sm hover:border-black hover:text-black transition-colors"
          >
            もう一度診断する
          </Link>
        </div>
      </section>

      <OperationLinks />
    </div>
  );
}
