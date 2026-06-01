"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  calculateRevo111Result,
  decodeRevo111Answers,
  getRevo111ResultDetails,
  isValidRevo111Answers,
} from "@/lib/calculateRevo111Result";
import { activityScoreLabels } from "@/data/revo111Navigation";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "meeddgby";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

const RATING_OPTIONS = [1, 2, 3, 4, 5];

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

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-3">{label}</label>
      <div className="grid grid-cols-5 gap-2">
        {RATING_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-2xl border py-3 text-sm font-medium transition-colors ${
              value === option
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

function OptionalInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

function ActivityScoreList({ scores }: { scores: Record<string, number> }) {
  return (
    <div className="space-y-3">
      {activityScoreLabels.map((label) => {
        const score = scores[label];
        return (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{score} / 5</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-black transition-all"
                style={{ width: `${score * 20}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  resultId?: string;
}

export default function Revo111ResultClient({ resultId }: Props) {
  const searchParams = useSearchParams();
  const encoded = resultId ?? searchParams.get("answers");
  const [copied, setCopied] = useState(false);
  const [fitRating, setFitRating] = useState(0);
  const [useRating, setUseRating] = useState(0);
  const [shareRating, setShareRating] = useState(0);
  const [want111Rating, setWant111Rating] = useState(0);
  const [bestFit, setBestFit] = useState("");
  const [feltDifferent, setFeltDifferent] = useState("");
  const [name, setName] = useState("");
  const [sns, setSns] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const shareText = useMemo(() => {
    if (!resultState) return "";
    return [
      "私のRevo111診断結果は",
      `「${resultState.details.mainRole.name} × ${resultState.details.subRole.name} × ${resultState.details.supportRole.name}」でした。`,
      "",
      "役割は固定ではなく、活動で育つ。",
      "あなたも診断してみてください。",
    ].join("\n");
  }, [resultState]);

  const resultUrl =
    typeof window === "undefined"
      ? ""
      : encoded
        ? `${window.location.origin}/revo111/result/${encoded}`
        : window.location.href;

  useEffect(() => {
    if (!resultState || !encoded) return;

    const storageKey = `revo111-result-saved:${encoded}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    const payload = {
      種別: "Revo111診断結果",
      結果ID: encoded,
      メイン役割: resultState.details.mainRole.name,
      サブ役割: resultState.details.subRole.name,
      補助役割: resultState.details.supportRole.name,
      メインスコア: resultState.result.main.score,
      サブスコア: resultState.result.sub.score,
      補助スコア: resultState.result.support.score,
      結果URL: resultUrl,
      送信日時: new Date().toISOString(),
    };

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      window.sessionStorage.setItem(storageKey, "true");
    }).catch(() => {
      // Result display should never be blocked by monitor logging.
    });
  }, [encoded, resultState, resultUrl]);

  const handleCopyResult = async () => {
    const text = `${shareText}\n${resultUrl}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmitFeedback = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resultState) return;

    setSending(true);
    setError("");

    const payload = {
      種別: "Revo111モニター感想",
      結果ID: encoded ?? "なし",
      結果URL: resultUrl,
      メイン役割: resultState.details.mainRole.name,
      サブ役割: resultState.details.subRole.name,
      補助役割: resultState.details.supportRole.name,
      診断結果はしっくりきたか: fitRating || "未回答",
      どこが一番しっくりきたか: bestFit || "なし",
      違和感があった部分: feltDifferent || "なし",
      仕事や活動に活かせそうか: useRating || "未回答",
      誰かに見せたいと思ったか: shareRating || "未回答",
      "111問版ができたら受けたいか": want111Rating || "未回答",
      名前: name || "匿名",
      SNS: sns || "なし",
      連絡先: contact || "なし",
      送信日時: new Date().toISOString(),
    };

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(key, String(value));
      }

      const [formspreeRes] = await Promise.all([
        fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        }),
        fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      ]);

      if (!formspreeRes.ok) {
        setError(`送信に失敗しました（${formspreeRes.status}）。もう一度お試しください。`);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`送信エラー: ${message}`);
    } finally {
      setSending(false);
    }
  };

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
          あなたは、<br />
          {details.mainNavigation.publicLabel}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          {details.mainNavigation.publicSummary}
        </p>

        <div className="rounded-2xl bg-black p-6 text-white">
          <p className="text-sm text-gray-400 mb-2">Revo111での呼び名</p>
          <p className="text-2xl font-bold leading-relaxed">{details.mainRole.name}</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-300">
            Revo111では、この役割を「{details.mainRole.name}」と呼びます。
            役割は固定ではなく、仕事・仲間・活動の中で育っていくものです。
          </p>
        </div>
      </section>

      <ResultSection title="Role Mix">
        <h2 className="text-lg font-bold text-black mb-3">あなたを動かす3つの力</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{details.roleCopy}</p>
        <div className="space-y-3">
          {[
            ["中心", details.mainNavigation.publicLabel, details.mainRole.name, result.main.percentage],
            ["支え", details.subNavigation.publicLabel, details.subRole.name, result.sub.percentage],
            ["育つ可能性", details.supportNavigation.publicLabel, details.supportRole.name, result.support.percentage],
          ].map(([label, publicName, roleName, percentage]) => (
            <div key={label} className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xs text-gray-400">{String(percentage)}%</p>
              </div>
              <p className="text-lg font-bold text-black">{publicName}</p>
              <p className="mt-1 text-xs text-gray-400">Revo111名: {roleName}</p>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="Work">
        <h2 className="text-lg font-bold text-black mb-3">仕事で活かすなら</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          役職名ではなく、あなたの力が自然に出やすい仕事の入口です。
        </p>
        <PillList items={details.workExamples} />
      </ResultSection>

      <ResultSection title="Life Navigation">
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-black mb-3">あなたはどんな人？</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{details.currentText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black mb-3">支えになっている力</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{details.subText}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black mb-3">これから育つ可能性</h2>
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

      <ResultSection title="Activities">
        <h2 className="text-lg font-bold text-black mb-3">活動で活かすなら</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          今すぐ全部を選ぶ必要はありません。動きやすい入口を見つけるための目安です。
        </p>
        <ActivityScoreList scores={details.activityScores} />
      </ResultSection>

      <ResultSection title="Growth Route">
        <h2 className="text-lg font-bold text-black mb-3">成長ルート</h2>
        <div className="space-y-3 mb-5">
          {details.growthRoute.meanings.map((meaning, index) => (
            <div key={meaning} className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-bold text-black">{meaning}</p>
              <p className="mt-1 text-xs text-gray-400">
                Revo111名: {details.growthRoute.roles[index]?.name}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{details.growthRoute.description}</p>
      </ResultSection>

      <ResultSection title="Future Partner">
        <h2 className="text-lg font-bold text-black mb-3">仲間との関わり方</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          あなたは、こんな人たちと組むと力が伸びやすくなります。
        </p>
        <PillList items={details.partnerLabels} />
        <p className="text-sm text-gray-600 leading-relaxed my-5">
          Revo111で見ると、未来を広げる存在は次の役割です。
        </p>
        <div className="space-y-3">
          {details.futurePartners.map((partner) => (
            <div key={partner.role.key} className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-bold text-black mb-1">
                {partner.navigation.publicLabel}
              </p>
              <p className="mb-2 text-xs text-gray-400">Revo111名: {partner.role.name}</p>
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

      <ResultSection title="Today">
        <h2 className="text-lg font-bold text-black mb-3">今日の一歩</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          今日3分でできる、小さなミッションです。
        </p>
        <div className="space-y-3">
          <p className="rounded-2xl bg-black px-5 py-4 text-sm font-medium leading-relaxed text-white">
            {details.todayMission}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            余裕があれば、次に「{details.quest.intermediate}」へ進んでみてください。
          </p>
        </div>
      </ResultSection>

      <ResultSection title="Share">
        <h2 className="text-lg font-bold text-black mb-3">結果を共有する</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          診断結果は、仲間と話すきっかけとして使えます。
        </p>
        <div className="grid grid-cols-1 gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n${resultUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl bg-black px-5 py-4 text-center text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Xで共有
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(resultUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-gray-200 px-5 py-4 text-center text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
          >
            LINEで共有
          </a>
          <button
            type="button"
            onClick={handleCopyResult}
            className="rounded-2xl border border-gray-200 px-5 py-4 text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
          >
            {copied ? "コピーしました" : "結果をコピー"}
          </button>
        </div>
      </ResultSection>

      <ResultSection title="Monitor Feedback">
        <h2 className="text-lg font-bold text-black mb-3">モニター感想フォーム</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          あなたの感想が、111問版の質問設計と結果文の改善につながります。
        </p>

        {submitted ? (
          <div className="rounded-2xl bg-gray-50 p-6 text-center">
            <p className="text-lg font-bold text-black mb-2">ありがとうございます。</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              感想を受け取りました。Revo111を育てるための大切な声として活かします。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-8">
            <RatingInput
              label="診断結果はしっくりきましたか？"
              value={fitRating}
              onChange={setFitRating}
            />
            <TextAreaInput
              label="どこが一番しっくりきましたか？"
              value={bestFit}
              onChange={setBestFit}
              placeholder="役割名、文章、成長ルートなど..."
            />
            <TextAreaInput
              label="違和感があった部分はありますか？"
              value={feltDifferent}
              onChange={setFeltDifferent}
              placeholder="質問文、結果文、役割の組み合わせなど..."
            />
            <RatingInput
              label="この結果を仕事や活動に活かせそうですか？"
              value={useRating}
              onChange={setUseRating}
            />
            <RatingInput
              label="誰かに見せたいと思いましたか？"
              value={shareRating}
              onChange={setShareRating}
            />
            <RatingInput
              label="111問版ができたら受けたいですか？"
              value={want111Rating}
              onChange={setWant111Rating}
            />
            <div className="space-y-4">
              <OptionalInput
                label="名前 任意"
                value={name}
                onChange={setName}
                placeholder="お名前"
              />
              <OptionalInput
                label="SNS 任意"
                value={sns}
                onChange={setSns}
                placeholder="@username など"
              />
              <OptionalInput
                label="連絡先 任意"
                value={contact}
                onChange={setContact}
                placeholder="メールアドレス、SNSなど"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {sending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  送信中…
                </>
              ) : (
                "感想を送る"
              )}
            </button>
          </form>
        )}
      </ResultSection>

      <ResultSection title="Next Navigation">
        <h2 className="text-lg font-bold text-black mb-3">次の診断へ</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          あなたの未来を広げる存在は、
          {details.futurePartners[0]?.navigation.publicLabel ?? "仲間の力を引き出す人"}
          でした。次は仲間診断で、あなたの周りにどんな役割がいるか見てみませんか？
        </p>
        <Link
          href="/monitor/team"
          className="block w-full rounded-2xl bg-black px-5 py-4 text-center text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          仲間診断（Monitor B）へ
        </Link>
      </ResultSection>

      <section className="px-6 py-8 space-y-3">
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
