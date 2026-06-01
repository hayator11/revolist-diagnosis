"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  calculateRevo111Result,
  decodeRevo111Answers,
  getRevo111ResultDetails,
  isValidRevo111Answers,
} from "@/lib/calculateRevo111Result";

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
          {item}
        </span>
      ))}
    </div>
  );
}

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-100 px-6 py-8">
      <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">{title}</p>
      {children}
    </section>
  );
}

export default function Revo111ResultClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("answers");

  const resultState = useMemo(() => {
    if (!encoded) return null;
    const answers = decodeRevo111Answers(encoded);
    if (!isValidRevo111Answers(answers)) return null;
    const result = calculateRevo111Result(answers);
    return {
      result,
      details: getRevo111ResultDetails(result),
    };
  }, [encoded]);

  if (!resultState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-6 text-sm">診断データが見つかりませんでした。</p>
        <Link
          href="/revo111"
          className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          44問診断をやり直す
        </Link>
      </div>
    );
  }

  const { result, details } = resultState;

  return (
    <div className="max-w-lg mx-auto pb-20">
      <section className="px-6 py-12">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
          Revo111 Result
        </p>
        <h1 className="text-3xl font-bold text-black leading-snug mb-4">
          あなたの今の中心役割は、<br />
          {details.mainRole.name}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Revo111は人を固定するものではなく、今の役割・成長・仲間・活動の循環を見える形にする成長OSです。
        </p>

        <div className="rounded-2xl bg-black p-6 text-white">
          <p className="text-sm text-gray-400 mb-2">役割コピー</p>
          <p className="text-xl font-bold leading-relaxed">{details.roleCopy}</p>
        </div>
      </section>

      <ResultSection title="Role Balance">
        <div className="space-y-3">
          {[
            ["メイン役割", details.mainRole.name, result.main.percentage],
            ["サブ役割", details.subRole.name, result.sub.percentage],
            ["補助役割", details.supportRole.name, result.support.percentage],
          ].map(([label, name, percentage]) => (
            <div key={label} className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xs text-gray-400">{percentage}%</p>
              </div>
              <p className="text-lg font-bold text-black">{name}</p>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="Current Point">
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-black mb-3">あなたの現在地</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{details.currentText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black mb-3">サブ役割</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{details.subText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black mb-3">補助役割</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{details.supportText}</p>
          </div>
        </div>
      </ResultSection>

      <ResultSection title="Give">
        <h2 className="text-lg font-bold text-black mb-3">自然に渡しているもの</h2>
        <PillList items={details.gives} />
      </ResultSection>

      <ResultSection title="Receive">
        <h2 className="text-lg font-bold text-black mb-3">受け取ると潤うもの</h2>
        <PillList items={details.receives} />
        <p className="text-sm text-gray-600 leading-relaxed mt-4">{details.comfortableEnvironment}</p>
      </ResultSection>

      <ResultSection title="Growth Route">
        <h2 className="text-lg font-bold text-black mb-3">成長ルート</h2>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {details.growthRoute.roles.map((role, index) => (
            <div key={role.key} className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                {role.name}
              </span>
              {index < details.growthRoute.roles.length - 1 && (
                <span className="text-xs text-gray-300">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{details.growthRoute.description}</p>
      </ResultSection>

      <ResultSection title="Future Partner">
        <h2 className="text-lg font-bold text-black mb-3">未来を広げる存在</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          これは何かを埋めるという意味ではありません。違う役割と出会うことで、あなたの可能性が広がるということです。
        </p>
        <div className="space-y-3">
          {details.futurePartners.map((partner) => (
            <div key={partner.role.key} className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-bold text-black mb-1">{partner.role.name}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {partner.creates.join(" → ")}。{partner.description}
              </p>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="Third Person">
        <h2 className="text-lg font-bold text-black mb-3">
          第三者効果：{details.thirdPerson.third.name}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {details.thirdPerson.pair[0].name}と{details.thirdPerson.pair[1].name}の間に、
          {details.thirdPerson.third.name}が加わることで、流れが生まれます。
        </p>
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-bold text-black mb-2">{details.thirdPerson.flow.join(" → ")}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{details.thirdPerson.result}</p>
        </div>
      </ResultSection>

      <ResultSection title="Activities">
        <h2 className="text-lg font-bold text-black mb-3">向いている活動</h2>
        <div className="space-y-2">
          {details.activities.map((activity) => (
            <p key={activity} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {activity}
            </p>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="Funding Role">
        <h2 className="text-lg font-bold text-black mb-3">Fundingでの役割</h2>
        <p className="text-sm font-bold text-black mb-3">{details.fundingRole.title}</p>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">得意</p>
            <PillList items={details.fundingRole.strengths} />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">関わり方</p>
            <PillList items={details.fundingRole.ways} />
          </div>
        </div>
      </ResultSection>

      <ResultSection title="Weekly Quest">
        <h2 className="text-lg font-bold text-black mb-3">今週のクエスト</h2>
        <div className="space-y-3">
          <p className="rounded-2xl bg-black px-5 py-4 text-sm font-medium leading-relaxed text-white">
            {details.quest.beginner}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            余裕があれば、次に「{details.quest.intermediate}」へ進んでみてください。
          </p>
        </div>
      </ResultSection>

      <section className="px-6 py-8 space-y-3">
        <Link
          href="/monitor/feedback"
          className="block w-full text-center py-4 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          この結果の感想を送る
        </Link>
        <Link
          href="/revo111"
          className="block w-full text-center py-4 rounded-2xl border border-gray-200 text-gray-600 text-sm hover:border-black hover:text-black transition-colors"
        >
          もう一度診断する
        </Link>
        <Link
          href="/revo"
          className="block w-full text-center py-4 rounded-2xl border border-gray-200 text-gray-600 text-sm hover:border-black hover:text-black transition-colors"
        >
          Revoの活動を見る
        </Link>
      </section>
    </div>
  );
}
