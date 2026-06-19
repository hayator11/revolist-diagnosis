import type { Metadata } from "next";
import IcebreakOrganizerClient from "./IcebreakOrganizerClient";

export const metadata: Metadata = {
  title: "Icebreak 33 オフ会運営ツール",
  description: "参加者の診断結果から、会話が始まりやすい席順を作る運営者向けページです。",
};

export default function IcebreakOrganizerPage() {
  return <IcebreakOrganizerClient />;
}
