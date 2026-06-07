/**
 * ShareCard.tsx
 * 1200 × 630px の固定サイズカード（SNSシェア画像 / OGP 用）
 * html-to-image でキャプチャして PNG 保存に使用
 * インラインスタイルで統一（Tailwind は使用しない）
 */

import { revoTypes } from "@/data/revotypes";
import { getCombination, getTagline } from "@/data/combinations";
import type { DiagnosisResult } from "@/lib/calculateResult";

interface Props {
  result: DiagnosisResult;
}

const FONT =
  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", sans-serif';

// タグチップ（白枠）
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 14px",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: "20px",
        fontSize: "13px",
        color: "rgba(255,255,255,0.75)",
        marginRight: "8px",
        marginBottom: "8px",
        fontFamily: FONT,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}

// タグチップ（赤枠）
function RedTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 14px",
        border: "1px solid rgba(220,38,38,0.5)",
        borderRadius: "20px",
        fontSize: "13px",
        color: "rgba(220,38,38,0.9)",
        marginRight: "8px",
        marginBottom: "8px",
        fontFamily: FONT,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}

export default function ShareCard({ result }: Props) {
  const mainType = revoTypes[result.main.key];
  const subType = revoTypes[result.sub.key];
  const auxType = revoTypes[result.auxiliary.key];
  const combo = getCombination(result.main.key, result.sub.key);
  const tagline = getTagline(result.main.key);

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "radial-gradient(ellipse at 40% 45%, #111111 0%, #000000 65%)",
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "52px 64px",
        boxSizing: "border-box",
      }}
    >
      {/* 背景の装飾リング（循環を表す） */}
      <div
        style={{
          position: "absolute",
          right: "-80px",
          bottom: "-80px",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-30px",
          bottom: "-30px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "30px",
          bottom: "30px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* ── ヘッダー ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "36px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          Revo Diagnosis
        </span>
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          revo.onokun.com
        </span>
      </div>

      {/* ── メイン2カラム ── */}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "72px",
          alignItems: "stretch",
        }}
      >
        {/* 左カラム: タイプ情報 */}
        <div
          style={{
            flex: "0 0 560px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* タイプ名ブロック */}
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Main Type
            </p>
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "0.1em",
                lineHeight: "1",
                marginBottom: "10px",
                textTransform: "uppercase",
              }}
            >
              {mainType.key.toUpperCase()}
            </h1>
            <p
              style={{
                fontSize: "22px",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.05em",
                marginBottom: "12px",
              }}
            >
              {mainType.name}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.05em",
              }}
            >
              × {subType.name}　× {auxType.name}
            </p>
          </div>

          {/* 仕切り線 */}
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              margin: "24px 0",
            }}
          />

          {/* タグエリア */}
          <div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              What I Give
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {mainType.gives.map((g) => (
                <Tag key={g} label={g} />
              ))}
            </div>

            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                marginBottom: "10px",
                marginTop: "14px",
              }}
            >
              Who Makes Me Shine
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {mainType.goodWith.slice(0, 2).map((key) => (
                <RedTag key={key} label={revoTypes[key].name} />
              ))}
            </div>
          </div>
        </div>

        {/* 右カラム: コンボ説明 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* コンボコピー */}
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Your Combination
            </p>
            <p
              style={{
                fontSize: "24px",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.85)",
                lineHeight: "1.7",
                marginBottom: "20px",
              }}
            >
              {combo.title}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                lineHeight: "1.8",
              }}
            >
              {combo.quote}
            </p>
          </div>

          {/* 仕切り線 */}
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              margin: "24px 0",
            }}
          />

          {/* 下部テキスト */}
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: "1.8",
                marginBottom: "16px",
              }}
            >
              あなたの役割は、<br />まだ完成していません。
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.05em",
              }}
            >
              {tagline}
            </p>
          </div>
        </div>
      </div>

      {/*
        将来拡張:
        - レーダーチャート（役割スコアの視覚化）
        - 動的アニメーション（Framer Motion）
        - Story 形式（1080×1920）
        - Revo Circle 可視化（役割循環図）
        - AI 文章生成（GPT / Claude API）
        - 仲間相性表示（あなたを輝かせる存在カード）
        - Revoマップ接続（位置情報 × 役割分布）
        - Discord / Instagram Story 対応フォーマット
        - コミュニティカード（メンバー情報付き）
      */}
    </div>
  );
}
