import DiagnosisClient from "../_components/DiagnosisClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revo Team 診断 | Revo OS β",
  description: "あなたはどんなチームで力を発揮しやすいのか。プロジェクト内での立ち位置を見つけます。",
};

export default function TeamPage() {
  return <DiagnosisClient diagKey="team" />;
}
