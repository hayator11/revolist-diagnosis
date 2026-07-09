import { icebreakRoleResultCopy } from "@/data/icebreakRoleResultCopy";
import { revo111Roles, type Revo111Role } from "@/data/revo111Roles";
import type { RevoTypeKey } from "@/data/revotypes";

interface Props {
  type: Revo111Role;
  compact?: boolean;
}

const ROLE_CLUSTERS: Partial<Record<RevoTypeKey, string>> = {
  crazist: "まだ見えていない扉を見つける役割",
  revolist: "まだそこにないものを形にする役割",
  maxdesigner: "未来の展開を描く役割",
  imagemaister: "想いや空気を形にする役割",
  logicalmaister: "散らかった話を形にする役割",
  inforader: "情報を知恵に変える役割",
  premiercrafter: "いいものをより良い形に磨く役割",
  movmentor: "人の挑戦を盛り上げる役割",
  arranger: "バラバラな力に流れをつくる役割",
  communicator: "人と人が話すきっかけをつくる役割",
  soulowner: "人が本音を出せる場をつくる役割",
};

export default function TypeCard({ type, compact = false }: Props) {
  const resultCopy = icebreakRoleResultCopy[type.key];
  const partnerNames = type.futurePartners
    .map((key) => revo111Roles[key]?.name)
    .filter(Boolean)
    .slice(0, 4);

  if (compact) {
    return (
      <div className="border border-gray-200 rounded-2xl p-5 hover:border-black transition-colors">
        <p className="text-xs text-gray-400 mb-1 tracking-wider">{type.name}</p>
        <p className="text-sm font-semibold text-black leading-snug mb-2">
          {type.catchCopy}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">{resultCopy?.workingCopy ?? type.mission}</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
          Type
        </p>
        <h2 className="text-3xl font-bold text-black mb-1">{type.name}</h2>
        <p className="text-sm text-gray-500">{type.catchCopy}</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-black leading-relaxed">
            {resultCopy?.workingCopy ?? type.mission}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {resultCopy?.essence ?? type.mission}
          </p>
          <p className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {ROLE_CLUSTERS[type.key] ?? "可能性を持ち寄る役割"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            自然にしやすい動き
          </p>
          <div className="flex flex-wrap gap-2">
            {type.naturalActions.map((action) => (
              <span
                key={action}
                className="inline-flex items-center px-3 py-1 rounded-full bg-black text-white text-xs font-medium"
              >
                {action}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            持ち寄れるもの
          </p>
          <div className="flex flex-wrap gap-2">
            {type.gives.map((g) => (
              <span
                key={g}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            可能性を引き出し合いやすい相手
          </p>
          <div className="flex flex-wrap gap-2">
            {partnerNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            活きやすい場
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {type.comfortableEnvironment}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            試しやすい活動
          </p>
          <div className="flex flex-wrap gap-2">
            {type.recommendedActivities.map((a) => (
              <span
                key={a}
                className="text-xs text-gray-600 border-b border-dashed border-gray-300"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
