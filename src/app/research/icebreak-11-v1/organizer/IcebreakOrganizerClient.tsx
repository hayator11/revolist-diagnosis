"use client";

import { useMemo, useState, type FormEvent } from "react";
import { revo111Roles } from "@/data/revo111Roles";
import type { RevoTypeKey } from "@/data/revotypes";
import {
  calculateIcebreakResult,
  decodeIcebreakAnswers,
  isValidIcebreakAnswers,
} from "@/lib/calculateIcebreakResult";
import {
  FORCE_COLORS,
  FORCE_KEYS,
  FORCE_LABELS,
  type ForceKey,
} from "@/lib/diagnosisCore/forces";

type OrganizerParticipant = {
  id: string;
  name: string;
  resultUrl: string;
  encodedResultId: string;
  mainTypeKey: RevoTypeKey;
  partnerTypeKey: RevoTypeKey;
  centerForce: ForceKey;
};

type SeatedOrganizerParticipant = OrganizerParticipant & {
  seatNo: number;
};

type OrganizerTable = {
  tableNo: number;
  members: SeatedOrganizerParticipant[];
  emptySeats: number;
  reason: string;
};

const RESULT_PATH = "/research/icebreak-11-v1/result";

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function extractEncodedResultId(input: string) {
  const value = input.trim();

  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value, window.location.origin);
    const queryId = parsed.searchParams.get("id");

    if (queryId) {
      return queryId;
    }

    const pathMatch = parsed.pathname.match(/\/research\/icebreak-11-v1\/result\/([^/?#]+)/);

    if (pathMatch?.[1]) {
      return decodeURIComponent(pathMatch[1]);
    }
  } catch {
    const queryMatch = value.match(/[?&]id=([^&#]+)/);
    const pathMatch = value.match(/\/research\/icebreak-11-v1\/result\/([^/?#]+)/);

    if (queryMatch?.[1]) {
      return decodeURIComponent(queryMatch[1]);
    }

    if (pathMatch?.[1]) {
      return decodeURIComponent(pathMatch[1]);
    }
  }

  const rawAnswers = decodeIcebreakAnswers(value);
  return isValidIcebreakAnswers(rawAnswers) ? value : null;
}

function recoverParticipant(name: string, resultUrl: string): OrganizerParticipant {
  const trimmedName = name.trim();
  const trimmedUrl = resultUrl.trim();

  if (!trimmedName) {
    throw new Error("参加者名を入力してください");
  }

  if (!trimmedUrl) {
    throw new Error("結果URLを入力してください");
  }

  const encodedResultId = extractEncodedResultId(trimmedUrl);

  if (!encodedResultId) {
    throw new Error("結果URLからIDを読み取れませんでした");
  }

  const answers = decodeIcebreakAnswers(encodedResultId);

  if (!isValidIcebreakAnswers(answers)) {
    throw new Error("診断結果を復元できませんでした");
  }

  const result = calculateIcebreakResult(answers);

  return {
    id: createLocalId(),
    name: trimmedName,
    resultUrl: trimmedUrl,
    encodedResultId,
    mainTypeKey: result.mainTypeKey,
    partnerTypeKey: result.partnerTypeKey,
    centerForce: result.centerForce,
  };
}

function createTableReason(members: SeatedOrganizerParticipant[]) {
  if (members.length === 0) {
    return "参加者を追加すると、このテーブルにも席順を作れます。";
  }

  const forces = new Set(members.map((member) => member.centerForce));

  if (forces.has("ignite") && forces.has("care")) {
    return "起点役と受け止め役が近くなるようにしました。挑戦の話が安心して続きやすい組み合わせです。";
  }

  if (forces.has("design") && forces.has("structure")) {
    return "発想型と整理型が会話しやすい構成です。アイデアを形にする話が進みやすくなります。";
  }

  if (forces.has("connect")) {
    return "つなぐ力が会話の入口になりやすいテーブルです。初対面でも話が始まりやすい組み合わせです。";
  }

  if (forces.size >= Math.min(3, members.length)) {
    return "同じ力が固まりすぎないように配置しました。違う入り口から会話が広がりやすい構成です。";
  }

  return "このテーブルは初対面でも話が始まりやすいよう、参加者の力を見ながら配置しました。";
}

function generateOrganizerSeating(
  participants: OrganizerParticipant[],
  tableCount: number,
  seatsPerTable: number,
) {
  const tables = Array.from({ length: tableCount }, (_, index) => ({
    tableNo: index + 1,
    members: [] as OrganizerParticipant[],
  }));

  const sortedParticipants = [...participants].sort((a, b) => {
    const forceDiff = FORCE_KEYS.indexOf(a.centerForce) - FORCE_KEYS.indexOf(b.centerForce);
    return forceDiff === 0 ? a.name.localeCompare(b.name, "ja") : forceDiff;
  });

  sortedParticipants.forEach((participant) => {
    const availableTables = tables.filter((table) => table.members.length < seatsPerTable);
    const bestTable = availableTables.sort((a, b) => {
      const sameForceA = a.members.filter((member) => member.centerForce === participant.centerForce).length;
      const sameForceB = b.members.filter((member) => member.centerForce === participant.centerForce).length;

      if (sameForceA !== sameForceB) {
        return sameForceA - sameForceB;
      }

      return a.members.length - b.members.length;
    })[0];

    bestTable?.members.push(participant);
  });

  return tables.map<OrganizerTable>((table) => {
    const members = table.members
      .sort((a, b) => {
        const forceDiff = FORCE_KEYS.indexOf(a.centerForce) - FORCE_KEYS.indexOf(b.centerForce);
        return forceDiff === 0 ? a.name.localeCompare(b.name, "ja") : forceDiff;
      })
      .map((member, index) => ({
        ...member,
        seatNo: index + 1,
      }));

    return {
      tableNo: table.tableNo,
      members,
      emptySeats: Math.max(0, seatsPerTable - members.length),
      reason: createTableReason(members),
    };
  });
}

function RoleName({ roleKey }: { roleKey: RevoTypeKey }) {
  return <span>{revo111Roles[roleKey]?.name ?? roleKey}</span>;
}

function ForceBadge({ force }: { force: ForceKey }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        borderColor: FORCE_COLORS[force],
        color: FORCE_COLORS[force],
        backgroundColor: `${FORCE_COLORS[force]}14`,
      }}
    >
      {FORCE_LABELS[force]}
    </span>
  );
}

export default function IcebreakOrganizerClient() {
  const [meetupTitle, setMeetupTitle] = useState("Icebreak 33 オフ会");
  const [eventDate, setEventDate] = useState("");
  const [expectedSeats, setExpectedSeats] = useState(8);
  const [tableCount, setTableCount] = useState(2);
  const [seatsPerTable, setSeatsPerTable] = useState(4);
  const [participantName, setParticipantName] = useState("");
  const [participantUrl, setParticipantUrl] = useState("");
  const [participants, setParticipants] = useState<OrganizerParticipant[]>([]);
  const [formError, setFormError] = useState("");
  const [seatingError, setSeatingError] = useState("");
  const [seatingResult, setSeatingResult] = useState<OrganizerTable[] | null>(null);

  const totalSeats = tableCount * seatsPerTable;
  const remainingSeats = Math.max(0, totalSeats - participants.length);
  const forceCounts = useMemo(
    () =>
      FORCE_KEYS.map((force) => ({
        force,
        count: participants.filter((participant) => participant.centerForce === force).length,
      })),
    [participants],
  );

  function handleAddParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    try {
      const participant = recoverParticipant(participantName, participantUrl);
      setParticipants((current) => [...current, participant]);
      setParticipantName("");
      setParticipantUrl("");
      setSeatingResult(null);
      setSeatingError("");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "参加者を追加できませんでした");
    }
  }

  function handleCreateSeating() {
    setSeatingError("");

    if (participants.length === 0) {
      setSeatingError("参加者を追加してから席順を作ってください。");
      return;
    }

    if (participants.length > totalSeats) {
      setSeatingError("参加者数が席数を超えています。テーブル数または1卓人数を増やしてください。");
      setSeatingResult(null);
      return;
    }

    setSeatingResult(generateOrganizerSeating(participants, tableCount, seatsPerTable));
  }

  function handleRemoveParticipant(id: string) {
    setParticipants((current) => current.filter((participant) => participant.id !== id));
    setSeatingResult(null);
    setSeatingError("");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-orange-600">Icebreak 33 organizer prototype</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Icebreak 33 オフ会運営ツール</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              参加者の診断結果から、会話が始まりやすい席順を作ります。
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-orange-100 bg-orange-50 p-5 text-sm leading-7 text-slate-700 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">このページについて</h2>
          <p className="mt-3">
            オフ会や交流会の主催者向けの試作ページです。イベント情報を入力し、参加者の診断結果をもとに、
            11タイプのバランスを見ながら席順を作れます。現在は保存なしのプロトタイプです。
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-bold">イベント作成</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                正式版では、ここでイベントを作成して参加者用URLを発行します。Phase 1では入力内容をこの画面内だけで扱います。
              </p>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">オフ会タイトル</span>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={meetupTitle}
                  onChange={(event) => setMeetupTitle(event.target.value)}
                  placeholder="例：6月レボリストLab交流会"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">開催日時</span>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  placeholder="例：6/29 19:00、受付後に席順作成"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">予定席数</span>
                  <input
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    type="number"
                    min={1}
                    max={200}
                    value={expectedSeats}
                    onChange={(event) => setExpectedSeats(Math.max(1, Number(event.target.value) || 1))}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">テーブル数</span>
                  <input
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    type="number"
                    min={1}
                    max={20}
                    value={tableCount}
                    onChange={(event) => {
                      setTableCount(Math.max(1, Number(event.target.value) || 1));
                      setSeatingResult(null);
                    }}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">1卓人数</span>
                  <input
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    type="number"
                    min={1}
                    max={12}
                    value={seatsPerTable}
                    onChange={(event) => {
                      setSeatsPerTable(Math.max(1, Number(event.target.value) || 1));
                      setSeatingResult(null);
                    }}
                  />
                </label>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">{meetupTitle || "オフ会タイトル未入力"}</p>
                <p className="mt-1">{eventDate || "開催日時は未入力です"}</p>
                <p className="mt-2">予定席数 {expectedSeats}</p>
                <p className="mt-2">
                  席数 {totalSeats} / 登録 {participants.length} / 残り {remainingSeats}
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-slate-700">
                <p className="font-bold text-slate-900">参加URL発行</p>
                <p className="mt-1">
                  Phase 2で、参加者に配布する診断URLを発行できるようにします。現在は準備中です。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-bold">診断済み参加者を手動で追加する</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                すでに診断が終わっている参加者は、結果URLを貼り付けて仮登録できます。
              </p>
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleAddParticipant}>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">参加者名 / ニックネーム</span>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={participantName}
                  onChange={(event) => setParticipantName(event.target.value)}
                  placeholder="例：はやと"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">診断結果URL</span>
                <textarea
                  className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  value={participantUrl}
                  onChange={(event) => setParticipantUrl(event.target.value)}
                  placeholder={`${RESULT_PATH}/3-3-3-... または ${RESULT_PATH}?id=3-3-3-...`}
                />
              </label>

              {formError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              ) : null}

              <button
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                type="submit"
              >
                参加者を追加する
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">参加者一覧</h2>
              <p className="mt-1 text-sm text-slate-600">結果URLから復元した役割とforceを確認できます。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {forceCounts.map(({ force, count }) => (
                <span key={force} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {FORCE_LABELS[force]} {count}
                </span>
              ))}
            </div>
          </div>

          {participants.length === 0 ? (
            <div className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              参加者を追加すると、ここに復元結果が表示されます。
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="px-3 py-2">名前</th>
                    <th className="px-3 py-2">メイン役割</th>
                    <th className="px-3 py-2">話しやすい相手</th>
                    <th className="px-3 py-2">中心force</th>
                    <th className="px-3 py-2">結果URL</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="rounded-xl bg-slate-50">
                      <td className="whitespace-nowrap rounded-l-xl px-3 py-3 font-semibold">{participant.name}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <RoleName roleKey={participant.mainTypeKey} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <RoleName roleKey={participant.partnerTypeKey} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <ForceBadge force={participant.centerForce} />
                      </td>
                      <td className="max-w-56 truncate px-3 py-3 text-xs text-slate-500">{participant.resultUrl}</td>
                      <td className="rounded-r-xl px-3 py-3 text-right">
                        <button
                          className="text-xs font-semibold text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
                          type="button"
                          onClick={() => handleRemoveParticipant(participant.id)}
                        >
                          外す
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">席順生成</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                同じcenterForceが固まりすぎないように、登録順ではなくforceの分散を見ながらテーブルへ配置します。
              </p>
            </div>
            <button
              className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              type="button"
              disabled={participants.length === 0}
              onClick={handleCreateSeating}
            >
              席順を作る
            </button>
          </div>

          {seatingError ? (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {seatingError}
            </div>
          ) : null}

          {seatingResult ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {seatingResult.map((table) => (
                <div key={table.tableNo} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold">テーブル {table.tableNo}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{table.reason}</p>
                    </div>
                    {table.emptySeats > 0 ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        空席 {table.emptySeats}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 space-y-3">
                    {table.members.map((member) => (
                      <div key={member.id} className="rounded-xl bg-slate-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold">
                            {member.seatNo}. {member.name}
                          </p>
                          <ForceBadge force={member.centerForce} />
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          <RoleName roleKey={member.mainTypeKey} /> / 話しやすい相手:{" "}
                          <RoleName roleKey={member.partnerTypeKey} />
                        </p>
                      </div>
                    ))}

                    {table.members.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">まだ参加者がいません。</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              参加者を追加して「席順を作る」を押すと、テーブルごとの席順と理由が表示されます。
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">データの扱い</h2>
          <p className="mt-3">
            正式版では、イベント終了後3日まで席順確認用データを保持し、その後は参加者名・席順・個別紐づきデータを削除する設計です。
            このプロトタイプでは保存を行わず、入力内容はこの画面内だけで扱います。
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">初期版でやらないこと</h2>
          <p className="mt-3">
            このプロトタイプは保存、ログイン、Supabase接続、API追加、既存host統合、QR受付、CSV出力、LINE連携、
            ドラッグアンドドロップ、手動席替え、本番DB設計、centeredResultを使った高度なマッチングは行いません。
          </p>
        </section>
      </div>
    </main>
  );
}
