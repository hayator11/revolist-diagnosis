/**
 * /api/og?answers=4-3-2-5-...
 * 診断結果の OGP 画像を動的生成するエンドポイント
 * next/og (Satori) を使用
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { calculateResult, decodeAnswers } from "@/lib/calculateResult";
import { revoTypes } from "@/data/revotypes";
import { getCombination, getTagline } from "@/data/combinations";
import { questions } from "@/data/questions";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encoded = searchParams.get("answers");

  // デフォルト値（answers が無効な場合）
  let mainName = "レボリスト診断";
  let subName = "";
  let auxName = "";
  let comboTitle = "あなたの役割は、まだ完成していません。";
  let tagline = "役割が違うから、人は支え合える。";
  let gives: string[] = [];

  if (encoded) {
    try {
      const answers = decodeAnswers(encoded);
      if (answers.length === questions.length && !answers.some(isNaN)) {
        const result = calculateResult(answers);
        const mainType = revoTypes[result.main.key];
        const subType = revoTypes[result.sub.key];
        const auxType = revoTypes[result.auxiliary.key];
        const combo = getCombination(result.main.key, result.sub.key);

        mainName = mainType.name;
        subName = subType.name;
        auxName = auxType.name;
        comboTitle = combo.title;
        tagline = getTagline(result.main.key);
        gives = mainType.gives.slice(0, 3);
      }
    } catch {
      // フォールバック値を使用
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "radial-gradient(ellipse at 40% 45%, #111111 0%, #000000 65%)",
          display: "flex",
          flexDirection: "column",
          padding: "52px 64px",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
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
              color: "rgba(255,255,255,0.2)",
            }}
          >
            revo.onokun.com
          </span>
        </div>

        {/* 2カラムレイアウト */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "72px",
          }}
        >
          {/* 左: タイプ情報 */}
          <div
            style={{
              flex: "0 0 520px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Main Type
              </p>
              <h1
                style={{
                  fontSize: "64px",
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: "0.08em",
                  lineHeight: "1",
                  marginBottom: "12px",
                }}
              >
                {mainName}
              </h1>
              {subName && (
                <p
                  style={{
                    fontSize: "16px",
                    color: "rgba(255,255,255,0.38)",
                    marginTop: "12px",
                  }}
                >
                  × {subName}　× {auxName}
                </p>
              )}
            </div>

            {/* 渡しているもの */}
            {gives.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  What I Give
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {gives.map((g) => (
                    <span
                      key={g}
                      style={{
                        padding: "5px 14px",
                        border: "1px solid rgba(255,255,255,0.22)",
                        borderRadius: "20px",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右: コンボ説明 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                Your Combination
              </p>
              <p
                style={{
                  fontSize: "26px",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: "1.6",
                }}
              >
                {comboTitle}
              </p>
            </div>

            <div>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: "1.8",
                  marginBottom: "16px",
                }}
              >
                あなたの役割は、まだ完成していません。
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.28)",
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
          - 日本語フォント（Noto Sans JP）の動的ロード
          - レーダーチャートの SVG 埋め込み
          - 役割循環図（Revo Circle）
        */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
