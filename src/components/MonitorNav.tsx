import Link from "next/link";
import type { MonitorDiagnosisKey } from "@/data/monitorQuestions";

interface DiagItem {
  key: MonitorDiagnosisKey;
  label: string;
  accent: string;
}

const DIAGS: DiagItem[] = [
  { key: "role",   label: "Revo Role",   accent: "#dc2626" },
  { key: "team",   label: "Revo Team",   accent: "#2563eb" },
  { key: "match",  label: "Revo Match",  accent: "#16a34a" },
  { key: "growth", label: "Revo Growth", accent: "#9333ea" },
];

interface Props {
  current?: MonitorDiagnosisKey;
}

export default function MonitorNav({ current }: Props) {
  return (
    <nav className="flex gap-2 flex-wrap justify-center">
      {DIAGS.map((d) => {
        const isActive = d.key === current;
        return (
          <Link
            key={d.key}
            href={`/monitor/${d.key}`}
            className={`text-xs px-4 py-2 rounded-full border transition-colors font-medium ${
              isActive
                ? "bg-black text-white border-black"
                : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black"
            }`}
          >
            {d.label}
          </Link>
        );
      })}
    </nav>
  );
}
