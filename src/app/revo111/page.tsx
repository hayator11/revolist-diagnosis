import type { Metadata } from "next";
import Revo111DiagnosisClient from "./_components/Revo111DiagnosisClient";

export const metadata: Metadata = {
  title: "Revo111 44問診断 | レボリスト診断",
  description:
    "役割・成長・仲間・活動の循環を見える形にする、Revo111 Sprint1の44問診断です。",
};

export default function Revo111Page() {
  return <Revo111DiagnosisClient />;
}
