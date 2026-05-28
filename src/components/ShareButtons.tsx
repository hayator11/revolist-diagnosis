"use client";

import { useRef, useState, useEffect } from "react";
import type { DiagnosisResult } from "@/lib/calculateResult";
import { revoTypes } from "@/data/revotypes";
import { buildShareText } from "@/data/combinations";
import ShareCard from "./ShareCard";

interface Props {
  result: DiagnosisResult;
}

export default function ShareButtons({ result }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.295);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const mainType = revoTypes[result.main.key];
  const subType = revoTypes[result.sub.key];
  const auxType = revoTypes[result.auxiliary.key];

  // コンテナ幅に合わせてスケールを計算
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setScale(w / 1200);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const shareText = buildShareText(
    mainType.name,
    subType.name,
    auxType.name,
    // combotitle はここで getCombination から取得するか props でもらう
    `${mainType.catchcopy}`
  );

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  // ── PNG 生成 & ダウンロード ──
  const handleSave = async () => {
    if (!captureRef.current || generating) return;
    setGenerating(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 2,
        width: 1200,
        height: 630,
        style: { transform: "none" }, // scale をリセット
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `revo-diagnosis-${result.main.key}.png`;
      link.href = dataUrl;
      link.click();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("画像生成に失敗しました:", e);
    } finally {
      setGenerating(false);
    }
  };

  // ── X シェア ──
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;

  // ── LINE シェア ──
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  // ── リンクコピー ──
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4 text-center">
        結果をシェアする
      </p>

      {/* ── カードプレビュー ── */}
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden mb-6 relative"
        style={{ height: `${630 * scale}px` }}
      >
        {/* スクリーン表示用（スケールダウン） */}
        <div
          style={{
            width: "1200px",
            height: "630px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <ShareCard result={result} />
        </div>

        {/* html-to-image 用キャプチャ要素（オフスクリーン） */}
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: "0",
            width: "1200px",
            height: "630px",
            pointerEvents: "none",
          }}
        >
          <div ref={captureRef}>
            <ShareCard result={result} />
          </div>
        </div>
      </div>

      {/* ── シェアボタン群 ── */}
      <div className="space-y-2">
        {/* 画像を保存 */}
        <button
          onClick={handleSave}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              生成中…
            </>
          ) : saved ? (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-400" aria-hidden>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              保存しました
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              画像を保存する
            </>
          )}
        </button>

        {/* X (Twitter) シェア */}
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.262 5.636 5.901-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X でシェア
        </a>

        {/* LINE シェア */}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500" aria-hidden>
            <path d="M12 2C6.48 2 2 6.28 2 11.47c0 3.75 2.37 7.02 5.9 8.89.26.13.43.41.38.7l-.3 1.7c-.08.47.43.84.85.62L11.5 21.8c.16-.08.34-.1.5-.07.66.1 1.33.15 2 .15 5.52 0 10-4.28 10-9.41C24 6.28 19.52 2 12 2zm-3.5 12.5h-2v-6h2v6zm3.5 0h-2v-6h2v6zm3.5 0h-2V11h-1V9h3v5.5z" />
          </svg>
          LINE でシェア
        </a>

        {/* リンクをコピー */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500" aria-hidden>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              コピーしました
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

      {/* Instagram 保存案内 */}
      <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
        Instagramにシェアする場合は、<br />
        「画像を保存」してから投稿してください。
      </p>

      {/*
        将来拡張:
        - Story 形式（1080×1920）の PNG 生成
        - Revo Circle 可視化カード
        - Discord シェア
        - コミュニティカード（Revo メンバー付き）
        - AI 生成テキスト（役割説明の自動カスタマイズ）
        - 仲間相性表示シェアカード
      */}
    </div>
  );
}
