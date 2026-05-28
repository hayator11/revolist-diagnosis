import { type RevoType } from "@/data/revotypes";

interface Props {
  type: RevoType;
  compact?: boolean;
}

export default function TypeCard({ type, compact = false }: Props) {
  if (compact) {
    return (
      <div className="border border-gray-200 rounded-2xl p-5 hover:border-black transition-colors">
        <p className="text-xs text-gray-400 mb-1 tracking-wider">{type.name}</p>
        <p className="text-sm font-semibold text-black leading-snug mb-2">
          {type.catchcopy}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">{type.description}</p>
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
        <p className="text-sm text-gray-500">{type.catchcopy}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">{type.description}</p>

        {/* Strengths */}
        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            強み
          </p>
          <div className="flex flex-wrap gap-2">
            {type.strengths.map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-3 py-1 rounded-full bg-black text-white text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Gives */}
        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            自然に渡しているもの
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

        {/* Receives */}
        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            受け取ると潤うもの
          </p>
          <div className="flex flex-wrap gap-2">
            {type.receives.map((r) => (
              <span
                key={r}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            向いている活動
          </p>
          <div className="flex flex-wrap gap-2">
            {type.activities.map((a) => (
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
