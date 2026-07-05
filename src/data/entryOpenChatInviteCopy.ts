export interface EntryOpenChatInviteCopy {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  buttonLabel: string;
}

export const entryOpenChatInviteCopies: EntryOpenChatInviteCopy[] = [
  {
    key: "entry_open_chat_next_steps_a",
    eyebrow: "Next step",
    title: "診断結果の続きを受け取る",
    body:
      "オープンチャットでは、11役割の深掘り、可能性を引き出し合いやすい相手の考え方、次に試せる診断や企画をお知らせします。",
    note:
      "これから、自分に合う人と出会えるマッチング企画や、オリジナル診断づくりの案内もここで育てていきます。",
    buttonLabel: "診断結果の続きを受け取る",
  },
  {
    key: "entry_open_chat_matching_b",
    eyebrow: "Matching lab",
    title: "自分に合う人と出会う入口へ",
    body:
      "この診断は、ここから『誰と組むと可能性が動き出すのか』を見つける場へ育てていきます。",
    note:
      "オープンチャットで、次の診断、マッチング企画、結果の活かし方、オリジナル診断づくりのお知らせを受け取れます。",
    buttonLabel: "組み合わせの続きを見に行く",
  },
];

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function selectEntryOpenChatInviteCopy(encodedAnswers: string) {
  const hash = stableHash(encodedAnswers || "entry-open-chat");
  return entryOpenChatInviteCopies[hash % entryOpenChatInviteCopies.length];
}
