"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getIcebreakRoleResultCopy } from "@/data/icebreakRoleResultCopy";
import { revo111Roles } from "@/data/revo111Roles";
import type { RevoTypeKey } from "@/data/revotypes";
import { FORCE_COLORS, FORCE_LABELS, type ForceKey } from "@/lib/diagnosisCore/forces";

interface HostEvent {
  eventCode: string;
  hostKey: string;
  eventName: string;
  eventDate: string;
  layoutType: string;
  tableCapacity: number;
  status: string;
  expiresAt: string;
}

interface HostParticipant {
  id: string;
  nickname: string;
  centerForce: ForceKey;
  subForce: ForceKey;
  mainTypeKey?: string;
  partnerTypeKey?: string;
  thirdTypeKey?: string;
  tableNo: number | null;
  seatNo: number | null;
  seatReason: string | null;
  joinedAt: string;
}

interface HostTable {
  tableNo: number;
  tableName: string;
  isCompleteForceSet: boolean;
  members: Array<HostParticipant & { reason: string }>;
}

function getRoleInfo(roleKey?: string) {
  if (!roleKey || !(roleKey in revo111Roles)) {
    return null;
  }

  const typedRoleKey = roleKey as RevoTypeKey;
  return {
    role: revo111Roles[typedRoleKey],
    copy: getIcebreakRoleResultCopy(typedRoleKey),
  };
}

function ParticipantRoleSummary({ roleKey }: { roleKey?: string }) {
  const roleInfo = getRoleInfo(roleKey);

  if (!roleInfo) {
    return null;
  }

  return (
    <div className="mb-3 rounded-lg bg-gray-50 p-3">
      <p className="text-sm font-bold text-black">{roleInfo.role.name}タイプ</p>
      {roleInfo.copy?.catchCopy && (
        <p className="mt-1 text-xs leading-relaxed text-gray-600">{roleInfo.copy.catchCopy}</p>
      )}
    </div>
  );
}

function SeatRoleName({ roleKey }: { roleKey?: string }) {
  const roleInfo = getRoleInfo(roleKey);

  if (!roleInfo) {
    return null;
  }

  return <p className="mt-2 text-sm font-bold text-black">{roleInfo.role.name}タイプ</p>;
}

