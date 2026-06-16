"use client";

import {
  ENERGY_ORDER,
  energyLabels,
  energyThemeColors,
  type EnergyKey,
} from "@/data/energyLightQuestions";
import type { EnergyScores } from "@/lib/calculateEnergyLightResult";

interface Props {
  percentages: EnergyScores;
  primaryEnergy: EnergyKey;
  size?: number;
}

function pointFor(index: number, radius: number, center: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / ENERGY_ORDER.length;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

export default function EnergyPentagonChart({ percentages, primaryEnergy, size = 260 }: Props) {
  const center = size / 2;
  const maxRadius = size * 0.32;
  const gridRadii = [0.33, 0.66, 1].map((ratio) => maxRadius * ratio);
  const points = ENERGY_ORDER.map((energy, index) =>
    pointFor(index, maxRadius * Math.max(0.18, Math.min(1, percentages[energy] / 100)), center),
  );
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");
  const color = energyThemeColors[primaryEnergy];

  return (
    <div className="mx-auto w-full max-w-xs">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
        {gridRadii.map((radius) => (
          <polygon
            key={radius}
            points={ENERGY_ORDER.map((_, index) => {
              const point = pointFor(index, radius, center);
              return `${point.x},${point.y}`;
            }).join(" ")}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {ENERGY_ORDER.map((energy, index) => {
          const point = pointFor(index, maxRadius, center);
          return (
            <line
              key={energy}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          );
        })}
        <polygon points={polygon} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="3" />
        {points.map((point, index) => (
          <circle key={ENERGY_ORDER[index]} cx={point.x} cy={point.y} r="4" fill={color} />
        ))}
        {ENERGY_ORDER.map((energy, index) => {
          const labelPoint = pointFor(index, maxRadius + 28, center);
          return (
            <text
              key={energy}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={energyThemeColors[energy]}
              fontSize="11"
              fontWeight="700"
            >
              {energyLabels[energy]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
