import { type Activity } from "@/data/activities";
import { revoTypes, type RevoTypeKey } from "@/data/revotypes";

interface Props {
  activities: Activity[];
  topTypes: RevoTypeKey[];
}

export default function ActivitySuggestion({ activities, topTypes }: Props) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-gray-500">おすすめの活動を準備中です。</p>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const matchingTypes = activity.suitableTypes.filter((t) =>
          topTypes.includes(t)
        );

        return (
          <div
            key={activity.id}
            className="border border-gray-200 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-bold text-black">{activity.name}</h4>
              <div className="flex gap-1">
                {activity.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              あなたは、{activity.name}のような「
              {activity.tags.join("・")}
              」の活動で力を発揮しやすいタイプです。
            </p>
            {matchingTypes.length > 0 && (
              <div className="flex gap-1 mt-2">
                {matchingTypes.map((key) => (
                  <span
                    key={key}
                    className="text-xs bg-black text-white px-2 py-0.5 rounded-full"
                  >
                    {revoTypes[key].name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
