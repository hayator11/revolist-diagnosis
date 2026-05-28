"use client";

import { useState } from "react";

interface Props {
  comboTitle: string;
}

export default function ShareButton({ comboTitle }: Props) {
  const [copied, setCopied] = useState(false);

  const shareText = `レボリスト診断の結果：「${comboTitle}」型でした。\nあなたは、誰と組むと未来を動かせますか？`;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;

  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3 text-center">
        結果をシェアする
      </p>
      <div className="flex gap-3">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {/* X (Twitter) */}
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-current"
            aria-hidden
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.262 5.636 5.901-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X でシェア
        </a>
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500" aria-hidden>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              コピー済み
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              リンクをコピー
            </>
          )}
        </button>
      </div>
      {/* 将来拡張: SNSシェア画像生成 */}
    </div>
  );
}
