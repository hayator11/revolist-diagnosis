const OPEN_CHAT_URL =
  "https://line.me/ti/g2/b26E1JogLaVG_XwQwgsCMfC7HWrD8VW5EkyOUQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

type OpenChatInviteProps = {
  context?: "diagnosis" | "monitor" | "icebreak";
};

const contextCopy: Record<NonNullable<OpenChatInviteProps["context"]>, string> = {
  diagnosis:
    "診断結果の次に見えてくること、モニター募集、オリジナル診断づくりの可能性などをお知らせします。",
  monitor:
    "モニター診断の更新、改善の背景、オリジナル診断づくりの可能性などをお知らせします。",
  icebreak:
    "オフ会用診断の使い方、席順づくり、オリジナル診断づくりの可能性などをお知らせします。",
};

export default function OpenChatInvite({ context = "diagnosis" }: OpenChatInviteProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">
        Open Chat
      </p>
      <h2 className="mb-3 text-lg font-bold leading-snug text-black">
        オープンチャット
        <br />
        「孤独な挑戦者を、減らしたい」
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        ひとりで抱え込まず、役割や可能性を持ち寄るための場所です。
        {contextCopy[context]}
      </p>
      <p className="mb-5 text-xs leading-relaxed text-gray-500">
        診断結果の共有、モニター企画、オフ会用の活用、オリジナル診断の構築など、
        次の展開を知りたい方に向けて案内していきます。
      </p>
      <a
        href={OPEN_CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        オープンチャットで次のお知らせを受け取る
      </a>
    </section>
  );
}
