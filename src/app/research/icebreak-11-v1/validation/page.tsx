import type { Metadata } from "next";
import IcebreakValidationClient from "./IcebreakValidationClient";

export const metadata: Metadata = {
  title: "検証アンケート | Icebreak 33",
  description: "Icebreak 33 中心0モデルの実回答検証フォームです。",
};

export default function IcebreakValidationPage() {
  return <IcebreakValidationClient />;
}
