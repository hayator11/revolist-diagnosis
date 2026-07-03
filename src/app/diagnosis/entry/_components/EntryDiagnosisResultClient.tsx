"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OpenChatInvite from "@/components/OpenChatInvite";
import {
  calculateEntryDiagnosisResult,
  decodeEntryAnswers,
  getEntryResultNudge,
  isValidEntryAnswers,
} from "@/lib/calculateEntryDiagnosisResult";
import { revoTypes } from "@/data/revotypes";

function percentBar(value: number) {
  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-black" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function EntryDiagnosisResultClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers") ?? "";

  const resultState = useMemo(() => {
    const answers = decodeEntryAnswers(encoded);
    if (!isValidEntryAnswers(answers)) return null;
    return {
      answers,
      result: calculateEntryDiagnosisResult(answers),
    };
  }, [encoded]);

  useEffect(() => {
    if (!resultState || !encoded) return;
    const storageKey = `entry-diagnosis-saved:${encoded}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    const mainType = revoTypes[resultState.result.main.key];
    const subType = revoTypes[resultState.result.sub.key];
    const auxiliaryType = revoTypes[resultState.result.auxiliary.key];

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "entry_diagnosis",
        formType: "entry_diagnosis",
        timestamp: new Date().toISOString(),
        diagnosisType: "entry_11",
        diagnosisId: encoded,
        answers: resultState.answers,
        resultTitle: `${mainType.name} × ${subType.name} × ${auxiliaryType.name}`,
        resultSummary: mainType.catchcopy,
        mainRoleKey: mainType.key,
        mainRoleName: mainType.name,
        subRoleKey: subType.key,
        subRoleName: subType.name,
        supportRoleKey: auxiliaryType.key,
        supportRoleName: auxiliaryType.name,
        pagePath: window.location.pathname,
      }),
    })
      .then(() => {
        window.sessionStorage.setItem(storageKey, "true");
      })
      .catch(() => {
        // Result display should not depend on logging.
      });
  }, [encoded, resultState]);

  if (!resultState) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm text-gray-500">診断データが見つかりませんでした。</p>
        <Link
          href="/diagnosis/entry"
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          入口診断をはじめる
        </Link>
      </main>
    );
  }

  const { result } = resultState;
  const mainType = revoTypes[result.main.key];
  const subType = revoTypes[result.sub.key];
  const auxiliaryType = revoTypes[result.auxiliary.key];
  const partnerTypes = result.partnerTypes.map((key) => revoTypes[key]);

  return (
    <main className="bg-white px-6 py-12">
      <div className="mx-auto max-w-lg">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-gray-400">
          Entry Result
        </p>

        <section className="mb-6 rounded-[28px] bg-black p-7 text-white">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            あなたの入口タイプ
          </p>
          <h1 className="mb-3 text-4xl font-bold leading-tight">
            {mainType.name}
          </h1>
          <p className="mb-5 text-sm leading-relaxed text-gray-300">
            {mainType.catchcopy}
          </p>
          <div className="h-px bg-gray-800" />
          <p className="mt-5 text-sm leading-relaxed text-gray-300">
            {getEntryResultNudge(mainType.key)}
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            What you bring
          </p>
          <h2 className="mb-3 text-xl font-bold text-black">
            あなたが自然に持ち寄っているもの
          </h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {mainType.gives.map((value) => (
              <span key={value} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
                {value}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            {mainType.givesDetail}
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            With whom
          </p>
          <h2 className="mb-3 text-xl font-bold text-black">
            可能性を引き出し合いやすい相手
          </h2>
          <div className="space-y-3">
            {partnerTypes.map((type) => (
              <div key={type.key} className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-bold text-black">{type.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{type.catchcopy}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-400">
            これは「合う・合わない」を決めるものではなく、会話やチームづくりの入口です。
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-gray-200 p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Your mix
          </p>
          <h2 className="mb-4 text-xl font-bold text-black">
            もう少し詳しく見ると
          </h2>
          <div className="space-y-4">
            {[
              { label: "強く出ている役割", type: mainType, score: result.main.percentage },
              { label: "一緒に出ている役割", type: subType, score: result.sub.percentage },
              { label: "これから育ちやすい役割", type: auxiliaryType, score: result.auxiliary.percentage },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="mt-1 text-sm font-bold text-black">{item.type.name}</p>
                  </div>
                  <p className="text-xs text-gray-400">{item.score}%</p>
                </div>
                {percentBar(item.score)}
              </div>
            ))}
          </div>
        </section>

        <div className="mb-6">
          <OpenChatInvite context="diagnosis" />
        </div>

        <div className="space-y-3">
          <Link
            href="/diagnosis/entry"
            className="block rounded-2xl border border-gray-200 px-6 py-4 text-center text-sm font-medium text-gray-700"
          >
            もう一度11問で試す
          </Link>
          <Link
            href="/monitor"
            className="block rounded-2xl border border-gray-200 px-6 py-4 text-center text-sm font-medium text-gray-700"
          >
            モニター診断を見る
          </Link>
        </div>
      </div>
    </main>
  );
}
