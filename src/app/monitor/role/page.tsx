import DiagnosisClient from "../_components/DiagnosisClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revo Role 診断 | Revo OS β",
  description: "場面を選びながら、あなたが何を持ち寄る人なのか。11役割と、可能性を引き出し合いやすい相手を見つけます。",
};

export default function RoleePage() {
  return <DiagnosisClient diagKey="role" />;
}
