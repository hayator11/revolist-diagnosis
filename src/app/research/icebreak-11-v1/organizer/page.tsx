import type { Metadata } from "next";
import IcebreakOrganizerClient from "./IcebreakOrganizerClient";

export const metadata: Metadata = {
  title: "Icebreak 33 オフ会席順メーカー",
  description: "診断済み参加者の結果URLから役割を復元し、席順を試作する運営者向けページです。",
};

export default function IcebreakOrganizerPage() {
  return <IcebreakOrganizerClient />;
}
