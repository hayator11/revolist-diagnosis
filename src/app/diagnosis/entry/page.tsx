import type { Metadata } from "next";
import EntryDiagnosisClient from "./_components/EntryDiagnosisClient";

export const metadata: Metadata = {
  title: "11問入口診断 | レボリスト診断",
  description:
    "11問・約2分で、今のあなたに出やすい役割と、可能性を引き出し合いやすい相手の入口を見つけます。",
};

export default function EntryDiagnosisPage() {
  return <EntryDiagnosisClient />;
}