export default function IcebreakHostClient() {
  const searchParams = useSearchParams();
  const hostKey = searchParams.get("key") ?? "";
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [tableCapacity, setTableCapacity] = useState(4);
  const [created, setCreated] = useState<{ participantUrl: string; hostUrl: string } | null>(null);
  const [event, setEvent] = useState<HostEvent | null>(null);
  const [participants, setParticipants] = useState<HostParticipant[]>([]);
  const [tables, setTables] = useState<HostTable[]>([]);
  const [message, setMessage] = useState("");

  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const participantUrl = useMemo(() => {
    if (!event) return created?.participantUrl ? `${origin}${created.participantUrl}` : "";
    return `${origin}/research/icebreak-11-v1?event=${event.eventCode}`;
  }, [created, event, origin]);

  const forceCounts = useMemo(() => {
    return participants.reduce<Record<string, number>>((acc, participant) => {
      acc[participant.centerForce] = (acc[participant.centerForce] ?? 0) + 1;
      return acc;
    }, {});
  }, [participants]);

  const loadEvent = useCallback(() => {
    if (!hostKey) return;
    fetch(`/api/icebreak/event/${encodeURIComponent(hostKey)}`)
      .then((response) => {
        if (!response.ok) throw new Error("not found");
        return response.json();
      })
      .then((data) => {
        setEvent(data.event);
        setParticipants(data.participants ?? []);
        setTables(data.tables ?? []);
      })
      .catch(() => {
        setMessage("イベントが見つかりませんでした。主催者URLを確認してください。");
      });
  }, [hostKey]);

  useEffect(() => {
    loadEvent();
    if (!hostKey) return;
    const timer = window.setInterval(loadEvent, 5000);
    return () => window.clearInterval(timer);
  }, [hostKey, loadEvent]);

  const createEvent = async () => {
    setMessage("");
    const response = await fetch("/api/icebreak/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventDate,
        layoutType: "island",
        tableCapacity,
      }),
    });
    const data = await response.json();
    setCreated(data);
    setEvent(data.event);
  };

  const generateSeating = async () => {
    if (!hostKey) return;
    const response = await fetch("/api/icebreak/seating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostKey }),
    });
    const data = await response.json();
    if (data.result === "success") {
      setEvent(data.event);
      setParticipants(data.participants ?? []);
      setTables(data.seating?.tables ?? []);
      setMessage("席順を生成しました。この席順、ランダムじゃありません。90秒の診断が決めました。");
    }
  };

  const resetEvent = async () => {
    if (!hostKey) return;
    const response = await fetch("/api/icebreak/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostKey }),
    });
    const data = await response.json();
    if (data.result === "success") {
      setEvent(null);
      setParticipants([]);
      setTables([]);
      setMessage("匿名統計を作成し、運営用データを削除しました。");
    }
  };

  if (!hostKey) {
    return (
      <div className="min-h-screen bg-white px-6 py-14">
        <div className="mx-auto max-w-lg">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">Icebreak Host</p>
          <h1 className="mb-4 text-3xl font-bold text-black">イベントを作成する</h1>
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">イベント名</label>
              <input
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                placeholder="第3回 おのくんオフ会"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black">開催日</label>
              <input
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black">1卓の人数</label>
              <input
                type="number"
                min={2}
                max={8}
                value={tableCapacity}
                onChange={(event) => setTableCapacity(Number(event.target.value))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={createEvent}
              className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
            >
              参加URLを発行する
            </button>
          </div>

          {created && event && (
            <div className="mt-8 rounded-lg border border-gray-200 p-5 text-sm">
              <p className="mb-2 font-bold text-black">参加コード: {event.eventCode}</p>
              <p className="break-all text-gray-600">{participantUrl}</p>
              <p className="mt-4 break-all text-gray-600">
                主催者URL: {origin}
                {created.hostUrl}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">Icebreak Host</p>
        <h1 className="mb-2 text-3xl font-bold text-black">{event?.eventName ?? "イベント"}</h1>
        <p className="mb-8 text-sm text-gray-500">
          参加コード: {event?.eventCode ?? "-"} / 参加人数: {participants.length}
        </p>

        {message && <p className="mb-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">{message}</p>}

        <section className="mb-8 grid gap-3 sm:grid-cols-5">
          {Object.entries(FORCE_LABELS).map(([force, label]) => (
            <div key={force} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: FORCE_COLORS[force as ForceKey] }}
                />
                <p className="text-xs font-bold text-gray-500">{label}</p>
              </div>
              <p className="text-2xl font-bold text-black">{forceCounts[force] ?? 0}</p>
            </div>
          ))}
        </section>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={loadEvent}
            className="rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700"
          >
            更新
          </button>
          <button
            type="button"
            onClick={generateSeating}
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
          >
            席順を生成する
          </button>
          <button
            type="button"
            onClick={resetEvent}
            className="rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700"
          >
            イベントを閉じる
          </button>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-black">参加者一覧</h2>
          {participants.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 p-5 text-sm leading-relaxed text-gray-500">
              参加者が診断を終えると、ここに力の分布が表示されます。参加URLを共有して、回答を待ちます。
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {participants.map((participant) => (
                <div key={participant.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: FORCE_COLORS[participant.centerForce] }}
                    />
                    <p className="font-bold text-black">{participant.nickname}</p>
                  </div>
                  <ParticipantRoleSummary roleKey={participant.mainTypeKey} />
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>中心の力：{FORCE_LABELS[participant.centerForce]}</p>
                    <p>広がり：{FORCE_LABELS[participant.subForce ?? participant.centerForce]}</p>
                  </div>
                  {participant.tableNo && (
                    <p className="mt-3 text-xs font-medium text-black">
                      {participant.tableNo}番テーブル / {participant.seatNo}番席
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-black">座席マップ</h2>
          {tables.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 p-5 text-sm leading-relaxed text-gray-500">
              参加者が集まったら「席順を生成する」を押すと、力の組み合わせから座席が作られます。
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {tables.map((table) => (
                <article key={table.tableNo} className="rounded-lg border border-gray-200 p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-black">
                        {table.tableNo}番 {table.tableName}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {table.members.map((member) => FORCE_LABELS[member.centerForce]).join(" / ")}
                      </p>
                    </div>
                    {table.isCompleteForceSet && (
                      <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                        5つの力がそろいました
                      </span>
                    )}
                  </div>
                  <div className="grid gap-3">
                    {table.members.map((member) => (
                      <div key={member.id} className="rounded-lg bg-gray-50 p-4">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: FORCE_COLORS[member.centerForce] }}
                          />
                          <p className="font-bold text-black">
                            {member.seatNo}. {member.nickname}
                          </p>
                        </div>
                        <SeatRoleName roleKey={member.mainTypeKey} />
                        <p className="mt-1 text-xs text-gray-500">
                          中心の力：{FORCE_LABELS[member.centerForce]}
                        </p>
                        <p className="text-xs leading-relaxed text-gray-500">{member.reason}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
