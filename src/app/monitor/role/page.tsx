import DiagnosisClient from "../_components/DiagnosisClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revo Role 診断 | Revo OS β",
  description: "あなたは今、どんな役割を強く使っているのか。主役割・サブ役割・補助役割を見つけます。",
};

export default function RoleePage() {
  return <DiagnosisClient diagKey="role" />;
}
