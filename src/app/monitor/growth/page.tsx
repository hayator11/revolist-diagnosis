import DiagnosisClient from "../_components/DiagnosisClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revo Growth 診断 | Revo OS β",
  description: "あなたは次にどんな力を育てると未来が広がるのか。眠っている役割と成長ルートを見つけます。",
};

export default function GrowthPage() {
  return <DiagnosisClient diagKey="growth" />;
}
