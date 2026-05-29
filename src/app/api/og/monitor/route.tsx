/**
 * /api/og/monitor?type=role|team|match|growth&answers=4-3-2-5-...
 * モニター診断結果の OGP 画像を動的生成するエンドポイント
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  decodeMonitorAnswers,
  calculateRoleResult,
  calculateTeamResult,
  calculateMatchResult,
  calculateGrowthResult,
} from "@/lib/calculateMonitorResult";
import { revoTypes } from "@/data/revotypes";
import { monitorDiagnosisMeta } from "@/data/monitorResults";

export const runtime = "edge";

const TOTAL_QUESTIONS = 18;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "role" | "team" | "match" | "growth" | null;
  const encoded = searchParams.get("answers");

  // デフォルト値
  let diagTitle = "Revo OS β版";
  let mainTypeName = "レボリスト診断";
  let mainTypeCatch = "役割でチームを作るための、新しい共創OS";
  let resultLabel = "診断結果";
  let accentColor = "#ffffff";
  let subLine = "";

  if (type && encoded) {
    try {
      const answers = decodeMonitorAnswers(encoded);
      if (answers.length === TOTAL_QUESTIONS && !answers.some(isNaN)) {
        const meta = monitorDiagnosisMeta[type];
        diagTitle = meta.title;
        accentColor = meta.accentColor;

        if (type === "role") {
          const r = calculateRoleResult(answers);
          const t = revoTypes[r.main.key];
          mainTypeName = t.name;
          mainTypeCatch = t.catchcopy;
          resultLabel = "今、強く使っている役割";
          subLine = `Sub: ${revoTypes[r.sub.key].name}  ×  ${revoTypes[r.auxiliary.key].name}`;
        } else if (type === "team") {
          const r = calculateTeamResult(answers);
          const t = revoTypes[r.main.key];
          mainTypeName = t.name;
          mainTypeCatch = r.teamLabel;
          resultLabel = "チーム内での立ち位置";
          subLine = `Revo Funding: ${r.revoFundingRole.slice(0, 20)}…`;
        } else if (type === "match") {
          const r = calculateMatchResult(answers);
          const t = revoTypes[r.openedByType.key];
          mainTypeName = t.name;
          mainTypeCatch = t.catchcopy;
          resultLabel = "あなたを開花させる存在";
          subLine = `あなたが開花させる存在: ${revoTypes[r.youOpenType.key].name}`;
        } else if (type === "growth") {
          const r = calculateGrowthResult(answers);
          const t = revoTypes[r.nextRole.key];
          mainTypeName = t.name;
          mainTypeCatch = r.growthLabel;
          resultLabel = "次に育つ可能性のある役割";
          subLine = `眠っている力: ${revoTypes[r.sleepingRole.key].name}`;
        }
      }
    } catch {
      // フォールバック使用
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "radial-gradient(ellipse at 35% 40%, #1a1a1a 0%, #000000 70%)",
          display: "flex",
          flexDirection: "column",
          padding: "52px 64px",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          boxSizing: "border-box",
        }}
      >
        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
              }}
            >
              Revo OS β
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px" }}>—</span>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: accentColor,
                opacity: 0.8,
                textTransform: "uppercase",
              }}
            >
              {diagTitle}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
            revolist-diagnosis.vercel.app
          </span>
        </div>

        {/* 2カラム */}
        <div style={{ display: "flex", flex: 1, gap: "64px" }}>
          {/* 左: 結果 */}
          <div style={{ flex: "0 0 560px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: accentColor,
                  textTransform: "uppercase",
                  marginBottom: "14px",
                  opacity: 0.85,
                }}
              >
                {resultLabel}
              </p>
              <h1
                style={{
                  fontSize: "72px",
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: "0.06em",
                  lineHeight: "1",
                  marginBottom: "16px",
                }}
              >
                {mainTypeName}
              </h1>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", marginTop: "8px" }}>
                {mainTypeCatch}
              </p>
              {subLine && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", marginTop: "14px" }}>
                  {subLine}
                </p>
              )}
            </div>

            {/* バッジ */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span
                style={{
                  padding: "5px 16px",
                  border: `1px solid ${accentColor}`,
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: accentColor,
                  opacity: 0.7,
                }}
              >
                {diagTitle}
              </span>
              <span
                style={{
                  padding: "5px 16px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Revo OS β版
              </span>
            </div>
          </div>

          {/* 右: メッセージ */}
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
                Monitor Program
              </p>
              <p
                style={{
                  fontSize: "22px",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: "1.7",
                }}
              >
                「誰が優れているか」ではなく、
                「誰と組むと力が発揮されるか」
              </p>
            </div>

            <div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: "1.8", marginBottom: "10px" }}>
                これは、性格診断ではありません。
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
                役割でチームを作るための、新しい共創OSの実験です。
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
