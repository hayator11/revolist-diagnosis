import DiagnosisClient from "../_components/DiagnosisClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revo Match 診断 | Revo OS β",
  description: "あなたは誰と組むと可能性が広がるのか。あなたを開花させる存在、あなたが開花させる存在を見つけます。",
};

export default function MatchPage() {
  return <DiagnosisClient diagKey="match" />;
}
