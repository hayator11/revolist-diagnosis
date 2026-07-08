import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DIAGNOSIS_COUNTER_LABELS,
  getDiagnosisRunCounterDashboardData,
  type DiagnosisRunCounterDashboardData,
} from "@/lib/diagnosisRunCounter";

export const metadata: Metadata = {
  title: "診断回数 | 管理画面",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  searchParams: Promise<{ key?: string }>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-3xl font-bold tabular-nums text-black">{value.toLocaleString("ja-JP")}</p>
    </div>
  );
}

function readPayloadText(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function readPayloadTextArray(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    : [];
}

function formatAnswers(values: string[], fallback = "") {
  return values.length > 0 ? values.join(" / ") : fallback || "-";
}

function Dashboard({ data }: { data: DiagnosisRunCounterDashboardData }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">Admin / Database / Stats</p>
        <h1 className="mb-3 text-3xl font-bold text-black">診断回数</h1>
        <p className="text-sm leading-relaxed text-gray-600">
          運営データベースに保存された診断完了・結果表示のカウントです。
        </p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={data.totalCount} />
        <StatCard label="Today" value={data.todayCount} />
        <StatCard label="Last 24 Hours" value={data.last24HoursCount} />
      </section>

      <section className="mb-10 rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-black">11問ライト診断 改善ダッシュボード</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            入口アクセス、診断完了、診断後アンケートを見ながら、質問と結果文を育てます。
          </p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <StatCard label="Access" value={data.entryAccessCount} />
          <StatCard label="Completed" value={data.entryDiagnosisCount} />
          <StatCard label="Feedback" value={data.entryFeedbackCount} />
        </div>
      </section>

      <section className="mb-10 rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-black">11問診断 直近アンケート</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            納得感、質問の答えやすさ、結果文の伝わり方、次に知りたいことを確認できます。
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {data.entryFeedbackEvents.map((event) => {
            const fitAnswer = readPayloadText(event.payload, "fitAnswer");
            const questionIssueAnswers = readPayloadTextArray(event.payload, "questionIssueAnswers");
            const resultCopyAnswers = readPayloadTextArray(event.payload, "resultCopyAnswers");
            const nextInterestAnswers = readPayloadTextArray(event.payload, "nextInterestAnswers");
            const freeComment = readPayloadText(event.payload, "freeComment");
            const impression = fitAnswer || readPayloadText(event.payload, "impressionText");
            const discomfort =
              questionIssueAnswers.length > 0
                ? questionIssueAnswers.join(" / ")
                : readPayloadText(event.payload, "discomfortText");
            const resultCopy =
              resultCopyAnswers.length > 0
                ? resultCopyAnswers.join(" / ")
                : readPayloadText(event.payload, "impressionText");
            const request =
              nextInterestAnswers.length > 0
                ? nextInterestAnswers.join(" / ")
                : readPayloadText(event.payload, "improvementRequestText");
            const mainRoleName = readPayloadText(event.payload, "mainRoleName");

            return (
              <article key={event.id} className="px-5 py-5">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>{formatDate(event.counted_at)}</span>
                  {mainRoleName && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                      {mainRoleName}
                    </span>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      納得感
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {impression || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      質問
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {discomfort || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      結果文
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {formatAnswers(resultCopy ? [resultCopy] : [])}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      次に知りたいこと
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {request || "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      コメント
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {freeComment || "-"}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
          {data.entryFeedbackEvents.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              まだアンケート回答はありません。
            </p>
          )}
        </div>
      </section>

      <section className="mb-10 rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-black">診断別カウンター</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-5 py-3">診断</th>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3 text-right">回数</th>
                <th className="px-5 py-3">初回</th>
                <th className="px-5 py-3">最終</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.counters.map((counter) => (
                <tr key={counter.diagnosis_key}>
                  <td className="px-5 py-4 font-medium text-black">
                    {DIAGNOSIS_COUNTER_LABELS[counter.diagnosis_key] ?? counter.diagnosis_key}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{counter.diagnosis_key}</td>
                  <td className="px-5 py-4 text-right font-mono text-base font-bold text-black">
                    {counter.total_count.toLocaleString("ja-JP")}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{formatDate(counter.first_counted_at)}</td>
                  <td className="px-5 py-4 text-gray-500">{formatDate(counter.last_counted_at)}</td>
                </tr>
              ))}
              {data.counters.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-gray-400" colSpan={5}>
                    まだカウントがありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-black">直近イベント</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data.recentEvents.map((event) => (
            <div key={event.id} className="grid gap-2 px-5 py-4 text-sm sm:grid-cols-[1.5fr_1fr_1fr]">
              <div>
                <p className="font-medium text-black">
                  {DIAGNOSIS_COUNTER_LABELS[event.diagnosis_key] ?? event.diagnosis_key}
                </p>
                <p className="font-mono text-xs text-gray-400">{event.diagnosis_key}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Source</p>
                <p className="text-gray-600">{event.source ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Counted</p>
                <p className="text-gray-600">{formatDate(event.counted_at)}</p>
              </div>
            </div>
          ))}
          {data.recentEvents.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">直近イベントはありません。</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default async function DiagnosisAdminPage({ searchParams }: Props) {
  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;
  const { key } = await searchParams;

  if (!configuredKey) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">Admin</p>
        <h1 className="mb-4 text-2xl font-bold text-black">管理画面は未設定です</h1>
        <p className="text-sm leading-relaxed text-gray-600">
          診断回数の管理画面を表示するには、Vercel Production に
          <span className="font-mono"> ADMIN_DASHBOARD_KEY </span>
          を設定してください。
        </p>
      </div>
    );
  }

  if (key !== configuredKey) {
    notFound();
  }

  let data: DiagnosisRunCounterDashboardData | null = null;
  let errorMessage = "";

  try {
    data = await getDiagnosisRunCounterDashboardData();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  if (data) {
    return <Dashboard data={data} />;
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">Admin</p>
      <h1 className="mb-4 text-2xl font-bold text-black">データを読み込めませんでした</h1>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        Supabaseのカウンターテーブル、または環境変数の設定を確認してください。
      </p>
      <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4 text-xs text-gray-500">{errorMessage}</pre>
    </div>
  );
}
