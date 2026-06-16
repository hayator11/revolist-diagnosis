"use client";

import type { ResearchForceKey } from "@/data/researchLightQuestions";
import { researchForceLabels } from "@/data/researchLightQuestions";
import type { ForceScores } from "@/lib/calculateResearchLightResult";
import { FORCE_ORDER } from "@/lib/calculateResearchLightResult";

const FORCE_COLORS: Record<ResearchForceKey, string> = {
  ignite: "#dc2626",
  design: "#7c3aed",
  connect: "#ea580c",
  structure: "#2563eb",
  care: "#16a34a",
};

const TYPICAL_SHAPE: Record<ResearchForceKey, ForceScores> = {
  ignite: { ignite: 20, design: 5, connect: 0, structure: -15, care: -10 },
  design: { ignite: 5, design: 20, connect: -5, structure: 0, care: -20 },
  connect: { ignite: 0, design: -10, connect: 20, structure: -15, care: 5 },
  structure: { ignite: -15, design: -5, connect: -10, structure: 20, care: 10 },
  care: { ignite: -10, design: -15, connect: 5, structure: 0, care: 20 },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pointFor(index: number, radius: number, center: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / FORCE_ORDER.length;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function polygonPoints(dev: ForceScores, center: number, maxRadius: number) {
  const midRadius = maxRadius * 0.55;
  const minRadius = maxRadius * 0.25;
  const scale = midRadius * 0.04;

  return FORCE_ORDER.map((force, index) => {
    const radius = clamp(midRadius + dev[force] * scale, minRadius, maxRadius);
    return pointFor(index, radius, center);
  });
}

function pointsToString(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

interface Props {
  centerForce: ResearchForceKey;
  dev: ForceScores;
  mode?: "focused" | "dual" | "broad";
  slotForce?: ResearchForceKey;
  partnerForce?: ResearchForceKey;
  compact?: boolean;
  partnerTargetId?: string;
}

export default function ForcePentagonChart({
  centerForce,
  dev,
  mode = "focused",
  slotForce,
  partnerForce,
  compact,
  partnerTargetId,
}: Props) {
  const size = compact ? 180 : 280;
  const center = size / 2;
  const maxRadius = compact ? 66 : 104;
  const midRadius = maxRadius * 0.55;
  const axisPoints = FORCE_ORDER.map((_, index) => pointFor(index, maxRadius, center));
  const ownPoints = polygonPoints(dev, center, maxRadius);
  const partnerPoints = partnerForce
    ? polygonPoints(TYPICAL_SHAPE[partnerForce], center, maxRadius)
    : null;

  const handleSlotClick = () => {
    if (!partnerTargetId) return;
    document.getElementById(partnerTargetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto block origin-center animate-[researchShapeIn_400ms_ease-out]"
        role="img"
        aria-label="5つの力の五角形チャート"
      >
        <circle
          cx={center}
          cy={center}
          r={midRadius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <polygon
          points={pointsToString(axisPoints)}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="1"
        />
        {FORCE_ORDER.map((force, index) => {
          const point = axisPoints[index];
          const labelPoint = pointFor(index, maxRadius + (compact ? 18 : 28), center);
          return (
            <g key={force}>
              <line
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <circle cx={point.x} cy={point.y} r={compact ? 3 : 4} fill={FORCE_COLORS[force]} />
              {!compact && (
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={FORCE_COLORS[force]}
                >
                  {researchForceLabels[force]}
                </text>
              )}
            </g>
          );
        })}
        {partnerPoints && (
          <polygon
            points={pointsToString(partnerPoints)}
            fill={FORCE_COLORS[partnerForce!]}
            fillOpacity="0.16"
            stroke={FORCE_COLORS[partnerForce!]}
            strokeOpacity="0.55"
            strokeWidth="2"
          />
        )}
        <polygon
          points={pointsToString(ownPoints)}
          fill={FORCE_COLORS[centerForce]}
          fillOpacity="0.18"
          stroke={FORCE_COLORS[centerForce]}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {!compact && (
          <text x={center} y={center - midRadius - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
            あなたの平均
          </text>
        )}
      </svg>

      {!compact && mode !== "broad" && slotForce && (
        <div className="mt-3 grid gap-2 text-center">
          <p className="text-xs font-medium" style={{ color: FORCE_COLORS[centerForce] }}>
            {researchForceLabels[centerForce]}: いま強く使っている力
          </p>
          <button
            type="button"
            onClick={handleSlotClick}
            className="mx-auto rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-black"
          >
            空きスロット: {researchForceLabels[slotForce]} / ここに入る仲間がいます
          </button>
        </div>
      )}
      {!compact && mode === "broad" && (
        <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
          均整のとれた形です。経験の幅が広い人ほどこの形になります。
        </p>
      )}
    </div>
  );
}
