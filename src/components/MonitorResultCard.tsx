"use client";

import { useState } from "react";
import Link from "next/link";
import { revoTypes } from "@/data/revotypes";
import { monitorDiagnosisMeta } from "@/data/monitorResults";
import type {
  MonitorResult,
  MonitorRoleResult,
  MonitorTeamResult,
  MonitorMatchResult,
  MonitorGrowthResult,
} from "@/lib/calculateMonitorResult";
import type { MonitorScenarioAxisKey } from "@/data/monitorScenarioQuestions";

interface Props {
  result: MonitorResult;
}

// ── 共通: タイプバッジ ──────────────────────────────────────────────
function TypeBadge({
  label,
  typeKey,
  accentColor,
  rank,
}: {
  label: string;
  typeKey: string;
  accentColor: string;
  rank: "main" | "sub" | "aux";
}) {
  const t = revoTypes[typeKey as keyof typeof revoTypes];
  const isMain = rank === "main";
  return (
    <div
      className={`rounded-2xl p-5 ${
        isMain ? "bg-black text-white" : "border border-gray-200 bg-white"
      }`}
    >
      <p
        className="text-xs tracking-widest uppercase mb-1 font-medium"
        style={{ color: isMain ? accentColor : "#9ca3af" }}
      >
        {label}
      </p>
      <p className={`text-xl font-bold mb-1 ${isMain ? "text-white" : "text-black"}`}>
        {t.name}
      </p>
      <p className={`text-xs leading-relaxed ${isMain ? "text-gray-400" : "text-gray-500"}`}>
        {t.catchcopy}
      </p>
    </div>
  );
}

// ── 共通: セクションラベル ───────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-widest text-gray-400 uppercase mb-3 font-medium">
      {children}
    </p>
  );
}

const AXIS_COPY: Record<MonitorScenarioAxisKey, { label: string; text: string }> = {
  self: {
    label: "自分の内側",
    text: "自分の感覚や納得感を大切にしながら、役割を見つけていく傾向があります。",
  },
  other: {
    label: "相手との関係",
    text: "相手の反応や関係性の中から、自然な動き方を見つけやすい傾向があります。",
  },
  field: {
    label: "場の流れ",
    text: "人や情報がどう配置されると動きやすいか、場全体を見ながら力を出しやすい傾向があります。",
  },
  future: {
    label: "未来の可能性",
    text: "まだ形になっていない可能性や、次に開けそうな展開に目が向きやすい傾向があります。",
  },
  structure: {
    label: "構造と整理",
    text: "考えや流れを整理し、動きやすい形にすることで力が出やすい傾向があります。",
  },
  expression: {
    label: "表現と伝わり方",
    text: "想いや世界観がどう伝わるかを大切にしながら、場に意味を届けやすい傾向があります。",
  },
  care: {
    label: "安心と余白",
    text: "人が自然体でいられる空気や、挑戦が続く土台を大切にしやすい傾向があります。",
  },
  action: {
    label: "具体的な一歩",
    text: "小さく動かしてみることや、次の一歩を置くことで可能性を開きやすい傾向があります。",
  },
};

