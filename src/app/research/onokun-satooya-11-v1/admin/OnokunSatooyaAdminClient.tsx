"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

interface TypeCount {
  typeKey: string;
  typeName: string;
  count: number;
}

interface DeviceCount {
  device: string;
  count: number;
}

interface LatestResult {
  diagnosis_run_number: number;
  diagnosis_id: string;
  created_at: string;
  main_type_name: string;
  main_revo_type_key: string | null;
  sub_type_name: string;
  sub_revo_type_key: string | null;
  support_type_name: string;
  support_revo_type_key: string | null;
  cluster_name: string;
  partner_type_name: string;
  partner_revo_type_key: string | null;
  device: string | null;
  result_url: string | null;
}

interface AdminStats {
  setupRequired?: boolean;
  setupReason?: string | null;
  totalDiagnosisCount: number;
  counterUpdatedAt: string | null;
  sampledResultCount: number;
  typeCounts: TypeCount[];
  deviceCounts: DeviceCount[];
  latestResults: LatestResult[];
}

type AdminState = "loading" | "login" | "ready" | "error";

export default function OnokunSatooyaAdminClient() {
  const [state, setState] = useState<AdminState>("loading");
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [message, setMessage] = useState("");

  const loadStats = async () => {
    setMessage("");

    const response = await fetch("/api/onokun-satooya/admin/stats", {
      cache: "no-store",
    });

    if (response.status === 401) {
      setState("login");
      return;
    }

    const data = (await response.json().catch(() => null)) as
      | (AdminStats & { reason?: string })
      | null;

    if (!response.ok || !data) {
      setMessage(data?.reason ?? "管理データを読み込めませんでした。");
      setState("error");
      return;
    }

    setStats(data);
    setState("ready");
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStats();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/onokun-satooya/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { reason?: string } | null;
      setMessage(
        data?.reason === "admin_not_configured"
          ? "管理用パスワードが環境変数に設定されていません。"
          : "パスワードが違います。",
      );
      return;
    }

    setPassword("");
    await loadStats();
  };

  const handleLogout = async () => {
    await fetch("/api/onokun-satooya/admin/logout", { method: "POST" });
    setStats(null);
    setMessage("");
    setPassword("");
    setState("login");
  };

  const isAuthenticatedView = state === "ready" || state === "error";

  return (
    <main className="min-h-screen bg-[#FFF8EA] px-5 py-8 text-[#3A2A1E] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-[#E8DCC4] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-[4px] bg-white px-3 py-1.5 text-xs font-black text-[#164F9E] shadow-sm">
              おのくん里親さん診断
            </p>
            <h1 className="text-3xl font-black leading-tight sm:text-5xl">運営管理</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAuthenticatedView && (
              <span className="rounded-[8px] bg-[#F7D35B] px-4 py-3 text-sm font-black text-[#3A2A1E]">
                ログイン中
              </span>
            )}
            <Link
              href="/research/onokun-satooya-11-v1"
              className="rounded-[8px] bg-white px-4 py-3 text-sm font-black text-[#164F9E] shadow-sm"
            >
              診断ページへ
            </Link>
            {isAuthenticatedView && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-[8px] bg-[#3A2A1E] px-4 py-3 text-sm font-black text-white"
              >
                ログアウト
              </button>
            )}
          </div>
        </header>

        {state === "loading" && (
          <section className="rounded-[8px] bg-white p-6 text-sm font-bold shadow-sm">
            読み込んでいます...
          </section>
        )}

        {state === "login" && (
          <section className="max-w-md rounded-[8px] bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-black">ログイン</h2>
            <p className="mb-5 text-sm font-bold leading-relaxed text-[#3A2A1E]/68">
              運営確認画面です。管理用パスワードを入力してください。
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[8px] border border-[#E8DCC4] bg-[#FFF8EA] px-4 py-3 text-base font-bold outline-none focus:border-[#164F9E]"
                placeholder="管理用パスワード"
              />
              {message && <p className="text-sm font-bold text-[#F06F8F]">{message}</p>}
              <button
                type="submit"
                className="w-full rounded-[8px] bg-[#164F9E] px-5 py-3 text-sm font-black text-white"
              >
                ログインする
              </button>
            </form>
          </section>
        )}

        {state === "error" && (
          <section className="rounded-[8px] bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-[#F06F8F]">{message}</p>
            <p className="mb-4 text-sm font-bold leading-relaxed text-[#3A2A1E]/70">
              管理ログインは有効です。作業を終える場合は右上のログアウトで管理セッションを切ってください。
            </p>
            <button
              type="button"
              onClick={() => {
                setState("loading");
                void loadStats();
              }}
              className="rounded-[8px] bg-[#164F9E] px-5 py-3 text-sm font-black text-white"
            >
              再読み込み
            </button>
          </section>
        )}

        {state === "ready" && stats && (
          <div className="space-y-6">
            {stats.setupRequired && (
              <section className="rounded-[8px] border border-[#F6A04D] bg-white p-6 shadow-sm">
                <p className="mb-2 text-xs font-black text-[#F06F8F]">DATABASE SETUP</p>
                <h2 className="mb-3 text-xl font-black">Supabaseの初期設定がまだ必要です</h2>
                <p className="text-sm font-bold leading-relaxed text-[#3A2A1E]/70">
                  管理画面へのログインはできています。集計を表示するには、
                  <span className="font-black text-[#164F9E]">
                    docs/onokun/onokun-satooya-supabase-counter-schema.sql
                  </span>
                  をSupabaseで実行してください。
                </p>
                {stats.setupReason && (
                  <p className="mt-4 rounded-[8px] bg-[#FFF8EA] px-4 py-3 text-xs font-black text-[#F06F8F]">
                    {stats.setupReason}
                  </p>
                )}
              </section>
            )}

            <section className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="総診断回数"
                value={`${stats.totalDiagnosisCount.toLocaleString("ja-JP")} 回`}
              />
              <MetricCard
                label="取得ログ件数"
                value={`${stats.sampledResultCount.toLocaleString("ja-JP")} 件`}
              />
              <MetricCard
                label="最終更新"
                value={formatDateTime(stats.counterUpdatedAt)}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Panel title="タイプ別集計">
                <div className="space-y-3">
                  {stats.typeCounts.length === 0 && (
                    <p className="text-sm font-bold text-[#3A2A1E]/60">
                      まだ診断ログがありません。
                    </p>
                  )}
                  {stats.typeCounts.map((item) => (
                    <div key={item.typeKey}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm font-black">
                        <span>{item.typeName}</span>
                        <span className="text-[#164F9E]">{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#FFF8EA]">
                        <div
                          className="h-full rounded-full bg-[#F06F8F]"
                          style={{
                            width: `${Math.max(
                              8,
                              Math.round((item.count / Math.max(1, stats.sampledResultCount)) * 100),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="端末別">
                <div className="space-y-3">
                  {stats.deviceCounts.map((item) => (
                    <div
                      key={item.device}
                      className="flex items-center justify-between rounded-[8px] bg-[#FFF8EA] px-4 py-3 text-sm font-black"
                    >
                      <span>{item.device}</span>
                      <span className="text-[#164F9E]">{item.count}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>

            <Panel title="最新ログ">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E8DCC4] text-xs font-black text-[#3A2A1E]/60">
                      <th className="py-3 pr-4">回</th>
                      <th className="py-3 pr-4">日時</th>
                      <th className="py-3 pr-4">メイン</th>
                      <th className="py-3 pr-4">Revo</th>
                      <th className="py-3 pr-4">サブ</th>
                      <th className="py-3 pr-4">補助</th>
                      <th className="py-3 pr-4">クラスター</th>
                      <th className="py-3 pr-4">相棒Revo</th>
                      <th className="py-3 pr-4">端末</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.latestResults.map((item) => (
                      <tr key={item.diagnosis_id} className="border-b border-[#F2E8D7]">
                        <td className="py-3 pr-4 font-black text-[#164F9E]">
                          {item.diagnosis_run_number}
                        </td>
                        <td className="py-3 pr-4 font-bold">{formatDateTime(item.created_at)}</td>
                        <td className="py-3 pr-4 font-bold">{item.main_type_name}</td>
                        <td className="py-3 pr-4 font-mono text-xs font-bold">
                          {item.main_revo_type_key ?? "-"}
                        </td>
                        <td className="py-3 pr-4">{item.sub_type_name}</td>
                        <td className="py-3 pr-4">{item.support_type_name}</td>
                        <td className="py-3 pr-4">{item.cluster_name}</td>
                        <td className="py-3 pr-4 font-mono text-xs font-bold">
                          {item.partner_revo_type_key ?? "-"}
                        </td>
                        <td className="py-3 pr-4">{item.device ?? "unknown"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[8px] bg-white p-5 shadow-sm">
      <p className="mb-2 text-xs font-black text-[#F06F8F]">{label}</p>
      <p className="text-3xl font-black text-[#164F9E]">{value}</p>
    </article>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[8px] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function formatDateTime(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
