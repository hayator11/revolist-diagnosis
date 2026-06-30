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