function getTopAxes(axisScores?: Record<MonitorScenarioAxisKey, number>) {
  if (!axisScores) return [];
  return (Object.entries(axisScores) as [MonitorScenarioAxisKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => ({ key, ...AXIS_COPY[key] }));
}

// ── Role 結果 ───────────────────────────────────────────────────────
function RoleResultBody({ result, accent }: { result: MonitorRoleResult; accent: string }) {
  const possibilityPartners = result.possibilityPartners
    ?.map((partner) => revoTypes[partner.key])
    .filter(Boolean);
  const topAxes = getTopAxes(result.axisScores);

  return (
    <div className="space-y-8">
      {/* 役割カード群 */}
      <div className="space-y-3">
        <TypeBadge label="Main Role" typeKey={result.main.key} accentColor={accent} rank="main" />
        <div className="grid grid-cols-2 gap-3">
          <TypeBadge label="Sub Role" typeKey={result.sub.key} accentColor={accent} rank="sub" />
          <TypeBadge label="Auxiliary" typeKey={result.auxiliary.key} accentColor={accent} rank="aux" />
        </div>
      </div>

      {/* 立ち位置 */}
      <div>
        <SectionLabel>あなたの立ち位置</SectionLabel>
        <p className="text-2xl font-bold text-black">{result.positionLabel}</p>
      </div>

      {possibilityPartners && possibilityPartners.length > 0 && (
        <div className="rounded-2xl bg-gray-50 p-5">
          <SectionLabel>可能性を引き出し合いやすい相手</SectionLabel>
          <div className="space-y-3">
            {possibilityPartners.slice(0, 2).map((partner) => (
              <div key={partner.key}>
                <p className="text-base font-bold text-black">{partner.name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{partner.catchcopy}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mt-4">
            関係を固定するものではなく、会話やチーム作りのきっかけとして使ってください。
          </p>
        </div>
      )}

      {topAxes.length > 0 && (
        <div className="rounded-2xl border border-gray-200 p-5">
          <SectionLabel>あなたが場で見ているもの</SectionLabel>
          <div className="space-y-4">
            {topAxes.map((axis) => (
              <div key={axis.key}>
                <p className="text-sm font-bold text-black mb-1">{axis.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{axis.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 渡しているもの */}
      <div>
        <SectionLabel>自然に渡しているもの</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {result.gives.map((g) => (
            <span key={g} className="text-sm text-black border border-gray-200 px-4 py-2 rounded-full">
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* 受け取ると潤うもの */}
      <div>
        <SectionLabel>受け取ると潤うもの</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {result.receives.map((r) => (
            <span key={r} className="text-sm text-gray-600 border border-dashed border-gray-300 px-4 py-2 rounded-full">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Revo Funding */}
      <div className="rounded-2xl bg-gray-50 p-5">
        <SectionLabel>Revo Fundingで活きる役割</SectionLabel>
        <p className="text-sm text-black leading-relaxed">{result.revoFundingRole}</p>
      </div>
    </div>
  );
}

// ── Team 結果 ───────────────────────────────────────────────────────
function TeamResultBody({ result, accent }: { result: MonitorTeamResult; accent: string }) {
  return (
    <div className="space-y-8">
      {/* 役割カード群 */}
      <div className="space-y-3">
        <TypeBadge label="Team Position" typeKey={result.main.key} accentColor={accent} rank="main" />
        <div className="grid grid-cols-2 gap-3">
          <TypeBadge label="Support" typeKey={result.sub.key} accentColor={accent} rank="sub" />
          <TypeBadge label="Complement" typeKey={result.auxiliary.key} accentColor={accent} rank="aux" />
        </div>
      </div>

      {/* 向いている立ち位置 */}
      <div>
        <SectionLabel>向いている立ち位置</SectionLabel>
        <p className="text-2xl font-bold text-black">{result.teamLabel}</p>
      </div>

      {/* 周りにいると良い存在 */}
      <div className="rounded-2xl bg-gray-50 p-5">
        <SectionLabel>周りにいると力が引き出される存在</SectionLabel>
        <p className="text-sm text-black leading-relaxed">{result.bestWith}</p>
      </div>

      {/* Revo Funding */}
      <div className="rounded-2xl border border-gray-200 p-5">
        <SectionLabel>Revo Fundingで活きる役割</SectionLabel>
        <p className="text-sm text-black leading-relaxed">{result.revoFundingRole}</p>
      </div>
    </div>
  );
}

// ── Match 結果 ──────────────────────────────────────────────────────
function MatchResultBody({ result, accent }: { result: MonitorMatchResult; accent: string }) {
  const t1 = revoTypes[result.openedByType.key];
  const t2 = revoTypes[result.youOpenType.key];
  const t3 = revoTypes[result.thirdPartyType.key];
  return (
    <div className="space-y-8">
      {/* あなたを開花させる存在 */}
      <div className="rounded-2xl bg-black text-white p-6">
        <p className="text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: accent }}>
          あなたを開花させる存在
        </p>
        <p className="text-2xl font-bold mb-2">{t1.name}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{result.openedByDesc}</p>
      </div>

      {/* あなたが開花させる存在 */}
      <div className="rounded-2xl border border-gray-200 p-6">
        <SectionLabel>あなたが力を引き出す存在</SectionLabel>
        <p className="text-xl font-bold text-black mb-2">{t2.name}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{result.youOpenDesc}</p>
      </div>

      {/* 第三者効果 */}
      <div className="rounded-2xl bg-gray-50 p-5">
        <SectionLabel>第三者が加わると広がる可能性</SectionLabel>
        <p className="text-sm font-medium text-black mb-1">{t3.name}が加わると</p>
        <p className="text-sm text-gray-500 leading-relaxed">{result.thirdPartyDesc}</p>
      </div>

      {/* 理想の組み合わせ */}
      <div>
        <SectionLabel>理想の組み合わせ</SectionLabel>
        <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-300 pl-4">
          {result.idealCombo}
        </p>
      </div>
    </div>
  );
}

// ── Growth 結果 ─────────────────────────────────────────────────────
function GrowthResultBody({ result, accent }: { result: MonitorGrowthResult; accent: string }) {
  const t1 = revoTypes[result.nextRole.key];
  const t2 = revoTypes[result.sleepingRole.key];
  return (
    <div className="space-y-8">
      {/* 次に育つ役割 */}
      <div className="rounded-2xl bg-black text-white p-6">
        <p className="text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: accent }}>
          次に育つ可能性のある役割
        </p>
        <p className="text-2xl font-bold mb-1">{t1.name}</p>
        <p className="text-sm mb-3" style={{ color: accent }}>{result.growthLabel}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{t1.description}</p>
      </div>

      {/* 眠っている力 */}
      <div className="rounded-2xl border border-dashed border-gray-300 p-5">
        <SectionLabel>眠っている力</SectionLabel>
        <p className="text-lg font-bold text-black mb-2">{t2.name}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{result.sleepingDesc}</p>
      </div>

      {/* 成長クエスト */}
      <div className="rounded-2xl bg-gray-50 p-5">
        <SectionLabel>おすすめの成長クエスト</SectionLabel>
        <p className="text-sm text-black leading-relaxed font-medium">{result.quest}</p>
      </div>

      {/* 向いている活動 */}
      <div>
        <SectionLabel>向いている活動</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {result.activities.map((a) => (
            <span key={a} className="text-xs text-gray-600 border border-gray-200 px-4 py-2 rounded-full">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* 未来の可能性 */}
      <div>
        <SectionLabel>未来の可能性</SectionLabel>
        <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-300 pl-4">
          {result.future}
        </p>
      </div>
    </div>
  );
}

// ── シェアテキスト生成 ──────────────────────────────────────────────
function buildMonitorShareText(result: MonitorResult): string {
  const meta = monitorDiagnosisMeta[result.type];
  const mainType = revoTypes[result.main.key];

  if (result.type === "role") {
    return `【${meta.title}】\n今、強く使っている役割は「${mainType.name}」でした。\n${mainType.catchcopy}\n\n#レボリスト診断 #RevoOS`;
  }
  if (result.type === "team") {
    return `【${meta.title}】\nチームでの立ち位置は「${result.teamLabel}」でした。\n${mainType.name}として力を発揮できそうです。\n\n#レボリスト診断 #RevoOS`;
  }
  if (result.type === "match") {
    const t1 = revoTypes[result.openedByType.key];
    return `【${meta.title}】\n私を開花させる存在は「${t1.name}」でした。\n出会いが役割の可能性を育てる。\n\n#レボリスト診断 #RevoOS`;
  }
  if (result.type === "growth") {
    const t1 = revoTypes[result.nextRole.key];
    return `【${meta.title}】\n次に育てると良い役割は「${t1.name}」でした。\nまだ使っていない力が眠っている。\n\n#レボリスト診断 #RevoOS`;
  }
  return `${meta.title}を試しました。\n#レボリスト診断 #RevoOS`;
}

// ── シェアボタン ────────────────────────────────────────────────────
function ShareSection({ result }: { result: MonitorResult }) {
  const [copied, setCopied] = useState(false);
  const shareText = buildMonitorShareText(result);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className="mt-10 border-t border-gray-100 pt-10">
      <p className="text-xs tracking-widest text-gray-400 uppercase mb-4 text-center">
        結果をシェアする
      </p>
      <div className="space-y-2">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.262 5.636 5.901-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X でシェア
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500" aria-hidden>
            <path d="M12 2C6.48 2 2 6.28 2 11.47c0 3.75 2.37 7.02 5.9 8.89.26.13.43.41.38.7l-.3 1.7c-.08.47.43.84.85.62L11.5 21.8c.16-.08.34-.1.5-.07.66.1 1.33.15 2 .15 5.52 0 10-4.28 10-9.41C24 6.28 19.52 2 12 2z" />
          </svg>
          LINE でシェア
        </a>
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500" aria-hidden>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              コピーしました
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              リンクをコピー
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── メインコンポーネント ────────────────────────────────────────────
export default function MonitorResultCard({ result }: Props) {
  const meta = monitorDiagnosisMeta[result.type];
  const mainType = revoTypes[result.main.key];

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      {/* ヘッダー */}
      <div className="mb-10 text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">{meta.title} — Result</p>
        <p className="text-sm text-gray-500 mb-2">{meta.subtitle}</p>
        <h1 className="text-3xl font-bold text-black leading-snug">
          今、強く出ている役割は
          <br />
          <span style={{ color: meta.accentColor }}>「{mainType.name}」</span>
          <br />
          <span className="text-xl font-medium text-gray-600">です。</span>
        </h1>
        <p className="text-xs text-gray-400 mt-4 italic">{mainType.catchcopy}</p>
      </div>

      {/* 診断別ボディ */}
      {result.type === "role" && (
        <RoleResultBody result={result} accent={meta.accentColor} />
      )}
      {result.type === "team" && (
        <TeamResultBody result={result} accent={meta.accentColor} />
      )}
      {result.type === "match" && (
        <MatchResultBody result={result} accent={meta.accentColor} />
      )}
      {result.type === "growth" && (
        <GrowthResultBody result={result} accent={meta.accentColor} />
      )}

      {/* ── 次の診断へ ── */}
      {meta.nextKey && (
        <div className="mt-14 border-t border-gray-100 pt-10">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-4 text-center">
            Next Diagnosis
          </p>
          <p className="text-sm text-gray-600 text-center mb-6">{meta.nextLabel}</p>
          <Link
            href={`/monitor/${meta.nextKey}`}
            className="block w-full text-center py-4 rounded-full border-2 border-black text-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
          >
            {monitorDiagnosisMeta[meta.nextKey].title} を試す
          </Link>
        </div>
      )}

      {/* ── シェア ── */}
      <ShareSection result={result} />

      {/* ── フィードバック ── */}
      <div className="mt-10 rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm text-black font-medium mb-1">この結果はどう感じましたか？</p>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          率直な感想が、111問フル診断の開発に活かされます。
        </p>
        <Link
          href="/monitor/feedback"
          className="inline-block px-8 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          感想を送る
        </Link>
      </div>

      {/* ── モニタートップへ ── */}
      <div className="mt-8 text-center">
        <Link href="/monitor" className="text-xs text-gray-400 hover:text-black transition-colors">
          ← モニタートップに戻る
        </Link>
      </div>
    </div>
  );
}
